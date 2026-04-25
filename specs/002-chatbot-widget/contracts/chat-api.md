# Contract: `POST /api/chat`

**Feature**: `002-chatbot-widget`
**Endpoint**: `/api/chat`
**Method**: `POST` (only — `GET`/`PUT`/`DELETE` return 405)
**Runtime**: Node.js (`export const runtime = "nodejs"`)
**Cache policy**: `export const dynamic = "force-dynamic"` (per-request)

This is the only public surface the chatbot exposes to the browser. All
streaming, sanitization, and grounding flows through here.

---

## Request

### Headers

| Header | Required | Notes |
|--------|----------|-------|
| `Content-Type` | yes | MUST be `application/json` |
| `Accept` | recommended | `text/event-stream` (advisory; server streams regardless) |
| `x-forwarded-for` | server-read | First comma-segment used as rate-limit key |
| `x-real-ip` | server-read | Fallback when `x-forwarded-for` absent |

### Body schema (Zod)

```ts
const RequestSchema = z.object({
  message: z.string().min(1).max(500),
  history: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().min(1).max(8000),
    })
  ).max(40).default([]),
});
```

### Body example

```json
{
  "message": "What systems has Qasim shipped?",
  "history": [
    { "role": "user", "content": "Hi!" },
    { "role": "assistant", "content": "Salaam — what would you like to know about Qasim's work?" }
  ]
}
```

### Validation flow (server-side, in order)

1. Parse JSON body. On parse failure → **400 `invalid_input`**.
2. Validate against `RequestSchema`. On failure → **400 `invalid_input`**
   if shape wrong, **413 `input_too_long`** if `message.length > 500`.
3. Resolve IP from `x-forwarded-for` first segment → `x-real-ip` →
   `"unknown"`.
4. Call `rateLimiter.check(ip)`. If `!allowed` → **429 `rate_limited`**
   with `resetAt`.
5. Run `sanitize(message)`. On `{ ok: false, reason: 'empty' }` → **400
   `invalid_input`**. (`'too_long'` already caught in step 2.)
6. Build agent input: `[...history, { role: "user", content: sanitizedText
   }]`.
7. Begin streaming response (200 OK). Subsequent failures emit SSE
   `error` events; HTTP status is already committed.

---

## Response: Success (200 OK)

### Headers

```
Content-Type: text/event-stream
Cache-Control: no-cache, no-transform
Connection: keep-alive
X-Accel-Buffering: no
```

### Body framing

Server-Sent Events. Each event is `event: <name>\ndata: <json>\n\n`. The
client splits chunks on the literal `\n\n` boundary.

### Event types

#### `event: delta`

A token (or token group) of the assistant's reply.

```
event: delta
data: {"text":"Qasim has shipped"}

```

```
event: delta
data: {"text":" 6 production systems including"}

```

#### `event: tool_call`

Optional, advisory. Emitted when the agent decides to invoke a tool, so
the client can update its typing-indicator copy ("Reading portfolio
data…").

```
event: tool_call
data: {"name":"getSystems"}

```

#### `event: done`

Terminal success. The full assistant message has been streamed; the
client transitions the assistant `Message.state` from `streaming` →
`complete`.

```
event: done
data: {"finishReason":"stop"}

```

#### `event: error`

Terminal failure mid-stream. The client transitions the assistant
`Message.state` to `failed` and surfaces a retry control.

```
event: error
data: {"code":"provider_error","message":"AI provider is unavailable. Please try again.","retryable":true}

```

### Example complete stream

```
event: delta
data: {"text":"Qasim"}

event: tool_call
data: {"name":"getSystems"}

event: delta
data: {"text":" has shipped 6 systems:"}

event: delta
data: {"text":" CRM Digital FTE, Personal AI Employee, Physical AI Humanoid Textbook, TaskFlow, Factory-de-Odoo, and a proposed MCP-Native Developer Tool."}

event: done
data: {"finishReason":"stop"}

```

---

## Response: Errors (non-200)

All errors return JSON, `Content-Type: application/json`, with this body:

```ts
interface ErrorBody {
  error: {
    code: ChatErrorCode;
    message: string;
    resetAt?: string;     // ISO-8601, only on rate_limited
    retryable: boolean;
  }
}
```

### 400 `invalid_input`

Empty message, malformed JSON, missing required field, or message fails
non-length validation. `retryable: false`.

```json
{
  "error": {
    "code": "invalid_input",
    "message": "Please enter a message.",
    "retryable": false
  }
}
```

### 413 `input_too_long`

Message exceeds 500 characters after trim. `retryable: false`.

```json
{
  "error": {
    "code": "input_too_long",
    "message": "Messages are limited to 500 characters.",
    "retryable": false
  }
}
```

### 429 `rate_limited`

IP exceeded 10 messages within the current 1-hour window. `retryable:
false`. The client widget renders a friendly cooldown message and
disables the input until `resetAt`.

```json
{
  "error": {
    "code": "rate_limited",
    "message": "You've hit the per-hour limit. Please try again later.",
    "resetAt": "2026-04-25T18:00:00.000Z",
    "retryable": false
  }
}
```

### 405 Method Not Allowed

`GET` / `PUT` / `DELETE` / `PATCH` to `/api/chat`. Headers include
`Allow: POST`.

### 502 `provider_error` (only when emitted *before* streaming starts)

OpenAI returns non-success or SDK throws before first token. After
streaming has begun, this is delivered as an SSE `error` event instead.
`retryable: true`.

```json
{
  "error": {
    "code": "provider_error",
    "message": "AI provider is unavailable. Please try again.",
    "retryable": true
  }
}
```

### 500 `internal_error`

Catch-all. Server logs the underlying error with a request id; client
sees a generic message. `retryable: true`.

---

## Internal contracts (not exposed to clients)

### Tool: `getSystems`

```ts
tool({
  name: "getSystems",
  description:
    "Returns the full list of systems Qasim has shipped or is actively building, with status, tagline, tech stack, and links. Call this whenever the user asks about Qasim's projects, work, or what he's built.",
  parameters: z.object({}),
  execute: async () => projectSystems(systems),
});
```

Returns: `GroundedSystem[]` (see data-model.md Entity 4).

### Tool: `getSkills`

```ts
tool({
  name: "getSkills",
  description:
    "Returns the full list of Qasim's technical skills grouped by category (AI & Agents, Languages & Frameworks, Infrastructure & DevOps, Data & Storage, Frontend). Call this whenever the user asks about Qasim's tech stack or skills.",
  parameters: z.object({}),
  execute: async () => projectSkills(skillCategories),
});
```

Returns: `GroundedSkillCategory[]` (see data-model.md Entity 4).

### Agent run options

```ts
run(agent, input, {
  stream: true,
  maxTurns: 2,             // tool call → final message; no chains
  // No `context` argument — tools are no-arg and read from imports
});
```

### Stream event mapping (SDK event → wire SSE event)

| SDK `RunItemStreamEvent.item.type` | Wire event |
|------------------------------------|------------|
| `tool_call_item` | `tool_call` |
| `tool_call_output_item` | _(suppressed; payload too large for client)_ |
| `message_output_item` raw text delta | `delta` (chunk-by-chunk via `toTextStream` adapter) |
| run completion | `done` |
| run error / SDK throw | `error` |

The wire-event payload is always shaped by *us* — the SDK's internal
event shape is not leaked to the browser.

---

## Idempotency, timeouts, retries

- **Idempotency**: not idempotent. A retried POST counts against the rate
  limit. The client SHOULD NOT auto-retry; the user clicks the retry
  button.
- **Server-side timeout**: 30 seconds total. If the agent run hasn't
  completed by then, the route emits an `error` event (`code:
  "provider_error"`) and closes the stream.
- **Client-side timeout**: the widget waits indefinitely while it
  receives `delta` events; on no events for > 60 seconds it surfaces a
  retry option.

## Security boundary

- `OPENAI_API_KEY` is read inside `agent.ts` only. Never logged. Never
  echoed in error bodies.
- Body is parsed with a 100 KB max (Zod `history` cap of 40 × 8 KB
  approximates this; Next.js's default body parser caps at 1 MB which is
  the upper bound).
- No CORS — the route is same-origin only. (No `Access-Control-Allow-
  Origin` header is set.)
