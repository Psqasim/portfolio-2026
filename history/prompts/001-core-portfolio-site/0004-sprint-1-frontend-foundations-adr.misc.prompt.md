---
id: "0004"
title: Sprint 1 Frontend Foundations ADR
stage: misc
date: 2026-04-21
surface: agent
model: claude-opus-4-7
feature: 001-core-portfolio-site
branch: main
user: muhammadqasim0326@gmail.com
command: /sp.adr
labels: [adr, sprint-1, portfolio-2026, framer-motion, lazymotion, web3forms, bundle-budget, constitution-principle-iv]
links:
  spec: specs/001-core-portfolio-site/spec.md
  ticket: null
  adr: history/adr/0001-sprint-1-frontend-foundations.md
  pr: null
files:
  - history/adr/0001-sprint-1-frontend-foundations.md
tests:
  - none (ADR artifact — no runnable tests; enforcement lives in scripts/check-forbidden.mjs grep rule + LazyMotion strict runtime error)
---

## Prompt

/sp.adr sprint-1-frontend-foundations Document both decisions: 1) LazyMotion(domAnimation) as animation bundle strategy to stay under 200KB/route budget, and 2) no third-party form library — direct fetch POST to Web3Forms endpoint.

## Response snapshot

Created **ADR-0001 "Sprint 1 Frontend Foundations"** at
`history/adr/0001-sprint-1-frontend-foundations.md`, clustering the two user-
specified decisions under a single ADR because they share the same forcing
function (Constitution Principle IV — ≤ 200 KB gz per route) and the same
pattern (prefer the smallest viable surface, document the upgrade path).

### Decision cluster

- **Animation bundle**: Framer Motion via `LazyMotion features={domAnimation} strict`
  at the root; all components import `m.*` (not `motion.*`). ~17 KB gz vs
  `domMax` ~29 KB gz. `strict` turns accidental `motion.*` imports into a
  runtime error — CI-catchable.
- **Contact form**: No third-party form library. Local `useState` + native
  HTML validation + `fetch` POST of `FormData` to
  `https://api.web3forms.com/submit` with an 8 s `AbortController`.

### Alternatives evaluated (summary)

Animation: full `motion` default import (rejected — +17 KB gz waste);
`domMax` (deferred to Sprint 3 when diagrams may need `layout`); CSS-only
(rejected — motion surface too rich to hand-roll); `react-spring` /
`motion-one` (rejected — 8 KB savings don't justify API relearn).

Form: `react-hook-form` + `zod` (~21 KB gz — rejected for 3 fields);
Formik (maintenance mode, heavier — rejected); Next.js Server Action
(rejected — Web3Forms key is designed as public client value, no owned
backend in Sprint 1); no-JS native form action (rejected — breaks toast
UX required by SC-005).

### Significance test (all three PASS per skill rubric)

- **Impact**: yes — animation strategy touches every animated component;
  form strategy sets precedent for future forms.
- **Alternatives**: yes — 4 animation alternatives + 4 form alternatives
  with pros/cons recorded.
- **Scope**: yes — cross-cutting for Sprint 1 and constrains Sprint 2/3
  decisions (chatbot widget, architecture diagrams, any future form).

### Clustering rationale

One ADR rather than two because:
1. Shared rationale (200 KB gz budget) — changing one influences the other's
   available headroom.
2. Both are Sprint 1-scoped escape hatches (`domMax` upgrade path for Sprint 3,
   `react-hook-form` adoption trigger if Sprint 2 forms grow to 6+ fields).
3. They will likely be revisited in the same PR when Sprint 3 budgets get
   re-baselined post-Lighthouse-measurement.

## Outcome

- ✅ Impact: Sprint 1 has a permanent, reviewable record of the two foundational bundle-budget decisions with explicit upgrade triggers, so the next person (or future-me) who sees `m.div` instead of `motion.div` or a hand-rolled form will not ask "why didn't you just use react-hook-form". Constitution Principle IV now has a cited authority behind its Sprint 1 pass evidence.
- 🧪 Tests: none (ADR artifact); enforcement mechanisms — `LazyMotion strict` runtime error + `scripts/check-forbidden.mjs` grep rule (`motion\.` in `src/**`) + per-PR bundle analyzer — are already sequenced as tasks T035 (MotionProvider), T071 (check-forbidden.mjs), T072 (bundle analyzer).
- 📁 Files: `history/adr/0001-sprint-1-frontend-foundations.md` (new, 1 file).
- 🔁 Next prompts: `/sp.analyze` (optional cross-artifact consistency check now that we have plan + tasks + ADR), or `/sp.implement` to start T001.
- 🧠 Reflection: Clustering was the right call — two single-topic ADRs would have duplicated the Principle IV context paragraph and split the "measured bytes vs features" tradeoff conversation across two files. The user's title `sprint-1-frontend-foundations` already signaled they wanted them bundled; I matched that intent.

## Evaluation notes (flywheel)

- Failure modes observed: none. Over-granular-ADR risk (one per decision) was avoided by clustering on shared rationale.
- Graders run and results (PASS/FAIL): significance checklist — PASS on all 3 (impact / alternatives / scope); clustering rubric — PASS (shared forcing function + co-revisit cadence); alternatives-with-rationale grader — PASS (8 alternatives documented with explicit reject reasons).
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): after Sprint 1 Lighthouse baseline on the Vercel preview, add a measured-bytes row to the ADR ("actual `m.*` footprint in production build: N KB") so future upgrade-path discussions have real numbers instead of docs-quoted ones.
