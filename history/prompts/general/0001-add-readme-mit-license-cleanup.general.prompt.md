---
id: "0001"
title: add readme mit license cleanup
stage: general
date: 2026-04-25
surface: agent
model: claude-opus-4-7
feature: none
branch: main
user: Muhammad Qasim
command: /sp.implement (post-merge polish)
labels: [docs, readme, license, hero-metrics]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - README.md
  - LICENSE
  - public/hero.png
  - src/data/personal.ts
tests:
  - none (docs/content-only change)
---

## Prompt

```
## CONTEXT
Portfolio 2026 is live at https://psqasim-dev.vercel.app/ with AI chatbot working. Need to add README, MIT License, clean up stray files, and fix hero metrics.

## TASK

### Task A: Create README.md
Create a professional README.md at the project root with this content structure:

# Muhammad Qasim — Portfolio 2026

Screenshot hero image: ![Portfolio](public/hero.png)

Live site: https://psqasim-dev.vercel.app/

## About
Personal portfolio for Muhammad Qasim, an Agentic AI Engineer based in Karachi, Pakistan. Built with the "Anime × Dark Tech × AI" design theme — dark navy backgrounds, sakura pink accents, Japanese kanji decorative elements, and AI circuit-board motifs.

## Features
- 6 shipped AI system showcases with real metrics and live links
- Embedded AI chatbot powered by OpenAI Agents SDK (gpt-4o-mini) with tool-calling for grounded answers
- "Earlier Work" expandable section for older projects
- Dark/Light theme with polished design for both modes
- Mobile-first responsive design
- Japanese kanji section accents and anime-inspired aesthetics
- Contact form via Web3Forms
- JSON-LD structured data + llms.txt for AI-friendly SEO (LLMO)
- Session-scoped preloader with kanji animation

## Tech Stack
- **Framework:** Next.js 15 + App Router + TypeScript
- **Styling:** Tailwind CSS 4 + CSS custom properties
- **Animation:** Framer Motion (LazyMotion/domAnimation)
- **AI Chatbot:** OpenAI Agents SDK + gpt-4o-mini
- **Theme:** next-themes (dark/light)
- **Icons:** Lucide React
- **Contact:** Web3Forms
- **Deployment:** Vercel
- **Methodology:** Spec-Kit Plus (SDD)

## Architecture
```
src/
├── app/             # Next.js App Router pages + API routes
│   └── api/chat/    # AI chatbot streaming endpoint
├── components/
│   ├── chat/        # AI chatbot widget
│   ├── layout/      # Navbar, Footer, Preloader
│   ├── sections/    # Hero, Systems, TechStack, About, Contact
│   └── ui/          # Reusable components
├── data/            # TypeScript data files (systems, skills, personal)
├── lib/             # Utilities, chat agent, rate limiter
└── types/           # TypeScript interfaces
```

## Systems Showcased
1. **CRM Digital FTE** — 24/7 AI customer success agent (101 tests, 7 MCP tools)
2. **Personal AI Employee** — Autonomous task execution, Platinum tier (122 commits, 97% coverage)
3. **Physical AI Humanoid Textbook** — Open source AI education platform
4. **TaskFlow** — Cloud-native AI task manager on Kubernetes
5. **Factory-de-Odoo** — Architecture advisor for ERP generation framework (33,200+ lines)
6. **MCP-Native Developer Tool** — Multi-MCP orchestration (Cerebral Valley hackathon)

## Development
```bash
pnpm install
pnpm dev
```

Requires `.env.local`:
```
NEXT_PUBLIC_WEB3FORMS_KEY=your-key
OPENAI_API_KEY=your-key
```

## License
MIT

## Author
**Muhammad Qasim** — Agentic AI Engineer
- GitHub: https://github.com/Psqasim
- LinkedIn: https://linkedin.com/in/muhammadqasim-dev
- X: https://x.com/psqasim0

Make sure to include the hero.png image reference properly. Use shields.io badges at the top for: Next.js, TypeScript, Tailwind CSS, Vercel, License MIT.

### Task B: Create LICENSE file
Create a standard MIT License file at the project root. Year: 2026. Name: Muhammad Qasim.

### Task C: Fix hero metrics
In src/data/personal.ts, change heroMetrics from "5 systems shipped" to "6 systems shipped" since we added the Physical AI Textbook.

### Task D: Clean up stray files
Delete these files from the project root (they're test screenshots that shouldn't be in the repo):
- done.png
- error.png

### Task E: Commit and push
Commit via GitHub MCP: "docs: add README, MIT license, fix hero metrics, cleanup"
Push to main.

## RULES
- README must be professional and impressive — this is what GitHub visitors see first
- Use shields.io badges for tech stack at the top of README
- Do NOT change any components or features
- Push to main

## EXPECTED OUTPUT
- README.md with badges, screenshot, features, tech stack, architecture
- LICENSE (MIT, 2026, Muhammad Qasim)
- Hero says "6 systems shipped"
- Stray PNGs removed from root
- Pushed to main
```

## Response snapshot

Created `README.md` with shields.io badges (Next.js, TypeScript, Tailwind 4,
Vercel, MIT) plus hero screenshot, features, tech stack, architecture tree,
6 systems showcased, dev setup, and author links. Created `LICENSE` (MIT,
2026, Muhammad Qasim). Updated `src/data/personal.ts` `heroMetrics` from
"5 systems shipped" to "6 systems shipped". `done.png` / `error.png` were
already absent from the repo (only the new untracked `public/hero.png`
remained — committed alongside README so the image reference resolves).

Verified clean: `pnpm check:forbidden` PASS, `pnpm typecheck` PASS.
Committed `b99ec05` and pushed `d849c51..b99ec05` to `origin/main` via git
CLI (binary `hero.png` doesn't fit `mcp__github__push_files` string-only
content shape — followed prior session's pattern).

## Outcome

- ✅ Impact: Repo now has discoverable README + license; hero metric
  reflects all 6 shipped systems; Vercel will redeploy `main`.
- 🧪 Tests: skipped (docs/content-only); typecheck + forbidden-term check
  green.
- 📁 Files: README.md (new), LICENSE (new), public/hero.png (new),
  src/data/personal.ts (1-line edit).
- 🔁 Next prompts: optional — sync `aboutBio` ("shipped 5 production-grade
  AI systems") to "6" if desired (left untouched per task scope).
- 🧠 Reflection: Binary asset + MCP push_files string-only shape is a
  recurring friction point; document a fallback in CLAUDE.md if MCP-first
  remains hard policy.

## Evaluation notes (flywheel)

- Failure modes observed: none.
- Graders run and results (PASS/FAIL): forbidden-term PASS, typecheck PASS.
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): if the user wants strict
  MCP-only git ops, add a workflow that base64-encodes binaries through
  push_files in a follow-up.
