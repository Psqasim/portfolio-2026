---
id: "0001"
title: Portfolio 2026 Constitution Ratified
stage: constitution
date: 2026-04-20
surface: agent
model: claude-opus-4-7
feature: none
branch: main
user: muhammadqasim0326@gmail.com
command: /sp.constitution
labels: [constitution, portfolio-2026, nextjs, tailwind, design-system, performance, identity]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
  - CLAUDE.md
tests:
  - none
---

## Prompt

/sp.constitution

Portfolio 2026 — personal portfolio website for Muhammad Qasim, an Agentic AI Engineer based in Karachi, Pakistan.

## Tech Stack
- Next.js 15 + App Router + TypeScript
- Tailwind CSS 4 + CSS custom properties for theming
- Framer Motion for animations
- Lucide React for icons
- next-themes for dark/light mode
- Web3Forms for contact form (free tier)
- NO CMS — all content hardcoded in TypeScript data files in src/data/
- NO styled-components, NO Sanity, NO extra UI libraries

## Architecture
- Single page app with smooth scroll sections + one dynamic route /systems/[slug]
- Static generation for all pages (no SSR, no external API calls on render)
- Mobile-first responsive design
- Dark mode is DEFAULT, light mode must also be polished

## Code Quality
- TypeScript strict mode
- ESLint with Next.js config
- All components as functional components with proper typing
- File structure: src/app/ for pages, src/components/ for UI, src/data/ for content, src/lib/ for utils, src/types/ for interfaces

## Design Theme: "Anime × Dark Tech × AI"
- Dark navy backgrounds (#0a0e1a), sakura pink accents (#f472b6), soft purple (#c084fc), cyan (#22d3ee)
- Subtle circuit-board grid background pattern
- Japanese kanji as decorative section accents
- Glow effects on hover states
- Fonts: Geist Sans or Inter for headings/body, Noto Sans JP for Japanese, JetBrains Mono for code

## Performance
- Lighthouse > 90
- FCP < 1.5s
- next/image with WebP, lazy loading
- Self-hosted fonts via next/font

## Git & Deployment
- All git operations via GitHub MCP — create repo, commit, push. Never manual git.
- Use Context7 MCP for looking up Next.js 15, Tailwind CSS 4, Framer Motion docs before implementing
- Deploy to Vercel free tier
- Repo: Psqasim/portfolio-2026 (create via GitHub MCP when ready)

## Forbidden Content
- Never mention any employer name, military, navy, government, department names, ranks, or titles
- Never use "junior developer", "aspiring", "learning", "exploring"
- Identity is "Agentic AI Engineer" — never "Frontend Developer"

## Sprint Plan
- Sprint 1: Core site (all sections, responsive, dark/light, deployed on Vercel)
- Sprint 2: System detail pages, AI chatbot widget (OpenAI + HF Spaces)
- Sprint 3: Interactive architecture diagrams, resume PDF, polish

Follow-up: "also make update just upatde '/home/ps_qasim/projects/portfolio-2026/CLAUDE.md' this means what we doing"

## Response snapshot

Ratified Portfolio 2026 Constitution v1.0.0 at `.specify/memory/constitution.md` and
added a Project Overview section to `CLAUDE.md` capturing the same load-bearing
facts for day-to-day agent guidance.

Six core principles (two NON-NEGOTIABLE):
1. Content Integrity & Identity Discipline — "Agentic AI Engineer" only; no
   employer/military/department references; no "junior/aspiring/learning" framing.
2. Static-First, Zero-Backend — Next.js 15 SSG, hardcoded TS data, Web3Forms only.
3. Type Safety & Code Quality — strict TS, ESLint zero warnings, fixed `src/` layout.
4. Performance Budget — Lighthouse ≥ 90, FCP < 1.5s, self-hosted fonts, ≤ 200 KB JS/route.
5. Design System Fidelity — tokenized Anime × Dark Tech × AI palette; dark default, light first-class.
6. Tooling Authority (MCP-First) — GitHub MCP for git, Context7 MCP for docs.

Plus Tech Stack Lock-In (frozen stack, no extra UI libs/CMS), Development
Workflow (3 sprints + per-PR gates), and Governance (amendment via ADR,
SemVer rules for the constitution itself).

Sync Impact Report embedded at top of constitution. All dependent templates
(plan/spec/tasks/commands) reviewed and compatible — no edits required.

## Outcome

- ✅ Impact: Project now has an enforceable governance document covering identity, stack, performance, and workflow; CLAUDE.md carries a quick-reference Project Overview so future sessions don't re-derive context.
- 🧪 Tests: none (governance artifact; no code change)
- 📁 Files: `.specify/memory/constitution.md` (written), `CLAUDE.md` (Project Overview prepended), `history/prompts/constitution/0001-portfolio-2026-constitution-ratified.constitution.prompt.md` (this PHR)
- 🔁 Next prompts: `/sp.specify` for Sprint 1 core site feature spec; then `/sp.plan`; create `Psqasim/portfolio-2026` via GitHub MCP when ready.
- 🧠 Reflection: Encoding the forbidden-content rules as a NON-NEGOTIABLE principle (not just a CLAUDE.md note) makes violations a merge-blocker rather than a style preference.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): After Sprint 1 Lighthouse run, revisit the 200 KB/route JS budget — tighten to 150 KB if real-world numbers allow.
