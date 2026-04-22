#!/usr/bin/env node
// Fail the build if any forbidden term appears in built output or typed data.
// Constitution Principle I — identity rules.

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");

const PATTERNS = [
  "junior developer",
  "aspiring",
  "learning",
  "exploring",
  "frontend developer",
];

const SEARCH_EXTENSIONS = new Set([
  ".html",
  ".htm",
  ".js",
  ".mjs",
  ".css",
  ".json",
  ".txt",
  ".ts",
  ".tsx",
  ".md",
]);

const SKIP_DIRS = new Set(["node_modules", ".git"]);

function* walk(root) {
  if (!existsSync(root)) return;
  const stack = [root];
  while (stack.length) {
    const current = stack.pop();
    const info = statSync(current);
    if (info.isDirectory()) {
      for (const entry of readdirSync(current)) {
        if (SKIP_DIRS.has(entry)) continue;
        stack.push(join(current, entry));
      }
    } else if (info.isFile()) {
      yield current;
    }
  }
}

function shouldScan(filePath) {
  return SEARCH_EXTENSIONS.has(extname(filePath));
}

function findMatches(text, patterns) {
  const hay = text.toLowerCase();
  const hits = [];
  for (const pattern of patterns) {
    const idx = hay.indexOf(pattern.toLowerCase());
    if (idx !== -1) hits.push({ pattern, index: idx });
  }
  return hits;
}

const roots = [
  resolve(repoRoot, ".next"),
  resolve(repoRoot, "public"),
  resolve(repoRoot, "src/data"),
];

let failures = 0;
for (const root of roots) {
  for (const filePath of walk(root)) {
    if (!shouldScan(filePath)) continue;
    const text = readFileSync(filePath, "utf8");
    const hits = findMatches(text, PATTERNS);
    for (const h of hits) {
      failures++;
      const rel = filePath.replace(repoRoot + "/", "");
      console.error(`[forbidden] ${rel}: matched "${h.pattern}" at offset ${h.index}`);
    }
  }
}

if (failures > 0) {
  console.error(`\n[forbidden] ${failures} match${failures === 1 ? "" : "es"} found.`);
  process.exit(1);
}

console.log(
  `[forbidden] clean — scanned ${roots.length} roots for ${PATTERNS.length} terms.`,
);
