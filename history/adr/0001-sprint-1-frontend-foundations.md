# ADR-0001: Sprint 1 Frontend Foundations

> **Scope**: Decision cluster covering two Sprint 1 frontend choices that share
> a common rationale (Constitution Principle IV — ≤ 200 KB gzipped client JS
> per route): (1) animation bundle strategy via Framer Motion `LazyMotion`, and
> (2) no third-party form library for the contact form.

- **Status:** Accepted
- **Date:** 2026-04-21
- **Feature:** 001-core-portfolio-site
- **Context:**

  Constitution v1.0.0 Principle IV (NON-NEGOTIABLE) enforces a **≤ 200 KB
  gzipped client JS budget per route** and Lighthouse ≥ 90 (mobile profile)
  with FCP < 1.5 s. Sprint 1 is a single-route site, so every byte loaded on
  `/` counts against that budget. Two foundational frontend choices materially
  shape whether we meet the budget on day one:

  1. **Animation library surface** — every section uses scroll-triggered
     reveals and hover effects via Framer Motion. The default `motion.*` import
     path ships the full library (~34 KB gz). That alone consumes ~17 % of the
     per-route budget before we write a single component.

  2. **Contact form tooling** — the contact section (US2) has exactly three
     fields (name, email, message) submitting client-side to Web3Forms. The
     React ecosystem defaults (react-hook-form ~9 KB gz, Formik ~13 KB gz, plus
     validation schema libraries like Zod/Yup at 8–15 KB gz) would add real
     weight for what is effectively one controlled form with three required
     fields and a submit handler.

  Both decisions have viable alternatives with meaningful tradeoffs, both are
  cross-cutting (motion strategy touches every animated component; form
  strategy sets the precedent for any future forms in Sprint 2+), and both
  will be re-examined when Sprint 2 adds the chatbot widget and `/systems/[slug]`
  pages. They are documented together because they share the same forcing
  function (bundle budget) and the same mitigation pattern (prefer the
  smallest viable surface, escape hatch later if needed).

## Decision

- **Animation surface**: Framer Motion via
  `LazyMotion features={domAnimation} strict` mounted at the root of the
  component tree (`src/components/motion/MotionProvider.tsx`). All motion
  primitives are imported as `m.*` (e.g., `m.div`, `m.section`), never
  `motion.*`. The `strict` flag turns accidental `motion.*` imports into a
  runtime error so CI catches regressions. `domAnimation` ships ~17 KB gz
  versus `domMax` at ~29 KB gz (Context7 / Framer Motion docs,
  `/grx7/framer-motion`). We do not need drag, layout, or layout-projection
  features in Sprint 1 — if Sprint 3 adds interactive architecture diagrams
  that require `layout`, we upgrade to `domMax` via a single provider change
  and re-baseline the budget.

- **Contact form tooling**: No third-party form library. The `Contact`
  component is a client component with local `useState` for the three fields,
  a native-HTML submit handler, inline validation (`required`, `type="email"`,
  `minLength`), and a `fetch` POST of a `FormData` body to
  `https://api.web3forms.com/submit` per
  `specs/001-core-portfolio-site/contracts/web3forms.md`. An 8-second
  `AbortController` bounds the wait; success / error surfaces as a toast
  within the 5-second SLO (SC-005). Honeypot field per Web3Forms recommendation.

## Consequences

### Positive

- **Bundle headroom preserved.** Together these choices save ~20–25 KB gz on
  the primary route — roughly 10–12 % of the entire per-route budget — which
  leaves room for Sprint 2's chatbot widget and Sprint 3's diagrams without
  having to claw bytes back later.
- **Fewer moving parts.** Three fields plus one `fetch` has no hidden
  abstractions; a new contributor can read `Contact.tsx` top-to-bottom and
  understand the entire submit path. Same for animations — `m.*` + variants
  is the complete mental model.
- **CI-enforceable invariants.** `LazyMotion strict` + a grep rule in
  `scripts/check-forbidden.mjs` (`motion\.` in `src/**`) makes accidental
  regressions loud. The form decision is self-enforcing — nothing to drift
  toward.
- **Reversible.** Both choices can be reversed in a contained PR: swap
  `domAnimation` → `domMax` in one provider, or introduce `react-hook-form`
  inside `Contact.tsx` without touching any other component.

### Negative

- **Manual validation in the form.** We hand-roll email pattern and
  min-length checks. If Sprint 2 adds a longer form (e.g., "Request a
  consultation" with 6+ fields + conditional logic), we will re-open this
  decision and likely adopt `react-hook-form` + `zod`. Writing that migration
  plan now would be premature.
- **Feature ceiling on animations.** `domAnimation` does not include drag,
  layout, or layout-id projection. Attempting to use `<m.div layout>` or
  `useDragControls` will fail silently under `strict`. Sprint 3's
  "interactive architecture diagrams" will almost certainly require an
  upgrade path — this is a known, dated pending decision, not a surprise.
- **Discipline tax on imports.** Every contributor must remember to import
  `m` from `framer-motion` (via the project's re-export) rather than
  `motion`. The `strict` runtime error and a lint rule mitigate, but it is
  still cognitive load for newcomers used to the default docs examples.

## Alternatives Considered

### Animation surface

- **Alternative A1 — `motion` default import (full library)**: Ships the
  entire Framer Motion surface (~34 KB gz). *Rejected* — wastes ~17 KB gz of
  budget on features we do not use in Sprint 1 and would not use in Sprint 2.
- **Alternative A2 — `LazyMotion features={domMax}`**: ~29 KB gz. Includes
  drag + layout. *Rejected for Sprint 1*, flagged as the upgrade target
  when Sprint 3 diagrams land. Measured-flip decision, not a closed door.
- **Alternative A3 — CSS-only animations + IntersectionObserver**: ~0 KB
  motion library cost, but we would reimplement stagger, spring, variants,
  and exit-animation orchestration by hand. *Rejected* — Constitution
  Principle III (Anime × Dark Tech × AI) depends on rich, coordinated motion
  that would be disproportionately expensive to hand-roll and maintain.
- **Alternative A4 — `react-spring` or `motion-one`**: Smaller cores
  (8–12 KB gz) but weaker variants / orchestration ergonomics and no first-
  class Next.js App Router guidance in Context7. *Rejected* — the 8 KB gz
  savings over `domAnimation` does not justify the API relearn for a
  single-developer project.

### Contact form tooling

- **Alternative B1 — `react-hook-form` (+ zod)**: ~9 KB + ~12 KB gz.
  *Rejected* — three fields do not justify ~21 KB of dependency + schema
  weight; the mental overhead of learning the RHF resolver pattern for one
  form is higher than the refactor cost later.
- **Alternative B2 — Formik (+ yup)**: ~13 KB + ~15 KB gz. *Rejected* for
  the same reason, plus Formik is in maintenance mode.
- **Alternative B3 — Server Action (Next.js 15)**: Would remove client JS
  for submission entirely. *Rejected* — Web3Forms POST is already
  client-origin (their access key is designed as a public value, see
  `contracts/web3forms.md`), and adding an owned server route just to
  forward a form violates our "no backend we own in Sprint 1" stance from
  the Constitution + plan.md.
- **Alternative B4 — `<form action="https://api.web3forms.com/submit" method="POST">`
  with no JS at all**: Works without JS but prevents inline success/error
  toasts (we would have to redirect to `?submitted=1`), which degrades the
  UX bar set by SC-005 (toast within 5 s). *Rejected* — the ~1 KB of handler
  code is worth the UX.

## References

- Feature Spec: `specs/001-core-portfolio-site/spec.md`
- Implementation Plan: `specs/001-core-portfolio-site/plan.md`
- Research log: `specs/001-core-portfolio-site/research.md` (R-004 animation
  bundle, R-006 contact form)
- Contract: `specs/001-core-portfolio-site/contracts/web3forms.md`
- Constitution: `.specify/memory/constitution.md` (Principle IV — Performance
  budget, NON-NEGOTIABLE)
- Context7 library IDs consulted: `/grx7/framer-motion`,
  `/vercel/next.js/v15.1.8`
- Related ADRs: none (this is ADR-0001)
- Evaluator evidence: `history/prompts/001-core-portfolio-site/0002-sprint-1-core-site-plan.plan.prompt.md`
  (plan-stage PHR documenting Constitution Check PASS with these two
  decisions as pass evidence for Principle IV)
