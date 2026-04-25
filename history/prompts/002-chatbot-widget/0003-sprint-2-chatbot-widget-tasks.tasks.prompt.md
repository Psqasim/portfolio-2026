---
id: 0003
title: Sprint 2 chatbot widget tasks
stage: tasks
date: 2026-04-25
surface: agent
model: claude-opus-4-7
feature: 002-chatbot-widget
branch: 002-chatbot-widget
user: Psqasim
command: /sp.tasks
labels: [tasks, sprint-2, chatbot, tdd, openai-agents-sdk, sse]
links:
  spec: specs/002-chatbot-widget/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/002-chatbot-widget/tasks.md
tests:
  - Format check: every task has `- [ ]` + Txxx + file path; Phase 3+ carry [US#] labels
  - Story coverage: US1 (11 tasks), US2 (3 tasks), US3 (3 tasks); all independently testable
  - Dependency audit: TDD red-before-green preserved on T006/T008/T009 + T016/T017
---

## Prompt

/sp.tasks

## Response snapshot

Generated `specs/002-chatbot-widget/tasks.md` — **38 tasks across 6 phases**,
organized by user story for independent delivery.

### Phase breakdown

| Phase | Range | Count | Blocks |
|-------|-------|-------|--------|
| 1 Setup | T001–T003 | 3 | dep install, env example, ADR draft |
| 2 Foundational | T004–T015 | 12 | types, lib/chat/* (errors, system-prompt, sanitizer, rate-limiter, sse, tools, agent), forbidden-term script extension, three TDD unit test files |
| 3 US1 (P1 MVP) | T016–T026 | 11 | route handler + 5 UI components + hook + layout wiring + 2 integration tests + E2E spec |
| 4 US2 (P2) | T027–T029 | 3 | system-prompt language block + test extensions |
| 5 US3 (P3) | T030–T032 | 3 | minimize/new-chat controls + hook expansion + E2E |
| 6 Polish | T033–T038 | 6 | bundle-budget script + CI wiring + identity/language probe sets + quickstart smoke + final audit |

### Parallel opportunities

- Phase 2 has a seven-wide parallel window after T001 lands (T004 ‖ T005 ‖
  T006 ‖ T008 ‖ T009 ‖ T012 ‖ T013).
- US1 has a three-wide UI parallel window (T019 ‖ T020 ‖ T021) once types
  exist; hook (T022) can parallel with them.
- Polish phase has T033 ‖ T035 ‖ T036.

### Independent test per story

- **US1**: open site → click button → type "What systems has Qasim
  shipped?" → verify streamed grounded answer names only systems from
  `src/data/systems.ts`.
- **US2**: type Urdu script OR Roman Urdu → verify reply in matching
  language.
- **US3**: 3-message convo → minimize → reopen (history intact) → New
  Chat (cleared) → refresh (cleared).

### MVP scope

**Phases 1 + 2 + 3 (T001–T026, 26 tasks)** — ships a working streamed
grounded English chatbot to preview. US2/US3/polish are incremental
follow-up PRs.

### Format validation

Every task row passes the required format:
`- [ ] T### [P?] [US#?] description with file path`. Phase 1/2/6 tasks
carry no story label (correct — shared infra). Phase 3–5 tasks all
carry [US1]/[US2]/[US3]. No task ID gap, no duplicate IDs.

### Suggested PR slicing (5 small PRs)

1. T001–T015 foundational (dep + ADR + libs + unit tests; no UI impact)
2. T016–T026 US1 MVP (the shippable one)
3. T027–T029 US2 language parity
4. T030–T032 US3 controls
5. T033–T038 polish + CI gate + audit → ready for main

## Outcome

- ✅ Impact: Sprint 2 implementation is now broken into 38 ordered,
  testable tasks with explicit [P] parallelism marks, [US#] story
  traceability, file paths, and dependency ordering. `/sp.green` is
  unblocked.
- 🧪 Tests: 8 test files scripted (3 unit in Phase 2, 2 integration in
  US1, 1 E2E progressively extended across US1/US2/US3, plus 2 probe-set
  modules in Polish). TDD red-before-green ordering enforced on every
  lib module that has a test.
- 📁 Files: `specs/002-chatbot-widget/tasks.md` (new, 38 tasks), this
  PHR.
- 🔁 Next prompts: **`/sp.adr add-openai-agents-sdk`** (if not already
  run) to land the ADR before PR #1 merges, then **`/sp.green
  002-chatbot-widget`** to kick off the MVP (Phases 1+2+3). Optionally
  **`/sp.red`** first to generate just the failing tests if the user
  wants a strict two-phase TDD rhythm.
- 🧠 Reflection: The user-story slicing in spec.md (P1/P2/P3 with
  explicit "Independent Test" statements) made task organization
  straightforward — US2 and US3 are genuinely small (3 tasks each)
  because the heavy lifting (route + UI shell) lives in US1. Keeping
  system-prompt language-mirroring in US2 (not bundled into US1) means
  the MVP can go out without delaying on multilingual-probe tuning.

## Evaluation notes (flywheel)

- Failure modes observed: none. The plan's Phase 2 scope was rich enough
  that most architectural decisions were already pre-resolved; task
  generation was mechanical.
- Graders run and results (PASS/FAIL): format check PASS (all 38 rows
  match the checklist pattern); story coverage PASS (every acceptance
  scenario from spec.md mapped to at least one task); dependency audit
  PASS (TDD red tasks precede their green counterparts; no cross-story
  blocker dependencies).
- Prompt variant (if applicable): n/a (first tasks run for this
  feature).
- Next experiment (smallest change to try): if `/sp.green` reveals that
  the MSW fixture for the SDK stream events is fragile, lift it into a
  shared helper under `tests/integration/helpers/openai-mock.ts` and
  retrofit T016/T017 to use it — but only if the duplication actually
  shows up.
