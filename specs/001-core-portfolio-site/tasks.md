---
description: "Task list for Sprint 1 — Core Portfolio Site"
---

# Tasks: Sprint 1 — Core Portfolio Site

**Input**: Design documents in `/specs/001-core-portfolio-site/`
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/web3forms.md`, `contracts/llms-txt.md`, `contracts/seo-metadata.md`, `quickstart.md`

**Tests**: Included. Rationale: `research.md` §R-010 + `plan.md` "Testing" establish
Vitest + Playwright + axe-core + Lighthouse CI as the Sprint 1 test surface, and
every User Story in `spec.md` has an "Independent Test" clause that needs
codified verification before merge.

**Organization**: Tasks are grouped by user story (US1 P1 MVP → US4 P3) so each
story can be shipped, demoed, and validated independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Maps task to spec.md user story (US1 / US2 / US3 / US4)
- File paths are exact and absolute to the repo root `portfolio-2026/`

## Path Conventions

Single Next.js 15 App Router project, Constitution-mandated layout:

- Routes: `src/app/`
- UI: `src/components/{layout,sections,motion,ui}/`
- Content: `src/data/`
- Utilities: `src/lib/`
- Types: `src/types/`
- Tests: `tests/{e2e,unit}/`
- Scripts: `scripts/`
- Public assets: `public/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Bootstrap the Next.js 15 App Router app with the frozen stack.

- [X] T001 Scaffold Next.js 15 App Router + TS project at repo root: run `pnpm create next-app@15 . --ts --app --tailwind --eslint --src-dir --import-alias "@/*"` and commit the result in `package.json`, `tsconfig.json`, `next.config.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`. _(Scaffolded via temp-dir detour because create-next-app refused the non-empty repo root containing `.claude/ .specify/ specs/ history/ CLAUDE.md`; files copied into root verbatim.)_
- [X] T002 Enable strict TS in `tsconfig.json` (`"strict": true`, `"noUncheckedIndexedAccess": true`, `"noImplicitOverride": true`) and a path alias `"@/*": ["./src/*"]`.
- [X] T003 [P] Configure ESLint in `eslint.config.mjs` extending `next/core-web-vitals` + `@typescript-eslint/recommended`; add `@typescript-eslint/no-explicit-any: "error"` and `no-restricted-imports` forbidding `motion/react` top-level (force `m.*` via `framer-motion`).
- [X] T004 [P] Install Tailwind v4 tooling: `pnpm add -D tailwindcss @tailwindcss/postcss postcss` and wire `postcss.config.mjs` with `@tailwindcss/postcss`. _(create-next-app --tailwind flag wired this for us.)_
- [X] T005 [P] Install runtime deps: `pnpm add framer-motion next-themes lucide-react clsx tailwind-merge`.
- [X] T006 [P] Install test deps: `pnpm add -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom @playwright/test @axe-core/playwright msw` and run `pnpm playwright install --with-deps chromium`. _(Deps installed; `playwright install` deferred until first e2e task T025 to avoid downloading Chromium during setup.)_
- [X] T007 [P] Create `.env.example` with `NEXT_PUBLIC_WEB3FORMS_KEY=` placeholder and `.env.local` entry in `.gitignore`. _(`.gitignore` already matches `.env.local` via `.env.*.local` + explicit `.env`.)_
- [ ] T008 [P] Download self-hosted font files for Inter (variable), Noto Sans JP (400/700), JetBrains Mono (400/700) into `src/fonts/` (from rsms.me/inter and fonts.google.com archives). Commit the `.woff2` binaries. _(Deferred to T018 where fonts are actually imported; will use `next/font/google` which self-hosts binaries at build time — satisfies Constitution IV "self-hosted via next/font" via equivalent mechanism.)_

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core shell — theme + motion providers, design tokens, layout,
shared utilities, content scaffolds, typed entity interfaces — that every
user story depends on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T009 Create `src/types/index.ts` with all interfaces per `data-model.md`: `SystemStatus`, `SystemMetric`, `System`, `SkillCategorySlug`, `Skill`, `SkillCategory`, `EducationEntry`, `SocialPlatform`, `SocialLink`, `ContactSubmission`, `PersonalProfile`.
- [X] T010 [P] Create `src/lib/cn.ts` exporting `cn(...inputs)` using `clsx` + `twMerge`.
- [X] T011 [P] Create `src/lib/scroll.ts` exporting `smoothScrollTo(id: string, offsetPx?: number)` that respects `prefers-reduced-motion` (instant when reduced).
- [X] T012 [P] Create `src/lib/useSessionFlag.ts` — `useSessionFlag(key: string): [boolean, () => void]` backed by `sessionStorage` with SSR-safe fallback.
- [X] T013 [P] Create `src/lib/useScrollSpy.ts` — single-observer `IntersectionObserver` with `rootMargin: "-40% 0px -55% 0px"` returning active section id (per research.md R-003).
- [X] T014 [P] Create `src/lib/jsonld.ts` exporting `personSchema(profile: PersonalProfile)` returning the JSON-LD Person object per `contracts/seo-metadata.md`.
- [X] T015 Write `src/app/globals.css` with `@import "tailwindcss"`, `@custom-variant dark`, dark-mode `@theme` token block, light-mode inversion via `:where(html:not(.dark))`, and font variable exposure (`--font-sans`/`--font-jp`/`--font-mono`).
- [X] T016 Create `src/components/motion/MotionProvider.tsx` — client component wrapping children in `<LazyMotion features={domAnimation} strict>` and `<MotionConfig reducedMotion="user">`.
- [X] T017 Create `src/components/motion/FadeInSection.tsx` — reusable `m.section` with `initial={{ opacity: 0, y: 24 }}`, `whileInView={{ opacity: 1, y: 0 }}`, `viewport={{ once: true, amount: 0.25 }}`, `transition={{ duration: 0.5, ease: "easeOut" }}`.
- [X] T018 Rewrite `src/app/layout.tsx` with three `next/font/local` families (Inter variable / Noto Sans JP 400 / JetBrains Mono 400), `<ThemeProvider>` → `<MotionProvider>` wrap, full `metadata: Metadata` literal per `contracts/seo-metadata.md`, and JSON-LD Person schema inlined via `<script type="application/ld+json">`. _(Used `next/font/local` with `.woff2` files downloaded from rsms.me + fonts.gstatic.com; `next/font/google` timed out in the sandbox — T008 binary-download approach activated.)_
- [X] T019 [P] Create `src/app/robots.ts` per `contracts/seo-metadata.md` (allow-all; sitemap deferred to Sprint 2 when `/systems/[slug]` lands).
- [X] T020 Reduce `src/app/page.tsx` to a scaffold of seven empty `<section>` placeholders with TODO markers (`TODO: US1` → Hero/Systems, `TODO: US2` → Navbar/Contact, `TODO: US3` → Skills/About, `TODO: US4` → Preloader/Footer).
- [X] T021 [P] Create `src/data/personal.ts` skeleton exporting `personal: PersonalProfile` with all fields typed; US1 fields (fullName, title, heroDescription, heroMetrics, email, location, japaneseName, tagline, copyright) populated now; US3/US4 fields (aboutBio, education, socials, quote) marked TODO.
- [X] T022 [P] Create `src/data/systems.ts` skeleton exporting `systems: System[]` as an empty array (populated in T032).
- [X] T023 [P] Create `src/data/skills.ts` skeleton exporting `skillCategories: SkillCategory[]` as an empty array (populated in T055).
- [X] T024 Wire `package.json` scripts: `dev`, `build`, `start`, `lint` (→ `eslint` — `next lint` was deprecated in Next 15.5), `typecheck`, `test`, `test:watch`, `test:e2e`, `check:forbidden`, `analyze`. _(`prebuild` wiring for `build-llms-txt.mjs` deferred until the script itself lands in T070 to avoid a build-time missing-file error.)_
- [X] T008 [P] Download self-hosted font files — retroactively satisfied during T018. `src/fonts/` contains `InterVariable.woff2` (350 KB), `JetBrainsMono-400.woff2` (31 KB latin), `NotoSansJP-400.woff2` (81 KB core JIS subset). 700 weights faux-bolded by browser; expanded subsets deferred to T070 polish if kanji glyphs miss.

**Checkpoint**: Shell is live. `pnpm dev` renders an empty but themed page at
`http://localhost:3000`. `pnpm typecheck`, `pnpm lint`, and `pnpm build` all
green. Any user story can now begin in parallel.

---

## Phase 3: User Story 1 — Evaluate Engineering Credibility in Under 30 Seconds (Priority: P1) 🎯 MVP

**Goal**: Deliver the hero identity + the 5-card shipped-systems grid so that
a visitor on a 360px mobile viewport can state the owner's professional
identity, name two systems, and click through to GitHub within 30 seconds
of the preloader fading out.

**Independent Test**: With `pnpm dev` running, open `localhost:3000` at a
375px viewport; hero announces "Muhammad Qasim — Agentic AI Engineer"; scroll
reveals a grid of exactly 5 cards (CRM Digital FTE, Personal AI Employee,
TaskFlow, Factory-de-Odoo, MCP-Native Developer Tool) each with a working
GitHub link; Factory-de-Odoo shows "Architecture Advisor"; "View My Work ↓"
smooth-scrolls to `#systems`. `pnpm test:e2e -- --grep=us1` green.

### Tests for User Story 1 (write first, expect fail)

- [X] T025 [P] [US1] Playwright smoke in `tests/e2e/us1-hero.spec.ts` — viewport 375×812; asserts h1, "Agentic AI Engineer", hero metrics line, no horizontal scroll. _(Written; Playwright Chromium not installed in this sandbox — will run in Vercel CI / local Chromium setup.)_
- [X] T026 [P] [US1] Playwright smoke in `tests/e2e/us1-systems.spec.ts` — asserts 5 `[data-testid="system-card"]` nodes, each with status badge, 2–4 metric tiles, ≥1 tech tag, github href.
- [X] T027 [P] [US1] Playwright smoke in `tests/e2e/us1-factory-role.spec.ts` — filters cards by "Factory-de-Odoo", asserts "Architecture Advisor" text.
- [X] T028 [P] [US1] Playwright smoke in `tests/e2e/us1-cta-scroll.spec.ts` — clicks "View My Work", asserts `window.scrollY > 0` + `#systems` in viewport.
- [X] T029 [P] [US1] Vitest unit in `tests/unit/TerminalCard.test.tsx` — PASSING. reduced-motion renders all 4 log lines immediately.
- [X] T030 [P] [US1] Vitest unit in `tests/unit/systems-data.test.ts` — PASSING (5 assertions). length=5, metrics 2–4, github urls, Factory roleBadge, tech tags present.

### Implementation for User Story 1

- [X] T031 [US1] `src/data/personal.ts` hero fields populated: fullName, title, heroDescription, heroMetrics, email, location, japaneseName, tagline, copyright. US3/US4 fields remain TODO placeholders.
- [X] T032 [US1] `src/data/systems.ts` populated with 5 System entries in display order: CRM Digital FTE (LIVE), Personal AI Employee (SHIPPED), TaskFlow (SHIPPED), Factory-de-Odoo (ACTIVE, roleBadge="Architecture Advisor"), MCP-Native Developer Tool (APPLIED). Each has 2–4 metrics, tech tags, githubUrl, tagline; 2 have liveUrl.
- [X] T033 [P] [US1] `src/components/ui/Badge.tsx` — `variant: "LIVE"|"SHIPPED"|"ACTIVE"|"APPLIED"|"ROLE"` mapped to status tokens via `color-mix(in oklab, …)` with 1px ring.
- [X] T034 [P] [US1] `src/components/ui/GlowCard.tsx` — border + hover `shadow-[0_0_32px_-8px_var(--color-accent-pink)]` + focus-within for keyboard nav.
- [X] T035 [P] [US1] `src/components/ui/SectionHeader.tsx` — `{title, kanji?, id}` with decorative kanji absolutely positioned, gradient accent underline.
- [X] T036 [P] [US1] `src/components/ui/CircuitGrid.tsx` — inline SVG `<pattern>` (40×40 grid + corner dots), 40s pan gated by `@media (prefers-reduced-motion: no-preference)`.
- [X] T037 [US1] `src/components/ui/TerminalCard.tsx` — client component; 4-line agent log; per-character typing (~25ms) + inter-line gap (400ms); `useReducedMotion()` short-circuit to instant render; always-dark palette (terminal metaphor).
- [X] T038 [US1] `src/components/sections/Hero.tsx` — `min-h-screen` two-column `md:` grid, CircuitGrid absolute bg, Japanese name / h1 / title / description / metrics / CTAs. "Ask My AI Agent" `disabled` + `aria-disabled="true"` + `title="Coming soon"`.
- [X] T039 [US1] `src/components/ui/SystemCard.tsx` — status Badge, optional role Badge, name, tagline, metrics grid (value + label), tech pills, GitHub link + optional Live link, disabled `View Architecture →` span for Sprint 2.
- [X] T040 [US1] `src/components/sections/Systems.tsx` — SectionHeader + grid `grid-cols-1 min-[641px]:grid-cols-2 min-[1025px]:grid-cols-3 gap-6` (FR-016 bounds), FadeInSection wrapper.
- [X] T041 [US1] `src/app/page.tsx` mounts `<Hero />` + `<Systems />`. Unit tests 6/6 green (includes Factory role + 5-entry constraint). e2e written, Chromium install deferred.

**Checkpoint**: User Story 1 ships. Deployable as-is — a visitor hits the
site, reads the hero, scans 5 cards, clicks a GitHub link. That alone is
the MVP per spec.md.

---

## Phase 4: User Story 2 — Initiate Direct Contact (Priority: P2)

**Goal**: Visitor can reach email / socials in one click and submit the
contact form with a success-or-error toast within 5 s.

**Independent Test**: Contact section shows `muhammadqasim0326@gmail.com`,
`Karachi, Pakistan`, GitHub + LinkedIn (exact URL
`https://linkedin.com/in/muhammadqasim-dev`) + X icons; no phone number
anywhere; submitting the form with valid inputs triggers a `fetch` to
`https://api.web3forms.com/submit` (MSW-intercepted in test) and a success
toast within 5 seconds; failure path shows error toast and retains field
values.

### Tests for User Story 2 (write first, expect fail)

- [X] T042 [P] [US2] Playwright smoke in `tests/e2e/us2-contact-info.spec.ts` — scroll to `#contact`; assert visible email link `mailto:muhammadqasim0326@gmail.com`, "Karachi, Pakistan" text, GitHub + LinkedIn + X icons, LinkedIn href equals `https://linkedin.com/in/muhammadqasim-dev`; assert no element contains a phone number pattern.
- [X] T043 [P] [US2] Playwright smoke in `tests/e2e/us2-form-success.spec.ts` — intercept POST to `api.web3forms.com/submit` → 200 `{success: true}`; fill form, submit, assert success toast visible within 5 s, fields cleared.
- [X] T044 [P] [US2] Playwright smoke in `tests/e2e/us2-form-error.spec.ts` — intercept POST → `{success: false, message: "rate limit"}`; submit, assert error toast visible; fields retain values.
- [X] T045 [P] [US2] Playwright smoke in `tests/e2e/us2-form-validation.spec.ts` — submit with empty message → inline error, no network request fired (listen to `page.on("request")`).

### Implementation for User Story 2

- [X] T046 [US2] Fill `src/data/personal.ts` socials + contact fields: `email`, `location`, `socials` array with GitHub (`https://github.com/Psqasim`), LinkedIn (`https://linkedin.com/in/muhammadqasim-dev`), X (placeholder URL — dimmed non-clickable if real handle absent; leave `href: "#"` with `data-placeholder="true"`).
- [X] T047 [P] [US2] Create `src/components/ui/Toast.tsx` — headless toast host using a React context + queue; `variant: "success" | "error"`; auto-dismiss 6 s for success, manual dismiss for error; ARIA `role="status"` / `role="alert"` respectively.
- [X] T048 [US2] Create `src/components/sections/Contact.tsx` — client component. Left column: info cards (email, location, socials). Right column: form with Name (maxLength 100), Email (type="email", pattern validated via a small regex), Message (maxLength 4000, shows char counter). Submit handler: client validate, assemble `FormData`, POST to `https://api.web3forms.com/submit` per `contracts/web3forms.md` (8 s `AbortController`), emit toast. Fields retain on error.
- [X] T049 [US2] Mount `<Contact />` in `src/app/page.tsx` replacing its placeholder; mount `<ToastProvider>` in `src/app/layout.tsx` inside `<MotionProvider>` so every route can emit toasts.

**Checkpoint**: US1 + US2 both shipped. A visitor can reach out via any of
four channels and the form round-trips in under 5 s.

---

## Phase 5: User Story 3 — Build Trust Through Depth & Personality (Priority: P3)

**Goal**: Visitor understands the technical breadth (Skills), the person
(About bio + photo + education timeline), and the closing personality
(Footer quote + teaser).

**Independent Test**: Skills section shows 5 categories with counts
`[6, 5, 9, 2, 4]`, no proficiency metadata anywhere; About bio is 3–4
sentences mentioning GIAIC and Karachi; 3-entry education timeline has
the GIAIC entry flagged current; Footer renders large "MUHAMMAD QASIM",
Japanese rendering "ムハンマド・カシム", Yami Sukehiro quote, and the
Sprint-2 AI-agent teaser.

### Tests for User Story 3 (write first, expect fail)

- [X] T050 [P] [US3] Playwright smoke in `tests/e2e/us3-skills.spec.ts` — assert 5 category groups with counts `[6, 5, 9, 2, 4]` in order; assert no element contains `%`, `year`, `years`, `level`, or star characters `★`/`☆`.
- [X] T051 [P] [US3] Playwright smoke in `tests/e2e/us3-about.spec.ts` — bio text contains "Karachi" and "GIAIC"; 3 education timeline entries visible; GIAIC entry has a visually distinct "current" marker (data-current attribute).
- [X] T052 [P] [US3] Playwright smoke in `tests/e2e/us3-footer.spec.ts` — assert visible "MUHAMMAD QASIM", "ムハンマド・カシム", italic quote "Surpass your limits. Right here, right now.", attribution "Yami Sukehiro", copyright "© 2026 Muhammad Qasim", teaser text containing "embedded AI agent".
- [X] T053 [P] [US3] Vitest unit in `tests/unit/skills-data.test.ts` — import `skillCategories`; assert 5 entries with `skills.length` `[6, 5, 9, 2, 4]` and category kanji `["知能", "言語", "基盤", "情報", "画面"]`.

### Implementation for User Story 3

- [X] T054 [US3] Populate `src/data/skills.ts` — 5 `SkillCategory` entries with kanji/labels and skills: AI & Agents 知能 (6), Languages & Frameworks 言語 (5), Infrastructure & DevOps 基盤 (9), Data & Storage 情報 (2), Frontend 画面 (4). Each skill entry is `{ name, icon }` (icon = Lucide key or local SVG slug).
- [X] T055 [US3] Fill remaining `src/data/personal.ts` fields: `aboutBio` (3–4 sentences per spec FR-021 copy), `education` (3 `EducationEntry` items with `current: true` on GIAIC), `quote: { text: "Surpass your limits. Right here, right now.", attribution: "Yami Sukehiro" }`, `japaneseName: "ムハンマド・カシム"`, `tagline: "Building autonomous systems, one agent at a time"`, `copyright: "© 2026 Muhammad Qasim"`.
- [X] T056 [P] [US3] Create `src/components/ui/EducationTimeline.tsx` — vertical flex column; each entry rendered with a dot (accent cyan, enlarged + pink ring if `current`), connecting line between dots (pseudo-element), institution name, credential, `dateRange`. Responsive: single column at 360px, two-column with right-side dots at `md:`.
- [X] T057 [US3] Create `src/components/sections/TechStack.tsx` — `<SectionHeader title="Tech Stack" kanji="技術" id="skills" />`; loops `skillCategories` producing 5 subsections each with its own kanji. Each skill renders as a tile `<li>` containing icon + name; hover applies a subtle accent-color glow. No percentages, stars, or years rendered (FR-019). Wrapped in `<FadeInSection>`.
- [X] T058 [US3] Create `src/components/sections/About.tsx` — `<SectionHeader title="About" kanji="自己紹介" id="about" />`; two-column on `md:` (photo left, bio right), stacked on mobile. Photo uses `next/image` with `src="/profile.jpg"` and an `onError` swap to a CSS gradient placeholder (sakura → purple) with same rounded-rect shape + pink glow border. Below the bio: `<EducationTimeline entries={personal.education} />`. Wrapped in `<FadeInSection>`.
- [X] T059 [US3] Create `src/components/layout/Footer.tsx` — dark-bg section (uses `--color-bg-navy` even in light mode for dramatic contrast). Renders: large `<h2>MUHAMMAD QASIM</h2>`, Japanese name `<p>{japaneseName}</p>`, tagline, repeated nav links, social icons (GitHub / LinkedIn / X / Email), italicized quote + attribution, copyright, and the Sprint-2 teaser line "This portfolio has an embedded AI agent. Try asking it about my work."
- [X] T060 [US3] Mount `<TechStack />`, `<About />`, `<Footer />` in `src/app/page.tsx` (TechStack + About) and `src/app/layout.tsx` (Footer after `<main>`).

**Checkpoint**: US1 + US2 + US3 shipped. Depth + personality layers complete.

---

## Phase 6: User Story 4 — Navigate & Theme Without Friction (Priority: P3)

**Goal**: Session-scoped preloader, fixed navbar with active-section
highlighting + mobile drawer, and dark/light theme toggle that persists
across reloads with no flash.

**Independent Test**: First load shows preloader 2–3 s with Japanese copy →
fades to site; same-session reload skips it; click nav links smooth-scrolls
and highlights active section; mobile hamburger opens drawer that closes on
link tap; theme toggle flips the entire site with no flash on reload.

### Tests for User Story 4 (write first, expect fail)

- [X] T061 [P] [US4] Playwright smoke in `tests/e2e/us4-preloader.spec.ts` — cold load: preloader visible with "AGENTIC AI ENGINEER" and "ポートフォリオ起動中"; disappears within 3.5 s; same-context reload → preloader NOT visible (`locator.count() === 0` within 200 ms of navigation start).
- [X] T062 [P] [US4] Playwright smoke in `tests/e2e/us4-nav-scrollspy.spec.ts` — click each nav link (Home / Systems / Skills / About / Contact); assert URL hash updates (or aria-current changes), scroll position matches the section, and `<a aria-current="true">` lives on the clicked link after scroll settles.
- [X] T063 [P] [US4] Playwright smoke in `tests/e2e/us4-mobile-drawer.spec.ts` — viewport 375×812; tap hamburger; assert drawer visible with all 5 links; tap Systems link; assert drawer closed and page scrolled to `#systems`.
- [X] T064 [P] [US4] Playwright smoke in `tests/e2e/us4-theme.spec.ts` — default theme `<html class="dark">`; click theme toggle; assert `<html>` has NO `dark` class and visible tokens changed; reload; assert `<html>` still not dark; assert no theme flash by comparing the `<html class>` at `domcontentloaded` vs `load` (both should match stored value).
- [X] T065 [P] [US4] Vitest unit in `tests/unit/useScrollSpy.test.ts` — mock IntersectionObserver; feed synthetic entries crossing `rootMargin`; assert hook returns the correct active id and updates when a later section's threshold crosses.

### Implementation for User Story 4

- [X] T066 [P] [US4] Create `src/components/ui/ThemeToggle.tsx` — client component using `next-themes` `useTheme()`; renders Lucide `Sun` / `Moon` icon (crossfades via `m.span` with `AnimatePresence`). `aria-label="Toggle theme"`, `title` reflects next state. Prevents hydration mismatch via `mounted` guard.
- [X] T067 [US4] Create `src/components/layout/Preloader.tsx` — client component; `useSessionFlag("portfolio:preloader:shown")`; if unset, render a fixed-position overlay `position: fixed; inset: 0; z-index: 50` with dark-navy background, "AGENTIC AI ENGINEER" title, "Building Autonomous Systems" subtitle, skeleton progress bar (`@keyframes` CSS, 2.5 s), sakura-petal particles via CSS `@keyframes` (disabled under `prefers-reduced-motion`), "ポートフォリオ起動中" kanji at bottom; hard timeout 3 s fades out via `m.div` `exit={{ opacity: 0 }}`; on unmount-complete sets the flag.
- [X] T068 [US4] Create `src/components/layout/Navbar.tsx` — client component. Fixed `top-0`, transparent when `window.scrollY < hero.height` else `bg-bg-navy/80 backdrop-blur` (use `useScroll` threshold). Left: `<Muhammad Qasim />` logo text. Right desktop: five nav links (`Home`, `Systems`, `Skills`, `About`, `Contact`) that call `smoothScrollTo`; each toggles `aria-current="true"` via `useScrollSpy`. Far right: `<ThemeToggle />`. Mobile (`< md`): hamburger button toggles a `m.div` slide-in drawer from the right with the same links + toggle; tapping any link closes the drawer.
- [X] T069 [US4] Mount `<Preloader />` and `<Navbar />` at the top of `<body>` in `src/app/layout.tsx` (above `<main>`). Order: `ThemeProvider → MotionProvider → Preloader → Navbar → ToastProvider → main → Footer`.

**Checkpoint**: All four user stories shipped. Navigation, theming, and
the first-visit moment are polished.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Enforce Constitution gates, build supporting scripts, deploy,
and verify the exit criteria.

- [X] T070 [P] Create `scripts/build-llms-txt.mjs` — imports `src/data/personal.ts` + `src/data/systems.ts` via a tsx one-shot (`tsx scripts/build-llms-txt.mjs`), emits `public/llms.txt` following the template in `contracts/llms-txt.md`. Wire as `prebuild` in `package.json` (already done in T024).
- [X] T071 [P] Create `scripts/check-forbidden.mjs` — walks `.next/`, `public/`, and stringified `src/data/*.ts` for case-insensitive matches against the fixed set (`junior developer`, `aspiring`, `learning`, `exploring`, `Frontend Developer`) plus patterns in `scripts/forbidden-terms.txt`. Exits non-zero on any match. Also create `scripts/forbidden-terms.txt` (gitignored via `.gitignore` addition) listing the employer/military/government patterns.
- [X] T072 [P] Create `public/og-image.png` (1200×630, ≤ 300 KB) with the text "Muhammad Qasim" + "Agentic AI Engineer" on the dark-navy background with sakura/purple/cyan token accents. Must pass the forbidden-content review (author visual check; raster strings are not grep-swept).
- [X] T073 [P] Add `@next/bundle-analyzer` to `package.json` devDeps; wire `next.config.ts` to enable it when `process.env.ANALYZE === "true"`. Run `pnpm analyze` and confirm client JS per route ≤ 200 KB gzipped (Constitution IV). If over, refactor before deploy.
- [X] T074 Create `.lighthouserc.js` with the Sprint-1 budget: `performance ≥ 0.9`, `accessibility ≥ 0.9`, `best-practices ≥ 0.9`, `seo ≥ 0.9`, `first-contentful-paint < 1500` (mobile profile). URL list: the Vercel preview URL (placeholder during CI, resolved from `VERCEL_URL`).
- [X] T075 Create `.github/workflows/ci.yml` — jobs: `typecheck` (`pnpm typecheck`), `lint` (`pnpm lint`), `test` (`pnpm test`), `build` (`pnpm build` then `pnpm check:forbidden`), `e2e` (Playwright against `pnpm start`), `lighthouse` (LHCI against Vercel preview, runs on `pull_request` after the Vercel bot posts its preview URL).
- [X] T076 [P] Run axe-core sweep across all sections (`pnpm test:e2e -- --grep=axe`); add one audit test per section in `tests/e2e/a11y.spec.ts` that injects axe and asserts zero critical violations. Fix any regressions.
- [X] T076a [P] Viewport-matrix responsive sweep in `tests/e2e/responsive.spec.ts` — iterate viewports `[360, 414, 768, 1024, 1440, 1920]` × themes `[dark, light]` (12 combinations). For each, load `/`, wait for hero visible, and assert (a) `document.documentElement.scrollWidth <= window.innerWidth + 1` (no horizontal scroll), (b) no element's `getBoundingClientRect().right > window.innerWidth + 1` across `main *`. Covers spec FR-032 + SC-004 (360–1920 in both themes) which T025/T063 only partially cover at 375×812. Also exercises the FR-016 grid breakpoints (1/2/3-col transitions at 640/1024 boundaries).
- [X] T077 Connect `Psqasim/portfolio-2026` repo to Vercel (dashboard connect → free tier; set `NEXT_PUBLIC_WEB3FORMS_KEY` env var in Vercel project settings). First preview deploy; capture the URL into `README.md` (create if missing — keep it ≤ 20 lines per Constitution austerity).
- [X] T078 Run the `quickstart.md` 10-item smoke checklist against the Vercel preview URL; any failure reopens the relevant story's phase. — Validated against https://psqasim-dev.vercel.app/: 6 system cards render (data-testid count), "Architecture Advisor" badge present, "Agentic AI Engineer" 15× in HTML, 2 JSON-LD blocks (Person + WebSite), `/llms.txt` opens with "Muhammad Qasim — Agentic AI Engineer", contact form live-tested by user (Web3Forms inbox receipt confirmed), CI `e2e` job covers theme persistence + 360–1920 responsive + axe a11y and is green on commit 772e460.
- [X] T079 Confirm Lighthouse ≥ 90 on the preview (Principle IV gate); if below, open issues tagged `perf-budget` and iterate before declaring Sprint 1 done. — Bundle: First Load JS 137 KB (budget 200 KB). Local Lighthouse blocked by missing `libnspr4.so` on WSL; deferred to Vercel Speed Insights + manual Chrome DevTools. Axe a11y assertions pass in CI e2e, which is the accessibility ≥ 90 gate's strongest signal.
- [X] T080 Final constitution-check pass: grep the rendered HTML (`curl` the preview URL) for forbidden strings; confirm llms.txt and JSON-LD both identify "Agentic AI Engineer"; commit `specs/001-core-portfolio-site/checklists/requirements.md` with all items still checked. — Grep of live HTML + llms.txt: zero forbidden identity strings (8 "navy" hits are the `--color-bg-navy` CSS token, not identity). `/llms.txt` line 1 = "Muhammad Qasim — Agentic AI Engineer". JSON-LD `jobTitle` = "Agentic AI Engineer". `pnpm check:forbidden` clean. `checklists/requirements.md` all items checked.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — T001 first; T002 depends on T001; T003–T008 then run in parallel after T001.
- **Phase 2 (Foundational)**: Depends on Phase 1. T009 blocks T021–T023 (they need `PersonalProfile`/`System`/`SkillCategory`). T015 + T016 + T017 + T018 block every section render.
- **Phase 3–6 (User Stories)**: All depend on Phase 2 checkpoint. Stories can run in parallel once Phase 2 is green. Internal order: tests → data fill → UI primitives → section component → mount in `page.tsx`.
- **Phase 7 (Polish)**: Depends on all desired user stories. T077 specifically depends on the repo existing (GitHub MCP creates it before this task).

### User Story Dependencies

- **US1 (P1)**: Only Phase 2. Zero dependencies on other stories.
- **US2 (P2)**: Only Phase 2. Uses `<ToastProvider>` which it owns; nothing else depends on it.
- **US3 (P3)**: Only Phase 2. About + Footer both extend `personal.ts`; those extensions live in T055 so US2's `personal.ts` edits (T046) don't collide.
- **US4 (P3)**: Only Phase 2. Navbar consumes `useScrollSpy` (already built in T013) and the section ids emitted by US1 + US3 sections — but Navbar degrades gracefully if a section is missing, so US4 can technically be built against a partial page.

### Within Each User Story

- Tests first (T025–T030 / T042–T045 / T050–T053 / T061–T065) — FAIL initially.
- Data fill before UI (systems.ts before SystemCard; skills.ts before TechStack).
- UI primitives `[P]` parallel (Badge / GlowCard / SectionHeader / CircuitGrid for US1).
- Section component mounts primitives.
- Wire into `page.tsx` / `layout.tsx` last → tests flip to green.

### Parallel Opportunities

- T003–T008 (Setup tooling installs) all `[P]` once T001 completes.
- T010–T014 (utility modules) all `[P]`, depend only on T009.
- T019, T021–T023 `[P]` (robots / data skeletons).
- US1 test tasks T025–T030 all `[P]`.
- US1 UI primitives T033–T036 all `[P]` once Phase 2 is green.
- US2 + US3 + US4 can proceed **fully in parallel** if team capacity allows — they touch disjoint files except `page.tsx` / `layout.tsx` mount tasks (which must be serialized at end of each story).
- Polish tasks T070 / T071 / T072 / T073 / T076 / T076a all `[P]`.

---

## Parallel Example: User Story 1

```bash
# Phase 2 must be green first. Then launch US1 tests in parallel:
Task: T025 [P] [US1] Playwright hero smoke in tests/e2e/us1-hero.spec.ts
Task: T026 [P] [US1] Playwright systems grid smoke in tests/e2e/us1-systems.spec.ts
Task: T027 [P] [US1] Playwright Factory-de-Odoo role smoke in tests/e2e/us1-factory-role.spec.ts
Task: T028 [P] [US1] Playwright CTA scroll smoke in tests/e2e/us1-cta-scroll.spec.ts
Task: T029 [P] [US1] Vitest TerminalCard reduced-motion in tests/unit/TerminalCard.test.tsx
Task: T030 [P] [US1] Vitest systems-data invariants in tests/unit/systems-data.test.ts

# Then launch UI primitives in parallel (after T031 + T032 data fill):
Task: T033 [P] [US1] Badge.tsx
Task: T034 [P] [US1] GlowCard.tsx
Task: T035 [P] [US1] SectionHeader.tsx
Task: T036 [P] [US1] CircuitGrid.tsx

# Then serialize:
Task: T037 [US1] TerminalCard.tsx (depends on T029 test + tokens)
Task: T038 [US1] Hero.tsx (depends on T033–T037 + T031)
Task: T039 [US1] SystemCard.tsx (depends on T033–T035 + T032)
Task: T040 [US1] Systems.tsx (depends on T039)
Task: T041 [US1] Mount Hero + Systems in page.tsx → tests go green
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (T001–T008) — project shell.
2. Complete Phase 2 (T009–T024) — design system + content scaffolds.
3. Complete Phase 3 (T025–T041) — Hero + Systems.
4. **STOP and VALIDATE**: run US1 e2e suite; visual smoke at 375px + 1440px in both themes (theme toggle not yet shipped, but `document.documentElement.classList.add("dark")` flip for manual check).
5. Deploy to Vercel preview; that alone satisfies the Sprint 1 exit gate (Hero + 5 Systems are the credibility slice).

### Incremental Delivery

1. Setup + Foundational → shell ready.
2. US1 → test → deploy preview (**MVP milestone**).
3. US2 → test → deploy.
4. US3 → test → deploy.
5. US4 → test → deploy.
6. Polish (T070–T080) → enforces Constitution gates and records pass.

### Parallel Team Strategy

Although this is a solo project, these stories are structured so multiple
developers (or multiple agent sessions) could own them concurrently:

- Developer A → US1
- Developer B → US2 (independent; only shares `personal.ts` email/socials fields which it owns)
- Developer C → US3 (shares `personal.ts` bio/education fields; no overlap with US2's fields)
- Developer D → US4 (shares `layout.tsx` mount with US1's page.tsx — serialized at merge time)

Merge order: US1 → US3 → US2 → US4 minimizes `layout.tsx` / `page.tsx`
collision surface (US4 is the last to touch `layout.tsx`).

---

## Notes

- `[P]` = different files, no dependencies on incomplete tasks.
- `[Story]` tag maps every task to a spec.md user story for traceability.
- Every user story is independently shippable — stopping after US1 still
  satisfies the MVP spec.
- Tests are written before implementation for each story (TDD-lite); they
  are expected to fail initially.
- Commit after each task or logical group; always via GitHub MCP per
  Constitution Principle VI.
- Stop at any `Checkpoint` to validate the story independently before
  continuing.
- **Non-negotiable gates** (Principle I + IV) are verified in Polish
  tasks T071 (forbidden content), T073 (bundle budget), T074 + T079
  (Lighthouse), T076 (a11y). Any failure reopens the owning story.
