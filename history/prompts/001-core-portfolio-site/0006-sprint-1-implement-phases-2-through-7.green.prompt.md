---
id: 0006
title: Sprint 1 implement phases 2 through 7
stage: green
date: 2026-04-21
surface: agent
model: claude-opus-4-7
feature: 001-core-portfolio-site
branch: 001-core-portfolio-site
user: muhammadqasim0326@gmail.com
command: /sp.implement
labels: [sprint-1, implement, hero, systems, contact, tech-stack, about, footer, navbar, preloader, theme-toggle, ci, lighthouse, a11y]
links:
  spec: specs/001-core-portfolio-site/spec.md
  ticket: null
  adr: history/adr/0001-sprint-1-frontend-foundations.md
  pr: null
files:
  - src/components/sections/Hero.tsx
  - src/components/sections/Systems.tsx
  - src/components/sections/Contact.tsx
  - src/components/sections/TechStack.tsx
  - src/components/sections/About.tsx
  - src/components/ui/Toast.tsx
  - src/components/ui/ThemeToggle.tsx
  - src/components/ui/EducationTimeline.tsx
  - src/components/layout/Footer.tsx
  - src/components/layout/Preloader.tsx
  - src/components/layout/Navbar.tsx
  - src/data/personal.ts
  - src/data/skills.ts
  - src/data/systems.ts
  - src/hooks/useSessionFlag.ts
  - src/hooks/useScrollSpy.ts
  - src/app/layout.tsx
  - src/app/page.tsx
  - src/app/globals.css
  - scripts/build-llms-txt.mjs
  - scripts/check-forbidden.mjs
  - public/llms.txt
  - .github/workflows/ci.yml
  - .lighthouserc.js
  - tests/e2e/us2-contact-info.spec.ts
  - tests/e2e/us2-form-success.spec.ts
  - tests/e2e/us2-form-error.spec.ts
  - tests/e2e/us2-form-validation.spec.ts
  - tests/e2e/us3-tech-stack.spec.ts
  - tests/e2e/us3-about.spec.ts
  - tests/e2e/us3-footer.spec.ts
  - tests/e2e/us4-navbar.spec.ts
  - tests/e2e/us4-theme-toggle.spec.ts
  - tests/e2e/us4-preloader.spec.ts
  - tests/e2e/us4-scroll-spy.spec.ts
  - tests/e2e/a11y.spec.ts
  - tests/e2e/responsive.spec.ts
  - tests/unit/skills-data.test.ts
  - tests/unit/useScrollSpy.test.ts
tests:
  - vitest (unit) — skills-data invariants (no %, no levels, no years, no stars)
  - vitest (unit) — useScrollSpy IntersectionObserver wiring
  - playwright (e2e) — us2 contact info, form success/error/validation
  - playwright (e2e) — us3 tech stack, about, footer
  - playwright (e2e) — us4 navbar, theme toggle, preloader, scroll-spy
  - playwright (e2e) — a11y per section via axe (zero critical)
  - playwright (e2e) — responsive sweep 360→1920 × dark/light (no overflow)
  - script — scripts/check-forbidden.mjs across .next/, public/, src/data/
---

## Prompt

Continue into Phase 2 (T009-T024). Keep going through all phases until all 80 tasks are complete. Commit after each phase. Use Context7 MCP for docs lookups. Use GitHub MCP for all git operations. If you hit a blocker or need a decision, stop and ask — don't guess.

## Response snapshot

Executed Sprint 1 tasks T009 → T076a across six commits on branch `001-core-portfolio-site`:

- c6d2b41 — T008-T024 foundational shell: Tailwind v4 `@theme` tokens, LazyMotion provider, theme provider, layout scaffolding, useSessionFlag/useScrollSpy hooks.
- db989b6 — T025-T041 US1: Hero two-column, terminal typing card, SystemsGrid + SystemCard with status badges and metric tiles, JSON-LD Person schema, OG meta.
- 039bd54 — T042-T049 US2: Contact section with honeypot + inline validation + 8s AbortController, Web3Forms POST, Toast provider (success role=status 6s auto-dismiss; error role=alert manual).
- 143eac0 — T050-T060 US3: TechStack five categories (no %/levels/years), About with photo fallback + EducationTimeline, Footer with quote and Sprint-2 teaser.
- fd4703f — T061-T069 US4: Preloader (session flag, 2.6s), Navbar (transparent→solid at 80px, drawer dialog on mobile), ThemeToggle with mounted guard.
- 36b2a02 — T070-T076a Phase 7 Polish: prebuild llms.txt generator, check-forbidden scan, Lighthouse CI config, GitHub Actions workflow, axe + responsive e2e sweeps.

Gate status at checkpoint: `pnpm typecheck` ✅, `pnpm lint` ✅, `pnpm build` ✅ (134 KB First Load JS, 33% under 200 KB route budget), `pnpm check:forbidden` ✅.

Honored user correction mid-session: no forbidden-term text file anywhere — removed `scripts/forbidden-terms.txt` write, stripped `loadExtraPatterns()` from the scanner, purged the `.gitignore` entry, kept only the in-code fixed pattern list.

## Outcome

- ✅ Impact: Full Sprint 1 homepage assembled (Hero → Systems → TechStack → About → Contact + Navbar/Preloader/Footer), dark-default theme polished in light mode, Web3Forms flow with spam mitigation, CI workflow green locally, forbidden-term scanner clean.
- 🧪 Tests: 2 unit suites + 11 e2e specs + a11y/responsive sweeps; Chromium not installed in local sandbox so e2e runs are CI-only for now.
- 📁 Files: ~40 new source files across src/{app,components,data,hooks,lib,types}, scripts/, tests/, plus CI/Lighthouse config.
- 🔁 Next prompts: decision checkpoint on T077-T080 (Vercel connect, preview smoke, Lighthouse ≥ 90 on preview, final constitution gate) + git push to remote.
- 🧠 Reflection: Clustering tasks per phase + committing at phase boundaries kept diffs reviewable; the forbidden-term correction reinforced the rule — never persist sensitive category vocabulary anywhere, not even as tooling config.

## Evaluation notes (flywheel)

- Failure modes observed: (1) Footer initially authored as server component but passed onClick — fixed via "use client"; (2) first draft of socials used TitleCase platforms — downcased to match SocialLink union; (3) I pre-created a forbidden-terms.txt file the user rejected — removed and refactored scanner to inline list only.
- Graders run and results (PASS/FAIL): typecheck PASS, lint PASS, build PASS (budget 134 KB / 200 KB), check:forbidden PASS, unit tests PASS locally; e2e DEFERRED to CI (no local browser).
- Prompt variant (if applicable): n/a — single pass through tasks.md phases in order.
- Next experiment (smallest change to try): after T077 preview URL lands, run Lighthouse CI against the preview and feed FCP/TTI/CLS deltas back into any animation tuning on Preloader or Hero terminal card.
