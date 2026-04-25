---
id: 0002
title: Sprint 2 chatbot widget plan
stage: plan
date: 2026-04-25
surface: agent
model: claude-opus-4-7
feature: 002-chatbot-widget
branch: 002-chatbot-widget
user: Psqasim
command: /sp.plan
labels: [plan, sprint-2, chatbot, openai-agents-sdk, sse, nextjs15, context7]
links:
  spec: specs/002-chatbot-widget/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/002-chatbot-widget/plan.md
  - specs/002-chatbot-widget/research.md
  - specs/002-chatbot-widget/data-model.md
  - specs/002-chatbot-widget/contracts/chat-api.md
  - specs/002-chatbot-widget/quickstart.md
  - CLAUDE.md
tests:
  - Constitution Check: 6 principles + Tech Stack Lock-In, all PASS (one ADR-required)
  - Phase 0 NEEDS-CLARIFICATION resolution table: 11 items, all resolved
  - Context7 MCP consulted: /openai/openai-agents-js + /vercel/next.js/v15.1.8
---

## Prompt

/sp.plan

Use Context7 MCP to look up OpenAI Agents SDK docs and Next.js 15 Route Handlers (streaming) before writing the plan.

## Tech decisions (locked)
- OpenAI Agents SDK with gpt-4o-mini
- Next.js API route at /api/chat/route.ts (server-side only)
- SSE streaming via ReadableStream
- Agent tools: getSystems() and getSkills() reading from src/data/systems.ts and src/data/skills.ts
- Rate limiter: in-memory Map, 10 msgs per IP per hour, resets on cold start
- Input sanitizer: regex strip emails, phones, credit cards, max 500 chars
- OPENAI_API_KEY server-only env var
- Chat widget: React component with useState for messages, floating button bottom-right
- Session memory: conversation history in React state only, no database
- Mobile: chat panel slides up full-width from bottom

## File structure for chatbot
src/
  app/
    api/
      chat/
        route.ts          — POST handler: validate → rate limit → sanitize → agent call → stream response
  components/
    chat/
      ChatWidget.tsx      — Main widget: floating button + chat panel + state management
      ChatPanel.tsx       — The chat panel UI: header, messages list, input field
      ChatMessage.tsx     — Individual message bubble (user or bot)
      ChatInput.tsx       — Text input + send button
      TypingIndicator.tsx — Animated dots during generation
  lib/
    chat/
      agent.ts            — OpenAI Agent SDK setup: agent definition, tools, system prompt
      tools.ts            — getSystems() and getSkills() tool implementations
      rate-limiter.ts     — IP-based rate limiting logic
      sanitizer.ts        — Input sanitization (PII strip, length limit)
      system-prompt.ts    — The full system prompt text as a constant

## Key implementation notes
- The agent uses OpenAI Agents SDK (not raw ChatCompletion) — this makes it a real agent with tools, matching the "Agentic AI Engineer" identity
- Tools read from the same TypeScript data files the portfolio uses — single source of truth
- Streaming uses Web API ReadableStream + TextEncoder for SSE
- Rate limiter key is x-forwarded-for header (Vercel provides this)
- Chat widget uses dynamic import with ssr: false since it's client-only
- Widget is loaded in layout.tsx so it appears on every page

## Response snapshot

Phase 0 + Phase 1 plan landed for `002-chatbot-widget` with five
artifacts under `specs/002-chatbot-widget/`. Constitution v1.0.0 check
passes on all six principles; one tracked exception is the
`@openai/agents` dependency addition (Tech Stack Lock-In requires an
ADR — flagged below).

### Context7 verification
- `/openai/openai-agents-js` — confirmed `Agent` + `tool()` + `run(...,
  { stream: true, maxTurns })` are the current shape; `for await
  (const event of stream)` with `event.type === 'run_item_stream_event'`
  drives token streaming. `tool_call_item` and `message_output_item`
  are the two event subtypes we wire to SSE.
- `/vercel/next.js/v15.1.8` — confirmed Web-API `ReadableStream` +
  `TextEncoder` is the documented streaming pattern; `X-Accel-Buffering:
  no` is the official knob to defeat proxy buffering on self-hosted /
  Nginx-fronted deploys.

### research.md (Phase 0 — 16 decisions)
1. `@openai/agents` SDK + `gpt-4o-mini` (vs raw chat-completions / Vercel
   AI SDK / Anthropic).
2. Node runtime route handler (vs Edge — SDK + Map persistence prefer
   Node).
3. SSE over `ReadableStream` with three event types (`delta`,
   `tool_call`, `done`/`error`).
4. Two no-arg tools (`getSystems`, `getSkills`) — single source of truth
   with the portfolio UI; identity copy stays in the system prompt, not
   in tools.
5. In-memory `Map<ip, {count, windowStart}>`, fixed 1-hour window,
   `x-forwarded-for` first-segment key.
6. Server-side regex sanitizer (email/phone/CC) + 500-char cap, returns
   replacement tokens (`[email redacted]`) not silent strips.
7. Trust the model for English/Urdu/Roman Urdu (no `franc`/`cld3`).
8. Plain-text rendering only — defer Markdown to Sprint 3.
9. Coded error taxonomy: 400/413/429/502/500 + SSE `error` event mid-
   stream.
10. Client uses `fetch` + `response.body.getReader()` (POST-friendly,
    not `EventSource`).
11. Identity-locked `SYSTEM_PROMPT` constant (Constitution Principle I
    enforcement at module-constant level).
12. Mount widget in `layout.tsx` so React state survives in-app
    navigation.
13. Two-stage bundle: floating button eager, panel + transport lazy
    (`next/dynamic({ ssr: false })`) — honors SC-006 +25 KB cap.
14. Test stack: Vitest unit + integration (MSW), Playwright + axe E2E,
    plus a deferred ≥20-probe identity/language probe set for
    `/sp.tasks` validation.
15. Extend `scripts/check-forbidden.mjs` to scan
    `src/lib/chat/system-prompt.ts`; mirror with a vitest constant test.
16. **One** new runtime dep: `@openai/agents` — ADR-eligible per
    Constitution Tech Stack Lock-In.

### data-model.md (Phase 1)
Five entities formalized with invariants + state-transition diagrams:
**Chat Session** (React state, with discriminated `status` union),
**Message** (with assistant `streaming → complete | failed` lifecycle),
**Rate-limit Counter** (algorithm pseudocode + constants), **Grounding
Sources** (projection types `GroundedSystem` / `GroundedSkillCategory`
that prune the source modules for token efficiency), **Chat Error**
(coded taxonomy + retryable hint).

### contracts/chat-api.md (Phase 1)
Wire-level contract: Zod request schema, SSE event grammar with
literal example bytes, complete error-body shapes for each HTTP status,
SDK-event → wire-event mapping table. Idempotency / timeout / security-
boundary section codifies the 30-second server timeout, no-CORS posture,
and `OPENAI_API_KEY` import boundary.

### quickstart.md (Phase 1)
15-step browser smoke guide: install + lint gate, open widget, three
language probes, identity-violation probe (Principle I gate), prompt-
injection probe, length-cap probe, PII-redaction probe (verifies
DevTools payload), rate-limit drill, provider-outage drill, session-
memory + minimize/new-chat/refresh drill, dark/light + 360px/1440px
parity, bundle-size gate, live-preview re-run.

### plan.md (Phase 2 entry)
Project Structure section enumerates every new/modified file under the
constitution-locked layout (`src/app/api/chat/`, `src/components/chat/`,
`src/lib/chat/`, `src/types/chat.ts`, plus three test files). **No new
top-level directories.** Constitution Check is fully filled — six
principle tables + Tech Stack Lock-In line — and Complexity Tracking
documents the single ADR-required item (`@openai/agents` addition) with
the alternatives rejected.

### Agent context
`update-agent-context.sh claude` ran cleanly; CLAUDE.md's "Active
Technologies" now lists the 002-chatbot-widget tech tags alongside the
001-core-portfolio-site ones.

## Outcome

- ✅ Impact: Sprint 2's chatbot architecture is fully spec'd and gated.
  Five planning artifacts (plan, research, data-model, contracts,
  quickstart) cover every NEEDS-CLARIFICATION-eligible decision. The
  feature is `/sp.tasks`-ready.
- 🧪 Tests: Constitution Check PASS on Principles I–VI (NON-NEGOTIABLE
  I + IV both green); Phase 0 unknowns table 11/11 resolved; Context7
  cross-check confirmed both SDK + Next.js 15 streaming patterns are
  current.
- 📁 Files: `specs/002-chatbot-widget/plan.md` (filled),
  `specs/002-chatbot-widget/research.md`,
  `specs/002-chatbot-widget/data-model.md`,
  `specs/002-chatbot-widget/contracts/chat-api.md`,
  `specs/002-chatbot-widget/quickstart.md`, `CLAUDE.md` (updated by
  agent-context script), this PHR.
- 🔁 Next prompts: **`/sp.tasks`** to break the plan into ordered TDD
  tasks. Optionally **`/sp.adr add-openai-agents-sdk`** first (or any
  time before merge) to formally record the dependency addition under
  Constitution Tech Stack Lock-In.
- 🧠 Reflection: The locked tech decisions in the user's `/sp.plan`
  prompt removed almost all Phase 0 guesswork; the residual research
  was about *transport framing*, *language detection*, *error
  taxonomy*, and *bundle staging* — exactly the seams a tech-locked
  spec leaves open. The two-stage bundle (button eager, panel lazy) is
  the load-bearing architecture decision because it converts the +25 KB
  SC-006 ceiling from a worry into a budgetary affordance.

## Evaluation notes (flywheel)

- Failure modes observed: none. Phase 0 + Phase 1 ran clean; CLAUDE.md
  agent-context update produced one cosmetic line ("Database: None
  persistent. In-memory `Map`...") because the parser took
  `**Storage**: None persistent...` as a database field — content is
  correct, just oddly phrased. Not blocking.
- Graders run and results (PASS/FAIL): Constitution Check PASS (6/6
  principles + Tech Stack Lock-In flagged for ADR); Phase 0 unknowns
  resolved 11/11 PASS; Context7 doc verification PASS for both
  libraries.
- Prompt variant (if applicable): n/a (first plan run for this feature).
- Next experiment (smallest change to try): if the ADR pass surfaces
  any concern about pulling `openai` + `zod` transitively, the
  fallback is the hand-rolled OpenAI REST + function-calling path
  (rejected in research.md Decision 1 / Complexity Tracking). Worth
  pre-running `pnpm add @openai/agents --dry-run` before tasks to
  see the exact transitive footprint.

## ADR suggestion

📋 Architectural decision detected: adding `@openai/agents` runtime
dependency (with transitive `openai`, `zod`) to the constitution-locked
tech stack. Document reasoning and tradeoffs? Run
`/sp.adr add-openai-agents-sdk`.
