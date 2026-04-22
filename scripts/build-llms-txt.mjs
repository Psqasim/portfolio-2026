#!/usr/bin/env node
// Emit public/llms.txt from the typed data modules. Run via `tsx scripts/build-llms-txt.mjs`.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");

const personalMod = await import(
  pathToFileURL(resolve(repoRoot, "src/data/personal.ts")).href
);
const systemsMod = await import(
  pathToFileURL(resolve(repoRoot, "src/data/systems.ts")).href
);
const { personal } = personalMod;
const { systems } = systemsMod;

const header = [
  `# ${personal.fullName} — ${personal.title}`,
  "",
  `${personal.location}. ${personal.heroDescription}`,
  "",
  "## About",
  "",
  personal.aboutBio,
  "",
  "## Shipped systems",
  "",
];

const systemLines = systems.map(
  (s) =>
    `- ${s.name}${s.roleBadge ? ` (${s.roleBadge})` : ""} — ${s.tagline}\n  ${s.githubUrl}`,
);

const contact = [
  "",
  "## Contact",
  "",
  `Email: ${personal.email}`,
  ...personal.socials
    .filter((s) => s.href !== "#" && s.platform !== "email")
    .map((s) => `${s.label}: ${s.href}`),
  "",
];

const body = [...header, ...systemLines, ...contact].join("\n");

const outPath = resolve(repoRoot, "public/llms.txt");
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, body, "utf8");

console.log(`[build-llms-txt] wrote ${outPath} (${body.length} bytes)`);
