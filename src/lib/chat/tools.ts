import { tool } from "@openai/agents";
import { z } from "zod";
import { systems } from "@/data/systems";
import { skillCategories } from "@/data/skills";
import type { System, SkillCategory } from "@/types";

// Projections trim identity-sensitive / token-bloat fields before the model sees them.
// See data-model.md Entity 4 ("Grounding Sources").

export interface GroundedSystem {
  slug: string;
  name: string;
  status: System["status"];
  tagline: string;
  tech: string[];
  githubUrl?: string;
  liveUrl?: string;
  roleBadge?: string;
  metricsSummary: string;
}

export interface GroundedSkillCategory {
  slug: string;
  label: string;
  skillNames: string[];
}

export function projectSystems(source: System[]): GroundedSystem[] {
  return source.map((s) => {
    const summary = s.metrics.map((m) => `${m.label}: ${m.value}`).join(", ");
    const projected: GroundedSystem = {
      slug: s.slug,
      name: s.name,
      status: s.status,
      tagline: s.tagline,
      tech: s.tech,
      metricsSummary: summary,
    };
    if (s.githubUrl) projected.githubUrl = s.githubUrl;
    if (s.liveUrl) projected.liveUrl = s.liveUrl;
    if (s.roleBadge) projected.roleBadge = s.roleBadge;
    return projected;
  });
}

export function projectSkills(
  source: SkillCategory[],
): GroundedSkillCategory[] {
  return source.map((c) => ({
    slug: c.slug,
    label: c.label,
    skillNames: c.skills.map((s) => s.name),
  }));
}

export const getSystemsTool = tool({
  name: "getSystems",
  description:
    "Returns the full list of systems Qasim has shipped or is actively building, with status, tagline, tech stack, and links. Call this whenever the user asks about Qasim's projects, work, or what he has built.",
  parameters: z.object({}),
  execute: async () => projectSystems(systems),
});

export const getSkillsTool = tool({
  name: "getSkills",
  description:
    "Returns the full list of Qasim's technical skills grouped by category (AI & Agents, Languages & Frameworks, Infrastructure & DevOps, Data & Storage, Frontend). Call this whenever the user asks about Qasim's tech stack or skills.",
  parameters: z.object({}),
  execute: async () => projectSkills(skillCategories),
});
