# Feature Specification: Sprint 1 — Core Portfolio Site

**Feature Branch**: `001-core-portfolio-site`
**Created**: 2026-04-20
**Status**: Draft
**Input**: User description: Sprint 1 Core Portfolio Site — single-page portfolio with 8 sections (preloader, navbar, hero, systems, skills, about, contact, footer), dark/light theme, mobile-first responsive, static content from TypeScript data files, no backend.

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Evaluate Engineering Credibility in Under 30 Seconds (Priority: P1) 🎯 MVP

A hiring manager, founder, or collaborator arrives at the portfolio from a cold
link (e.g., a recruiter message, X DM, or GitHub profile). Within 30 seconds
they must be able to answer two questions: "What does this person build?" and
"Is this credible?" They do this by reading the hero identity and scanning the
shipped-systems grid with its status badges, metrics, tech tags, and outbound
links to GitHub / live URLs.

**Why this priority**: This is the portfolio's reason to exist. If a visitor
cannot answer those two questions quickly, nothing else in the site matters.
A site with only the hero and systems sections is already a viable MVP —
everything below it is reinforcement.

**Independent Test**: Serve only the hero and shipped-systems sections
(preloader + navbar present as scaffolding). A test visitor reading for
30 seconds on a 360px mobile viewport MUST be able to (a) state the owner's
professional identity, (b) name at least two shipped systems, and (c) reach
a GitHub repository by clicking a single card link.

**Acceptance Scenarios**:

1. **Given** a visitor lands on the homepage for the first time, **When** the
   initial loading moment ends, **Then** the hero headline announces
   "Muhammad Qasim" with the title "Agentic AI Engineer" and a description
   referencing autonomous AI systems, along with a metrics line showing
   "5 systems shipped · 200+ tests passing · Deployed on cloud".
2. **Given** the visitor scrolls to the systems section, **When** the grid
   comes into view, **Then** exactly 5 system cards are rendered (CRM Digital
   FTE, Personal AI Employee, TaskFlow, Factory-de-Odoo, MCP-Native Developer
   Tool), each displaying a status badge, one-line description, 2–4 metric
   tiles, tech tags, and a GitHub link button.
3. **Given** the Factory-de-Odoo card is rendered, **When** the visitor
   inspects it, **Then** a role badge reading "Architecture Advisor" is
   visible (collab role disclosure).
4. **Given** a system has an associated live URL, **When** the card is
   rendered, **Then** a live-URL button is present in addition to the GitHub
   button; **Given** no live URL exists, **Then** only the GitHub button is
   present (no broken links).
5. **Given** the visitor clicks "View Architecture →" on any card, **When**
   the click resolves, **Then** the button is disabled or presents a
   non-navigating state (Sprint 2 feature; card must not navigate).
6. **Given** the visitor clicks "View My Work ↓" in the hero, **When** the
   click resolves, **Then** the page smoothly scrolls to the systems section
   and the systems section becomes the active section in the navbar.
7. **Given** the visitor hovers over the "Ask My AI Agent" CTA, **When** the
   hover registers (or the button is focused via keyboard), **Then** a
   tooltip reading "Coming soon" is presented and the button does not
   navigate anywhere.

---

### User Story 2 — Initiate Direct Contact (Priority: P2)

A visitor convinced by the systems grid wants to reach out. They need to
(a) find a direct channel (email, LinkedIn, GitHub, X) without friction, and
(b) optionally submit a short message through an in-page form that confirms
delivery.

**Why this priority**: The portfolio's business goal is to convert interest
into conversation. Contact must be trivially reachable but is a distinct
slice from US1 — US1 already delivers value (the visitor can copy-paste a
URL and reach out externally). US2 closes the loop on-site.

**Independent Test**: With US1's hero + systems in place, add the contact
section alone. A test visitor MUST be able to (a) copy the owner's email in
one click, (b) reach LinkedIn and GitHub with one click each, and
(c) submit a three-field form and see a success or error confirmation
within 5 seconds of submit.

**Acceptance Scenarios**:

1. **Given** the visitor scrolls to the contact section, **When** the
   section renders, **Then** the email `muhammadqasim0326@gmail.com`,
   location "Karachi, Pakistan", and social links (GitHub, LinkedIn with
   `https://linkedin.com/in/muhammadqasim-dev`, X) are visible; phone
   number is absent.
2. **Given** the visitor fills the Name, Email, and Message fields and
   presses Send, **When** all fields are valid, **Then** the form submits
   to the configured form-handling service and a success toast appears.
3. **Given** the submission fails (network error, service error, or
   validation error from the service), **When** the error resolves, **Then**
   an error toast appears with actionable copy and the form fields retain
   their contents so the visitor can retry.
4. **Given** the visitor submits without filling required fields or with an
   invalid email, **When** they press Send, **Then** inline validation
   errors appear and no network request is made.

---

### User Story 3 — Build Trust Through Depth & Personality (Priority: P3)

A visitor who has seen the hero and systems wants to understand the
technical breadth behind the work and get a sense of the person. They read
the skills grid (grouped by category, no fake proficiency bars), the short
bio, the education timeline, and the footer's personal touches.

**Why this priority**: These sections add credibility and identity but are
not the primary conversion surface. The portfolio can demo without them
(US1 ships first); adding them elevates trust without being prerequisite.

**Independent Test**: With US1 and US2 in place, add skills + about +
footer. A visitor MUST be able to (a) identify 5 skill categories with at
least 2 skills each, (b) read a bio of ≤ 4 sentences that includes GIAIC
and Karachi, (c) see an education timeline with 3 entries where the GIAIC
entry is visually highlighted as current.

**Acceptance Scenarios**:

1. **Given** the visitor scrolls to the skills section, **When** the grid
   renders, **Then** 5 categories appear with their respective kanji
   headers (AI & Agents 知能, Languages & Frameworks 言語, Infrastructure
   & DevOps 基盤, Data & Storage 情報, Frontend 画面) containing
   respectively 6, 5, 9, 2, and 4 skill entries; no percentage bars or
   years-of-experience are shown anywhere.
2. **Given** the visitor reaches the about section, **When** the section
   renders, **Then** a bio of 3–4 sentences referencing "Karachi, Pakistan"
   and GIAIC is shown, a profile image placeholder with a sakura-pink
   accent border is present (graceful fallback to a gradient if the image
   file is absent), and a vertical education timeline lists GIAIC
   (2023–Present, highlighted as current), Govt Islamia Science College
   (Intermediate, 2019), and Bahria Model School (Matriculation, 2017).
3. **Given** the visitor reaches the footer, **When** it renders, **Then**
   the large name "MUHAMMAD QASIM" with the Japanese rendering
   "ムハンマド・カシム" below it, the tagline "Building autonomous systems,
   one agent at a time", repeated nav links, social icons (GitHub,
   LinkedIn, X, Email), an italicized quote "Surpass your limits. Right
   here, right now." attributed to Yami Sukehiro, copyright
   "© 2026 Muhammad Qasim", and a teaser line about an embedded AI agent
   are all present.

---

### User Story 4 — Navigate & Theme the Site Without Friction (Priority: P3)

A visitor expects smooth, professional navigation across sections, a first
impression moment on first visit, and the ability to switch between dark
(default) and light themes.

**Why this priority**: Navigation and theming are cross-cutting capabilities
that polish the entire experience. They enable US1–US3 to feel cohesive but
are not, individually, the reason a visitor comes.

**Independent Test**: With US1 in place, add navbar + preloader + theme
toggle. A test visitor MUST be able to (a) see a branded preloader moment
on first visit and NOT see it on a same-session return, (b) jump to each
section via navbar links and observe active-section highlighting,
(c) toggle between dark and light themes with persistence across reloads.

**Acceptance Scenarios**:

1. **Given** a visitor lands on the site for the first time in a browser
   session, **When** the document starts loading, **Then** a full-screen
   dark navy preloader is shown for 2–3 seconds displaying
   "AGENTIC AI ENGINEER", the subtitle "Building Autonomous Systems",
   subtle particle/petal motion, a skeleton-style progress bar, and the
   Japanese text "ポートフォリオ起動中" at the bottom, before fading out.
2. **Given** the visitor has already seen the preloader in the current
   session, **When** they navigate back to the homepage (same tab), **Then**
   the preloader does NOT reappear and the site renders immediately.
3. **Given** the visitor is on a desktop viewport, **When** the page is at
   the top of the hero, **Then** the navbar background is transparent;
   **Given** the visitor scrolls past the hero, **Then** the navbar gains
   a solid/blurred background.
4. **Given** the visitor clicks a nav link (Home / Systems / Skills /
   About / Contact), **When** the click resolves, **Then** the page
   smooth-scrolls to that section and the navbar highlights the current
   section while the visitor reads it.
5. **Given** a mobile viewport (≤ 768px), **When** the visitor taps the
   hamburger icon, **Then** a slide-in drawer opens listing the same
   navigation links; tapping a link closes the drawer and scrolls to the
   section.
6. **Given** the visitor toggles the theme icon, **When** the toggle
   resolves, **Then** the entire site switches between dark and light
   themes without layout shift, and the choice persists across page
   reloads; both themes are fully polished (no unfinished surfaces).
7. **Given** the visitor's OS reports `prefers-reduced-motion`, **When**
   any animation runs, **Then** scroll-triggered animations, preloader
   particles, and micro-interactions are disabled or replaced with
   instant transitions.

---

### Edge Cases

- **First visit with slow network**: the preloader MUST NOT block
  indefinitely; if hero assets exceed 3 seconds, the preloader times out
  and reveals content with whatever is loaded, then continues loading
  below-the-fold.
- **Return within same session**: preloader is suppressed (session-scoped
  flag). Closing the tab and reopening resets the session and preloader
  shows again.
- **JavaScript disabled**: critical content (hero copy, systems list,
  contact email, social links) MUST remain legible and navigable as
  server-rendered HTML. Form submit, theme toggle, and animations may
  degrade.
- **Missing profile image**: the about section falls back to a
  gradient-filled placeholder with the same shape and glow; no broken
  image icon.
- **System with no live URL**: only the GitHub link button is rendered
  on that card; no disabled placeholder for the missing live URL.
- **Contact form submission failure**: error toast, form fields retained,
  retry possible; no silent data loss.
- **Theme flash on load**: the site MUST NOT briefly show the wrong theme
  before applying the stored preference (no light-to-dark flicker).
- **Accessibility — keyboard only**: every interactive element (nav links,
  theme toggle, hamburger, card buttons, form fields, submit) MUST be
  reachable by keyboard with visible focus styles.
- **Accessibility — reduced motion**: all motion respects
  `prefers-reduced-motion`.
- **Small viewport (360px)**: every section renders without horizontal
  scroll, without clipped text, and without overlapping elements.
- **Very long paste in contact message**: message field enforces a
  reasonable maximum (4 000 characters) and shows a friendly counter or
  truncation notice rather than silently dropping input.
- **Forbidden-content regression**: no section, alt text, metadata, or
  social link may reference any employer, military, navy, government,
  department, rank, or title; copy must not use "junior", "aspiring",
  "learning", or "exploring". (Enforced per Constitution Principle I.)

## Requirements *(mandatory)*

### Functional Requirements

#### Structure & navigation

- **FR-001**: The site MUST present a single scrollable page composed of
  eight ordered surfaces: preloader, navbar, hero, shipped systems, skills,
  about, contact, footer.
- **FR-002**: The navbar MUST remain fixed at the top of the viewport, be
  transparent when the hero is in view, and gain a solid/blurred background
  once the visitor scrolls past the hero.
- **FR-003**: The navbar MUST expose links to Home, Systems, Skills, About,
  and Contact; clicking any link MUST smooth-scroll to the corresponding
  section.
- **FR-004**: The navbar MUST highlight the section currently in view as the
  visitor scrolls (active-section indicator).
- **FR-005**: On viewports ≤ 768px, the navbar MUST collapse into a
  hamburger that opens a slide-in drawer containing the same links; tapping
  a link MUST close the drawer and scroll to the section.

#### Preloader

- **FR-006**: On the first document load within a given browser session, the
  site MUST display a full-screen dark-navy preloader for 2–3 seconds
  showing the title "AGENTIC AI ENGINEER", the subtitle "Building Autonomous
  Systems", a skeleton-style progress indicator, subtle sakura-petal or
  particle motion, and the Japanese text "ポートフォリオ起動中" at the
  bottom, after which it MUST fade out and reveal the site.
- **FR-007**: The preloader MUST NOT re-appear on subsequent navigations
  within the same session (session-scoped suppression).
- **FR-008**: If hero assets have not loaded within 3 seconds, the
  preloader MUST time out and reveal the site rather than block
  indefinitely.

#### Hero

- **FR-009**: The hero MUST occupy the full initial viewport height and
  present a two-column layout on desktop (stacked on mobile) with: left
  column showing the name "Muhammad Qasim", title "Agentic AI Engineer",
  the description "I build autonomous AI systems that run 24/7 — MCP
  servers, multi-agent orchestration, and production-grade agent workflows",
  and the metrics line "5 systems shipped · 200+ tests passing · Deployed
  on cloud"; right column showing a dark terminal-style card that types out
  four agent log lines sequentially: "[Agent] Incoming ticket via
  WhatsApp…", "[SkillsInvoker] Routing to TroubleshootSkill…", "[MCP]
  Querying knowledge base…", "[Agent] Response sent. Resolution time: 4.2s".
- **FR-010**: The hero MUST render a subtle circuit-board grid pattern
  behind the foreground content.
- **FR-011**: The hero MUST expose two CTA buttons: "View My Work ↓", which
  smooth-scrolls to the systems section, and "Ask My AI Agent", which is
  non-interactive in Sprint 1 and surfaces a "Coming soon" tooltip on
  hover or keyboard focus.

#### Shipped systems

- **FR-012**: The systems section MUST carry the kanji accent "実績" in its
  header and render exactly 5 system cards sourced from a typed content
  module (not a CMS): CRM Digital FTE, Personal AI Employee, TaskFlow,
  Factory-de-Odoo, and MCP-Native Developer Tool.
- **FR-013**: Each card MUST display a status badge (LIVE / SHIPPED /
  ACTIVE / APPLIED), the system name, a one-line description, 2–4 metric
  tiles, tech tags, a GitHub link button, and — when present in data — a
  live-URL button; cards with no live URL MUST render only the GitHub
  button.
- **FR-014**: The Factory-de-Odoo card MUST display the role badge
  "Architecture Advisor".
- **FR-015**: Each card MUST show a "View Architecture →" affordance that
  is disabled (non-navigating) in Sprint 1.
- **FR-016**: The grid MUST render 1 column at viewport widths ≤ 640px,
  2 columns at 641–1024px inclusive, and 3 columns at ≥ 1025px. (The
  breakpoint bounds are authoritative; framework-default breakpoints that
  start at 768px or 1024px do NOT satisfy this requirement.)
- **FR-017**: Cards MUST present a glowing accent-colored border on hover
  or keyboard focus.

#### Skills

- **FR-018**: The skills section MUST carry the kanji accent "技術" and
  display five grouped icon grids — AI & Agents (6 entries, 知能),
  Languages & Frameworks (5, 言語), Infrastructure & DevOps (9, 基盤),
  Data & Storage (2, 情報), Frontend (4, 画面) — sourced from a typed
  content module.
- **FR-019**: Skill tiles MUST show only the skill name and a subtle
  icon/logo; the site MUST NOT display proficiency percentages, skill
  levels, stars, or years of experience anywhere.
- **FR-020**: Skill tiles MUST present a subtle glow on hover / focus.

#### About

- **FR-021**: The about section MUST carry the kanji accent "自己紹介" and
  render a 3–4 sentence bio referencing Karachi, GIAIC, and the owner's
  shipped-systems output, using only approved identity language (see
  FR-036).
- **FR-022**: The about section MUST display a rounded-rectangle profile
  image placeholder with a sakura-pink glow border, loading from
  `/public/profile.jpg`; if the image is missing, a gradient placeholder
  of the same shape MUST be shown without a broken-image icon.
- **FR-023**: An education timeline MUST appear below the bio with three
  entries in reverse chronological order: GIAIC — Certified AI, Metaverse
  & Web 3.0 Developer & Solopreneur (WMD) — 2023 to Present (highlighted
  as current); Govt Islamia Science College — Intermediate — 2019;
  Bahria Model School — Matriculation — 2017. The timeline MUST be
  rendered vertically with dots and a connecting line.

#### Contact

- **FR-024**: The contact section MUST carry the header "Let's Build
  Something" and the intro "Looking for an AI engineer? Want to
  collaborate on an agent project? Just want to say salam? Drop a
  message."
- **FR-025**: The contact section MUST expose the email
  `muhammadqasim0326@gmail.com`, the location "Karachi, Pakistan", and
  social icons for GitHub, LinkedIn (linking to
  `https://linkedin.com/in/muhammadqasim-dev`), and X. A phone number
  MUST NOT be displayed anywhere on the site.
- **FR-026**: The contact form MUST collect Name, Email, and Message
  (required) and submit to a configured third-party form-handling service
  using an access key sourced from an environment variable; no form data
  is persisted on the portfolio itself.
- **FR-027**: On successful submission, the site MUST display a success
  toast notification. On failure, it MUST display an error toast with
  actionable copy and retain the submitted field contents so the visitor
  can retry.
- **FR-028**: The form MUST validate inputs client-side (required fields
  and a plausible email pattern) and MUST NOT dispatch a submission when
  validation fails.

#### Footer

- **FR-029**: The footer MUST render on a dark background and include the
  large name "MUHAMMAD QASIM", the Japanese rendering
  "ムハンマド・カシム" beneath it, the tagline "Building autonomous
  systems, one agent at a time", repeated navigation links, social icons
  (GitHub, LinkedIn, X, Email), the italicized quote "Surpass your limits.
  Right here, right now." attributed to Yami Sukehiro, the copyright line
  "© 2026 Muhammad Qasim", and the teaser "This portfolio has an embedded
  AI agent. Try asking it about my work."

#### Theming, responsiveness, motion

- **FR-030**: Dark mode MUST be the default theme on first visit. A theme
  toggle MUST be available in the navbar allowing the visitor to switch
  between dark and light. The chosen theme MUST persist across reloads
  and MUST be applied before the first paint to avoid a theme flash.
- **FR-031**: Both dark and light themes MUST be fully polished — every
  section, control, and state MUST be designed and verified in both
  themes with no unfinished surfaces.
- **FR-032**: The entire site MUST render without horizontal scroll or
  clipped content at 360px width, and MUST remain legible and navigable
  from 360px up to 1920px.
- **FR-033**: Sections MUST animate into view when scrolled into the
  viewport (entrance animations). All motion MUST respect the user's
  `prefers-reduced-motion` setting.

#### Content, accessibility, discoverability

- **FR-034**: All textual and visual content MUST be sourced from typed
  content modules under `src/data/` (systems, skills, education, socials).
  The site MUST NOT fetch content from any CMS or remote service at build
  or render time.
- **FR-035**: The site MUST expose discoverability metadata: a title and
  description that include the identity "Agentic AI Engineer", OpenGraph
  tags, a JSON-LD Person schema, and a `/llms.txt` file at the site root
  summarizing the owner's identity, work, and contact surfaces for AI
  crawlers.
- **FR-036**: No surface (copy, metadata, alt text, OG tags, JSON-LD,
  llms.txt, commit trail, or any derived asset) may reference any
  employer, military, navy, government, department, rank, or title —
  direct or indirect, past or present. No surface may use the words
  "junior developer", "aspiring", "learning", or "exploring". The
  professional identity is "Agentic AI Engineer" and MUST NOT be
  rendered as "Frontend Developer". *(Constitution Principle I —
  NON-NEGOTIABLE.)*
- **FR-037**: Every interactive element MUST be reachable by keyboard
  with a clearly visible focus indicator; every non-decorative image
  MUST have meaningful alt text; heading hierarchy MUST be monotonic
  (h1 → h2 → h3 without skips) starting at a single h1 for the hero.

### Key Entities

- **System**: A shipped project displayed on a card. Attributes: slug,
  display name, status (LIVE | SHIPPED | ACTIVE | APPLIED), one-line
  description, optional role badge (e.g., "Architecture Advisor"), 2–4
  metrics (label + value), tech tags (list of strings), GitHub URL,
  optional live URL. Five instances exist in Sprint 1.
- **Skill**: A capability displayed as a tile. Attributes: name, category
  (AI & Agents | Languages & Frameworks | Infrastructure & DevOps |
  Data & Storage | Frontend), optional icon reference.
- **Education Entry**: An item in the about timeline. Attributes:
  institution, credential, date range, current flag.
- **Social Link**: An outbound link from contact / footer. Attributes:
  platform (GitHub | LinkedIn | X | Email), URL or mailto, label.
- **Contact Submission** *(transient, not persisted)*: Name, Email,
  Message collected from the contact form; handed off to the external
  form-handling service and discarded locally.

### Assumptions

- **Session-scoped preloader**: "First visit per session" means scoped to
  the current browser tab session — closing and reopening the site resets
  the flag and the preloader replays.
- **Form validation defaults**: Name 1–100 chars, Email RFC-lite regex,
  Message 1–4 000 chars. All fields required. Toast auto-dismiss after
  6 seconds; error toasts stay until dismissed.
- **X (Twitter) handle**: An X social link is rendered; the exact handle
  will be supplied in the content module before Sprint 1 sign-off. If a
  placeholder is used during build, it MUST be a non-clickable dimmed
  icon, never a broken link.
- **Profile photo**: The file `/public/profile.jpg` may be absent during
  Sprint 1; the gradient fallback is acceptable and is not a blocker for
  the sprint exit gate.
- **Constitution alignment**: This spec inherits identity rules
  (Principle I), the static-site / zero-backend posture (Principle II),
  and the performance budget (Principle IV — Lighthouse ≥ 90, FCP <
  1.5s, JS ≤ 200 KB/route) from `.specify/memory/constitution.md`
  v1.0.0. Violations of any NON-NEGOTIABLE principle are merge-blockers
  and do not require duplication in this spec's FR list.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time visitor on a 360px mobile viewport can identify
  the owner's professional identity ("Agentic AI Engineer"), name at
  least two shipped systems, and click through to a GitHub repository
  within 30 seconds of the preloader fading out, without scrolling
  beyond the systems section.
- **SC-002**: Homepage Lighthouse scores (mobile profile, Moto G4 +
  Slow-4G) reach ≥ 90 for Performance, Accessibility, Best Practices,
  and SEO on the deployed preview. *(Constitution Principle IV.)*
- **SC-003**: First Contentful Paint on the same Lighthouse profile is
  under 1.5 seconds.
- **SC-004**: The site renders correctly (no horizontal scroll, no
  clipped text, no overlapping elements) at every viewport width from
  360px to 1920px in both dark and light themes.
- **SC-005**: A visitor submitting a valid contact form receives a
  success or error confirmation within 5 seconds of pressing Send in at
  least 99 % of submissions on a stable network.
- **SC-006**: Every interactive element is reachable by keyboard with a
  visible focus indicator; an automated accessibility audit (e.g.,
  axe-core or equivalent) reports zero critical violations on the
  homepage.
- **SC-007**: The preloader is visible on the first document load of a
  session and suppressed on every subsequent same-session navigation in
  100 % of tested runs.
- **SC-008**: Zero occurrences of the forbidden strings (any employer
  name, "junior developer", "aspiring", "learning", "exploring",
  "Frontend Developer", or any military / navy / government /
  department / rank / title reference) appear in any shipped surface —
  HTML, metadata, JSON-LD, OpenGraph, llms.txt, alt text, or bundled
  JSON. *(Constitution Principle I — NON-NEGOTIABLE.)*
- **SC-009**: 100 % of the 5 system cards render with a status badge,
  the required metric tiles, and a working GitHub link; cards with a
  live URL additionally render a working live-URL button.
- **SC-010**: Theme preference persists across page reloads in 100 %
  of tested sessions and no theme-flash occurs on initial paint.
