---
id: "0002"
title: Sprint 1 Core Site Plan
stage: plan
date: 2026-04-20
surface: agent
model: claude-opus-4-7
feature: 001-core-portfolio-site
branch: 001-core-portfolio-site
user: muhammadqasim0326@gmail.com
command: /sp.plan
labels: [plan, sprint-1, portfolio-2026, nextjs-15, tailwind-4, framer-motion, next-themes, web3forms, static-generation, seo, a11y]
links:
  spec: specs/001-core-portfolio-site/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-core-portfolio-site/plan.md
  - specs/001-core-portfolio-site/research.md
  - specs/001-core-portfolio-site/data-model.md
  - specs/001-core-portfolio-site/contracts/web3forms.md
  - specs/001-core-portfolio-site/contracts/llms-txt.md
  - specs/001-core-portfolio-site/contracts/seo-metadata.md
  - specs/001-core-portfolio-site/quickstart.md
  - CLAUDE.md
tests:
  - none (plan artifact; test surface defined in plan.md "Testing" + research.md R-010)
---

## Prompt

/sp.plan

Use Context7 MCP to look up latest docs for Next.js 15 App Router, Tailwind CSS 4, and Framer Motion before writing the plan.

## Tech Decisions (locked in constitution)
- Next.js 15 + App Router + TypeScript
- Tailwind CSS 4 + CSS custom properties for dark/light theming
- Framer Motion for scroll animations and hover effects
- next-themes for dark/light toggle
- Lucide React for UI icons
- Self-hosted fonts via next/font: Inter, Noto Sans JP, JetBrains Mono
- Web3Forms for contact form (POST to endpoint, access key in NEXT_PUBLIC_WEB3FORMS_KEY)
- All content in src/data/ TypeScript files — no CMS, no database
- next/image for all images
- Static generation — no SSR, no API routes in Sprint 1

## File Structure
src/
  app/
    layout.tsx           — Root layout: ThemeProvider, fonts, metadata, JSON-LD
    page.tsx             — Home: imports all section components
    globals.css          — Tailwind base + CSS custom properties for theme colors
  components/
    layout/
      Navbar.tsx         — Fixed nav, scroll spy, theme toggle, mobile drawer
      Footer.tsx         — Name, kanji, quote, socials, copyright
      Preloader.tsx      — Session-scoped loading screen
    sections/
      Hero.tsx           — Two-column hero with terminal card
      Systems.tsx        — System cards grid
      TechStack.tsx      — Categorized skill icon grids
      About.tsx          — Bio + photo placeholder + education timeline
      Contact.tsx        — Info cards + Web3Forms contact form
    ui/
      SystemCard.tsx     — Individual system card with metrics and glow
      TerminalCard.tsx   — Dark terminal with typing animation
      GlowCard.tsx       — Reusable card with glow border on hover
      Badge.tsx          — Status badges (LIVE, SHIPPED, ACTIVE, APPLIED)
      SectionHeader.tsx  — Section title + kanji accent
      EducationTimeline.tsx — Vertical timeline with dots
      CircuitGrid.tsx    — SVG background pattern
      ThemeToggle.tsx    — Dark/light switch icon
  data/
    personal.ts          — Name, title, bio, socials, education, quotes
    systems.ts           — 5 system projects with metrics and tech tags
    skills.ts            — Skill categories with kanji labels
  lib/
    utils.ts             — cn() classname merger, any helpers
  types/
    index.ts             — TypeScript interfaces for System, Skill, etc.
  public/
    llms.txt             — Plain text summary for AI crawlers
    profile.jpg          — Placeholder (will be replaced later)

## Design Tokens
Dark mode (default): bg #0a0e1a, cards #0f1629, purple #c084fc, pink #f472b6, cyan #22d3ee, text #e2e8f0
Light mode: bg #f8fafc, cards #ffffff, purple #7c3aed, pink #ec4899, cyan #0891b2, text #0f172a

## Deployment
- GitHub repo: Psqasim/portfolio-2026 (create via GitHub MCP)
- Vercel: connect after first push
- Domain: psqasim-portfolio-2026.vercel.app initially

## Key Implementation Notes
- Mobile-first: all components designed for 375px first, then responsive breakpoints
- Preloader only shows once per session (sessionStorage flag)
- Terminal card in hero has typing animation effect using setInterval
- System cards data-driven from systems.ts — no hardcoded JSX per project
- Contact form: simple fetch POST to https://api.web3forms.com/submit
- JSON-LD Person schema in layout.tsx head
- OpenGraph meta tags with "Agentic AI Engineer" identity

## Response snapshot

Generated `specs/001-core-portfolio-site/plan.md` plus the full Phase 0 / Phase 1 output tree, **after** consulting Context7 MCP for `/vercel/next.js/v15.1.8`, `/tailwindlabs/tailwindcss.com`, and `/grx7/framer-motion` per Constitution Principle VI (docs consulted are logged at the top of `research.md`).

Key plan-level decisions (full rationale in `research.md`):

- **Theme wiring (R-001)**: `next-themes` with `attribute="class"`, `defaultTheme="dark"`, `enableSystem={false}`, paired with Tailwind v4 `@custom-variant dark (&:where(.dark, .dark *))` in `globals.css`. Dark tokens are the default `@theme` block; light mode is an inverted token set gated by `:where(html:not(.dark))`. Inline no-flash script shipped by `next-themes` handles the FR-030 "no theme flash" requirement.
- **Preloader (R-002)**: Client component, `sessionStorage` flag `portfolio:preloader:shown`, hard 3-second safety timeout (FR-008). Sibling overlay (`position: fixed; inset: 0`) to avoid layout shift on unmount.
- **Scroll spy (R-003)**: Single shared `IntersectionObserver` with asymmetric `rootMargin: "-40% 0px -55% 0px"` in `src/lib/useScrollSpy.ts`. Navbar consumes it to set `aria-current="true"` on the active link.
- **Animation budget (R-004)**: `LazyMotion features={domAnimation} strict` — 17 KB gz instead of the 29 KB `domMax` bundle. All motion primitives import as `m.*`; `motion.*` imports are a CI failure under `strict`.
- **Reduced motion (R-005)**: `<MotionConfig reducedMotion="user">` at the root + explicit `useReducedMotion()` inside `TerminalCard`'s typing loop (which is `setInterval`-based, not a Framer transition). `CircuitGrid` uses a media query to drop its pan loop.
- **Contact form (R-006)**: Client-component `fetch` POST to `https://api.web3forms.com/submit` with `multipart/form-data`; `NEXT_PUBLIC_WEB3FORMS_KEY` is public by design. Validation inline (no form library — three fields don't justify the weight, and both Formik and RHF are effectively on the "no extra UI libs" list). 8-second abort controller; SC-005 requires toast within 5 s on stable networks.
- **Typography (R-007)**: `next/font/local` for all three families (Inter, Noto Sans JP, JetBrains Mono), exposed as `--font-sans` / `--font-jp` / `--font-mono` CSS variables consumed by `@theme`. Zero runtime Google Fonts calls.
- **Forbidden-content gate (R-008)**: `node scripts/check-forbidden.mjs` added as a post-`next build` step that greps `.next/`, `public/`, and compiled `src/data/` imports. Matches against `scripts/forbidden-terms.txt` (gitignored) + the fixed NON-NEGOTIABLE strings. Build fails on any hit.
- **Images (R-009)**: `next/image` for rasters, inline SVG `CircuitGrid` for the decorative grid so it recolors via `currentColor` on theme swap. Pre-rendered PNG for OG card at `public/og-image.png`.
- **Testing (R-010)**: Vitest (unit) + Playwright (integration + axe-core a11y) + Lighthouse CI against the Vercel preview URL. Mirrors SC-002 / SC-003 / SC-006.

Contracts produced:

- `contracts/web3forms.md` — POST shape, required + recommended fields, success/error envelopes, network-timeout behavior, honeypot recommendation, 8 s abort timeout.
- `contracts/llms-txt.md` — exact `public/llms.txt` template with "Agentic AI Engineer" identity, GIAIC mention, shipped-systems list, contact surfaces; generation pipeline through `scripts/build-llms-txt.mjs`; forbidden-content sweep applies.
- `contracts/seo-metadata.md` — `metadata: Metadata` literal for `src/app/layout.tsx`, inline JSON-LD Person schema shape, OG image spec (1200×630 PNG at `public/og-image.png`), `robots.ts` definition. Sitemap deferred to Sprint 2.

Data model (`data-model.md`): 7 interfaces — `System`, `SystemStatus`, `SystemMetric`, `Skill`, `SkillCategory` (with `SkillCategorySlug` union), `EducationEntry`, `SocialLink`, `ContactSubmission`, `PersonalProfile`. Seven build-time invariants encoded as unit tests (5 systems, `[6, 5, 9, 2, 4]` skill counts, 2–4 metrics per system, GitHub URL prefix, LinkedIn exact URL, no phone number anywhere, forbidden-content sweep).

Quickstart (`quickstart.md`): full local loop (`pnpm dev` / `typecheck` / `lint` / `test` / `test:e2e` / `build`), env setup, pre-PR Lighthouse run, three constitution-gate verification commands (`check:forbidden`, `ANALYZE=true pnpm build`, a11y Playwright grep), and a 10-item post-deploy smoke checklist.

Constitution Check: all six principles PASS. `Complexity Tracking` table empty. Key evidence recorded in `plan.md` — Principle IV evidence is the `LazyMotion(domAnimation)` selection + `next/font` self-host + per-PR Lighthouse CI on the Vercel preview; Principle VI evidence is the Context7 library-ID trail at the top of `research.md`.

Agent context (CLAUDE.md): Refreshed via `.specify/scripts/bash/update-agent-context.sh claude` — added the concrete Language/Version + Primary Dependencies + Storage (None) + Project Type lines so future agent turns in this repo see the locked plan without re-reading it.

## Outcome

- ✅ Impact: Sprint 1 has a concrete, constitution-compliant implementation plan with Phase 0 research, Phase 1 contracts + data model + quickstart, and a clean Constitution Check (zero violations). Ready for `/sp.tasks`.
- 🧪 Tests: none ran (plan artifact); `research.md` R-010 + `plan.md` "Testing" define the test surface for the green phase (Vitest + Playwright + axe-core + Lighthouse CI).
- 📁 Files: `specs/001-core-portfolio-site/plan.md`, `research.md`, `data-model.md`, `contracts/web3forms.md`, `contracts/llms-txt.md`, `contracts/seo-metadata.md`, `quickstart.md`, and `CLAUDE.md` (auto-refreshed).
- 🔁 Next prompts: `/sp.tasks` (recommended — generate the work breakdown); `/sp.analyze` (optional cross-artifact consistency check before tasks); consider `/sp.adr sprint-1-animation-bundle` if we want an ADR recording the `LazyMotion(domAnimation)` decision formally.
- 🧠 Reflection: The Context7 lookups confirmed a key cost-saving call — `LazyMotion(domAnimation)` is 17 KB vs 29 KB for `domMax`, which is exactly what keeps us under the 200 KB/route gzip budget without handcuffing the animation surface. Locking it as an ADR candidate up-front means Sprint 3's "add drag or layout animations" conversation will already have a reasoning trail.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): Constitution Check — PASS on all six principles; spec quality checklist — still PASS (re-verified that plan.md tech choices don't invalidate the spec's tech-agnostic language).
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): after the first Lighthouse run on the Vercel preview, tighten the per-route JS budget from 200 KB → 150 KB if real-world numbers allow; record the amended number as a PATCH bump of the constitution.
