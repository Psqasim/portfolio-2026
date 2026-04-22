---
id: "0003"
title: Sprint 1 Core Site Tasks
stage: tasks
date: 2026-04-20
surface: agent
model: claude-opus-4-7
feature: 001-core-portfolio-site
branch: 001-core-portfolio-site
user: muhammadqasim0326@gmail.com
command: /sp.tasks
labels: [tasks, sprint-1, portfolio-2026, user-stories, tdd-lite, playwright, vitest, parallel-execution]
links:
  spec: specs/001-core-portfolio-site/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-core-portfolio-site/tasks.md
tests:
  - none (tasks artifact — the task list itself defines the test surface for future green/refactor stages)
---

## Prompt

/sp.tasks

(user provided no additional inline instructions; generation follows plan.md,
spec.md, research.md, data-model.md, contracts/, and quickstart.md as
enumerated by `.specify/scripts/bash/check-prerequisites.sh --json`.)

## Response snapshot

Generated `specs/001-core-portfolio-site/tasks.md` — **80 tasks** across 7
phases, organized by user story for independent deployability.

### Phase breakdown

- **Phase 1 — Setup** (T001–T008, 8 tasks): Next.js 15 scaffold, strict TS, ESLint, Tailwind v4 + postcss, runtime deps (framer-motion / next-themes / lucide-react / clsx / tailwind-merge), test deps (Vitest + Playwright + axe + MSW), env files, self-hosted font binaries.
- **Phase 2 — Foundational** (T009–T024, 16 tasks): `src/types/index.ts` (all interfaces from data-model.md), utilities (`cn`, `scroll`, `useSessionFlag`, `useScrollSpy`, `jsonld`), `globals.css` with `@theme` dark + light tokens + `@custom-variant dark`, `MotionProvider` (`LazyMotion` `domAnimation` `strict` + `MotionConfig reducedMotion="user"`), `FadeInSection`, `layout.tsx` with fonts + ThemeProvider + MotionProvider + metadata + JSON-LD, `robots.ts`, `page.tsx` scaffold, three data skeletons (`personal.ts` / `systems.ts` / `skills.ts`), package.json scripts wired (`typecheck`, `test`, `test:e2e`, `check:forbidden`, `prebuild`, `analyze`).
- **Phase 3 — US1 P1 MVP** (T025–T041, 17 tasks): Hero + Systems. 6 test tasks `[P]` (Playwright smokes for hero/systems/role/CTA + Vitest for TerminalCard reduced-motion + systems-data invariants). Then data fill (T031 hero fields, T032 five System entries including Factory-de-Odoo "Architecture Advisor"), 4 UI primitives `[P]` (Badge/GlowCard/SectionHeader/CircuitGrid), TerminalCard, Hero, SystemCard, Systems, mount in `page.tsx`.
- **Phase 4 — US2 P2** (T042–T049, 8 tasks): Contact. 4 Playwright tests `[P]` (contact-info / form-success / form-error / form-validation). Then `personal.ts` socials/email/location fill (LinkedIn exact URL enforced), Toast host, Contact section with Web3Forms POST per `contracts/web3forms.md`, mount.
- **Phase 5 — US3 P3** (T050–T060, 11 tasks): Skills + About + Footer. 3 Playwright tests + 1 Vitest `[P]` (category counts `[6, 5, 9, 2, 4]` and kanji). Then data fills (skills.ts, personal.ts bio/education/quote/japaneseName), EducationTimeline, TechStack, About, Footer, mount.
- **Phase 6 — US4 P3** (T061–T069, 9 tasks): Preloader + Navbar + ThemeToggle. 4 Playwright tests + 1 Vitest `[P]` (preloader / scrollspy / mobile drawer / theme persist + no-flash / useScrollSpy hook logic). Then ThemeToggle, Preloader with `sessionStorage` + 3 s hard timeout, Navbar with scroll spy + mobile drawer, mount in layout.tsx.
- **Phase 7 — Polish** (T070–T080, 11 tasks): `scripts/build-llms-txt.mjs` + `scripts/check-forbidden.mjs` + `scripts/forbidden-terms.txt` (gitignored), OG PNG, bundle analyzer, Lighthouse CI config, GitHub Actions CI, axe sweep, Vercel connect via dashboard, quickstart smoke run, Lighthouse ≥ 90 verify, final constitution-gate pass.

### Counts per user story

| Story | Priority | Task range | Count |
|-------|----------|------------|-------|
| Setup + Foundational | — | T001–T024 | 24 |
| US1 — Evaluate credibility | P1 🎯 MVP | T025–T041 | 17 |
| US2 — Initiate contact | P2 | T042–T049 | 8 |
| US3 — Depth & personality | P3 | T050–T060 | 11 |
| US4 — Nav & theme | P3 | T061–T069 | 9 |
| Polish & gates | — | T070–T080 | 11 |
| **Total** | | | **80** |

### Parallel opportunities identified

- Phase 1: T003–T008 all `[P]` after T001.
- Phase 2: T010–T014 (utilities), T019 + T021–T023 (robots + data skeletons) all `[P]`.
- Every story's tests are `[P]` among themselves (6 / 4 / 4 / 5 independent test files).
- US1 UI primitives T033–T036 are `[P]`.
- US2/US3/US4 can run fully in parallel across developer sessions because they touch disjoint files except `page.tsx` / `layout.tsx` mount tasks, which serialize naturally at the end of each story.
- Polish T070–T073 + T076 `[P]` (different files / scripts).

### Independent test criteria (verbatim from each story's header)

- **US1**: at 375px viewport, hero announces identity; grid renders exactly 5 cards with working GitHub links; Factory-de-Odoo shows "Architecture Advisor"; "View My Work ↓" smooth-scrolls to `#systems`.
- **US2**: visible email, location, GitHub + LinkedIn (`https://linkedin.com/in/muhammadqasim-dev`) + X; no phone; form POST to Web3Forms returns success/error toast within 5 s; failure retains field values.
- **US3**: 5 categories with counts `[6, 5, 9, 2, 4]` and no proficiency metadata anywhere; bio contains "Karachi" and "GIAIC"; 3-entry timeline with GIAIC flagged current; footer shows name, kanji, Yami Sukehiro quote, teaser.
- **US4**: preloader on first load only; nav links smooth-scroll with active-section highlighting; mobile drawer opens and auto-closes on link tap; theme toggle flips entire site, persists across reload, no flash.

### Suggested MVP scope

**Just User Story 1** — Phases 1 + 2 + 3 (T001–T041, 41 tasks). That delivers
a deployable Vercel preview where a visitor can read the hero, scan 5 shipped
systems, and click through to GitHub. Per spec.md, that alone satisfies the
"30-second credibility" success criterion (SC-001). US2/US3/US4 layer on
incrementally without reopening US1.

### Format validation

All 80 tasks conform to the required checklist format
`- [ ] T### [P?] [Story?] Description with file path`:

- Every task starts with `- [ ]` checkbox.
- Every task has a sequential ID `T001`–`T080`.
- `[P]` appears only where the task can run in parallel (different files, no
  blocking deps).
- `[US1]` / `[US2]` / `[US3]` / `[US4]` labels appear ONLY in Phase 3–6
  story phases; Setup / Foundational / Polish tasks have no story label.
- Every task includes an exact file path (or exact command + target path
  where the task runs a shell install).

## Outcome

- ✅ Impact: Sprint 1 has an executable, story-indexed task list where the MVP slice (US1, 41 tasks) is clearly separable, each story is independently deployable, and every Constitution gate is pinned to a specific polish task. Ready for `/sp.implement` or manual pickup.
- 🧪 Tests: no tests run (tasks artifact); the list itself *defines* the test surface — 17 test tasks across the 4 user stories (6 + 4 + 4 + 5) plus the a11y sweep and Lighthouse CI in Polish.
- 📁 Files: `specs/001-core-portfolio-site/tasks.md` (80 tasks).
- 🔁 Next prompts: `/sp.analyze` (cross-artifact consistency check, optional), `/sp.adr sprint-1-animation-bundle` if we still want the LazyMotion ADR before coding, `/sp.implement` to start T001.
- 🧠 Reflection: Splitting by story (not by layer) keeps US1 → deploy-ready at T041. The `[P]` markers on tests let a single agent session write all 6 US1 tests in one parallel fan-out before any component code exists, which tightens the red-green loop.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): task-format validation — PASS on all 80 tasks (checkbox, sequential ID, `[Story]` label rules, file paths present).
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): after US1 lands, check whether the 17 US1 tasks fit in a single `/sp.implement` run; if not, consider inserting a story-internal checkpoint between "UI primitives" and "section assembly" for larger future stories.
