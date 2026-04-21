<!--
Sync Impact Report
==================
Version change: (template/unversioned) → 1.0.0
Bump rationale: Initial ratification. Converts placeholder scaffold into a
concrete governance document for Portfolio 2026. Treated as MAJOR baseline
(1.0.0) since no prior numbered version existed.

Modified principles:
  - [PRINCIPLE_1_NAME] → I. Content Integrity & Identity Discipline (NON-NEGOTIABLE)
  - [PRINCIPLE_2_NAME] → II. Static-First, Zero-Backend
  - [PRINCIPLE_3_NAME] → III. Type Safety & Code Quality
  - [PRINCIPLE_4_NAME] → IV. Performance Budget (NON-NEGOTIABLE)
  - [PRINCIPLE_5_NAME] → V. Design System Fidelity
  - [PRINCIPLE_6_NAME] → VI. Tooling Authority (MCP-First)

Added sections:
  - Additional Constraints: Tech Stack Lock-In (replaces [SECTION_2_NAME])
  - Development Workflow & Delivery Gates (replaces [SECTION_3_NAME])
  - Governance (populated)

Removed sections: none

Templates requiring updates:
  - ✅ .specify/templates/plan-template.md — Constitution Check slot references
    this document; gates are evaluated against Principles I–VI at /sp.plan time.
  - ✅ .specify/templates/spec-template.md — compatible as-is; identity /
    forbidden-content rules enforced at authoring time per Principle I.
  - ✅ .specify/templates/tasks-template.md — compatible as-is; polish phase
    must include Lighthouse + a11y verification per Principle IV.
  - ✅ .claude/commands/sp.constitution.md — aligned with this workflow.
  - ⚠ No README.md or docs/quickstart.md present yet; create during Sprint 1.

Deferred / Follow-up TODOs:
  - None. All placeholders resolved.
-->

# Portfolio 2026 Constitution

## Core Principles

### I. Content Integrity & Identity Discipline (NON-NEGOTIABLE)

The subject of this site is Muhammad Qasim, an **Agentic AI Engineer** based
in Karachi, Pakistan. The following rules are absolute and apply to source
code, copy, metadata, image alt text, OG tags, resume exports, commit
messages, and any AI-generated output:

- MUST use the identity "Agentic AI Engineer" in all professional framing.
- MUST NOT use the titles "Frontend Developer", "junior developer",
  "aspiring", "learning", or "exploring" to describe the subject.
- MUST NOT reference any employer name, military, navy, government,
  department, rank, or title — direct or indirect, past or present.
- MUST keep all narrative copy outcome-oriented (what was shipped, measured,
  owned) rather than credential-oriented.

**Rationale**: The positioning of the site is a load-bearing product
requirement. A single slip (a stray "Jr.", a leaked department name) is a
user-visible regression regardless of whether code compiles.

### II. Static-First, Zero-Backend

The site is a statically generated single-page experience with one dynamic
route (`/systems/[slug]`). There is no server runtime we operate.

- MUST use Next.js 15 App Router with static generation (SSG). No SSR, no
  ISR, no route handlers that call third-party APIs at render time.
- MUST hardcode all content as typed TypeScript modules under `src/data/`.
  No CMS (no Sanity, no Contentful, no MDX pipeline from a remote source).
- Contact form MUST submit to Web3Forms (free tier) from the client. No
  custom backend endpoint, no serverless function we own.
- External calls at runtime (e.g., chatbot widget in Sprint 2) MUST be
  client-initiated and gracefully degrade when the upstream is unreachable.

**Rationale**: Zero infra operated = zero pager, free hosting, trivial
rollback. The portfolio's content doesn't change hourly; build-time
generation is strictly sufficient.

### III. Type Safety & Code Quality

- TypeScript MUST run in `strict` mode; `any` requires an inline justification
  comment in a PR or it will not be merged.
- ESLint (Next.js config) MUST pass with zero warnings on CI; warnings are
  treated as errors.
- All React components MUST be functional with explicitly typed props
  (no `React.FC`-implicit-children-surprise patterns).
- Repository layout is fixed: `src/app/` for routes, `src/components/` for
  UI, `src/data/` for content, `src/lib/` for utilities, `src/types/` for
  shared interfaces. New top-level directories require an ADR.

**Rationale**: A single maintainer project degrades fastest when "just this
once" cheats accumulate. Strict types and fixed layout keep the cost of
returning to the code after weeks close to zero.

### IV. Performance Budget (NON-NEGOTIABLE)

Every merge MUST preserve these budgets on the deployed Vercel preview:

- Lighthouse Performance, Accessibility, Best Practices, and SEO scores:
  **≥ 90** on mobile profile, homepage.
- First Contentful Paint: **< 1.5s** on Moto G4 / Slow-4G Lighthouse profile.
- Images MUST use `next/image` with WebP and lazy loading below the fold.
- Fonts MUST be self-hosted via `next/font` (Geist Sans or Inter for UI,
  Noto Sans JP for Japanese accents, JetBrains Mono for code). No
  `<link href="fonts.googleapis.com">` at runtime.
- Client JS per route MUST stay under 200 KB gzipped; exceeding this
  requires an ADR documenting the tradeoff.

**Rationale**: Slow portfolios lose the reader in the first three seconds —
the site's entire job is to survive that window. Budgets are set at
build-time gates rather than aspirations.

### V. Design System Fidelity

The visual identity is **"Anime × Dark Tech × AI"** and is enforced as
tokens, not vibes.

- Color tokens (CSS custom properties, Tailwind v4 `@theme`): background
  navy `#0a0e1a`, sakura pink `#f472b6`, soft purple `#c084fc`, cyan
  `#22d3ee`. No ad-hoc hex values in component code — every color MUST
  resolve to a token.
- Dark mode is the **default**; light mode MUST be first-class (fully
  audited, not a half-translated inversion). Theme toggling via
  `next-themes`.
- Decorative motifs (subtle circuit-board grid background, Japanese kanji
  as section accents, glow-on-hover states) are part of the spec; removing
  them requires an ADR.
- Animations use Framer Motion and MUST respect `prefers-reduced-motion`.
- Mobile-first: every component MUST be designed and verified at 360px
  width before desktop polish.

**Rationale**: Without encoded tokens, "anime × dark tech × AI" drifts into
"generic dark theme" within two sprints. Tokens + dark-first keep the
identity enforceable in code review.

### VI. Tooling Authority (MCP-First)

- All git operations (repo creation, commits, pushes, PRs for
  `Psqasim/portfolio-2026`) MUST go through the GitHub MCP. Manual `git
  push` from the agent is prohibited.
- Before implementing against Next.js 15, Tailwind CSS 4, Framer Motion,
  or `next-themes`, the agent MUST consult Context7 MCP for current docs.
  Training-data recall alone is insufficient for these versioned APIs.
- Secrets (Web3Forms access key, OpenAI key in Sprint 2, HF token) MUST
  live in `.env.local` / Vercel project env vars. Never commit a secret,
  never hardcode, never log.

**Rationale**: MCP tools are the authoritative source per the repo-wide
SDD guardrails. Skipping them re-introduces the exact failure modes
(stale APIs, inconsistent git state) they were added to prevent.

## Additional Constraints: Tech Stack Lock-In

The stack below is frozen for the lifetime of this constitution. Adding or
removing any line requires an ADR and a version bump.

- **Framework**: Next.js 15 (App Router) + TypeScript (strict).
- **Styling**: Tailwind CSS 4 + CSS custom properties. No styled-components,
  no Emotion, no CSS-in-JS runtime.
- **Animation**: Framer Motion. No GSAP, no Lottie unless ADR'd.
- **Icons**: Lucide React only.
- **Theme**: `next-themes`.
- **Forms**: Web3Forms (free tier) for the contact form.
- **Fonts**: Geist Sans or Inter, Noto Sans JP, JetBrains Mono, via
  `next/font`.
- **Hosting**: Vercel free tier. Repo: `Psqasim/portfolio-2026`.
- **Forbidden additions**: additional UI libraries (Radix/shadcn/MUI/Chakra),
  any CMS, analytics heavy enough to violate Principle IV.

## Development Workflow & Delivery Gates

The project ships in three sprints. Each sprint has a binary exit gate.

- **Sprint 1 — Core site**: All primary sections (hero, about, systems
  list, contact), responsive from 360px upward, dark + light themes
  polished, deployed on Vercel preview, Lighthouse ≥ 90 on homepage.
- **Sprint 2 — Depth**: `/systems/[slug]` detail pages for each featured
  system; AI chatbot widget (OpenAI + HF Spaces) with graceful offline
  fallback; still SSG everywhere except the chatbot's client calls.
- **Sprint 3 — Polish**: Interactive architecture diagrams on systems
  pages, downloadable resume PDF, micro-interaction pass, final
  performance + accessibility audit.

Per-PR gates (enforced before merge):

- CI: `tsc --noEmit` green, ESLint green (zero warnings), `next build`
  green.
- Manual: preview deploy link in PR description, Lighthouse run on
  changed routes, visual check in both themes at 360px and 1440px.
- PHR created under `history/prompts/` for every meaningful AI-assisted
  change (per repo-wide SDD rules).
- ADR required when: adding/removing a dependency in the locked stack,
  changing the routing model, changing the token palette, or relaxing
  any Principle in this document.

## Governance

This constitution supersedes ad-hoc preferences and chat-level decisions
for Portfolio 2026. When a conflict arises between this document and any
runtime instruction, this document wins until explicitly amended.

- **Amendment procedure**: Open an ADR under `history/adr/` describing the
  change, its rationale, and the affected principle(s). Update this file
  in the same PR. Both must be approved before merge.
- **Versioning policy** (semantic):
  - **MAJOR**: Removing a principle, redefining identity/forbidden-content
    rules, or relaxing any NON-NEGOTIABLE gate.
  - **MINOR**: Adding a new principle or a materially new section.
  - **PATCH**: Wording clarifications, typo fixes, token value tweaks that
    don't change meaning.
- **Compliance review**: Every `/sp.plan` run MUST perform a Constitution
  Check against Principles I–VI and record violations (with
  justifications) in the plan's Complexity Tracking table. `/sp.analyze`
  flags drift between plan/spec/tasks and this file.
- **Runtime guidance**: Day-to-day agent behavior follows `CLAUDE.md` at
  repo root; where `CLAUDE.md` is silent, this constitution governs.

**Version**: 1.0.0 | **Ratified**: 2026-04-20 | **Last Amended**: 2026-04-20
