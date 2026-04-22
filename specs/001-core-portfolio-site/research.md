# Phase 0 Research: Sprint 1 — Core Portfolio Site

**Feature**: `001-core-portfolio-site`
**Date**: 2026-04-20
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

## Docs consulted (Context7 MCP, per Constitution Principle VI)

| Library | Library ID | What we verified |
|---------|------------|------------------|
| Next.js 15 | `/vercel/next.js/v15.1.8` | `export const metadata` in `layout.tsx` is the canonical SSG-compatible SEO entry; JSON-LD is embedded as a `<script type="application/ld+json">` child of the layout. Static generation is the default when no request-time APIs are used. |
| Tailwind CSS 4 | `/tailwindlabs/tailwindcss.com` | `@theme` directive holds CSS variables that materialize into utility classes; class-based dark mode uses `@custom-variant dark (&:where(.dark, .dark *))` — aligned with `next-themes` `attribute="class"`. |
| Framer Motion | `/grx7/framer-motion` | `LazyMotion` with `features={domAnimation}` ≈ 17 KB gz vs `domMax` ≈ 29 KB; `useReducedMotion()` hook + `<MotionConfig reducedMotion="user">` gives OS-level compliance; `whileInView` + `viewport={{ once: true }}` is the canonical scroll-reveal. |

---

## R-001 — Theme strategy & no-flash-on-load

**Decision**: `next-themes` with `attribute="class"`, `defaultTheme="dark"`,
`enableSystem={false}`, `disableTransitionOnChange`. Tailwind v4 dark variant
defined via `@custom-variant dark (&:where(.dark, .dark *))` in
`src/app/globals.css`. Theme tokens live in two `@theme` blocks — a default
dark token set and a `.dark` override is **not** needed because the default
IS dark; a `:where(html:not(.dark))` block inverts the tokens for light mode.

**Rationale**:
- `next-themes` ships a small inline script that sets the class on `<html>`
  before hydration, eliminating theme flash (FR-030).
- `attribute="class"` is the exact mode Tailwind v4's class-based dark
  variant expects per the Tailwind docs we fetched.
- `enableSystem={false}` matches our "dark is the default" requirement —
  we do not want the OS preference overriding first paint.

**Alternatives rejected**:
- CSS `prefers-color-scheme` media query only: no user override, fails
  FR-030's toggle requirement.
- Hand-rolled theme context with `localStorage`: re-implements `next-themes`
  with worse no-flash behavior.
- Tailwind v3 `darkMode: 'class'`: project is frozen on Tailwind v4 per
  Constitution.

## R-002 — Preloader: session scoping and 3-second cap

**Decision**: `Preloader` is a client component rendered as a sibling of the
page content. On mount, it reads a `sessionStorage` flag
`portfolio:preloader:shown`. If unset, it displays for 2.0–3.0 s (driven by
a CSS `@keyframes` progress animation) and then fades out over 400 ms,
setting the flag on completion. If set, it mounts invisible and unmounts
immediately. A `setTimeout(3000)` safety-net ends the preloader regardless
of asset load state (FR-008).

**Rationale**:
- `sessionStorage` is tab-scoped → reopening the tab replays the
  preloader, matching the "first visit per session" assumption in the spec.
- Keeping the preloader client-only avoids an SSR/hydration flash where
  the preloader markup would briefly appear to return visitors.
- Timer is the source of truth, not asset load events — the constitution
  caps FCP at 1.5 s and we must not let a slow third-party asset extend
  the preloader.

**Alternatives rejected**:
- Server component with a cookie: cookies leak to server and complicate
  SSG caching; sessionStorage is client-scoped and trivial.
- Preloader tied to `document.readyState`: unpredictable on slow networks
  and breaks FR-008.
- Preloader as part of `layout.tsx` above `children`: causes a layout
  shift when it unmounts; sibling overlay with `position: fixed; inset: 0;`
  avoids it.

## R-003 — Scroll spy for active section highlighting

**Decision**: Implement `useScrollSpy(sectionIds: string[])` in
`src/lib/useScrollSpy.ts` using a single shared `IntersectionObserver` with
`rootMargin: "-40% 0px -55% 0px"` and `threshold: 0`. The hook returns the
currently active section id; `Navbar` consumes it to toggle an `aria-current`
attribute and a visual underline.

**Rationale**:
- A single observer for 5 sections is O(1); cheaper than `useInView` per
  section (which spins up 5 observers).
- Asymmetric `rootMargin` keeps only one section "active" at a time as the
  reader crosses the middle of the viewport — matches FR-004 expectation.
- `aria-current="true"` exposes active state to screen readers (FR-037).

**Alternatives rejected**:
- Scroll-event `window.pageYOffset` math: forces a layout read on every
  scroll frame, bad for 60 fps.
- Framer Motion `useScroll` + `useTransform` ranges: doable but overkill
  for a boolean "is this section active" decision.

## R-004 — Animation library budget: `LazyMotion` + `m`

**Decision**: All motion primitives imported from Framer Motion's `m.*`
namespace; a single `<LazyMotion features={domAnimation} strict>` wraps the
app at `src/app/layout.tsx`. `FadeInSection` is a thin wrapper around
`m.section` with a shared `viewport={{ once: true, amount: 0.25 }}` and a
`variants` object tuned to respect reduced motion.

**Rationale**:
- Per Context7 docs: `domAnimation` = ~17 KB gz vs `domMax` = ~29 KB; we
  need `animate`, `whileInView`, `whileHover`, and variants — all in
  `domAnimation`. No drag, no layout, no layout projection needed in
  Sprint 1.
- `strict` mode catches any accidental `motion.*` import (which would
  re-bundle the full library and blow the JS budget per Principle IV).

**Alternatives rejected**:
- Import `motion.*` directly: bundles ~29 KB; exceeds what we need.
- CSS-only animations for entrance effects: works for simple fades but
  not for orchestrated variants (e.g., Hero terminal lines stagger); a
  mixed approach doubles the mental model.

## R-005 — Reduced-motion policy

**Decision**: Wrap children at the root in `<MotionConfig reducedMotion="user">`
so that every `m.*` component's transition is auto-zeroed when the OS
reports `prefers-reduced-motion: reduce`. Additionally, `TerminalCard`
reads `useReducedMotion()` and instant-prints the agent log lines instead
of typing them. `CircuitGrid` uses CSS `@media (prefers-reduced-motion: reduce)`
to drop its gentle pan loop.

**Rationale**:
- `reducedMotion="user"` is the path Framer Motion exposes for this
  exact use case; individual opt-outs are possible but unnecessary.
- Hand-wiring `useReducedMotion()` inside the typing loop is required
  because the loop is driven by `setInterval`, not a Framer transition.

**Alternatives rejected**:
- Detecting via a one-off `window.matchMedia` in each component:
  duplicative and racy on theme / viewport events.

## R-006 — Contact form submission to Web3Forms

**Decision**: `Contact.tsx` is a client component. Submission handler:

```
const fd = new FormData(form);
fd.append("access_key", process.env.NEXT_PUBLIC_WEB3FORMS_KEY!);
fd.append("from_name", "portfolio-2026");
const res = await fetch("https://api.web3forms.com/submit", {
  method: "POST",
  body: fd,
});
const json = await res.json();
if (!json.success) throw new Error(json.message ?? "submission failed");
```

Client-side validation runs first (FR-028): required Name (1–100 chars),
Email (RFC-lite regex), Message (1–4000 chars). Toast host renders success
or error (FR-027). Fields retain values on error.

**Rationale**:
- Web3Forms accepts `multipart/form-data` or JSON; `FormData` is
  simpler than manually composing JSON and survives browser auto-fill.
- `NEXT_PUBLIC_WEB3FORMS_KEY` is intentionally a public env var — the
  key is already surfaced to any visitor via the form; Web3Forms
  applies rate-limiting and per-key abuse controls on their side.
- No third-party form library (Formik, React Hook Form) — three fields
  don't justify the weight and both libraries are on the forbidden list
  per Constitution "Forbidden additions".

**Alternatives rejected**:
- Serverless route handler at `/api/contact`: violates Principle II
  (zero-backend).
- `mailto:` link: fails SC-005 (no on-site confirmation).
- Formspree / Basin: acceptable alternatives but Constitution names
  Web3Forms as the frozen choice.

## R-007 — Typography loading

**Decision**: `next/font/local` for Inter (variable), Noto Sans JP (400/700),
and JetBrains Mono (400/700). All three declared in `src/app/layout.tsx`
with `display: "swap"`, exposed as CSS variables (`--font-sans`,
`--font-jp`, `--font-mono`) and referenced from `@theme` in `globals.css`.
Font files live in `src/fonts/` (self-hosted, constitution-mandated).

**Rationale**:
- `next/font/local` preloads + subsets + generates `preload` `<link>` tags
  automatically — no runtime request to fonts.googleapis.com (Principle IV).
- `display: "swap"` prevents FOIT (flash of invisible text) on slow
  networks, protecting FCP.
- Variable Inter keeps the weight-axis cheap (no separate 500 / 600 files).

**Alternatives rejected**:
- `next/font/google`: runs at build time but Constitution forbids any
  runtime Google Fonts link; `next/font/google` **does** host locally,
  so technically compliant — using `local` anyway to eliminate the
  build-time network fetch and keep CI deterministic.
- System font stack: doesn't match the "Anime × Dark Tech × AI" typography
  requirement (JetBrains Mono specifically for terminal card, Noto Sans
  JP for kanji accents).

## R-008 — Forbidden-content regression check

**Decision**: Add a CI step after `next build`:

```
node scripts/check-forbidden.mjs
```

The script walks `.next/`, `public/`, and the compiled content of
`src/data/` (re-imported through an esbuild one-shot) and fails the build if
any case-insensitive match is found for the forbidden set: `junior
developer`, `aspiring`, `learning`, `exploring`, `Frontend Developer`, and a
project-specific list of employer/military/government keywords stored in
`scripts/forbidden-terms.txt` (gitignored-safe; the file enumerates patterns
without naming the protected entity in commit history).

**Rationale**:
- Principle I is NON-NEGOTIABLE; SC-008 requires zero occurrences across
  shipped surfaces. A build-time grep is the cheapest enforceable gate.
- Checking compiled output (`.next/`) rather than `src/` catches strings
  that slip into auto-generated metadata / OG tags.
- `forbidden-terms.txt` being external to the commit history avoids
  re-introducing the very strings we're forbidding.

**Alternatives rejected**:
- ESLint custom rule: runs at lint time only, misses runtime-composed
  strings.
- Manual code review: not scalable and doesn't satisfy "zero occurrences"
  as a repeatable check.

## R-009 — Image strategy

**Decision**: All raster images use `next/image` with `sizes` attribute
tuned per breakpoint. Profile photo uses `priority={false}` (below the
fold). OG image is a pre-rendered PNG at `public/og-image.png` referenced
from `metadata.openGraph.images`. Circuit-grid background is an inline
SVG component (`CircuitGrid.tsx`) — not `next/image` — because it's purely
decorative and recolors via `currentColor` for theme swaps.

**Rationale**:
- `next/image` handles WebP negotiation and lazy loading automatically
  (Principle IV).
- Inline SVG for the circuit grid avoids an extra HTTP request and lets
  the pattern pick up theme tokens via `currentColor`.

**Alternatives rejected**:
- Hand-rolled `<img srcset>`: re-implements `next/image` badly.
- SVG as a `<img>` tag: loses `currentColor` theme swap.

## R-010 — Testing strategy

**Decision**:
- **Unit (Vitest)**: `cn()` merger, `useScrollSpy` reducer logic,
  `TerminalCard` typing loop reduction to instant when reduced-motion.
- **Integration (Playwright)**:
  - homepage loads and renders 8 sections in order
  - all 5 system cards render with GitHub links
  - theme toggle persists after reload, no flash
  - preloader shows on first visit, suppressed on reload within session
  - contact form validates, submits (MSW-intercepted), shows success toast
  - axe-core audit returns zero critical violations
- **CI (GitHub Actions)**: `tsc --noEmit`, `eslint .`, `next build`,
  `pnpm test`, forbidden-content check, Lighthouse CI against Vercel
  preview URL.

**Rationale**:
- Playwright covers both visual/interaction and a11y with one runner.
- Vitest is lighter than Jest and plays well with Vite-era toolchains.
- Lighthouse CI is the only way to enforce SC-002 / SC-003 programmatically.

**Alternatives rejected**:
- Jest + React Testing Library for component tests: heavier config for
  no upside; Vitest matches the project's velocity.
- Cypress: fine alternative; Playwright wins because it bundles multiple
  browser engines and has a better parallel story for CI.

---

## Open risks (tracked; none are blockers)

- **R-A**: Web3Forms free tier rate limit (per their ToS, ~50 submissions/mo).
  Mitigation: contact form is not expected to see abuse; if it does we can
  add a honeypot field in a follow-up. No action for Sprint 1.
- **R-B**: Vercel free-tier bandwidth / build minutes — only risk if traffic
  spikes. Out of scope for Sprint 1.
- **R-C**: X handle placeholder — assumption documented in spec; if still
  unknown at deploy, the X icon renders as a dimmed non-clickable badge.

## Docs to carry forward

- `research.md` (this file) — inputs to `/sp.tasks`
- `data-model.md` — entity shapes
- `contracts/` — external contract specs (Web3Forms POST, llms.txt schema,
  JSON-LD Person schema + OG tags)
- `quickstart.md` — dev onboarding + deploy path
