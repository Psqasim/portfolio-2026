import type { PersonalProfile } from "@/types";

export const personal: PersonalProfile = {
  // TODO: US1 — hero fields populated in T031.
  fullName: "Muhammad Qasim",
  japaneseName: "ムハンマド・カシム",
  title: "Agentic AI Engineer",
  tagline: "Building autonomous systems, one agent at a time",
  location: "Karachi, Pakistan",
  heroDescription:
    "I build autonomous AI systems that run 24/7 — MCP servers, multi-agent orchestration, and production-grade agent workflows.",
  heroMetrics: "6 systems shipped · 200+ tests passing · Deployed on cloud",

  aboutBio:
    "Software developer based in Karachi, Pakistan. Working professional by day, agentic AI systems builder around the clock. Currently enrolled in GIAIC, where I've shipped 5 production-grade AI systems through their hackathon program — from autonomous agents to MCP servers to cloud-native orchestration. I don't explore technologies. I ship them.",

  quote: {
    text: "Surpass your limits. Right here, right now.",
    attribution: "Yami Sukehiro",
  },

  socials: [
    { platform: "github", href: "https://github.com/Psqasim", label: "GitHub" },
    {
      platform: "linkedin",
      href: "https://linkedin.com/in/muhammadqasim-dev",
      label: "LinkedIn",
    },
    { platform: "x", href: "https://x.com/psqasim0", label: "X" },
    { platform: "email", href: "mailto:muhammadqasim0326@gmail.com", label: "Email" },
  ],

  education: [
    {
      institution: "GIAIC",
      credential:
        "Certified AI, Metaverse & Web 3.0 Developer & Solopreneur (WMD)",
      dateRange: "2023 – Present",
      current: true,
    },
    {
      institution: "Govt Islamia Science College",
      credential: "Intermediate",
      dateRange: "2019",
    },
    {
      institution: "Bahria Model School",
      credential: "Matriculation",
      dateRange: "2017",
    },
  ],

  email: "muhammadqasim0326@gmail.com",
  copyright: "© 2026 Muhammad Qasim",
};
