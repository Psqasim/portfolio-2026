#!/usr/bin/env node
// Fail the build when the homepage's First Load JS exceeds the agreed budget.
//
// Sprint 1 baseline: ~137 KB. SC-006 reserves +25 KB for the chat widget,
// so the post-Sprint-2 budget is 162 KB. The widget's heavy bundle is
// behind next/dynamic({ ssr: false }), so this number should NOT actually
// move much in practice — this script is a tripwire if someone accidentally
// imports the panel eagerly.
//
// Implementation note: Next.js 15 writes app-build-manifest.json with
// unhashed logical paths (e.g., "static/chunks/main-app.js") but emits
// content-hashed files on disk (e.g., "main-app-1632b0283ab0fbe1.js").
// We resolve each manifest entry by exact match first, then by the
// "<basename>-<hex>.<ext>" sibling pattern.

import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");
const nextDir = resolve(repoRoot, ".next");
const manifestPath = join(nextDir, "app-build-manifest.json");

const BUDGET_KB = 162;

function fail(msg) {
  console.error(`[bundle] ${msg}`);
  process.exit(1);
}

function resolveChunk(rel) {
  const direct = join(nextDir, rel);
  try {
    statSync(direct);
    return direct;
  } catch {
    /* fall through to hashed lookup */
  }

  const dir = dirname(direct);
  const base = rel.split("/").pop();
  const ext = extname(base);
  const stem = base.slice(0, -ext.length);
  // Match "<stem>-<hex>.<ext>" — hex anchored to avoid prefix collisions
  // (e.g., "main.js" must not pick up "main-app-<hash>.js").
  const pattern = new RegExp(`^${stem.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}-[0-9a-f]+${ext.replace(".", "\\.")}$`);

  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return null;
  }
  const matches = entries.filter((name) => pattern.test(name));
  if (matches.length === 0) return null;
  if (matches.length > 1) {
    console.warn(
      `[bundle] warning: ${matches.length} hashed candidates for ${rel}; using ${matches[0]}`,
    );
  }
  return join(dir, matches[0]);
}

let manifest;
try {
  manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
} catch {
  fail(`could not read ${manifestPath} — run \`pnpm build\` first.`);
}

// Refuse to run against a dev build — sizes are meaningless and chunks
// are unhashed. `next dev` writes lowPriorityFiles paths under
// "static/development/", whereas `next build` uses a hashed prefix.
try {
  const buildManifest = JSON.parse(
    readFileSync(join(nextDir, "build-manifest.json"), "utf8"),
  );
  const isDev = (buildManifest.lowPriorityFiles ?? []).some((p) =>
    p.startsWith("static/development/"),
  );
  if (isDev) {
    fail("`.next/` is from `pnpm dev`, not `pnpm build`. Run a production build first.");
  }
} catch (err) {
  if (err && err.message && err.message.startsWith("[bundle]")) throw err;
  // build-manifest.json missing is a separate problem — let the next read fail.
}

const homepageEntry =
  manifest.pages?.["/page"] ?? manifest.pages?.["/"] ?? null;

if (!homepageEntry || !Array.isArray(homepageEntry)) {
  fail("homepage entry missing from app-build-manifest.json (looked for '/page' and '/').");
}

let totalGzipped = 0;
const missing = [];
const resolved = [];

for (const rel of homepageEntry) {
  const filePath = resolveChunk(rel);
  if (!filePath) {
    missing.push(rel);
    continue;
  }
  const buf = readFileSync(filePath);
  totalGzipped += gzipSync(buf).length;
  resolved.push(filePath.slice(nextDir.length + 1));
}

const totalKB = totalGzipped / 1024;
const budgetBytes = BUDGET_KB * 1024;

if (missing.length > 0) {
  fail(
    `could not resolve ${missing.length} chunk(s) from manifest: ${missing.join(", ")}`,
  );
}

console.log(
  `[bundle] homepage First Load JS: ${totalKB.toFixed(1)} KB gzipped (${resolved.length} chunks)`,
);
for (const r of resolved) {
  console.log(`  - ${r}`);
}

if (totalGzipped > budgetBytes) {
  fail(
    `homepage exceeds ${BUDGET_KB} KB budget: ${totalKB.toFixed(1)} KB > ${BUDGET_KB} KB`,
  );
}

console.log(`[bundle] within budget (${BUDGET_KB} KB).`);
