# Phase 1 Data Model: AI Chatbot Widget

**Feature**: `002-chatbot-widget`
**Date**: 2026-04-25
**Source**: spec.md "Key Entities" + research.md decisions

This feature has no persistent storage. All entities live either in React
state (browser) or in a single Node module-scope `Map` (server). The
data-model document records their shapes, lifecycles, and validation rules
so the implementation has one canonical reference.

---

## Entity 1 — Chat Session (client only)

**Lifecycle**: created the first time `ChatWidget` mounts in a browser
tab; cleared on `New Chat` button or `window.unload` (page refresh /
navigation away). Never persisted.

**Storage**: React `useState` inside `ChatWidget.tsx`.

```ts
interface ChatSession {
  id: string;             // crypto.randomUUID() — for React keying / debugging
  messages: Message[];    // ordered, oldest first
  status:                 // mutually exclusive
    | { kind: "idle" }
    | { kind: "sending"; pendingMessageId: string }
    | { kind: "streaming"; pendingMessageId: string }
    | { kind: "error"; lastError: ChatError };
  isOpen: boolean;        // panel open/closed (button always visible)
}
```

**Validation rules**:
- `messages.length` SHOULD stay ≤ 40 to keep the request payload reasonable.
  When the array reaches 40, the oldest 20 are pruned client-side before the
  next request (older context is dropped silently — recent turns matter
  most).
- `status` can only progress idle → sending → streaming → idle, or any state
  → error → idle on retry.
- `isOpen` toggling does NOT mutate `messages` (FR-005: minimize preserves
  history).

**Reset semantics**:
- `New Chat`: replace with `{ id: newUUID(), messages: [], status: { kind:
  "idle" }, isOpen: true }`.
- Page refresh: state lost, fresh session created on next mount.

---

## Entity 2 — Message

**Lifecycle**: created when the user submits, or when the bot starts
streaming a reply. Updated in-place during streaming.

```ts
interface Message {
  id: string;             // crypto.randomUUID() — React key
  role: "user" | "assistant";
  content: string;        // sanitized; never contains raw HTML
  state:
    | "complete"          // user messages always complete; assistant after stream end
    | "streaming"         // assistant only, while delta events arriving
    | "failed";           // assistant only, terminal error during stream
  createdAt: number;      // Date.now()
}
```

**Validation rules**:
- `role: "user"` → `content.length ≤ 500` after trim (FR-008). Enforced
  client-side at submit and re-validated server-side (Decision 6).
- `role: "user"` → `state` is always `"complete"` (we never mutate user
  messages after submission).
- `role: "assistant"` → starts as `streaming`, transitions to either
  `complete` (on `done` SSE event) or `failed` (on `error` SSE event /
  network drop).
- `content` is rendered as plain text only; no Markdown, no HTML
  (Decision 8). Newlines split into `<br />` at render time.
- `id` MUST be stable across re-renders (used as React `key`).

**Wire shape sent to server** (subset — server doesn't need React-specific
fields):

```ts
interface WireMessage {
  role: "user" | "assistant";
  content: string;
}
```

Conversion: `messages.filter(m => m.state === "complete").map(({ role,
content }) => ({ role, content }))`.

---

## Entity 3 — Rate-limit Counter (server only)

**Lifecycle**: created lazily on first request from a given IP; reset
when the 1-hour window expires; lost on Node process restart (Vercel cold
start). Single in-memory Map shared across all requests handled by the
same instance.

**Storage**: `src/lib/chat/rate-limiter.ts` module-scope `Map`.

```ts
interface RateLimitRecord {
  count: number;          // messages within the current window
  windowStart: number;    // ms epoch — when this window began
}

const buckets = new Map<string, RateLimitRecord>();
```

**Constants**:
- `WINDOW_MS = 3_600_000` (1 hour)
- `LIMIT_PER_WINDOW = 10`

**Algorithm** (`check(ip): { allowed: boolean; remaining: number; resetAt:
number }`):
1. `now = Date.now()`.
2. `record = buckets.get(ip)`.
3. If absent OR `now - record.windowStart >= WINDOW_MS`:
   - `record = { count: 0, windowStart: now }`.
4. If `record.count >= LIMIT_PER_WINDOW`:
   - Return `{ allowed: false, remaining: 0, resetAt: record.windowStart +
     WINDOW_MS }`. (Do NOT increment.)
5. Otherwise:
   - `record.count += 1; buckets.set(ip, record)`.
   - Return `{ allowed: true, remaining: LIMIT_PER_WINDOW - record.count,
     resetAt: record.windowStart + WINDOW_MS }`.

**Validation rules**:
- Map key MUST be the resolved IP (Decision 5 algorithm). Empty / `unknown`
  IP gets its own bucket — all anonymous requests share one quota.
- Counter does NOT decrement on error responses (rate-limit applies to
  inbound attempts, not successful sends).
- Map size is bounded informally by traffic; for our scale (single-digit
  conversations/day) it stays under 1k entries even adversarially. No
  eviction policy.

---

## Entity 4 — Grounding Sources (server-read, build-time-typed)

**Lifecycle**: imported at module load by the agent's tool implementations.
Same TypeScript modules the portfolio's UI imports — the bot is
*automatically in sync* with what the visitor sees on the page.

**Sources**:
- `src/data/systems.ts` → `systems: System[]` (6 entries currently).
- `src/data/skills.ts` → `skillCategories: SkillCategory[]` (5 categories).

**Tool projections** (what the bot actually receives — pruned to keep
token cost low):

```ts
// getSystems() returns
interface GroundedSystem {
  slug: string;
  name: string;
  status: System["status"];      // "SHIPPED" | "LIVE" | "ACTIVE" | "APPLIED"
  tagline: string;
  tech: string[];
  githubUrl?: string;
  liveUrl?: string;
  roleBadge?: string;            // e.g. "Architecture Advisor"
  metricsSummary: string;        // joined from `metrics[]` for compactness
}

// getSkills() returns
interface GroundedSkillCategory {
  slug: string;
  label: string;                 // e.g., "AI & Agents"
  skillNames: string[];          // just names — no icon strings
}
```

**Why projection vs raw export**: the raw `System` carries fields the bot
doesn't need (`image: string`, individual metric labels in object form)
that bloat token usage. Projection is a pure `.map()` per call.

**Validation rules**:
- Tools MUST NOT mutate the imported arrays. The projection always builds
  a fresh array.
- Tools are deterministic — calling twice in the same request returns the
  same payload (the source modules don't change at runtime).

**Out of grounding tools (lives in system prompt instead — Decision 11)**:
- Personal identity copy (`personal.aboutBio`, `personal.title`,
  `personal.heroDescription`).
- Education entries.
- Contact channels.
- Methodology one-liner ("Spec-Kit Plus / SDD").

This split exists because identity-sensitive copy must be governed by
the constant `SYSTEM_PROMPT` constitution-lint check, not by mutable tool
output.

---

## Entity 5 — Chat Error (transport)

**Lifecycle**: instantiated on the server when a request fails any gate;
serialized to JSON; either sent as an HTTP error response or as an SSE
`error` event (Decision 9).

```ts
type ChatErrorCode =
  | "invalid_input"      // 400
  | "input_too_long"     // 413
  | "rate_limited"       // 429
  | "provider_error"     // 502
  | "internal_error";    // 500

interface ChatError {
  code: ChatErrorCode;
  message: string;       // user-facing, friendly, language-neutral English
  resetAt?: string;      // ISO-8601, only on rate_limited
  retryable: boolean;    // hint for the client widget's retry button
}
```

**Validation rules**:
- `message` MUST NOT leak server internals (no stack traces, no provider
  names beyond "AI provider").
- `retryable: true` for `provider_error` and `internal_error`; `false` for
  `invalid_input`, `input_too_long`, `rate_limited` (those need user
  action, not retry).
- `resetAt` present iff `code === "rate_limited"`.

---

## Cross-entity invariants

1. **Identity invariant**: no `Message` with `role: "assistant"` should
   contain a forbidden identity term once `state === "complete"`. Enforced
   by the system prompt + sampling validation in `/sp.tasks` probe set.
2. **Server-only credentials**: `process.env.OPENAI_API_KEY` is read only
   inside `src/lib/chat/agent.ts` and `src/lib/chat/tools.ts` — never
   imported into any `src/components/**` or `src/app/**/page.tsx` file. A
   grep test in CI confirms this.
3. **Single in-flight invariant**: `ChatSession.status.kind === "streaming"`
   implies `ChatInput`'s send button is disabled (FR-016).
4. **Source-of-truth invariant**: Tools project from `@/data/systems` and
   `@/data/skills` — they MUST NOT hardcode any system or skill name. A
   unit test asserts each tool's output length equals the source array
   length.

---

## State transitions diagram (ASCII)

```
ChatSession.status:
        ┌──────────┐
        │   idle   │◀───────────────────────────┐
        └────┬─────┘                            │
             │ user submits                     │
             ▼                                  │
        ┌──────────┐                            │
        │ sending  │ (HTTP request flying)      │
        └────┬─────┘                            │
             │ first SSE delta                  │
             ▼                                  │
        ┌──────────┐                            │
        │streaming │ ── done event ─────────────┤
        └────┬─────┘                            │
             │ error event / network drop       │
             ▼                                  │
        ┌──────────┐                            │
        │  error   │ ── retry / dismiss ────────┘
        └──────────┘
```

Message states (assistant only; user messages are always `complete`):

```
streaming ──done──▶ complete
       ╲
        error──▶ failed
```
