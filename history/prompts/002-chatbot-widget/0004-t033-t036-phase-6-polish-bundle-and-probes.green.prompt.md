---
id: "0004"
title: T033-T036 Phase 6 polish bundle and probes
stage: green
date: 2026-04-25
surface: agent
model: claude-opus-4-7
feature: 002-chatbot-widget
branch: 001-core-portfolio-site
user: muhammadqasim0326@gmail.com
command: /sp.implement
labels: [sprint-2, chatbot-widget, polish, bundle-budget, probe-sets]
links:
  spec: specs/002-chatbot-widget/spec.md
  ticket: null
  adr: history/adr/0002-add-openai-agents-sdk.md
  pr: null
files:
  - scripts/check-bundle.mjs
  - package.json
  - .github/workflows/ci.yml
  - .gitignore
  - tests/probe-sets/identity-probes.ts
  - tests/probe-sets/language-probes.ts
  - specs/002-chatbot-widget/tasks.md
tests:
  - pnpm typecheck (clean)
  - pnpm test (47 passed)
  - pnpm run check:bundle (133.7 KB / 162 KB budget)
  - pnpm run check:forbidden (clean)
---

## Prompt

Start from T001. Work through all tasks in order, respecting dependencies and parallel markers. Use Context7 MCP to look up OpenAI Agents SDK (@openai/agents) and Next.js 15 Route Handlers docs before implementing. Use GitHub MCP for all git operations. Commit after each phase. Continue through all 38 tasks until complete. If you hit a blocker or need a decision, stop and ask.

## Response snapshot

Phase 6 polish — in-repo deliverables T033–T036 landed:

- **T033** `scripts/check-bundle.mjs` — reads `.next/app-build-manifest.json`, walks `pages["/page"]` chunks, gzips each, fails if total > 162 KB. Includes a hashed-chunk fallback resolver (`<basename>-<hex>.<ext>`) for older Next outputs and a guard that refuses dev builds (`lowPriorityFiles` containing `static/development/`). Production build reports homepage First Load JS at **133.7 KB gzipped (7 chunks)** — matches Next.js's reported 137 KB closely.
- **T034** Wired `"check:bundle": "node scripts/check-bundle.mjs"` into `package.json`; CI `build` and `e2e` jobs now provide `OPENAI_API_KEY=build-time-placeholder` and the build job runs `pnpm check:bundle` after `pnpm build`.
- **T035** `tests/probe-sets/identity-probes.ts` — 22 probes covering jailbreak / identity-override / employer-bait / demotion / roleplay categories. Each pairs a prompt with `mustContain` + `mustNotContain` markers, plus a `checkIdentityResponse` helper.
- **T036** `tests/probe-sets/language-probes.ts` — 23 probes covering English (6), Urdu script (6), Roman Urdu (6), mid-conversation switches (3), mixed-language (2). `checkLanguageResponse` uses Unicode-range detection for Urdu script and a function-word heuristic for Roman Urdu.

T037 (Vercel preview smoke) and T038 (Lighthouse + axe on preview) remain — these need a deployed preview URL and manual verification, so stopping per the user's "stop and ask" rule.

## Outcome

- ✅ Impact: bundle-budget tripwire enforced in CI; identity + language probe sets ready for manual sampling against the live agent.
- 🧪 Tests: typecheck clean, all 47 unit + integration tests pass, bundle 133.7 KB / 162 KB budget green, forbidden-term lint clean.
- 📁 Files: 5 new (bundle script, 2 probe sets, gitignore entry, PHR), 3 modified (package.json, ci.yml, tasks.md).
- 🔁 Next prompts: deploy to Vercel preview → run quickstart.md 15-step smoke (T037) → Lighthouse + axe audit (T038).
- 🧠 Reflection: bundle script needed two refinements — hashed-chunk fallback (Next emits content-hashed names that don't match unhashed manifest entries on some configurations) and a dev-build guard (`pnpm dev` overwrites `.next/` with unminified output that would silently produce meaningless numbers).

## Evaluation notes (flywheel)

- Failure modes observed: dev-build chunks would have given a false-green budget read until guard added.
- Graders run and results (PASS/FAIL): typecheck PASS; vitest PASS (47/47); check:bundle PASS (133.7 KB ≤ 162 KB); check:forbidden PASS.
- Prompt variant (if applicable): n/a (infrastructure work, no model interaction).
- Next experiment (smallest change to try): wire the probe sets into a Vitest live-call suite gated on a `LIVE_AGENT=1` env var so we can run them automatically against a deployed preview rather than only sampling manually.
