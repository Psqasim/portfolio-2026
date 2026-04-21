# Implementation Plan: Sprint 1 — Core Portfolio Site

**Branch**: `001-core-portfolio-site` | **Date**: 2026-04-20 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-core-portfolio-site/spec.md`

## Summary

Ship a single-page, statically generated portfolio for Muhammad Qasim
("Agentic AI Engineer") delivering eight scroll-ordered sections — preloader,
navbar, hero, shipped-systems grid, skills grid, about, contact, footer —
across four prioritized user stories (US1 MVP = hero + systems; US2 = contact;
US3 = depth; US4 = nav + theming).

**Technical approach** (verified against Context7-fetched docs for Next.js 15,
Tailwind v4, Framer Motion):

- Next.js 15 App Router with `export const metadata` in `src/app/layout.tsx`,
  one route (`/`), no `generateStaticParams`, no route handlers, no fetch at
  render time — pure SSG.
- Tailwind v4 with `@theme` CSS variables for the token palette
  (navy / sakura / purple / cyan) + `@custom-variant dark (&:where(.dark, .dark *))`
  to drive theming through `next-themes` `attribute="class"`.
- `LazyMotion` + `m.*` components loaded with the `domAnimation` feature bundle
  (~17 KB) in a single client provider; `useReducedMotion()` short-circuits
  every motion primitive so all animations collapse to instant transitions
  when the OS requests it.
- Typed content modules (`src/data/personal.ts`, `systems.ts`, `skills.ts`)
  — no CMS, no fetch. Components import content directly at build time.
- Contact form: client component submits `multipart/form-data` to
  `https://api.web3forms.com/submit` with the access key from
  `NEXT_PUBLIC_WEB3FORMS_KEY`; no backend we own.
- SEO/discoverability: `metadata.openGraph`, inline JSON-LD Person schema in
  `layout.tsx`, and a build-time `public/llms.txt`.

Outputs of this plan: `research.md`, `data-model.md`, `contracts/`,
`quickstart.md`. Tasks are generated in a later command (`/sp.tasks`).

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode), Node 20.x (Vercel runtime
lockstep), React 19 (via Next.js 15).
**Primary Dependencies**: Next.js 15 (App Router), Tailwind CSS 4, Framer
Motion (`LazyMotion` + `m`), `next-themes`, Lucide React, `next/font`, Web3Forms
(client POST). No CMS. No extra UI libraries (no Radix/shadcn/MUI/Chakra).
**Storage**: None. All content is hardcoded TypeScript modules under
`src/data/`. Contact submissions flow to Web3Forms; we never persist them.
**Testing**: Playwright smoke (homepage renders, 5 system cards present, form
POST mocked, theme toggle persists), Vitest + React Testing Library for unit
coverage on `TerminalCard` typing loop and `useScrollSpy`, `axe-core` via
`@axe-core/playwright` for a11y (zero critical), Lighthouse CI against the
Vercel preview URL.
**Target Platform**: Evergreen browsers (Chrome / Edge / Safari / Firefox —
last 2 versions) on viewports 360px – 1920px. Deployed statically on Vercel
free tier (CDN-served; no Node runtime at request time).
**Project Type**: Web (single Next.js app; no separate backend). Fixed
`src/` layout mandated by Constitution Principle III.
**Performance Goals**: Lighthouse Performance / Accessibility / Best
Practices / SEO ≥ 90 (mobile profile, Moto G4 + Slow-4G); First Contentful
Paint < 1.5 s on the same profile; client JS per route ≤ 200 KB gzipped;
scroll-triggered animations at 60 fps (use `transform` / `opacity` only).
**Constraints**: Zero-backend (Principle II). No SSR, no ISR, no route
handlers calling third-party APIs at render. No ad-hoc hex values in
component code — every color resolves to a `@theme` token (Principle V).
No forbidden-content strings (Principle I) anywhere in shipped surfaces.
Preloader timing capped at 3 s (FR-008) so it never blocks the FCP budget.
**Scale/Scope**: One page, 8 sections, 5 system cards, 26 skill tiles
(6+5+9+2+4), 3 education entries, 1 contact form. Traffic is low
(recruiter / collaborator links) — CDN cache-hit is the only hot path.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| **I. Content Integrity & Identity Discipline** (NON-NEGOTIABLE) | ✅ PASS | Spec FR-036 and SC-008 encode the forbidden-strings check as a test surface. Plan adds a pre-deploy `grep -iE` sweep over `/out` (see research.md R-008) before Vercel promote. Identity "Agentic AI Engineer" is hardcoded in hero copy, `layout.tsx` metadata, and llms.txt. |
| **II. Static-First, Zero-Backend** | ✅ PASS | Every route is SSG. Only external call at runtime is the client-initiated Web3Forms POST in the contact form. No `fetch` during render, no route handlers, no API we own. |
| **III. Type Safety & Code Quality** | ✅ PASS | TS strict enabled, ESLint zero-warnings, functional components with typed props, fixed `src/` layout per Constitution. All `any` prohibited without inline justification. |
| **IV. Performance Budget** (NON-NEGOTIABLE) | ✅ PASS | `LazyMotion` + `domAnimation` chosen over `domMax` (17 KB vs 29 KB). `next/font` self-hosts Inter / Noto Sans JP / JetBrains Mono with `display: "swap"`. `next/image` required for hero circuit grid + profile placeholder. Bundle budget verified per-PR via `@next/bundle-analyzer` + Lighthouse CI run against Vercel preview. |
| **V. Design System Fidelity** | ✅ PASS | Tailwind v4 `@theme` holds the four tokens (`--color-bg-navy`, `--color-accent-pink`, `--color-accent-purple`, `--color-accent-cyan`) plus light-mode counterparts via `@custom-variant`. `prefers-reduced-motion` honored globally via a `ReducedMotionProvider` wrapping `LazyMotion`. |
| **VI. Tooling Authority (MCP-First)** | ✅ PASS | Context7 MCP consulted for Next.js 15, Tailwind 4, Framer Motion before this plan was written (see research.md "Docs consulted"). Repo creation + PR flow goes through GitHub MCP (per CLAUDE.md). No manual `git push` from agent. |

**No violations.** Complexity Tracking table below is empty.

## Project Structure

### Documentation (this feature)

```text
specs/001-core-portfolio-site/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output — technical decisions + rationale
├── data-model.md        # Phase 1 output — TS interfaces for src/data modules
├── quickstart.md        # Phase 1 output — local dev + Vercel deploy guide
├── contracts/           # Phase 1 output — Web3Forms, llms.txt, JSON-LD shapes
│   ├── web3forms.md
│   ├── llms-txt.md
│   └── seo-metadata.md
├── checklists/
│   └── requirements.md  # Spec quality checklist (already present, all PASS)
└── tasks.md             # Phase 2 output (/sp.tasks command — NOT created here)
```

### Source Code (repository root)

```text
portfolio-2026/
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root: ThemeProvider, fonts, metadata, JSON-LD, LazyMotion
│   │   ├── page.tsx              # Home: composes all section components in scroll order
│   │   ├── globals.css           # @import "tailwindcss"; @theme tokens; @custom-variant dark
│   │   └── robots.ts             # Build-time robots.txt (allow-all, sitemap pointer)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx        # Fixed nav, scroll-spy, theme toggle, mobile drawer
│   │   │   ├── Footer.tsx        # Name + kanji + quote + socials + copyright + teaser
│   │   │   └── Preloader.tsx     # Session-scoped loading overlay with 3 s timeout
│   │   ├── sections/
│   │   │   ├── Hero.tsx          # Two-column hero, CTAs, circuit-grid background
│   │   │   ├── Systems.tsx       # Grid of 5 SystemCards with kanji 実績 header
│   │   │   ├── TechStack.tsx     # 5 category icon grids with kanji headers
│   │   │   ├── About.tsx         # Bio + photo placeholder + education timeline
│   │   │   └── Contact.tsx       # Info cards + Web3Forms form + toast host
│   │   ├── motion/
│   │   │   ├── MotionProvider.tsx # Client-only LazyMotion(domAnimation) + reduced-motion wire
│   │   │   └── FadeInSection.tsx # Reusable `m.section` with whileInView + reduced-motion fallback
│   │   └── ui/
│   │       ├── SystemCard.tsx
│   │       ├── TerminalCard.tsx  # Typing-loop agent log (client component)
│   │       ├── GlowCard.tsx
│   │       ├── Badge.tsx         # Status + role badges
│   │       ├── SectionHeader.tsx # Title + kanji accent
│   │       ├── EducationTimeline.tsx
│   │       ├── CircuitGrid.tsx   # Background SVG pattern
│   │       ├── ThemeToggle.tsx   # Sun/Moon icon via next-themes
│   │       └── Toast.tsx         # Contact form success/error toast
│   ├── data/
│   │   ├── personal.ts           # Name, kanji, bio, socials, quote, education, llms.txt seed
│   │   ├── systems.ts            # 5 System entries
│   │   └── skills.ts             # SkillCategory[] with kanji + entries
│   ├── lib/
│   │   ├── cn.ts                 # classnames merger (clsx + tailwind-merge)
│   │   ├── scroll.ts             # smoothScrollTo(id)
│   │   ├── useScrollSpy.ts       # IntersectionObserver → active section id
│   │   ├── useSessionFlag.ts     # sessionStorage-backed boolean hook for preloader
│   │   └── jsonld.ts             # Person schema builder
│   └── types/
│       └── index.ts              # System, Skill, SkillCategory, EducationEntry, SocialLink, ContactSubmission
├── public/
│   ├── llms.txt                  # Plain-text summary for AI crawlers
│   ├── profile.jpg               # (optional; gradient fallback in About when missing)
│   └── og-image.png              # 1200×630 OG card
├── tests/
│   ├── e2e/                      # Playwright smoke + form POST mock + theme persistence
│   └── unit/                     # Vitest: TerminalCard typing, useScrollSpy, cn()
├── next.config.ts
├── tailwind.config.ts            # Minimal — Tailwind v4 lives mostly in globals.css
├── tsconfig.json                 # strict: true
├── eslint.config.mjs             # next/core-web-vitals + @typescript-eslint/no-explicit-any: error
├── .env.example                  # NEXT_PUBLIC_WEB3FORMS_KEY=...
└── package.json
```

**Structure Decision**: Single Next.js 15 App Router application with the
**Constitution-mandated fixed layout** (`src/app/`, `src/components/`,
`src/data/`, `src/lib/`, `src/types/`). No monorepo, no separate backend, no
workspaces. Sub-folders inside `src/components/` (`layout/`, `sections/`,
`motion/`, `ui/`) are organizational only and do not count as new top-level
directories under Principle III. `tests/` sits at repo root (mirrors the
single-app shape). One dynamic route (`/systems/[slug]`) is out of scope for
Sprint 1 and will be added in Sprint 2 without disturbing this layout.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

_No violations. All Constitution gates PASS on this plan._

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |
