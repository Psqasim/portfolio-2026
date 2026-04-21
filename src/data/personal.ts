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

  // TODO: US3 — socials populated in T059 (LinkedIn URL fixed per FR-025).
  socials: [],

  // TODO: US3 — education populated in T058.
  education: [],

  email: "muhammadqasim0326@gmail.com",
  copyright: "© 2026 Muhammad Qasim",
};
