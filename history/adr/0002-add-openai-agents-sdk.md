# ADR-0002: Add `@openai/agents` runtime dependency

> **Scope**: Adoption of the OpenAI Agents SDK for JavaScript/TypeScript as the
> sole new runtime dependency for the Sprint 2 chatbot widget. Triggered by
> Constitution v1.0.0 "Tech Stack Lock-In" (amendment procedure requires an ADR
> for every additive change to `package.json` runtime dependencies).

- **Status:** Accepted
- **Date:** 2026-04-25
- **Feature:** 002-chatbot-widget
- **Context:**

  Sprint 2 adds an embedded chatbot widget that answers visitor questions about
  Qasim's shipped systems, skills, and methodology grounded on the same
  TypeScript data modules the portfolio renders (`src/data/systems.ts`,
  `src/data/skills.ts`). The spec (FR-002, FR-003) requires two capabilities
  the model can't fake:

  1. **Tool calling against real data at runtime** — the bot must not
     hallucinate a seventh system. When asked about projects, it calls a
     server-side `getSystems` tool that reads the typed data module, and only
     then composes its reply. Same pattern for `getSkills`.

  2. **Streamed responses** with distinct tool-call vs. message-delta events
     so the UI can render "Reading portfolio data…" while the tool runs and
     flip to token-by-token typing during the reply (FR-015 graceful
     degradation depends on distinguishing transport errors mid-stream from
     terminal errors).

  The OpenAI Agents SDK (`@openai/agents`) bundles the agent runtime, a
  first-class `tool()` helper with Zod-typed parameters, a `maxTurns` cap, and
  a streaming event taxonomy (`run_item_stream_event` with `tool_call_item` /
  `message_output_item`, and `raw_model_stream_event` with `output_text_delta`
  for per-token deltas) — all of which map directly onto our UI needs.

  Adding it introduces:

  - One direct runtime dependency: `@openai/agents` (~current stable).
  - Two transitive runtime dependencies: `openai` (REST client used under the
    hood) and `zod` (schema validation for tool parameters and request body).

  Constitution v1.0.0 Tech Stack Lock-In names Next.js 15, Tailwind CSS 4,
  Framer Motion, Lucide React, `next-themes`, Web3Forms as the locked stack.
  Adding `@openai/agents` is a material change: it introduces a new vendor
  coupling (OpenAI), a new runtime-code surface (agent runner), and a new
  semantic category (LLM orchestration) that none of the existing locked libs
  cover. The amendment procedure therefore requires this ADR.

## Decision

- **Adopt `@openai/agents` as the single chatbot runtime dependency.** Usage
  is scoped to the server:

  - Imports live only under `src/lib/chat/` (`agent.ts`, `tools.ts`) and the
    route handler `src/app/api/chat/route.ts`.
  - No client bundle impact — `@openai/agents` is never imported from a
    `"use client"` file, and the widget's client-side transport is plain
    `fetch()` + `response.body.getReader()` against our own `/api/chat`
    endpoint.
  - The `OPENAI_API_KEY` environment variable is read exclusively inside
    `src/lib/chat/agent.ts` at module load. Never `NEXT_PUBLIC_`, never
    logged, never echoed in error bodies.

- **Model**: `gpt-4o-mini`. Cost envelope: ~$0.15/1M input tokens, ~$0.60/1M
  output tokens → average conversation ~$0.0005 → budget < $5/month at the
  expected traffic (single-digit conversations/day first month, capped by the
  10-msgs/IP/hour rate limiter).

- **Agent configuration**: two no-arg `tool()` definitions (`getSystems`,
  `getSkills`) projecting from the portfolio's TypeScript data modules;
  `maxTurns: 2` (tool-call → final message; no multi-turn tool chains per
  spec Out of Scope); `stream: true` for SSE-compatible event consumption.

- **Transitive dependencies accepted**: `openai` and `zod`. These are standard
  ecosystem libraries; both are well-maintained, widely audited, and acceptable
  inside the locked stack as indirect deps. If either becomes a direct import
  anywhere in the repo, that would be a separate additive ADR event.

## Consequences

### Positive

- **Shipping velocity.** The SDK replaces ~600 LOC of hand-rolled agent
  runtime, tool-calling parser, and stream-event taxonomy with a tested upstream
  implementation. Sprint 2 ships in one sprint instead of two.
- **Event taxonomy already matches the UX spec.** The SDK emits
  `tool_call_item` and `message_output_item` as distinct events — exactly
  what the widget needs to render "Reading portfolio data…" → typing indicator
  → tokens. Reinventing this mapping on top of raw OpenAI function-calling
  would duplicate logic the SDK already gets right.
- **Identity-first framing.** An `Agent` with tools is literally what
  "Agentic AI Engineer" (Constitution Principle I identity) means. The
  implementation shape mirrors the positioning rather than disguising a
  chat-completions call as something grander.
- **Stable types.** The SDK's TypeScript defs cover the event stream, tool
  schemas, and agent config — removing a class of bugs we'd otherwise catch
  only at runtime.

### Negative

- **New vendor coupling (OpenAI).** The app now has a runtime dependency on
  OpenAI's infrastructure. Mitigation: server-side graceful degradation
  (FR-015) — if OpenAI is unreachable, the widget surfaces a friendly retry
  affordance and the rest of the portfolio is unaffected (Constitution II
  still holds because SSG continues to work; the chatbot is the anticipated
  "external call at runtime" exception).
- **Transitive surface.** Pulling in `openai` and `zod` increases the server
  dependency tree. Neither lands in the client bundle (the route handler is
  server-only), so Performance Budget (Principle IV) is unaffected — but the
  supply-chain surface is materially larger. Mitigation: lockfile discipline
  via `pnpm-lock.yaml`, Renovate/Dependabot for updates, and revisit in 6
  months whether either transitive should be upgraded to a direct dep with
  its own ADR.
- **Lock-in.** Swapping `@openai/agents` later (for Anthropic's Claude, or a
  hand-rolled client) would be a non-trivial refactor — the tool schema
  pattern, stream event types, and `run()` signature are SDK-specific.
  Mitigation: keep the SDK surface contained to `src/lib/chat/agent.ts` and
  `src/lib/chat/tools.ts`; never leak SDK types into `src/components/**`.
  That boundary is enforced by plan.md's Project Structure table and by the
  cross-entity invariant in data-model.md ("credentials server-only").
- **Cost variance.** A bot or abuser could burn budget. Mitigation: 10
  msgs/IP/hour rate limiter (`src/lib/chat/rate-limiter.ts`), 500-char input
  cap, 30 s server timeout, `maxTurns: 2` cap. If breached at scale, escalate
  to KV-backed limiter via a follow-up ADR.

## Alternatives Considered

### Alternative A — Vercel AI SDK (`ai` + `@ai-sdk/openai`)

- **What it looks like**: Two new dependencies instead of one.
  `streamText({ model: openai('gpt-4o-mini'), messages, tools: {...} })`.
- **Rejected because**:
  - Adds a second abstraction layer *on top of* OpenAI's SDK (Vercel's `ai`
    already wraps model providers), so the total transitive weight is
    comparable to `@openai/agents` but with two vendor coupling points.
  - `@ai-sdk/*` split-package model means future SDK upgrades touch two
    lockfile entries.
  - The ergonomic win (`streamText` + `useChat`) trades agent-runtime
    semantics for a thinner wrapper — we would end up re-implementing the
    tool-call → message-output event distinction that `@openai/agents` already
    exposes cleanly.
- **Re-open if**: we decide to swap models (e.g., Anthropic) or want
  `useChat`'s client-side helpers specifically; the Vercel AI SDK's
  provider-abstraction is the stronger proposition in that world.

### Alternative B — Hand-rolled OpenAI REST client with function-calling

- **What it looks like**: `fetch('https://api.openai.com/v1/chat/completions',
  { ... stream: true ... })` + our own SSE parser + our own
  function-calling loop.
- **Rejected because**:
  - ~600 LOC of agent runtime we'd own forever: tool dispatch, stream event
    framing, retry/timeout, max-turns enforcement, message-vs-tool-call
    demarcation.
  - No upstream security patches; every OpenAI API change (model deprecation,
    response-shape changes) becomes our maintenance event.
  - Saves one direct dependency but adds one bespoke subsystem — strictly
    worse for a single-developer project.
- **Re-open if**: OpenAI materially changes its SDK licensing, or we need a
  feature the SDK doesn't expose (unlikely at current scope).

### Alternative C — Anthropic Claude / HF Spaces

- **What it looks like**: Model-family switch entirely.
- **Rejected because**:
  - Spec Assumptions block explicitly names OpenAI as the pre-chosen
    provider. Out of scope for this ADR; revisiting would require a spec
    revision first.
  - The "Agentic AI Engineer" framing doesn't depend on the model brand — it
    depends on the agent + tool pattern, which both Claude and OpenAI
    provide. Not a reason to add here and now.
- **Re-open if**: cost profile, latency, or quality ever favor a different
  provider. Would be its own ADR (swap, not add).

### Alternative D — No chatbot in Sprint 2

- **What it looks like**: Ship Sprint 2 as `/systems/[slug]` detail pages
  only; defer the chatbot to Sprint 3.
- **Rejected because**: the chatbot is the headline Sprint 2 deliverable from
  the user prompt (see `history/prompts/002-chatbot-widget/0001-...spec.prompt.md`).
  Descoping contradicts the feature's stated intent. Documented here for
  completeness.

## References

- Feature Spec: `specs/002-chatbot-widget/spec.md`
- Implementation Plan: `specs/002-chatbot-widget/plan.md` (Constitution Check
  → Tech Stack Lock-In row flags this ADR as the single required complexity
  entry).
- Research log: `specs/002-chatbot-widget/research.md` (Decisions 1, 16 —
  SDK choice + dependency footprint).
- Data model: `specs/002-chatbot-widget/data-model.md` (cross-entity
  invariant 2 — server-only credentials boundary).
- Wire contract: `specs/002-chatbot-widget/contracts/chat-api.md` (tool
  shapes, `run()` options, stream event mapping).
- Constitution: `.specify/memory/constitution.md` (Tech Stack Lock-In
  amendment procedure + Principle VI — Tooling Authority).
- Context7 library IDs consulted: `/openai/openai-agents-js`,
  `/vercel/next.js/v15.1.8`.
- Related ADRs: ADR-0001 (Sprint 1 Frontend Foundations — set the precedent
  of clustering related locked-stack changes into one ADR). This one is
  single-subject because the dependency addition is its own atomic event.
- Evaluator evidence:
  `history/prompts/002-chatbot-widget/0002-sprint-2-chatbot-widget-plan.plan.prompt.md`
  (plan-stage PHR — Complexity Tracking entry names this ADR).
