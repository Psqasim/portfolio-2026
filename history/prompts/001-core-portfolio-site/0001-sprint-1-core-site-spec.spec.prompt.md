---
id: "0001"
title: Sprint 1 Core Site Spec
stage: spec
date: 2026-04-20
surface: agent
model: claude-opus-4-7
feature: 001-core-portfolio-site
branch: 001-core-portfolio-site
user: muhammadqasim0326@gmail.com
command: /sp.specify
labels: [spec, sprint-1, portfolio-2026, nextjs, single-page, dark-light-theme, accessibility, seo]
links:
  spec: specs/001-core-portfolio-site/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-core-portfolio-site/spec.md
  - specs/001-core-portfolio-site/checklists/requirements.md
tests:
  - none (spec artifact)
---

## Prompt

/sp.specify Sprint 1 — Core Portfolio Site

## What We're Building
A single-page portfolio website with 8 sections, dark/light theme, mobile-first responsive design. No backend, no CMS, no API calls on render. All content from TypeScript data files.

## Sections (scroll order)

### 1. Preloader
- Full-screen dark navy overlay on initial load, 2-3 seconds
- Shows: "AGENTIC AI ENGINEER" title, "Building Autonomous Systems" subtitle
- Japanese text: ポートフォリオ起動中 (Portfolio booting up) at bottom
- Subtle sakura petals or particles
- Skeleton-style progress bar
- Fades out to reveal main site
- Should NOT show on subsequent navigations, only first visit per session

### 2. Navbar
- Fixed top, transparent on hero, solid background on scroll
- Left: <Muhammad Qasim /> logo text
- Right: Home, Systems, Skills, About, Contact links (smooth scroll)
- Far right: Dark/Light theme toggle icon
- Mobile: hamburger menu with slide-in drawer
- Active section highlighting as user scrolls

### 3. Hero
- Full viewport height, two-column on desktop, stacked on mobile
- Left column: Name "Muhammad Qasim", title "Agentic AI Engineer", description "I build autonomous AI systems that run 24/7 — MCP servers, multi-agent orchestration, and production-grade agent workflows.", metrics line "5 systems shipped · 200+ tests passing · Deployed on cloud"
- Right column: Terminal-style card with dark background showing simulated agent log messages that type out one by one:
  - [Agent] Incoming ticket via WhatsApp...
  - [SkillsInvoker] Routing to TroubleshootSkill...
  - [MCP] Querying knowledge base...
  - [Agent] Response sent. Resolution time: 4.2s
- CTAs: "View My Work ↓" (scrolls to systems) and "Ask My AI Agent" (disabled for Sprint 1, tooltip says "Coming soon")
- Subtle circuit-board grid background pattern behind everything

### 4. Systems I've Shipped
- Section header with kanji accent: 実績 (Track Record)
- 5 system cards in a responsive grid (1 col mobile, 2 col tablet, 3 col desktop)
- Each card shows: status badge (LIVE/SHIPPED/ACTIVE/APPLIED), system name, one-line description, 2-4 metric tiles, tech tags, GitHub link button, live URL button (if exists)
- Cards have glow border effect on hover
- Data comes from src/data/systems.ts
- The 5 systems: CRM Digital FTE (Hackathon 5), Personal AI Employee (Hackathon 0), TaskFlow (Hackathon 2), Factory-de-Odoo (collab), MCP-Native Developer Tool (Cerebral Valley)
- Role badge on Factory-de-Odoo card: "Architecture Advisor"
- Click "View Architecture →" is disabled for Sprint 1 (Sprint 2 feature)

### 5. Tech Stack
- Section header with kanji accent: 技術 (Technology)
- NO percentage bars, NO skill levels, NO experience years
- 5 categories displayed as grouped icon grids: AI & Agents (6 skills), Languages & Frameworks (5), Infrastructure & DevOps (9), Data & Storage (2), Frontend (4)
- Each skill shows: name + subtle icon or logo
- Category headers with their kanji: 知能, 言語, 基盤, 情報, 画面
- Skills have subtle glow on hover
- Data comes from src/data/skills.ts

### 6. About
- Section header with kanji accent: 自己紹介 (Self Introduction)
- Short bio text (3-4 sentences max): "Software developer based in Karachi, Pakistan. Working professional by day, agentic AI systems builder around the clock. Currently enrolled in GIAIC, where I've shipped 5 production-grade AI systems through their hackathon program — from autonomous agents to MCP servers to cloud-native orchestration. I don't explore technologies. I ship them."
- Photo placeholder: rounded-rectangle with sakura-pink border glow, loads from /public/profile.jpg (use a placeholder gradient if image missing)
- Education timeline below the bio:
  - GIAIC — Certified AI, Metaverse & Web 3.0 Developer & Solopreneur (WMD) — 2023 to Present (highlighted as current)
  - Govt Islamia Science College — Intermediate — 2019
  - Bahria Model School — Matriculation — 2017
- Timeline is vertical with dots and connecting line

### 7. Contact
- Section header: "Let's Build Something"
- Intro text: "Looking for an AI engineer? Want to collaborate on an agent project? Just want to say salam? Drop a message."
- Left side: Email (muhammadqasim0326@gmail.com), Location (Karachi, Pakistan), Social icons (GitHub, LinkedIn, X) — NO phone number
- Right side: Contact form with Name, Email, Message fields + Send button
- Form submits to Web3Forms endpoint (access key from env var NEXT_PUBLIC_WEB3FORMS_KEY)
- Success/error toast notification after submit
- LinkedIn URL must be: https://linkedin.com/in/muhammadqasim-dev

### 8. Footer
- Dark background section
- Left: Name "MUHAMMAD QASIM" large, Japanese name ムハンマド・カシム below it
- Tagline: "Building autonomous systems, one agent at a time"
- Navigation links repeated
- Social icons: GitHub, LinkedIn, X, Email
- Black Clover quote in italics: "Surpass your limits. Right here, right now." — Yami Sukehiro
- Copyright: © 2026 Muhammad Qasim
- Small text: "This portfolio has an embedded AI agent. Try asking it about my work." (teaser for Sprint 2)

## Non-Functional Requirements
- Mobile-first: design for 375px width first, scale up
- Both dark mode and light mode must be fully polished
- Dark mode is the default
- All sections animate into view on scroll using Framer Motion
- Smooth scroll behavior for nav links
- All images lazy loaded via next/image
- Fonts self-hosted via next/font: Inter, Noto Sans JP, JetBrains Mono
- Accessible: proper heading hierarchy, alt texts, keyboard navigation, focus states
- SEO: JSON-LD Person schema, OpenGraph meta tags, proper title/description with "Agentic AI Engineer" identity
- Create an llms.txt file at /public/llms.txt summarizing who I am for AI crawlers

## Out of Scope for Sprint 1
- AI chatbot widget (Sprint 2)
- System detail pages /systems/[slug] (Sprint 2)
- "How I Build" methodology section (Sprint 2)
- Interactive architecture diagrams (Sprint 3)
- Resume/CV PDF download (Sprint 3)
- Analytics integration (Sprint 3)
- Actual profile photo (will add later, use placeholder)

## Response snapshot

Created feature `001-core-portfolio-site` and wrote `specs/001-core-portfolio-site/spec.md` structured around four prioritized user stories:

- **US1 (P1, MVP)** — Evaluate engineering credibility in under 30 seconds (Hero + Shipped Systems). Independently testable by showing only hero + systems cards and verifying a 360px visitor can name two systems and click through to GitHub.
- **US2 (P2)** — Initiate direct contact (socials + contact form with third-party submission and toast confirmation).
- **US3 (P3)** — Build trust through depth & personality (Skills grid, About bio, Education timeline, Footer).
- **US4 (P3)** — Navigate & theme without friction (Preloader first-visit-per-session, fixed navbar, smooth-scroll active highlighting, theme toggle with persistence, reduced-motion support).

Produced:
- **37 Functional Requirements** grouped by surface (Structure/Nav, Preloader, Hero, Systems, Skills, About, Contact, Footer, Theming/Responsiveness/Motion, Content/A11y/Discoverability). FR-036 encodes Constitution Principle I forbidden-content rules as a testable gate.
- **5 Key Entities** (System, Skill, Education Entry, Social Link, Contact Submission).
- **10 Success Criteria** — SC-001 (30-second credibility test), SC-002/003 (Lighthouse ≥ 90, FCP < 1.5s), SC-004 (360–1920px responsive), SC-005 (form confirmation ≤ 5s), SC-006 (a11y audit zero critical), SC-007 (preloader session behavior 100%), SC-008 (zero forbidden-content occurrences), SC-009 (all 5 system cards complete), SC-010 (theme persistence + no flash).
- **4 Assumptions documented** (session-scoped preloader, form validation bounds, X handle placeholder, profile image fallback) instead of opening NEEDS CLARIFICATION markers — kept under the 3-marker limit.
- **Edge cases** covering slow network, JS-disabled, missing image, prefers-reduced-motion, 360px edge, theme flash, keyboard-only nav, and the forbidden-content regression check.

Deliberately tech-agnostic: "scroll-triggered entrance animations" (not Framer Motion), "third-party form-handling service" (not Web3Forms by name). Directory references (`src/data/`, `/public/profile.jpg`, `/llms.txt`) retained as contract-level artifacts per Constitution Principle III's fixed layout, not framework leaks.

Quality checklist at `specs/001-core-portfolio-site/checklists/requirements.md` — all items pass on first iteration.

## Outcome

- ✅ Impact: Sprint 1 scope now has a testable, prioritized spec ready for `/sp.plan`. Each user story is independently deployable so MVP can ship after US1 alone. All forbidden-content and performance gates from the constitution are encoded as FRs/SCs.
- 🧪 Tests: none yet (spec artifact); FRs and SCs define the test surface for later stages.
- 📁 Files: `specs/001-core-portfolio-site/spec.md`, `specs/001-core-portfolio-site/checklists/requirements.md`, and this PHR.
- 🔁 Next prompts: `/sp.clarify` (optional — revisit the 4 assumptions before planning) or `/sp.plan` (recommended — proceed straight to implementation planning).
- 🧠 Reflection: Treating "forbidden content" as FR-036 + SC-008 (not just a README note) makes the identity/compliance rules a merge-blocker with explicit verifiable criteria. The 4-story split (US1 = Hero + Systems as MVP) lets the first deploy happen without waiting on Skills/About/Contact, shrinking time-to-preview.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): quality checklist self-validation — PASS on all items (first iteration)
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): after `/sp.plan`, re-run the quality checklist once the tech choices land in plan.md to confirm no framework-specific language has leaked backward into spec.md.
