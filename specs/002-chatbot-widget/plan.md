# Implementation Plan: AI Chatbot Widget

**Branch**: `002-chatbot-widget` | **Date**: 2026-04-25 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-chatbot-widget/spec.md`
**Phase 0 / Phase 1 artifacts**:
[research.md](./research.md), [data-model.md](./data-model.md),
[contracts/chat-api.md](./contracts/chat-api.md),
[quickstart.md](./quickstart.md)

## Summary

Add an embedded AI chatbot widget to the portfolio that answers visitor
questions about Muhammad Qasim's work, skills, and projects, grounded on
the same TypeScript data modules the portfolio renders. A floating button
in the bottom-right opens a chat panel; visitor messages are sanitized
and rate-limited server-side, then routed to an `@openai/agents`-defined
agent (`gpt-4o-mini`) with two no-arg tools (`getSystems`, `getSkills`).
Replies stream back over Server-Sent Events on a single Next.js route
handler at `/api/chat`. Session memory lives in React state only.

The implementation lives entirely inside the Sprint 1 codebase shape (no
new top-level dirs, no CMS, no database). It adds **one** runtime
dependency (`@openai/agents`) — that addition is the sole ADR-eligible
event in this plan.

## Technical Context

**Language/Version**: TypeScript 5.x (`strict`), Node 20.x (Vercel runtime), React 19.1.0.
**Primary Dependencies**: Next.js 15 (App Router), Tailwind CSS 4, Framer
Motion 11, `next-themes` 0.4, Lucide React 0.469, `@openai/agents` (NEW),
Zod (transitive via `@openai/agents`).
**Storage**: None persistent. In-memory `Map` for rate-limit counters
(server, per-instance). React `useState` for chat session (client).
**Testing**: Vitest (unit + integration with MSW), Playwright +
`@axe-core/playwright` (E2E + a11y), `tsc --noEmit`, ESLint, custom
`scripts/check-forbidden.mjs` (extended).
**Target Platform**: Vercel (Node serverless function for `/api/chat`),
modern evergreen browsers for the widget (Chromium, Firefox, Safari).
**Project Type**: single Next.js project (per Constitution III repo
layout). No new top-level directories.
**Performance Goals**: Time-to-first-token ≤ 2 s p50 / ≤ 4 s p95; widget
adds ≤ 25 KB First Load JS gzipped (SC-006); homepage stays ≤ 162 KB
total (constitution budget 200 KB; Sprint 1 baseline 137 KB).
**Constraints**: Server-only `OPENAI_API_KEY` (no `NEXT_PUBLIC_`); 10
msgs/IP/hour; 500 char input cap; identity constitution Principle I —
NON-NEGOTIABLE; cost budget < USD 5/month at expected traffic; SSG
preserved for all routes (the chatbot's POST is the only documented
exception per Constitution II).
**Scale/Scope**: Single-digit conversations/day expected first month;
homepage + `/systems/[slug]` routes carry the widget; widget itself is
~6 client components + 5 server-side lib modules + 1 API route.

## Constitution Check

*Constitution: v1.0.0 (2026-04-20). Re-evaluated post Phase 1 design.*

### Principle I — Content Integrity & Identity Discipline (NON-NEGOTIABLE)

| Gate | Status | Evidence |
|------|--------|----------|
| Identity "Agentic AI Engineer" used everywhere | PASS | `SYSTEM_PROMPT` constant locks the title; embedded in research.md Decision 11; lint guard in Decision 15. |
| No forbidden terms in any AI-generated output | PASS (gated) | `scripts/check-forbidden.mjs` extended to scan `system-prompt.ts`; vitest unit test asserts the constant; manual probe set in quickstart step 6 + `/sp.tasks` validation set. |
| No employer / military / navy / government references | PASS (gated) | Same lint + test gates above; spec FR-012 explicit; quickstart step 6 verifies in browser. |
| Outcome-oriented copy | PASS | System prompt instructs "factual, what was shipped, no credentialing"; tools project shipped systems with `status` and `metrics`, not job titles. |

**Verdict**: PASS. The identity surface is covered by code (constant
+ lint + unit test) and verification (quickstart + probe set).

### Principle II — Static-First, Zero-Backend

| Gate | Status | Evidence |
|------|--------|----------|
| Routes statically generated (SSG) | PASS | `/` and `/systems/[slug]` remain SSG. The new `/api/chat` is a Route Handler — explicitly allowed by Principle II as "external calls at runtime, client-initiated, gracefully degrading". |
| No CMS | PASS | Tools read from `src/data/*.ts` (typed modules). |
| Contact form unchanged | PASS | This feature touches no Web3Forms code. |
| Graceful degradation | PASS | FR-015 + Decision 9 error taxonomy + quickstart step 11 (provider outage). |

**Verdict**: PASS. The chatbot is the explicitly-anticipated case for
this principle, and degrades cleanly when OpenAI is unreachable.

### Principle III — Type Safety & Code Quality

| Gate | Status | Evidence |
|------|--------|----------|
| TypeScript strict | PASS | All new modules typed; tool parameters via Zod; data-model.md formalizes every entity. |
| ESLint zero warnings | PASS (gated) | CI gate unchanged; new code follows existing repo lint config. |
| Functional components, typed props | PASS | All 5 chat components are functional with explicit prop interfaces. |
| Repo layout fixed | PASS | New code lives under `src/app/api/chat/`, `src/components/chat/`, `src/lib/chat/`. **No new top-level directories.** |

**Verdict**: PASS.

### Principle IV — Performance Budget (NON-NEGOTIABLE)

| Gate | Status | Evidence |
|------|--------|----------|
| Lighthouse ≥ 90 on homepage (mobile) | PASS (gated) | Widget panel is lazy-loaded (Decision 13); only the floating button is in the initial bundle. |
| FCP < 1.5 s | PASS (gated) | Initial-bundle delta ≤ ~3 KB (button + icon). |
| Bundle ≤ 200 KB First Load JS | PASS (gated) | SC-006 caps widget delta at +25 KB; Sprint 1 baseline 137 KB → projected ≤ 162 KB. Enforced in CI by an extended bundle check. |
| Images via `next/image` | N/A | Widget has no images (icons only). |
| Self-hosted fonts | PASS | Reuses existing `next/font` setup. |

**Verdict**: PASS, with the explicit lazy-load architecture (Decision
13) doing the budget work.

### Principle V — Design System Fidelity

| Gate | Status | Evidence |
|------|--------|----------|
| Tokens not vibes | PASS | Widget uses existing CSS custom properties (navy bg, sakura/purple/cyan accents); no new hex values introduced (spec Assumptions confirms). |
| Dark default + first-class light | PASS | Widget reads `next-themes` resolved theme; both themes audited in quickstart step 13 + axe scan. |
| Decorative motifs preserved | PASS | Widget doesn't remove anything; adds AI/sparkle iconography that fits the "Anime × Dark Tech × AI" theme. |
| Framer Motion respects `prefers-reduced-motion` | PASS (gated) | All widget animations gated on `useReducedMotion()` (existing pattern from Sprint 1's `MotionProvider`). |
| Mobile-first 360 px | PASS (gated) | Quickstart step 13 verifies; FR-018 + SC-008 require 360 px parity. |

**Verdict**: PASS.

### Principle VI — Tooling Authority (MCP-First)

| Gate | Status | Evidence |
|------|--------|----------|
| Git operations via GitHub MCP | PASS (procedural) | Branch `002-chatbot-widget` exists; PR will be opened via GitHub MCP per repo policy. |
| Context7 MCP consulted before implementation | PASS | This plan's Phase 0 used Context7 for both `@openai/agents` and Next.js 15 v15.1.8 streaming docs (citations in research.md). |
| Secrets in `.env.local` / Vercel env | PASS | `OPENAI_API_KEY` server-only; quickstart step 0 enforces; data-model.md cross-entity invariant 2 documents the import boundary; CI grep test asserts. |

**Verdict**: PASS.

### Tech Stack Lock-In (Additional Constraints section)

| Item | Status | Evidence |
|------|--------|----------|
| Adding `@openai/agents` | **REQUIRES ADR** | Constitution Tech Stack Lock-In: "Adding or removing any line requires an ADR and a version bump." See Complexity Tracking below. |
| No additional UI libs | PASS | No Radix/shadcn/MUI/Chakra; no Markdown lib; no PII lib. |
| No CMS | PASS | n/a. |

### Overall Constitution Check

**Verdict**: PASS with one tracked exception (the `@openai/agents`
dependency addition, ADR-required by Tech Stack Lock-In). All NON-
NEGOTIABLE gates (I + IV) pass.

## Project Structure

### Documentation (this feature)

```text
specs/002-chatbot-widget/
├── plan.md                 # This file (/sp.plan output)
├── research.md             # Phase 0 — 16 decisions, all unknowns resolved
├── data-model.md           # Phase 1 — 5 entities, invariants, transitions
├── quickstart.md           # Phase 1 — 15-step manual smoke-test guide
├── contracts/
│   └── chat-api.md         # Phase 1 — POST /api/chat wire contract
├── checklists/
│   └── requirements.md     # Spec quality checklist (16/16 PASS)
└── tasks.md                # Phase 2 output (NOT created by /sp.plan)
```

### Source Code (repository root)

Only files added or touched by this feature are listed. **No new top-
level directories**; everything fits inside the constitution-locked
layout (`src/app/`, `src/components/`, `src/data/`, `src/lib/`,
`src/types/`).

```text
src/
├── app/
│   ├── layout.tsx                  # MOD: mount <ChatWidget /> after <Footer />
│   └── api/
│       └── chat/
│           └── route.ts            # NEW: POST handler — validate → rate-limit
│                                   #      → sanitize → run agent → stream SSE
│
├── components/
│   └── chat/
│       ├── ChatWidget.tsx          # NEW: floating button + open-state owner
│       │                           #      (initial bundle; lazy-loads ChatPanel)
│       ├── ChatPanel.tsx           # NEW: panel shell (header, messages, input)
│       ├── ChatMessage.tsx         # NEW: one bubble (user or assistant)
│       ├── ChatInput.tsx           # NEW: textarea + send button
│       ├── TypingIndicator.tsx     # NEW: animated dots while streaming
│       └── useChatSession.ts       # NEW: hook — session state + transport
│
├── data/
│   ├── systems.ts                  # UNCHANGED — read by getSystems tool
│   ├── skills.ts                   # UNCHANGED — read by getSkills tool
│   └── personal.ts                 # UNCHANGED — read by system-prompt builder
│
├── lib/
│   └── chat/
│       ├── agent.ts                # NEW: Agent definition (instructions, tools)
│       ├── tools.ts                # NEW: getSystems(), getSkills() tool impls
│       ├── system-prompt.ts        # NEW: SYSTEM_PROMPT constant (identity-locked)
│       ├── rate-limiter.ts         # NEW: in-memory Map + check(ip)
│       ├── sanitizer.ts            # NEW: sanitize(input) — PII strip + length cap
│       ├── sse.ts                  # NEW: ReadableStream + SSE event encoder
│       └── errors.ts               # NEW: ChatError taxonomy + HTTP mapping
│
└── types/
    └── chat.ts                     # NEW: Message, ChatSession, ChatError, etc.

scripts/
└── check-forbidden.mjs             # MOD: include src/lib/chat/system-prompt.ts in scan

tests/
├── unit/
│   ├── chat-sanitizer.test.ts      # NEW
│   ├── chat-rate-limiter.test.ts   # NEW
│   └── chat-system-prompt.test.ts  # NEW (asserts forbidden-term-free)
├── integration/
│   ├── chat-route.test.ts          # NEW (MSW intercepts OpenAI, asserts SSE order)
│   └── chat-route-errors.test.ts   # NEW (rate-limit, provider 500, sanitizer fail)
└── e2e/
    └── chat-widget.spec.ts         # NEW (Playwright + axe, dark/light, 360/1440)

.env.local.example                  # MOD: add OPENAI_API_KEY=sk-... line (no value)
package.json                        # MOD: add "@openai/agents" dependency
```

**Structure Decision**: Single Next.js project (Constitution III). All
new code slots under existing top-level directories. The chat surface is
self-contained under `src/components/chat/` (UI) + `src/lib/chat/`
(server/transport). The single new public route is `src/app/api/chat/
route.ts`. No top-level directories added; no ADR needed for layout.

## Phase 0 — Research Summary

See [research.md](./research.md) for the full 16-decision dossier. The
short version:

| # | Decision | One-line rationale |
|---|----------|--------------------|
| 1 | `@openai/agents` SDK with `gpt-4o-mini` | Tool-calling pattern matches "Agentic AI Engineer" identity; SDK gives stream events for free. |
| 2 | Next.js Node-runtime route handler | SDK + Map persistence prefer Node; Edge unvalidated. |
| 3 | SSE over `ReadableStream` | Idiomatic Next.js 15; no extra deps; survives proxies. |
| 4 | Two no-arg tools (`getSystems`, `getSkills`) | Single source of truth with the portfolio UI. |
| 5 | In-memory `Map` rate-limit, 10/IP/hr | Zero-backend (Constitution II); fine at expected traffic. |
| 6 | Regex sanitizer (email/phone/CC) + 500 cap | Server-side enforced; preserves semantic intent. |
| 7 | Trust the model for language detection | `gpt-4o-mini` handles English/Urdu/Roman Urdu natively. |
| 8 | Plain-text rendering (no Markdown) | React's default text-escaping is sufficient; defer Markdown to Sprint 3. |
| 9 | Coded error taxonomy (HTTP + SSE) | Lets the UI render correct affordances per error. |
| 10 | `fetch` + body-reader (not `EventSource`) | POST-friendly; same SSE bytes. |
| 11 | Identity-locked `SYSTEM_PROMPT` constant | Versioned, lint-checkable, unit-testable. |
| 12 | Mount widget in `layout.tsx` | Survives in-app navigation; preserves session. |
| 13 | Two-stage bundle (button eager, panel lazy) | Honors SC-006 +25 KB cap. |
| 14 | Vitest + Playwright + axe | Mirrors Sprint 1 test stack; no new test runners. |
| 15 | Constitution-lint extended to system prompt | Two-layer guard (script + unit test). |
| 16 | One new dep: `@openai/agents` | ADR-eligible; tracked in Complexity Tracking. |

## Phase 1 — Design Summary

- **Entities**: 5 (Chat Session, Message, Rate-limit Counter, Grounding
  Sources, Chat Error). All defined in [data-model.md](./data-model.md)
  with invariants and state-transition diagrams.
- **Wire contract**: `POST /api/chat` — full Zod request schema, SSE
  event types (`delta`, `tool_call`, `done`, `error`), and HTTP error
  bodies in [contracts/chat-api.md](./contracts/chat-api.md).
- **Manual smoke**: 15 numbered steps in [quickstart.md](./quickstart.md)
  (install → identity probe → rate-limit hit → outage degradation →
  bundle check → live deploy).
- **Agent context update**: `.specify/scripts/bash/update-agent-
  context.sh claude` will be run after this plan to refresh CLAUDE.md
  with the new tech (`@openai/agents`, Zod via SDK) under the "Active
  Technologies" markers.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| Adding **one** runtime dependency: `@openai/agents` (and transitively `openai`, `zod`) | This is the entire point of the feature. The SDK supplies the agent runtime, tool-calling protocol, and streaming event taxonomy. Implementing all three from scratch on top of `fetch` + the OpenAI REST API would (a) reinvent ~600 LOC of well-tested code, (b) lose the SDK's tracing/testing affordances, (c) take 2–3× longer to ship Sprint 2, and (d) still result in a similar bundle/server footprint. | (i) **Vercel AI SDK (`ai` + `@ai-sdk/openai`)** — adds two deps instead of one and a second AI abstraction we'd then have to standardize on. Rejected. (ii) **Hand-rolled OpenAI Chat Completions client with function-calling** — feasible but loses the `Agent`/`tool()` ergonomics that mirror the "Agentic AI Engineer" framing. Rejected as a worse cost/value trade. **ADR will be drafted in `/sp.tasks`** to formally record this addition under the constitution's Tech Stack Lock-In amendment procedure. |

No other constitution principles are violated or relaxed.

## Risks & Mitigations (top 3)

1. **Identity slip in a streamed token.** The model could partially emit
   a forbidden term mid-stream before stopping itself.
   *Mitigation*: system-prompt explicit refusal template (Decision 11),
   probe-set sampling (`/sp.tasks` ≥ 20 identity probes), unit test
   asserting `SYSTEM_PROMPT` is forbidden-term-free, manual quickstart
   step 6 verification before deploy.
2. **Cost overrun.** A bot/abuser could hammer the endpoint and burn
   the USD 5/month budget.
   *Mitigation*: 10 msgs/IP/hr rate limiter (Decision 5), 500-char
   input cap (Decision 6), 30 s server-side run timeout (contract),
   `maxTurns: 2` cap on the agent run. If breached at scale, escalate
   to KV-backed limiter via ADR.
3. **Bundle budget regression.** Pulling Framer Motion patterns and
   message rendering into the initial bundle could blow past +25 KB.
   *Mitigation*: lazy-load `ChatPanel` (Decision 13), CI bundle gate at
   162 KB, manual `pnpm build` size check in quickstart step 14.

## What this plan does NOT do

- It does not write any source files. All `src/**` files listed in
  Project Structure are *targets* for `/sp.tasks` and the implementation
  pass.
- It does not draft the ADR for `@openai/agents`. That belongs to
  `/sp.tasks` (or the user can run `/sp.adr add-openai-agents-sdk` now).
- It does not alter `tasks.md`. Phase 2 task generation is an explicit
  separate step.

## Next steps

1. **`/sp.tasks`** — generate ordered, testable task list from this plan.
2. **`/sp.adr add-openai-agents-sdk`** — formal ADR for the dependency
   addition (can run before or during /sp.tasks).
3. **Implementation pass** (TDD red → green → refactor) per the task
   list, with a PR via GitHub MCP at the end.
