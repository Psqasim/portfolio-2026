# Phase 1 Data Model: Sprint 1 — Core Portfolio Site

**Feature**: `001-core-portfolio-site`
**Date**: 2026-04-20

All "data" here is build-time content living in typed TS modules under
`src/data/`. There is no database, no ORM, no runtime persistence.
Interfaces are authoritative — content modules must satisfy them or the
build fails under `tsc --noEmit`.

---

## `src/types/index.ts`

```ts
// -------- Systems (shipped projects shown in the Systems grid) --------

export type SystemStatus = "LIVE" | "SHIPPED" | "ACTIVE" | "APPLIED";

export interface SystemMetric {
  /** Short label rendered above the value, e.g. "tests", "latency". */
  label: string;
  /** Value rendered in the tile, e.g. "200+", "4.2s". */
  value: string;
}

export interface System {
  /** Stable identifier; used by Sprint 2 for /systems/[slug]. */
  slug: string;
  /** Display name, e.g. "CRM Digital FTE". */
  name: string;
  status: SystemStatus;
  /** One-line tagline under the name (≤ 120 chars recommended). */
  tagline: string;
  /** Optional collaborator-role badge, e.g. "Architecture Advisor". */
  roleBadge?: string;
  /** 2–4 metric tiles. Enforced at lint time via a data-validator test. */
  metrics: SystemMetric[];
  /** Tech tags (strings) rendered as small pills. */
  tech: string[];
  /** Absolute GitHub URL. Required. */
  githubUrl: string;
  /** Optional live deployment URL; absent → only GitHub button. */
  liveUrl?: string;
}

// -------- Skills (grouped icon grid) --------

/** Category slug used for stable keying and analytics (later). */
export type SkillCategorySlug =
  | "ai-agents"
  | "languages-frameworks"
  | "infrastructure-devops"
  | "data-storage"
  | "frontend";

export interface Skill {
  /** Display name, e.g. "OpenAI", "Next.js", "Vercel". */
  name: string;
  /**
   * Icon identifier. Either a Lucide icon key (string imported from
   * `lucide-react`) or a local SVG slug resolved by the renderer. No
   * proficiency bars, stars, or years-of-experience fields allowed.
   */
  icon: string;
}

export interface SkillCategory {
  slug: SkillCategorySlug;
  /** English label, e.g. "AI & Agents". */
  label: string;
  /** Japanese kanji accent, e.g. "知能". */
  kanji: string;
  skills: Skill[];
}

// -------- About: education timeline --------

export interface EducationEntry {
  institution: string;
  credential: string;
  /** "2023 – Present", "2019", etc. Free-form short string. */
  dateRange: string;
  /** True for the currently-active institution (visually highlighted). */
  current?: boolean;
}

// -------- Socials / Contact --------

export type SocialPlatform = "github" | "linkedin" | "x" | "email";

export interface SocialLink {
  platform: SocialPlatform;
  /** Absolute URL or `mailto:` string. */
  href: string;
  /** Display label, e.g. "GitHub", "LinkedIn". */
  label: string;
}

// -------- Contact submission (transient; not persisted locally) --------

export interface ContactSubmission {
  name: string;     // 1–100 chars
  email: string;    // validated client-side (RFC-lite)
  message: string;  // 1–4000 chars
}

// -------- Personal profile (shared header/footer/metadata copy) --------

export interface PersonalProfile {
  fullName: string;         // "Muhammad Qasim"
  japaneseName: string;     // "ムハンマド・カシム"
  title: string;            // "Agentic AI Engineer"
  tagline: string;          // "Building autonomous systems, one agent at a time"
  location: string;         // "Karachi, Pakistan"
  heroDescription: string;  // long-form hero paragraph
  heroMetrics: string;      // "5 systems shipped · 200+ tests passing · Deployed on cloud"
  aboutBio: string;         // 3–4 sentence bio
  quote: {
    text: string;           // "Surpass your limits. Right here, right now."
    attribution: string;    // "Yami Sukehiro"
  };
  socials: SocialLink[];
  education: EducationEntry[];
  email: string;            // "muhammadqasim0326@gmail.com"
  /** Copyright line, e.g. "© 2026 Muhammad Qasim". */
  copyright: string;
}
```

---

## Module → type mapping

| Module | Exports | Type | Notes |
|--------|---------|------|-------|
| `src/data/personal.ts` | `personal` | `PersonalProfile` | Singleton; consumed by Hero, About, Footer, `layout.tsx` metadata, `llms.txt` generator. |
| `src/data/systems.ts` | `systems` | `System[]` | Exactly 5 entries in Sprint 1. Order = display order. |
| `src/data/skills.ts` | `skillCategories` | `SkillCategory[]` | Exactly 5 categories with lengths `[6, 5, 9, 2, 4]`. |

## Validation rules (enforced at build time)

1. **`systems.length === 5`** — guarded by a type-level helper
   `export const systems: Tuple<System, 5> = [...]` or a unit test.
2. **`skillCategories.map(c => c.skills.length)` equals `[6, 5, 9, 2, 4]`**
   — unit test `skills.shape.test.ts`.
3. **`metrics.length` for every System is between 2 and 4 inclusive** —
   unit test.
4. **`githubUrl` starts with `https://github.com/`** — unit test.
5. **LinkedIn social, when present, uses
   `https://linkedin.com/in/muhammadqasim-dev`** — unit test (matches
   FR-025).
6. **No phone number anywhere in `personal.socials` or `personal.*`**
   — unit test matches `/\+?\d[\d\s\-\(\)]{6,}/` and fails if found
   (FR-025).
7. **Forbidden-content sweep** on stringified content modules as part
   of the CI check described in `research.md` R-008.

---

## Identifier conventions

- Slugs are kebab-case ASCII (`crm-digital-fte`, `personal-ai-employee`,
  `taskflow`, `factory-de-odoo`, `mcp-native-developer-tool`).
- Section DOM ids match URL-friendly names used by the navbar scroll
  anchors: `#home`, `#systems`, `#skills`, `#about`, `#contact`. These
  are NOT types but are referenced by `useScrollSpy` and the Navbar.

## Out of scope for Sprint 1 (will extend these types in Sprint 2)

- `System.architectureSummary`, `System.techDeepDive`, `System.diagram`
  — consumed by `/systems/[slug]` detail page.
- `System.caseStudyMdx` — Sprint 2 brings MDX per system; still no CMS.
- Any analytics/event payload types — Sprint 3.
