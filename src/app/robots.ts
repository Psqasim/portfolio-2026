import type { MetadataRoute } from "next";

const SITE_URL = "https://psqasim-portfolio-2026.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    // sitemap added in Sprint 2 when /systems/[slug] lands.
    host: SITE_URL,
  };
}
