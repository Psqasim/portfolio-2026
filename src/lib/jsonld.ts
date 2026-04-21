import type { PersonalProfile } from "@/types";

const SITE_URL = "https://psqasim-portfolio-2026.vercel.app";

export function personSchema(profile: PersonalProfile): Record<string, unknown> {
  const github = profile.socials.find((s) => s.platform === "github")?.href;
  const linkedin = profile.socials.find((s) => s.platform === "linkedin")?.href;
  const sameAs = [github, linkedin].filter(
    (s): s is string => typeof s === "string" && s.length > 0,
  );

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.fullName,
    alternateName: profile.japaneseName,
    url: SITE_URL,
    image: `${SITE_URL}/og-image.png`,
    jobTitle: profile.title,
    description: profile.heroDescription,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Karachi",
      addressCountry: "PK",
    },
    email: `mailto:${profile.email}`,
    sameAs,
    alumniOf: profile.education.map((e) => ({
      "@type": "EducationalOrganization",
      name: e.institution,
    })),
  };
}
