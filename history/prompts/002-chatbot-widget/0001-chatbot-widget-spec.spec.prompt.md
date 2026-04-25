---
id: 0001
title: Sprint 2 chatbot widget spec
stage: spec
date: 2026-04-24
surface: agent
model: claude-opus-4-7
feature: 002-chatbot-widget
branch: 002-chatbot-widget
user: Psqasim
command: /sp.specify
labels: [spec, sprint-2, chatbot, openai-agents-sdk, streaming]
links:
  spec: specs/002-chatbot-widget/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/002-chatbot-widget/spec.md
  - specs/002-chatbot-widget/checklists/requirements.md
tests:
  - grep for [NEEDS CLARIFICATION] in spec.md (0 hits — PASS)
  - checklist validation (all 16 items pass on iteration 1)
---

## Prompt

 ## CONTEXT
Sprint 1 is functionally complete. 3 validation tasks remain (T078, T079, T080). The site is live at https://psqasim-dev.vercel.app/. Also starting Sprint 2 chatbot feature.

## TASK


Run this as a new spec:

/sp.specify Sprint 2 — AI Chatbot Widget

An embedded AI chatbot on the portfolio that answers visitor questions about Muhammad Qasim's work, skills, and projects. Uses OpenAI Agents SDK with tool-calling pattern.

## What it does
- Floating chat button (bottom-right corner) opens a chat panel
- Visitors can ask questions about Qasim's projects, tech stack, methodology, availability
- Bot answers from real data (reads from src/data/ files via tools) + system prompt knowledge
- Supports English, Urdu, Roman Urdu — replies in whatever language the user writes
- Session-only memory (React state) — clears on page refresh
- "New Chat" button to start fresh conversation without refreshing
- Chat history preserved when widget is minimized (stays in React state)

## Architecture
- Frontend: Chat widget component with message bubbles, input field, send button
- Backend: Next.js API route at /api/chat (server-side only)
- Model: OpenAI gpt-4o-mini via OpenAI Agents SDK
- Agent tools: getSystems() and getSkills() that read from src/data/systems.ts and src/data/skills.ts at runtime — grounds the agent on real data
- Streaming: Server-Sent Events (SSE) for real-time response streaming

## Security
- Rate limiter: 10 messages per IP per hour (in-memory Map, resets on cold start)
- Input sanitizer: strip email addresses, phone numbers, credit card patterns from user input
- Max input length: 500 characters
- Prompt injection guard: system prompt with clear delimiters, model refuses override attempts
- Output sanitizer: HTML-escape bot responses before rendering in UI
- API key: OPENAI_API_KEY (server-only env var, NOT NEXT_PUBLIC_)

## UI
- Floating button: blue circle with robot/sparkle icon, bottom-right, tooltip "Need help? Ask AI ✨"
- Chat panel: dark themed card matching portfolio design system (dark navy bg, purple/pink accents)
- Header: "Ask Qasim's AI 🤖" with minimize button (X) and "New Chat" button
- Messages: user bubbles right-aligned (purple accent bg), bot bubbles left-aligned (card bg)
- Typing indicator: animated dots while bot is generating
- Input: text field + send button, disabled during generation
- "Powered by OpenAI" small text at bottom of panel
- Mobile: chat panel takes full width, slides up from bottom
- Responsive: works on all screen sizes

## System prompt knowledge base
The agent knows about: all 6 systems (from systems.ts), all skills (from skills.ts), education, methodology (Spec-Kit Plus), contact info, availability. See constitution for forbidden content rules.

## Cost
- gpt-4o-mini: ~$0.15/1M input, ~$0.60/1M output
- Average conversation: ~800 tokens = ~$0.0005
- Budget: < $5/month

## Out of scope
- Persistent chat history across sessions (no database)
- File uploads or image analysis
- Multi-turn tool chains (single tool call per turn is enough)
- Voice input/output

## Response snapshot

Created branch `002-chatbot-widget`, authored a full user-value-framed
specification, and produced a passing quality checklist on the first
iteration (zero `[NEEDS CLARIFICATION]` markers, all 16 checklist items
pass).

### Spec structure
- **3 user stories** (P1 grounded Q&A → P2 Urdu/Roman Urdu → P3 session
  management), each with its own independent-test procedure and
  Given/When/Then acceptance scenarios.
- **9 edge cases**, including identity-violation attempts (constitution
  Principle I), prompt-injection resistance, rate-limit behavior,
  PII redaction, provider outage, and reduced-motion/keyboard a11y.
- **18 functional requirements (FR-001…FR-018)** — all framed in
  user-value terms (MUST language, testable). Covers widget presence,
  grounded answers, streaming, language detection, session memory,
  per-origin rate limiting, PII redaction, input length cap, prompt
  injection resistance, output escaping, server-only credentials, identity
  constitution enforcement, theme/responsive parity, keyboard + reduced-
  motion a11y, graceful provider failure handling, single-flight send
  control, AI-attribution disclosure, mobile full-width panel.
- **4 key entities**: Chat Session, Message, Rate-limit Counter,
  Grounding Sources.
- **9 success criteria (SC-001…SC-009)** — all technology-agnostic and
  measurable: time-to-first-token, 95% grounded-factual accuracy, 95%
  language-match, rate-limit coverage, zero identity-constitution
  violations, ≤25 KB gzipped First Load JS impact (stays under 200 KB
  constitution budget), < USD 5/month provider cost, axe passes in both
  themes at 360px/1440px, portfolio remains usable on provider outage.
- **Assumptions block** captures user-declared implementation choices
  (OpenAI Agents SDK + gpt-4o-mini, SSE over `/api/chat`, in-memory rate
  counter, `OPENAI_API_KEY` env var naming) without polluting the main
  FR/SC bodies — planning-ready without freezing the spec around
  technology names.
- **Out-of-scope list** preserved verbatim from the user's brief.

### Validation
- `/specs/002-chatbot-widget/checklists/requirements.md` — 16/16 items
  checked; one note flags the intentional content-quality caveat
  (Assumptions section names technologies because the user pre-declared
  them, but FR/SC language stays abstract).
- Ready for `/sp.clarify` (if the user wants a Q&A pass on Urdu handling
  depth, cost ceiling, or rate-limit numbers) or `/sp.plan` directly.

## Outcome

- ✅ Impact: Sprint 2 spec landed on branch `002-chatbot-widget`, passing
  quality validation on first iteration. Feature is defined in 18 FRs +
  9 SCs + 3 prioritized user stories, ready for architectural planning.
- 🧪 Tests: grep `[NEEDS CLARIFICATION]` → 0 hits (PASS); checklist
  16/16 (PASS).
- 📁 Files: `specs/002-chatbot-widget/spec.md` (new),
  `specs/002-chatbot-widget/checklists/requirements.md` (new),
  `history/prompts/002-chatbot-widget/0001-chatbot-widget-spec.spec.prompt.md`
  (this PHR).
- 🔁 Next prompts: `/sp.plan` to architect the chat route + widget
  component tree + agent tool layer + streaming transport. Optional
  `/sp.clarify` first if the user wants to lock Urdu/Roman Urdu
  coverage scope or the hourly-budget number before planning.
- 🧠 Reflection: The user's brief was already implementation-rich. Keeping
  the spec body user-value-focused while preserving the tech choices in
  an explicit "Assumptions" block was the right call — nothing is
  dropped, but the FRs don't need revision if the provider ever swaps.

## Evaluation notes (flywheel)

- Failure modes observed: none on iteration 1.
- Graders run and results (PASS/FAIL): quality checklist 16/16 PASS,
  NEEDS-CLARIFICATION grep PASS (0 hits).
- Prompt variant (if applicable): n/a (first spec for this feature).
- Next experiment (smallest change to try): if `/sp.plan` surfaces
  genuine ambiguity on the per-IP rate limit or language-coverage
  semantics, feed that back into the spec as a refinement rather than
  letting it live only in the plan.
