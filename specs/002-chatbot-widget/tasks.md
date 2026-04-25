---
description: "Task list for 002-chatbot-widget — ordered, testable, TDD-first"
---

# Tasks: AI Chatbot Widget (`002-chatbot-widget`)

**Input**: Design documents from `/specs/002-chatbot-widget/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/chat-api.md, quickstart.md — all present.

**Tests**: INCLUDED. research.md Decision 14 prescribes the test stack (Vitest unit + integration with MSW; Playwright + `@axe-core/playwright` for E2E + a11y). Every user story has a TDD red step before implementation.

**Organization**: By user story. Each story is independently shippable after its phase checkpoint.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Different file, no dependency on any incomplete task — safe to parallelize.
- **[Story]**: `[US1] | [US2] | [US3]` — only on user-story-phase tasks (Phase 3+).
- Exact file paths in every description.

## Path Conventions

Single Next.js project per Constitution III. **No new top-level directories.** All code lands under existing `src/app/`, `src/components/`, `src/lib/`, `src/types/`, plus `tests/`, `scripts/`, `history/adr/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: dependency + config scaffolding. Blocks nothing else until T001 lands because every task below imports from `@openai/agents`.

- [X] T001 Install `@openai/agents` runtime dependency — `pnpm add @openai/agents` in repo root; verify `package.json` has the new entry and `pnpm-lock.yaml` updates; run `pnpm typecheck` to confirm the SDK's types resolve.
- [X] T002 [P] Add `OPENAI_API_KEY=` placeholder line to `.env.local.example` (no real value; document that this MUST NOT be prefixed `NEXT_PUBLIC_`).
- [X] T003 [P] Draft ADR at `history/adr/0002-add-openai-agents-sdk.md` — document the `@openai/agents` addition per Constitution Tech Stack Lock-In; include rationale, rejected alternatives (Vercel AI SDK, hand-rolled Chat Completions), and scope of usage (server-only, inside `src/lib/chat/`).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: shared types, lib modules, and their unit tests that every user story depends on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T004 [P] Create `src/types/chat.ts` — export `Message`, `WireMessage`, `ChatSession` (with discriminated `status` union: `idle | sending | streaming | error`), `ChatError`, `ChatErrorCode` per data-model.md entities 1, 2, 5.
- [X] T005 [P] Create `src/lib/chat/errors.ts` — `ChatError` factory + `httpStatusFor(code)` mapping (400/413/429/502/500) per contracts/chat-api.md error taxonomy.
- [X] T006 [P] Write `tests/unit/chat-system-prompt.test.ts` — TDD red: assert `SYSTEM_PROMPT` is exported from `src/lib/chat/system-prompt.ts`, contains the exact string "Agentic AI Engineer", and contains none of: `junior`, `aspiring`, `learning`, `exploring`, `Frontend Developer`, `navy`, `military`, `government` (case-insensitive); assert presence of delimiter token `<<<USER MESSAGE>>>`.
- [X] T007 Create `src/lib/chat/system-prompt.ts` — export `SYSTEM_PROMPT` constant per research.md Decision 11 (identity block + scope block + tool-use block + delimiter discipline); satisfies T006.
- [X] T008 [P] Write `tests/unit/chat-sanitizer.test.ts` — TDD red: cases for email redaction (→ `[email redacted]`), phone redaction (→ `[phone redacted]`), credit-card pattern redaction (→ `[card redacted]`), 500-char cap (`'x'.repeat(600)` returns `{ok:false, reason:'too_long'}`), whitespace-only input returns `{ok:false, reason:'empty'}`, mixed PII in one message redacts all three.
- [X] T009 [P] Write `tests/unit/chat-rate-limiter.test.ts` — TDD red: 10 calls in window all allowed with decrementing `remaining`, 11th call returns `{allowed:false}` without incrementing, `Date.now()` mocked past `WINDOW_MS` returns `allowed:true` with fresh `windowStart`, `unknown` IP gets its own bucket, `resetAt === windowStart + WINDOW_MS`.
- [X] T010 Create `src/lib/chat/sanitizer.ts` — regex sanitizer per research.md Decision 6 (email `/[\w.+-]+@[\w-]+\.[\w.-]+/g`, phone `/\+?\d[\d\s.\-()]{8,}/g`, CC `/\b(?:\d[ -]?){13,19}\b/g`); replacement tokens, 500-char cap, trim-then-empty check; satisfies T008.
- [X] T011 Create `src/lib/chat/rate-limiter.ts` — module-scope `Map<string, RateLimitRecord>`, `WINDOW_MS = 3_600_000`, `LIMIT_PER_WINDOW = 10`, `check(ip)` per data-model.md Entity 3 algorithm; satisfies T009.
- [X] T012 [P] Create `src/lib/chat/sse.ts` — `makeSseStream()` returning `{ stream: ReadableStream, emit(name, data), close() }`; uses `TextEncoder` and the `event: <name>\ndata: <json>\n\n` framing from contracts/chat-api.md.
- [X] T013 [P] Create `src/lib/chat/tools.ts` — two `tool()` definitions: `getSystems` projecting `systems` from `src/data/systems.ts` to `GroundedSystem[]`, `getSkills` projecting `skillCategories` from `src/data/skills.ts` to `GroundedSkillCategory[]` per data-model.md Entity 4; `parameters: z.object({})` on both.
- [X] T014 Create `src/lib/chat/agent.ts` — `Agent` instance using `SYSTEM_PROMPT` as `instructions`, wiring both tools from T013, model `gpt-4o-mini`; reads `process.env.OPENAI_API_KEY` at module load and throws if missing. Depends on T007 + T013.
- [X] T015 Modify `scripts/check-forbidden.mjs` — add `src/lib/chat/system-prompt.ts` to the scan glob; confirm the script still exits non-zero if any forbidden term appears in that file.

**Checkpoint**: `pnpm test` green for all unit tests, `pnpm run check:forbidden` clean. Foundation ready.

---

## Phase 3: User Story 1 — Visitor asks a grounded question (Priority: P1) 🎯 MVP

**Goal**: A visitor opens the floating chat button, types an English question about Qasim's work, and receives a streaming answer grounded in `src/data/systems.ts` and `src/data/skills.ts`.

**Independent Test**: Open homepage, click floating button, type "What systems has Qasim shipped?", observe token-by-token stream that names only real systems from the portfolio data.

### Tests for User Story 1 (TDD red before implementation) ⚠️

- [X] T016 [P] [US1] Write `tests/integration/chat-route.test.ts` — MSW intercepts OpenAI, simulates SDK stream events; assert the route's SSE output ordering (`tool_call` → multiple `delta` → `done`), assert request body validated by Zod, assert final concatenated text contains at least one system name from `src/data/systems.ts`.
- [X] T017 [P] [US1] Write `tests/integration/chat-route-errors.test.ts` — cases for **400** (empty message, malformed JSON), **413** (501-char message), **429** (11 calls same IP), **502** (MSW forces OpenAI 500 before first token), **500** (thrown error inside route); assert error body shape matches contracts/chat-api.md.

### Implementation for User Story 1

- [X] T018 [US1] Create `src/app/api/chat/route.ts` — `export const runtime = "nodejs"`; `export const dynamic = "force-dynamic"`; `POST` handler implementing the full validation flow in contracts/chat-api.md §Request (JSON parse → Zod → IP resolution → rate-limit → sanitize → agent run → stream). Depends on T010, T011, T012, T014. Satisfies T016 + T017.
- [X] T019 [P] [US1] Create `src/components/chat/ChatMessage.tsx` — functional component, role-aware styling (user right-aligned purple-accent bg; assistant left-aligned card bg), plain-text rendering with `\n` → `<br />`, typed props `{ message: Message }`.
- [X] T020 [P] [US1] Create `src/components/chat/TypingIndicator.tsx` — three animated dots, gated on `useReducedMotion()` (no animation when reduced), matches portfolio color tokens.
- [X] T021 [P] [US1] Create `src/components/chat/ChatInput.tsx` — controlled textarea + send button, disables during streaming (FR-016), shows `N / 500` counter near cap, Enter-to-send with Shift+Enter for newline.
- [X] T022 [US1] Create `src/components/chat/useChatSession.ts` — hook exposing `{ session, send(text), isStreaming, error }`; implements `fetch('/api/chat', { method: 'POST', body: JSON.stringify(...) })` + `response.body.getReader()` + line-buffered SSE parser; updates assistant message state `streaming → complete | failed` per data-model.md. Depends on T004, T005.
- [X] T023 [US1] Create `src/components/chat/ChatPanel.tsx` — panel shell: header with title "Ask Qasim's AI 🤖", scrolling messages list rendering `ChatMessage[]`, `TypingIndicator` slot while streaming, `ChatInput` at bottom, "Powered by OpenAI" disclosure footer (FR-017). Wires through `useChatSession`. Depends on T019, T020, T021, T022.
- [X] T024 [US1] Create `src/components/chat/ChatWidget.tsx` — floating button (bottom-right, tooltip "Need help? Ask AI ✨") + lazy-loaded ChatPanel via `dynamic(() => import('./ChatPanel'), { ssr: false, loading: () => null })` (research.md Decision 13); owns `isOpen` state. Depends on T023.
- [X] T025 [US1] Modify `src/app/layout.tsx` — import `ChatWidget` and mount it as the last child inside `<body>` (after `<Footer />`) so widget state survives in-app navigation per research.md Decision 12. Depends on T024.
- [X] T026 [US1] Write `tests/e2e/chat-widget.spec.ts` — Playwright + `@axe-core/playwright`: open homepage, click floating button, assert panel opens, type "What systems has Qasim shipped?", assert tokens appear incrementally, assert final message contains at least one real system name (read fixture from `src/data/systems.ts`); run axe scan in dark + light at 360px + 1440px, assert zero critical/serious violations.

**Checkpoint**: US1 is complete — the portfolio has a working streamed grounded English chatbot. MVP-shippable.

---

## Phase 4: User Story 2 — Urdu / Roman Urdu replies (Priority: P2)

**Goal**: The bot replies in whatever language the visitor wrote in — English, Urdu script, or Roman Urdu.

**Independent Test**: With US1 shipped, type "Qasim kis tech stack pe kaam karta hai?" in the widget; reply is in Roman Urdu and names tech stack entries from `src/data/skills.ts`. Then type in Urdu script; reply is in Urdu script.

### Implementation for User Story 2

- [X] T027 [US2] Modify `src/lib/chat/system-prompt.ts` — append language-mirroring instruction block: "Detect the language of each user message. Reply in the SAME language and script. Supported: English, Urdu (Nastaliq script), Roman Urdu (Latin script). Never switch languages unilaterally." Depends on T007.
- [X] T028 [US2] Modify `tests/unit/chat-system-prompt.test.ts` — add assertions that the prompt contains the strings `Urdu`, `Roman Urdu`, and `SAME language`; ensure no forbidden-term regressions (run full forbidden-term sweep after edit).
- [X] T029 [US2] Modify `tests/e2e/chat-widget.spec.ts` — add two probes: (a) send "Qasim kis tech stack pe kaam karta hai?", assert reply contains at least one Roman Urdu word marker (e.g., matches `/[a-zA-Z]/` AND contains tech-stack entries AND does NOT contain common English filler like "the" when taken as a whole — heuristic check with a relaxed threshold); (b) send `قاسم نے کیا کیا بنایا ہے؟`, assert reply contains at least one Unicode character in the Arabic/Urdu range (U+0600–U+06FF).

**Checkpoint**: US2 complete — multilingual parity in place.

---

## Phase 5: User Story 3 — Minimize, New Chat, Session control (Priority: P3)

**Goal**: Visitor can minimize the widget (history preserved), click "New Chat" to reset without refreshing, and the session clears on page refresh.

**Independent Test**: With US1 shipped, hold a 3-message conversation, click minimize (X), scroll elsewhere, reopen — prior messages still visible; click "New Chat" — cleared; refresh page — cleared.

### Implementation for User Story 3

- [X] T030 [US3] Modify `src/components/chat/ChatPanel.tsx` — add header controls: minimize button (X icon, closes panel but does NOT touch `session.messages`) and "New Chat" button (calls `newChat()` from the hook); keyboard-operable (Tab order: New Chat → Minimize → messages → input → send), visible focus ring, `aria-label`s set.
- [X] T031 [US3] Modify `src/components/chat/useChatSession.ts` — expose `newChat()` that replaces the session with `{ id: crypto.randomUUID(), messages: [], status: { kind: 'idle' }, isOpen: true }`; confirm `isOpen` toggle does NOT mutate `messages` per data-model.md Entity 1 reset semantics.
- [X] T032 [US3] Modify `tests/e2e/chat-widget.spec.ts` — add three scenarios: (a) send 3 messages, click minimize, reopen, assert all 6 bubbles (3 user + 3 assistant) still present; (b) click "New Chat", assert messages list is empty and next send does not reference earlier content in request body (inspect via Playwright network fixture); (c) `page.reload()`, assert widget reopens to empty session.

**Checkpoint**: All three user stories independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T033 [P] Create `scripts/check-bundle.mjs` — parse `.next/build-manifest.json` after `pnpm build`, sum homepage First Load JS chunks, fail with non-zero exit if > **162 KB** gzipped (Sprint 1 baseline 137 KB + SC-006 +25 KB widget budget).
- [X] T034 Wire bundle check into CI — add `"check:bundle": "node scripts/check-bundle.mjs"` to `package.json` scripts; extend existing CI workflow to run `pnpm build && pnpm run check:bundle` on PRs.
- [X] T035 [P] Create `tests/probe-sets/identity-probes.ts` — exported array of ≥20 probes (jailbreak-style prompts, identity-override attempts, employer-name baiting, "describe as junior" attacks) each paired with expected refusal markers (must contain "Agentic AI Engineer"; must NOT contain forbidden-term list). Used for manual sampling per research.md Decision 14.
- [X] T036 [P] Create `tests/probe-sets/language-probes.ts` — exported array of ≥20 probes covering English, Urdu script, Roman Urdu, and mid-conversation language switches; each with expected language-match assertion.
- [ ] T037 Run the full `specs/002-chatbot-widget/quickstart.md` 15-step manual smoke on the Vercel preview; capture a short note per step in the PR description (PASS / observations); hard-fail on step 6 (identity) or step 9 (PII redaction).
- [ ] T038 Final audit on preview — Lighthouse ≥ 90 on mobile homepage for Performance / A11y / Best Practices / SEO (Constitution IV); axe-core sweep clean in both dark and light at 360px + 1440px; confirm `pnpm run check:bundle` green.

---

## Dependencies & Execution Order

### Phase-level

- **Setup (Phase 1)**: T001 first (installs dep that every task below imports). T002, T003 can run [P] alongside T001 completion.
- **Foundational (Phase 2)**: starts after T001. Blocks all user-story phases.
- **User Story 1 (Phase 3)**: starts after Phase 2 checkpoint.
- **User Story 2 (Phase 4)**: starts after US1's system-prompt file exists (T007) — strictly only needs Phase 2, but the E2E extension (T029) expects the widget UI to be in place, so in practice run after US1 ships.
- **User Story 3 (Phase 5)**: starts after US1's ChatPanel + useChatSession exist (T022, T023).
- **Polish (Phase 6)**: after all desired user stories done.

### Within Phase 2

- T006 must fail first → T007 makes it pass.
- T008 must fail first → T010 makes it pass.
- T009 must fail first → T011 makes it pass.
- T014 depends on T007 and T013.
- T015 is a script edit, independent of the lib modules.

### Within US1

- T016, T017 (integration tests) fail first.
- T018 (route handler) depends on all Phase 2 lib modules; makes T016 + T017 pass.
- T019, T020, T021 are leaf components and can run in parallel after T004 (types) exists.
- T022 depends on T004, T005.
- T023 depends on T019, T020, T021, T022.
- T024 depends on T023.
- T025 depends on T024.
- T026 (E2E) runs last, requires T025 wired.

### Parallel opportunities

- **Phase 1**: T002 ‖ T003 while T001 runs.
- **Phase 2**: T004 ‖ T005 ‖ T006 ‖ T008 ‖ T009 ‖ T012 ‖ T013 (seven-wide after T001). Then T007/T010/T011 close their respective red tests.
- **Phase 3 (US1)**: T016 ‖ T017 (two tests), then T019 ‖ T020 ‖ T021 (three components) alongside T022 (hook) once T004 lands.
- **Phase 6**: T033 ‖ T035 ‖ T036 are independent file creations.

---

## Parallel Example: User Story 1

```bash
# First wave — TDD red (different test files):
Task: "Write tests/integration/chat-route.test.ts (happy path + SSE order)"
Task: "Write tests/integration/chat-route-errors.test.ts (400/413/429/502/500)"

# After route handler green, leaf UI components in parallel:
Task: "Create src/components/chat/ChatMessage.tsx"
Task: "Create src/components/chat/TypingIndicator.tsx"
Task: "Create src/components/chat/ChatInput.tsx"
```

---

## Implementation Strategy

### MVP (US1 only)

1. Phase 1 Setup (T001–T003).
2. Phase 2 Foundational (T004–T015).
3. Phase 3 US1 (T016–T026).
4. **Stop, validate**: run quickstart.md steps 0–3 + 6 + 8 + 9 + 10 + 11. If all PASS, ship to preview.

### Incremental delivery

- MVP ships US1 → publishes preview URL → gather feedback.
- Add US2 (T027–T029) → single commit, re-run quickstart steps 4 + language probes.
- Add US3 (T030–T032) → single commit, re-run quickstart step 12.
- Polish (T033–T038) before main-branch merge.

### Suggested PR slicing

- **PR #1**: T001–T015 (scaffold + foundational libs + unit tests). Lands dep + ADR + lib modules; no UI impact.
- **PR #2**: T016–T026 (US1 end-to-end). The MVP PR.
- **PR #3**: T027–T029 (US2 language parity). Small.
- **PR #4**: T030–T032 (US3 controls). Small.
- **PR #5**: T033–T038 (polish + CI gate + audit). Merge-ready.

---

## Notes

- Every task has a checkbox, an ID, a file path. Phase 3+ tasks carry a `[US#]` label.
- Tests in US1 are integration/E2E (the unit tests for sanitizer/rate-limiter/system-prompt are already covered in Phase 2 foundational).
- No task touches more than one user-story layer at once — preserves independent testability.
- Commit after each task or tight logical group; avoid "finish the whole phase in one commit".
- The ADR (T003) is a small parallel artifact, not a blocker on any code task — but must land before PR #1 merges to satisfy Constitution Tech Stack Lock-In.
