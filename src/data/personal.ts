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
  heroMetrics: "5 systems shipped · 200+ tests passing · Deployed on cloud",

  // TODO: US3 — about bio populated in T057.
  aboutBio: "",

  // TODO: US4 — quote populated in T068.
  quote: {
    text: "",
    attribution: "",
  },

  socials: [
    { platform: "github", href: "https://github.com/Psqasim", label: "GitHub" },
    {
      platform: "linkedin",
      href: "https://linkedin.com/in/muhammadqasim-dev",
      label: "LinkedIn",
    },
    { platform: "x", href: "#", label: "X" },
    { platform: "email", href: "mailto:muhammadqasim0326@gmail.com", label: "Email" },
  ],

  // TODO: US3 — education populated in T058.
  education: [],

  email: "muhammadqasim0326@gmail.com",
  copyright: "© 2026 Muhammad Qasim",
};
