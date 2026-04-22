# Contract: `/llms.txt`

**Path**: `public/llms.txt` → served at `https://<domain>/llms.txt`
**Format**: plain text, UTF-8, no frontmatter.
**Referenced by**: FR-035, FR-036, SC-008.
**Audience**: AI crawlers (ChatGPT Search, Perplexity, Claude Search, etc.)
looking for a machine-readable introduction to the site.

## Shape (authoritative — match exactly)

```text
# Muhammad Qasim — Agentic AI Engineer

Karachi, Pakistan. Builds autonomous AI systems that run 24/7: MCP servers,
multi-agent orchestration, and production-grade agent workflows.

## About

Agentic AI Engineer. Shipped 5 production systems through GIAIC's hackathon
program — from autonomous agents to MCP servers to cloud-native orchestration.

## Shipped systems

- CRM Digital FTE — autonomous customer-support agent on WhatsApp.
  https://github.com/Psqasim/<slug>
- Personal AI Employee — long-running agent that manages inbox + calendar.
  https://github.com/Psqasim/<slug>
- TaskFlow — multi-agent orchestration for task pipelines.
  https://github.com/Psqasim/<slug>
- Factory-de-Odoo — Odoo ERP × agentic workflows (Architecture Advisor).
  https://github.com/Psqasim/<slug>
- MCP-Native Developer Tool — dev surface built on the Model Context
  Protocol.  https://github.com/Psqasim/<slug>

## Contact

Email: muhammadqasim0326@gmail.com
LinkedIn: https://linkedin.com/in/muhammadqasim-dev
GitHub: https://github.com/Psqasim
```

## Generation

- Authored by hand initially.
- Regenerated at build time via `scripts/build-llms-txt.mjs`, which imports
  `src/data/personal.ts` and `src/data/systems.ts` and serializes the above
  template. Script runs from `package.json` script `prebuild`.
- Output file committed to `public/llms.txt` so Vercel serves it directly
  as a static asset with no Node runtime involvement.

## Forbidden-content rules (Constitution Principle I)

- MUST NOT reference any employer, military, navy, government,
  department, rank, or title.
- MUST NOT use the words "junior", "aspiring", "learning", "exploring".
- MUST identify the subject as "Agentic AI Engineer" and NOT
  "Frontend Developer".
- Enforced by the forbidden-content check (research.md R-008) which
  sweeps `public/llms.txt` as part of the post-build gate.

## Cache / discovery

- `Cache-Control: public, max-age=3600, immutable` (Vercel default for
  `public/`).
- Referenced from `robots.ts` via a commented pointer so crawlers that
  read robots.txt can find it.
