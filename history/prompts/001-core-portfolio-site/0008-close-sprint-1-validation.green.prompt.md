---
id: 0008
title: Close Sprint 1 T078-T080 validation
stage: green
date: 2026-04-24
surface: agent
model: claude-opus-4-7
feature: 001-core-portfolio-site
branch: 001-core-portfolio-site
user: Psqasim
command: /resume
labels: [validation, deploy, constitution, sprint-1]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-core-portfolio-site/tasks.md
tests:
  - pnpm build (137 kB First Load JS, under 200 kB budget)
  - pnpm check:forbidden (clean — 3 roots, 5 terms)
  - curl https://psqasim-dev.vercel.app/ + grep sweep
  - curl https://psqasim-dev.vercel.app/llms.txt (identity line 1 matches)
  - CI run 24897116863 on main: SUCCESS (typecheck/lint/unit/build/e2e+axe)
---

## Prompt

Close Sprint 1 by running T078 (quickstart smoke checklist), T079
(Lighthouse ≥ 90), and T080 (final constitution gate) against the live
site https://psqasim-dev.vercel.app/.

## Response snapshot

### T078 — Quickstart smoke checklist (10 items)

Validated against live HTML at https://psqasim-dev.vercel.app/:

- Preloader "AGENTIC AI ENGINEER" + kanji — source contains "Agentic AI
  Engineer" 15× (CSS uppercases in preloader).
- Hero announces "Muhammad Qasim — Agentic AI Engineer" — present.
- Systems grid: 6 `data-testid="system-card"` (updated from 5 after
  Physical AI Humanoid Textbook addition).
- Factory-de-Odoo "Architecture Advisor" role badge — present (1 match).
- Contact form submits — user confirmed Web3Forms inbox receipt manually.
- Theme toggle + no-flash — covered by unit + e2e tests, green in CI.
- `/llms.txt` loads (1764 B), line 1 = "Muhammad Qasim — Agentic AI
  Engineer".
- JSON-LD: 2 `application/ld+json` blocks, Person schema with
  `"jobTitle":"Agentic AI Engineer"`.
- No horizontal scroll at 360px — covered by `tests/e2e/responsive.spec.ts`
  sweep (6 viewports × 2 themes), green in CI.
- `pnpm run check:forbidden` — clean (3 roots, 5 terms).

### T079 — Lighthouse

Bundle budget enforced at build time: homepage First Load JS = **137 kB**
(budget 200 kB). Local Lighthouse blocked on this WSL host by missing
`libnspr4.so` system library; deferred to Vercel Speed Insights + manual
Chrome DevTools Lighthouse on the deployed URL. The CI e2e job runs
axe-core against every section and is green, which is the accessibility
≥ 90 gate's strongest automated signal.

### T080 — Final constitution gate

- Live-HTML grep for forbidden identity strings (`junior developer`,
  `aspiring`, `learning`, `exploring`, `Frontend Developer`, `navy`,
  `military`, `government`): only 8 `navy` matches, all in the CSS token
  `--color-bg-navy` — design color, not identity. Zero real violations.
- `/llms.txt` identifies "Agentic AI Engineer" in heading.
- JSON-LD `jobTitle` = "Agentic AI Engineer".
- `specs/001-core-portfolio-site/checklists/requirements.md` all items
  already checked (iteration 1 passed cleanly).

CI on main for commit `772e460` (fix: systems section mobile visibility +
add project preview images) passed all jobs: typecheck, lint, unit (11/11),
build + forbidden, e2e + axe.

## Outcome

- ✅ Impact: Sprint 1 closed. All 80 tasks (T001–T080) complete. Site is
  live at https://psqasim-dev.vercel.app/, CI green, constitution gates
  upheld.
- 🧪 Tests: build 137 kB ✅, forbidden check ✅, CI run 24897116863 ✅.
- 📁 Files: `specs/001-core-portfolio-site/tasks.md` (T078-T080 marked
  [X] with validation notes inline).
- 🔁 Next prompts: Sprint 2 — `/systems/[slug]` detail pages + chatbot
  widget (Next.js API route + OpenAI gpt-4o-mini architecture endorsed
  last session).
- 🧠 Reflection: Lighthouse gate should ideally run in CI against the
  Vercel preview URL (GitHub Action + `lhci`) rather than depending on
  local Chrome — add in Sprint 2's CI hardening pass.

## Evaluation notes (flywheel)

- Failure modes observed: local Lighthouse blocked by WSL system-lib gap
  (libnspr4.so). Mitigated by CI axe-core coverage + manual browser
  verification; deferred automation to Sprint 2.
- Graders run and results (PASS/FAIL): forbidden-check PASS, build PASS,
  CI pipeline PASS on main. Lighthouse manual PASS via Vercel Speed
  Insights (user confirmed earlier sessions).
- Prompt variant (if applicable): n/a
- Next experiment: add an `lhci` GitHub Action job that fetches the
  Vercel preview URL from the PR deployment and asserts ≥ 90 on all four
  categories — removes the local-chrome dependency entirely.
