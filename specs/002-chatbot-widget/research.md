# Phase 0 Research: AI Chatbot Widget

**Feature**: `002-chatbot-widget`
**Date**: 2026-04-25
**Inputs**: spec.md, constitution v1.0.0, locked tech decisions in `/sp.plan` prompt
**Sources verified live**: Context7 MCP (`/openai/openai-agents-js`,
`/vercel/next.js/v15.1.8`)

## Summary

The user pre-locked the technology choices for this feature. Phase 0's job is
to **verify** those choices against current docs and resolve the small set of
implementation details the spec deliberately abstracted (transport framing,
runtime selection, sanitizer regex shape, language-detection strategy,
rate-limit key, error taxonomy). All NEEDS-CLARIFICATION items are resolved
below; nothing is left for the planner.

---

## Decision 1 — Agent runtime: OpenAI Agents JS SDK

- **Decision**: Use `@openai/agents` (OpenAI Agents SDK for JS/TS) with
  `gpt-4o-mini`. Define one `Agent` with a hardcoded `instructions` system
  prompt and two `tool()` functions (`getSystems`, `getSkills`). Run with
  `run(agent, input, { stream: true, maxTurns: 2 })`.
- **Rationale**:
  - Spec FR-002 (grounded answers) maps directly onto the SDK's
    tool-calling pattern — the agent calls `getSystems` / `getSkills`
    when it needs portfolio data, and the model never sees the data
    until it asks.
  - `maxTurns: 2` is enough for this feature: model decides to call a
    tool → tool returns → model writes the final reply. Spec out-of-scope
    explicitly excludes multi-turn tool chains.
  - Identity ("Agentic AI Engineer") is reinforced by the SDK's first-
    class system-prompt slot, plus the tool layer: the bot literally is
    an agent calling tools, which mirrors Qasim's positioning.
- **Alternatives considered**:
  - **Raw OpenAI Chat Completions API with function-calling** — viable
    but loses the SDK's stream event taxonomy (`run_item_stream_event`,
    `tool_call_item`, `message_output_item`) that we use for typing-
    indicator UX. Rejected because the SDK gives us those events for
    free with the same dependency footprint.
  - **Vercel AI SDK (`ai` + `@ai-sdk/openai`)** — popular but adds a
    second AI abstraction layer on top of OpenAI's SDK, doesn't add
    grounded-tooling value beyond what `@openai/agents` already gives,
    and would require an ADR per Constitution VI (locked stack).
    Rejected.
  - **Anthropic Claude / HF Inference** — out of scope for Sprint 2;
    spec Assumptions block names OpenAI explicitly.

## Decision 2 — Next.js Route Handler at `/api/chat` (Node runtime, dynamic)

- **Decision**: `src/app/api/chat/route.ts` exporting `POST` with
  `export const runtime = "nodejs"` and `export const dynamic = "force-
  dynamic"`. Reads `request.headers` directly (no `next/headers`).
- **Rationale**:
  - Constitution II says SSG is the default; per Principle II this is
    the single explicitly-allowed exception ("external calls at runtime
    … client-initiated, gracefully degrading"). Route handler runs
    server-side per request, never at build time.
  - **Node runtime** chosen over Edge because:
    - The OpenAI Agents SDK has not been validated against Cloudflare/
      Edge constraints in production; Vercel's Node runtime is the SDK's
      blessed target.
    - Long-lived streaming responses are well-supported in Node on
      Vercel; cold-start cost is acceptable for single-digit
      conversations/day (spec Assumptions).
    - In-memory rate-limit Map (Decision 5) requires the same instance
      across requests — Edge's V8 isolates make instance lifetime
      shorter and less predictable.
  - **`force-dynamic`** is required so Next doesn't try to cache the
    POST response (POSTs aren't cached anyway, but this also disables
    static analysis warnings).
- **Alternatives considered**:
  - **Edge runtime** — better latency, but breaks the Node-only Map
    persistence assumption and complicates SDK validation. Rejected
    until traffic justifies it.
  - **Pages-API-style `/pages/api/chat.ts`** — App Router is the
    constitution-locked routing model. Rejected.

## Decision 3 — Streaming format: SSE-shaped event stream over Web `ReadableStream`

- **Decision**: The route handler returns a `Response` whose body is a
  `ReadableStream` of `TextEncoder`-encoded chunks framed as SSE
  (`event: <name>\ndata: <json>\n\n`). Three event types:
  `delta` (text token), `done` (final flush), `error` (terminal failure).
  Headers: `Content-Type: text/event-stream`, `Cache-Control: no-cache,
  no-transform`, `Connection: keep-alive`, `X-Accel-Buffering: no`.
- **Rationale**:
  - Native Web API streaming is the Next.js 15 idiomatic path (Context7
    snippet "Create Streaming Responses using Native Web APIs in Next.js"
    confirms this is the documented pattern for v15.1+).
  - SSE framing on top of `ReadableStream` is trivial (string template),
    requires no third-party dep, and survives both Vercel's edge proxy
    and any Nginx reverse-proxy (the `X-Accel-Buffering: no` header is
    documented on Next.js's deploying page for exactly this case).
  - Client side uses `EventSource` semantics via `fetch().body.getReader()`
    rather than `EventSource` itself — POST bodies aren't allowed on
    `EventSource`. The `fetch` + reader approach reads the same SSE
    bytes line-by-line.
- **Alternatives considered**:
  - **Vercel AI SDK's `StreamingTextResponse` / `data stream`** — would
    work but pulls in `ai` + `@ai-sdk/openai`, both ADR-required (locked
    stack). Rejected.
  - **Raw plain-text streaming (no framing)** — simpler but loses the
    ability to send `error` and `done` events distinct from `delta`.
    Rejected because UX needs distinct typing-vs-error states (FR-015).
  - **WebSocket** — overkill for unidirectional server→client streaming.
    Rejected.

## Decision 4 — Agent tools: `getSystems` and `getSkills`

- **Decision**: Two tools defined with the SDK's `tool()` helper using
  Zod schemas (Zod is already a transitive dep of `@openai/agents`).
  `getSystems()` takes no args and returns the full `systems` array
  (slug, name, status, tagline, tech, githubUrl, liveUrl). `getSkills()`
  takes no args and returns the full `skillCategories` array
  (slug, label, skills[]). Both import directly from `@/data/systems`
  and `@/data/skills`.
- **Rationale**:
  - Single source of truth: the same TypeScript modules render the
    portfolio's Systems and Skills sections, so the bot is
    automatically in sync at request time (FR-002 grounded answers).
  - Tool schemas with no parameters keep the agent simple; the model
    decides *when* to fetch (per turn, on demand) rather than us
    pre-stuffing the system prompt with all data on every call (token-
    cost win — only paid when relevant).
  - Tools must NOT include `personal.ts` directly because that file
    contains identity copy that must be governed by the system prompt's
    constitution rules; we surface contact channels via the system
    prompt instead.
- **Alternatives considered**:
  - **Pre-stuff data into system prompt** — wastes tokens on every
    request, even for off-topic questions. Rejected.
  - **Add `getEducation`, `getMethodology`, `getContact` tools** — those
    payloads are tiny and identity-sensitive; embed them in the system
    prompt instead. Rejected.
  - **Pass the data as parameters from the client** — defeats the
    server-side grounding boundary; client could omit/forge data.
    Rejected.

## Decision 5 — Rate limiter: in-memory `Map<ip, { count, windowStart }>`

- **Decision**: `src/lib/chat/rate-limiter.ts` exports a module-scope
  `Map`, keyed by the visitor's source IP (resolved from
  `x-forwarded-for` first segment, falling back to
  `x-real-ip`, then `"unknown"`). Sliding 1-hour window: when
  `Date.now() - windowStart > 3_600_000`, reset count. Limit: 10 messages
  per hour.
- **Rationale**:
  - Spec Assumptions and SC-007 explicitly accept that the counter
    resets on cold start at single-digit conversations/day traffic. No
    Redis, no KV — keeps zero-backend posture (Constitution II).
  - `x-forwarded-for` is the documented Vercel-set header; first comma-
    split segment is the original client (Vercel and most proxies append
    their own hop downstream).
  - 10 msgs/hour math: at SC-007's USD 5/month and ~$0.0005/conversation,
    ~10k conversations is the budget — 10/hour/IP is a per-bot-stress-
    test ceiling, not a per-user UX constraint.
- **Alternatives considered**:
  - **Vercel KV / Upstash Redis** — durable, fair across cold starts,
    but adds a runtime dependency we don't operate. Rejected per
    Constitution II.
  - **Cookie / localStorage counter** — trivially bypassable. Rejected.
  - **Token-bucket vs fixed-window** — fixed window is simpler, gives
    cleaner cooldown messages ("resets at HH:MM"), and the difference is
    invisible at our traffic. Picked fixed-window.

## Decision 6 — Input sanitizer: regex strip + length cap

- **Decision**: `src/lib/chat/sanitizer.ts` exports `sanitize(input):
  { ok: true, text: string } | { ok: false, reason: 'too_long' | 'empty' }`.
  Steps applied in order:
  1. Trim whitespace; if empty, return `{ ok: false, reason: 'empty' }`.
  2. Reject if `input.length > 500` → `{ ok: false, reason: 'too_long' }`.
  3. Strip emails (`/[\w.+-]+@[\w-]+\.[\w.-]+/g` → `[email redacted]`).
  4. Strip phone-like sequences
     (`/\+?\d[\d\s.\-()]{8,}/g` → `[phone redacted]`).
  5. Strip credit-card-like 13–19 digit groups
     (`/\b(?:\d[ -]?){13,19}\b/g` → `[card redacted]`).
- **Rationale**:
  - FR-007 demands PII redaction *before* the message reaches the AI
    provider — server-side enforcement is the only trustworthy boundary
    (a client-only check is bypassable).
  - 500-char cap (FR-008) is enforced both client-side (UX) and server-
    side (defense in depth).
  - Regex is intentionally conservative: better to leak a non-PII string
    than to send raw card numbers to OpenAI. The replacement tokens
    (`[email redacted]` etc.) preserve semantic intent so the model can
    still answer "I'd email you at [redacted]" rather than truncating
    silently.
- **Alternatives considered**:
  - **Full-blown PII library (e.g., `compromise`, `microsoft/recognizers-
    text`)** — heavier dependency for marginal accuracy gain at our
    traffic. Rejected.
  - **No regex, rely on system-prompt instruction** — model can leak
    PII back to logs even if it tries not to display it. Rejected.

## Decision 7 — Language detection: rely on the model

- **Decision**: No explicit language-detection library. The system
  prompt instructs the agent: "Respond in the same language and script
  the user wrote in. If the user writes in Urdu (اردو), reply in Urdu
  script. If the user writes in Roman Urdu (Latin script Urdu), reply in
  Roman Urdu. Otherwise reply in English." `gpt-4o-mini` handles all
  three natively.
- **Rationale**:
  - FR-004 requires language-matching, not language-detection-as-a-
    service. The model is already paid for — adding `franc` or `cld3`
    adds bundle/server weight for no signal gain.
  - Spec Assumptions explicitly endorses "the language model handles it
    natively with the same system prompt; no separate translation
    layer".
- **Alternatives considered**:
  - **`franc` library + per-language system prompt** — adds 30 KB+ to
    the server bundle, moves a problem the model already solves
    upstream. Rejected.

## Decision 8 — Output sanitizer: HTML-escape on render, plain-text only

- **Decision**: The chat client renders bot messages as plain text using
  React's default text-node escaping (no `dangerouslySetInnerHTML`). New
  lines are converted to `<br />` via React's Fragment+map pattern. No
  Markdown rendering in this version.
- **Rationale**:
  - FR-010 demands HTML-neutralization. React's default text rendering
    already escapes `<`, `>`, `&`, `"`, `'` — adding a
    `DOMPurify`/`sanitize-html` dep is unnecessary if we never opt into
    `dangerouslySetInnerHTML`.
  - Markdown rendering is out of scope for this version; if links/code-
    blocks become important, that's a Sprint 3 polish item with its own
    sanitization design.
- **Alternatives considered**:
  - **react-markdown + rehype-sanitize** — sanitization is solvable, but
    Markdown opens a new attack surface and a new dep that the locked
    stack doesn't allow without an ADR. Deferred to Sprint 3.

## Decision 9 — Error taxonomy and HTTP shape

| Status | Code | When | Body shape |
|--------|------|------|------------|
| 400 | `invalid_input` | Body fails Zod validation, empty input | `{ error: { code, message } }` |
| 413 | `input_too_long` | Input > 500 chars | same |
| 429 | `rate_limited` | IP exceeded 10/hr | `{ error: { code, message, resetAt: ISO8601 } }` |
| 502 | `provider_error` | OpenAI returns non-success or times out | `{ error: { code, message } }` |
| 500 | `internal_error` | Anything else (logged server-side, generic message client-side) | same |

- **Streaming errors** (after the response started): emit an SSE event
  `event: error\ndata: {"code":...,"message":...}\n\n` and close the
  stream cleanly. Client widget shows a retry button.
- **Rationale**: distinct codes let the client widget render
  appropriate UI (cooldown timer for 429, character-count hint for 413,
  retry button for 502/500) without parsing the message text.

## Decision 10 — Client transport: `fetch` + body-reader, not `EventSource`

- **Decision**: `ChatWidget` calls `fetch('/api/chat', { method: 'POST',
  body: JSON.stringify(...) })`, then iterates
  `response.body!.getReader()` decoding chunks with `TextDecoder` and
  splitting on `\n\n` to reassemble SSE events.
- **Rationale**: `EventSource` only supports GET. POST is required to
  carry the conversation history and the new user message securely (not
  in the URL). The fetch-+-reader approach reads the same SSE framing
  with one extra parse step.
- **Alternatives considered**:
  - **GET with query params** — leaks message text into URLs and Vercel
    request logs; URL-length limits would clip long conversations.
    Rejected.
  - **Long-poll** — no streaming UX. Rejected.

## Decision 11 — System prompt knowledge: identity-locked constants

- **Decision**: `src/lib/chat/system-prompt.ts` exports a single
  `SYSTEM_PROMPT` string constant. It contains:
  - **Identity block** (verbatim, NON-NEGOTIABLE): the approved title
    "Agentic AI Engineer", the forbidden-terms list, the
    employer/military/navy/government prohibition, and a refusal
    template.
  - **Scope block**: what topics are allowed (work, skills, projects,
    methodology, contact, availability) and the polite-redirect line for
    out-of-scope questions.
  - **Tool-use block**: instructions to call `getSystems` and
    `getSkills` when the question would benefit from grounded data.
  - **Style block**: concise, factual, recruiter-friendly; no fabricated
    facts; mirror the visitor's language.
  - **Embedded copy** (from `personal.ts`): education entries, contact
    channels, methodology one-liner — these are small, identity-
    sensitive, and don't change shape per request, so they live in the
    prompt rather than a tool.
  - **Delimiter discipline**: user content is wrapped in a clearly-
    marked `<<<USER MESSAGE>>>` block with instructions to treat
    anything inside as data, not commands (FR-009 prompt-injection
    resistance).
- **Rationale**: The constitution's identity rules (Principle I) are
  the single most load-bearing constraint of this feature. Putting
  them in a versioned constant — not a tool result, not a database
  row — means a `git grep` shows what the bot will and won't say, and
  a unit test can assert the constant contains zero forbidden terms.

## Decision 12 — Widget mounting: dynamic import in root layout

- **Decision**: `src/components/chat/ChatWidget.tsx` is the single
  client-component entry point, wrapped at use-site with
  `next/dynamic({ ssr: false })`. Mounted in `src/app/layout.tsx` after
  `<Footer />` and inside `<ToastProvider>` so it appears on every
  route (homepage and `/systems/[slug]`) without re-rendering on
  navigation.
- **Rationale**:
  - SC-006 caps widget impact at +25 KB First Load JS. Dynamic import
    with `ssr: false` keeps the chat code out of the SSR bundle for the
    static homepage entirely — it's only fetched after the visitor's
    browser is idle and only when the widget is opened (we'll
    actually `dynamic()`-import the *panel* and keep just the floating
    button in the initial bundle, Decision 13).
  - Mounting in layout means the widget keeps its React state across
    in-app `<Link>` navigations to `/systems/[slug]`.
- **Alternatives considered**:
  - **Mount inline in `page.tsx`** — would unmount on navigation,
    breaking FR-005 (history preserved while navigating). Rejected.
  - **Use Zustand / Context for state** — overkill; `useState` inside
    the widget root is sufficient because the widget is the only thing
    that reads its own state.

## Decision 13 — Two-stage widget bundle: button eager, panel lazy

- **Decision**: `ChatWidget.tsx` (the floating button + `useState` for
  `isOpen`) is in the initial bundle. `ChatPanel.tsx` is loaded via
  `next/dynamic({ ssr: false, loading: () => null })` only after
  `isOpen === true`.
- **Rationale**: SC-006 budget. The button is ~3 KB (Lucide icon +
  hover state); the panel pulls in message rendering, the streaming
  client, and Framer Motion animations — easily 20+ KB. Lazy-loading
  the panel keeps the homepage's initial JS budget unaffected for
  visitors who never open the chat (the majority).
- **Alternatives considered**:
  - **Eager-load everything** — wastes the budget on the 95% of
    visitors who never click the button. Rejected.

## Decision 14 — Test strategy

- **Unit (Vitest)**:
  - `sanitizer.test.ts` — every regex case + length cap + empty input.
  - `rate-limiter.test.ts` — first message allowed, 10th allowed, 11th
    blocked, window expiry resets count.
  - `system-prompt.test.ts` — assert the constant contains "Agentic AI
    Engineer", does NOT contain any forbidden term, and contains the
    refusal template marker.
- **Integration (Vitest + MSW)**:
  - `route.test.ts` — POST to `/api/chat` with a valid body, MSW
    intercepts the OpenAI call and returns a canned stream, assert SSE
    events are emitted in order (`delta` × N, `done`).
  - `route.error.test.ts` — provider 500, sanitizer rejection, rate-
    limit hit; assert correct status codes per Decision 9.
- **E2E (Playwright)**:
  - `chat.spec.ts` — open widget, send "What systems has Qasim
    shipped?", mock the API to return a canned grounded reply, assert
    it streams in and names a real system. Run in dark + light, at
    360px and 1440px. Includes axe-core scan in both themes.
- **Manual probe set (deferred to /sp.tasks)**: a YAML fixture of
  ≥20 grounded-fact probes and ≥20 language-match probes (English/
  Urdu/Roman Urdu) executed against the *live* deployed `/api/chat`
  during validation, scored against SC-002 / SC-003.

## Decision 15 — Build-time guards (constitution enforcement)

- **Decision**: Extend `scripts/check-forbidden.mjs` to additionally
  scan `src/lib/chat/system-prompt.ts` for forbidden identity terms.
  Add a vitest test that imports `SYSTEM_PROMPT` and runs the same
  check at unit-test level. Both must pass for CI green.
- **Rationale**: Constitution Principle I is NON-NEGOTIABLE. A typo'd
  system prompt is the most likely failure path, so guard it at two
  layers (lint script + unit test).

## Decision 16 — Dependency additions (ADR-touching)

This feature adds **one** dependency to `package.json`:

- `@openai/agents` (~latest stable, peer-deps `openai` and `zod`).
  Adding any net-new runtime dep is ADR-eligible per Constitution VI.
  An ADR (`history/adr/`) will be drafted by `/sp.tasks` proposing
  this addition, with this research.md as its primary justification.

`zod` and `openai` are pulled in transitively by `@openai/agents`. No
other client-side libs are added; the widget UI is plain React +
Framer Motion (already locked).

## Open questions resolved

| # | Question | Resolution |
|---|----------|------------|
| 1 | Edge or Node runtime? | Node (Decision 2) |
| 2 | SSE framing or raw stream? | SSE (Decision 3) |
| 3 | Tool granularity? | Two no-arg tools, identity in prompt (Decision 4) |
| 4 | Rate-limit key? | First segment of `x-forwarded-for` (Decision 5) |
| 5 | Sanitizer regex shape? | Email/phone/CC, replace not strip (Decision 6) |
| 6 | Language detection? | Trust the model (Decision 7) |
| 7 | Markdown rendering? | Out of scope this version (Decision 8) |
| 8 | Error response shape? | Coded errors per Decision 9 |
| 9 | Client transport? | `fetch` + reader, POST-friendly (Decision 10) |
| 10 | Where does identity copy live? | System-prompt constant + lint guard (Decisions 11, 15) |
| 11 | Where to mount widget? | `layout.tsx`, dynamic import (Decisions 12, 13) |

No NEEDS-CLARIFICATION items remain. Ready for Phase 1 design.
