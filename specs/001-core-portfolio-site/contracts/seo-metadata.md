# Contract: SEO — `metadata`, OpenGraph, and JSON-LD

**Referenced by**: FR-035, FR-036, SC-002, SC-008.

All SEO surfaces are declared in `src/app/layout.tsx` and inherit down the
route tree. No per-page overrides are needed in Sprint 1 (single page).

## `export const metadata: Metadata`

(Verified against `/vercel/next.js/v15.1.8` docs via Context7.)

```ts
export const metadata: Metadata = {
  metadataBase: new URL("https://psqasim-portfolio-2026.vercel.app"),
  title: {
    default: "Muhammad Qasim — Agentic AI Engineer",
    template: "%s · Muhammad Qasim",
  },
  description:
    "Agentic AI Engineer in Karachi, Pakistan. Builds autonomous AI systems that run 24/7 — MCP servers, multi-agent orchestration, and production-grade agent workflows.",
  applicationName: "Muhammad Qasim — Portfolio",
  authors: [{ name: "Muhammad Qasim" }],
  keywords: [
    "Agentic AI Engineer",
    "AI systems",
    "MCP servers",
    "multi-agent orchestration",
    "Muhammad Qasim",
    "Karachi",
  ],
  openGraph: {
    type: "website",
    url: "https://psqasim-portfolio-2026.vercel.app",
    title: "Muhammad Qasim — Agentic AI Engineer",
    description:
      "Autonomous AI systems that run 24/7. 5 shipped systems, 200+ tests passing, deployed on cloud.",
    siteName: "Muhammad Qasim — Portfolio",
    images: [
      {
        url: "/og-image.png", // 1200×630
        width: 1200,
        height: 630,
        alt: "Muhammad Qasim — Agentic AI Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Qasim — Agentic AI Engineer",
    description:
      "Autonomous AI systems that run 24/7. 5 shipped, 200+ tests, deployed on cloud.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};
```

## JSON-LD Person schema

Rendered as a `<script type="application/ld+json">` child of `<body>` in
`layout.tsx` so SSG inlines it at build time. Shape:

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Muhammad Qasim",
  "alternateName": "ムハンマド・カシム",
  "url": "https://psqasim-portfolio-2026.vercel.app",
  "image": "https://psqasim-portfolio-2026.vercel.app/og-image.png",
  "jobTitle": "Agentic AI Engineer",
  "description": "Builds autonomous AI systems that run 24/7 — MCP servers, multi-agent orchestration, and production-grade agent workflows.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Karachi",
    "addressCountry": "PK"
  },
  "email": "mailto:muhammadqasim0326@gmail.com",
  "sameAs": [
    "https://github.com/Psqasim",
    "https://linkedin.com/in/muhammadqasim-dev"
  ],
  "alumniOf": [
    {
      "@type": "EducationalOrganization",
      "name": "GIAIC"
    }
  ]
}
```

Generation: `src/lib/jsonld.ts` exports `personSchema(profile: PersonalProfile)`
which returns the object; the component serializes with `JSON.stringify`
and escapes `</script>` per React's normal text escaping rules.

## OG image

- Authored at `public/og-image.png` (1200×630, ≤ 300 KB).
- Must render the text "Muhammad Qasim" + "Agentic AI Engineer" + the
  dark-navy + sakura / purple / cyan token palette.
- MUST NOT contain any forbidden-content strings (rendered as raster —
  included in the pre-deploy `npx exiftool` + OCR sweep if that becomes
  necessary; for Sprint 1, author review is acceptable).

## `robots.ts`

```ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://psqasim-portfolio-2026.vercel.app/sitemap.xml",
    host: "https://psqasim-portfolio-2026.vercel.app",
  };
}
```

Sitemap is NOT required for Sprint 1 (single-page site), but if added for
Sprint 2's `/systems/[slug]` it would live at `src/app/sitemap.ts`.

## Forbidden-content enforcement

The post-build script from research.md R-008 greps the rendered HTML,
including the inlined JSON-LD block and every `<meta>` tag, for the
forbidden set. A match fails the build before Vercel promote.
