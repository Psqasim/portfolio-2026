# Quickstart: Sprint 1 — Core Portfolio Site

**Feature**: `001-core-portfolio-site`
**Target reader**: contributor (typically the maintainer) preparing to
implement Sprint 1 tasks locally and promote to Vercel.

## Prerequisites

- Node 20.x (aligns with Vercel runtime)
- pnpm (or npm) — project uses pnpm lockfile
- A Web3Forms account with an access key (free tier is enough)
- Vercel account linked to the `Psqasim/portfolio-2026` GitHub repo

## One-time local setup

1. **Clone** (GitHub MCP will create the repo; once it exists):
   ```bash
   git clone https://github.com/Psqasim/portfolio-2026.git
   cd portfolio-2026
   ```

2. **Install deps**:
   ```bash
   pnpm install
   ```

3. **Configure env** — copy the example and fill the Web3Forms key:
   ```bash
   cp .env.example .env.local
   # then edit .env.local:
   # NEXT_PUBLIC_WEB3FORMS_KEY=<your key from web3forms.com>
   ```
   The key is intentionally a `NEXT_PUBLIC_*` var (inlined at build). See
   `contracts/web3forms.md` for why this is safe.

## Day-to-day loop

```bash
pnpm dev          # http://localhost:3000 — dark mode by default
pnpm lint         # ESLint (zero warnings = merge-ready)
pnpm typecheck    # tsc --noEmit (strict)
pnpm test         # Vitest unit tests
pnpm test:e2e     # Playwright integration (starts dev server automatically)
pnpm build        # next build → produces .next/
pnpm start        # serves the production build locally
```

### Run Lighthouse locally before opening a PR

```bash
pnpm dlx @lhci/cli autorun \
  --collect.url=http://localhost:3000 \
  --assert.preset=lighthouse:recommended
```

Budget: Performance / Accessibility / Best Practices / SEO **≥ 90** on the
mobile profile, FCP **< 1.5 s** (Constitution Principle IV).

## Verifying the Constitution gates

- **Identity check (Principle I / FR-036)**:
  ```bash
  pnpm run check:forbidden   # grep sweep over .next/ + public/
  ```

- **Bundle budget (Principle IV)**:
  ```bash
  ANALYZE=true pnpm build    # opens bundle analyzer HTML
  ```
  Per-route client JS MUST stay ≤ 200 KB gzipped.

- **Theme sanity (Principle V)**: visual check at 360px and 1440px in
  both dark and light themes. `pnpm dev` → toggle via the navbar icon.

- **a11y (SC-006)**:
  ```bash
  pnpm test:e2e -- --grep=axe    # axe-core via @axe-core/playwright
  ```

## Deploying

Deployment goes through the **GitHub MCP** (constitution Principle VI) for
commits / pushes / PRs. Manual `git push` from the agent is prohibited.

1. Create a feature branch (`001-core-portfolio-site` already active).
2. Push commits via GitHub MCP tools.
3. Vercel auto-builds a preview at
   `portfolio-2026-<hash>-psqasim.vercel.app`.
4. Merge to `main` when all CI gates pass; Vercel promotes to
   `psqasim-portfolio-2026.vercel.app` (or the production alias).

## Minimal smoke test after first deploy

Visit the preview URL on a cold browser profile and confirm:

- [ ] Preloader shows for ~2.5 s with `AGENTIC AI ENGINEER` + kanji
- [ ] Hero announces "Muhammad Qasim — Agentic AI Engineer"
- [ ] Systems grid shows exactly 5 cards; each has a GitHub button
- [ ] Factory-de-Odoo card shows "Architecture Advisor" role badge
- [ ] Contact form submits and shows a success toast within 5 s
- [ ] Theme toggle persists across reload; no flash
- [ ] `/llms.txt` loads and contains "Agentic AI Engineer"
- [ ] View source: JSON-LD Person schema inlined in `<body>`
- [ ] No horizontal scroll at 360px viewport
- [ ] `pnpm run check:forbidden` returns zero matches

## Troubleshooting

- **Preloader shows on every refresh**: `sessionStorage` disabled or
  private-browsing mode. This is expected behavior in private mode.
- **Theme flash on first load**: confirm `next-themes` `ThemeProvider` is
  the outermost client wrapper in `layout.tsx` and that no other CSS
  runs before its inline script.
- **Contact form fails with `success: false, message: "Invalid access key"`**:
  `.env.local` not loaded or key was regenerated — refresh from
  web3forms.com and update `.env.local` (and Vercel project env).
- **Lighthouse SEO dips below 90**: usually a missing `<meta name="description">`
  or an OG image that's too large. See `contracts/seo-metadata.md`.

## Next steps after Sprint 1 exits

- `/sp.tasks` generates the `tasks.md` work breakdown from this plan.
- `/sp.implement` is **not** invoked automatically — you choose when to
  start the build-out.
- Sprint 2 adds `/systems/[slug]` and the AI chatbot widget; extends the
  data model (see `data-model.md` "Out of scope").
