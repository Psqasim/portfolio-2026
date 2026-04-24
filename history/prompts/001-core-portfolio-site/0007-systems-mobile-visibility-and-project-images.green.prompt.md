---
id: 0007
title: Systems mobile visibility + project images
stage: green
date: 2026-04-24
surface: agent
model: claude-opus-4-7
feature: 001-core-portfolio-site
branch: 001-core-portfolio-site
user: Psqasim
command: /resume
labels: [mobile, animation, images, ux]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - src/components/motion/FadeInSection.tsx
  - src/components/ui/SystemCard.tsx
  - src/components/ui/EarlierWorkCard.tsx
  - src/data/systems.ts
  - src/types/index.ts
  - public/projects/*.png
tests:
  - pnpm typecheck (pass)
  - pnpm lint (pass)
  - pnpm test (11/11 pass)
  - pnpm build (137 kB First Load JS, under 200 kB budget)
---

## Prompt

Live site psqasim-dev.vercel.app showed the "Systems I've Shipped" section
as empty white space on mobile. Also, saved project screenshots in
/public/projects/ needed to be wired into system + earlier-work cards.
Follow-up: on mobile scroll, each section rendered late (like a slow
network) even on fast wifi — fix that too.

## Response snapshot

Root cause of the empty section: `FadeInSection` used
`viewport={{ amount: 0.25 }}` with `initial={{ opacity: 0, y: 24 }}`. The
Systems section stacks 6 cards vertically on mobile, making the section
taller than ~4× viewport height. 25% of it never intersects, so
`whileInView` never fires and the whole section stays at opacity 0 —
invisible. Same pattern also caused the "late rendering" feel on other
long sections (About, Contact): content waited until the viewport fully
crossed the intersection threshold.

Fix in one place:
- `amount` default → `"some"` (any intersection), with type widened to
  `number | "some" | "all"` so callers can still pass a fraction.
- Added `viewport.margin: "0px 0px 40% 0px"` — triggers the animation
  ~40% of viewport height before a section enters view, so content is
  already painted by the time the user scrolls to it.
- `duration` 0.5s → 0.35s; `y` offset 24 → 16 for a snappier reveal.

Images wired:
- Added optional `image?: string` to `System` (types/index.ts) and
  `EarlierProject` (data/systems.ts).
- Populated 5 of 6 system images + all 4 earlier-work images. Left
  MCP-Native Developer Tool without an image per spec.
- `SystemCard` renders image via `next/image` with `fill` + responsive
  `sizes`, 140 px mobile / 180 px desktop, flush to card edges via
  negative margin and `rounded-t-xl`.
- `EarlierWorkCard` same pattern at 110–120 px.

## Outcome

- ✅ Impact: Systems section is visible on mobile (and any long section
  on any device). Project thumbnails surface on every card that has one.
- 🧪 Tests: typecheck ✅, lint ✅, unit 11/11 ✅, build ✅ 137 kB.
- 📁 Files: 5 code files + 9 binary PNGs under public/projects/.
- 🔁 Next prompts: verify Lighthouse ≥ 90 still holds with new images
  (next/image auto-optimizes). Continue T077–T080 deploy flags.
- 🧠 Reflection: `whileInView` with a fixed `amount` fraction is a trap
  when section height is unbounded. Prefer `"some"` + a rootMargin.

## Evaluation notes (flywheel)

- Failure modes observed: none after fix.
- Graders run and results (PASS/FAIL): typecheck PASS, lint PASS, unit
  PASS, build PASS. Playwright not run locally (missing libnspr4.so on
  WSL); will validate via CI on push.
- Prompt variant (if applicable): n/a
- Next experiment: consider removing fade-in-on-scroll entirely for
  below-the-fold sections if the current margin is still perceptible on
  slow mobile CPUs.
