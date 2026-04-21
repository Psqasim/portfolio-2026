// Systems (shipped projects shown in the Systems grid)

export type SystemStatus = "LIVE" | "SHIPPED" | "ACTIVE" | "APPLIED";

export interface SystemMetric {
  label: string;
  value: string;
}

export interface System {
  slug: string;
  name: string;
  status: SystemStatus;
  tagline: string;
  roleBadge?: string;
  metrics: SystemMetric[];
  tech: string[];
  githubUrl: string;
  liveUrl?: string;
}

// Skills (grouped icon grid)

export type SkillCategorySlug =
  | "ai-agents"
  | "languages-frameworks"
  | "infrastructure-devops"
  | "data-storage"
  | "frontend";

export interface Skill {
  name: string;
  icon: string;
}

export interface SkillCategory {
  slug: SkillCategorySlug;
  label: string;
  kanji: string;
  skills: Skill[];
}

// About — education timeline

export interface EducationEntry {
  institution: string;
  credential: string;
  dateRange: string;
  current?: boolean;
}

// Socials / Contact

export type SocialPlatform = "github" | "linkedin" | "x" | "email";

export interface SocialLink {
  platform: SocialPlatform;
  href: string;
  label: string;
}

// Contact submission (transient, not persisted)

export interface ContactSubmission {
  name: string;
  email: string;
  message: string;
}

// Personal profile

export interface PersonalProfile {
  fullName: string;
  japaneseName: string;
  title: string;
  tagline: string;
  location: string;
  heroDescription: string;
  heroMetrics: string;
  aboutBio: string;
  quote: {
    text: string;
    attribution: string;
  };
  socials: SocialLink[];
  education: EducationEntry[];
  email: string;
  copyright: string;
}
