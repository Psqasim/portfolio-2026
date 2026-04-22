import type { System } from "@/types";

export const systems: System[] = [
  {
    slug: "crm-digital-fte",
    name: "CRM Digital FTE",
    status: "LIVE",
    tagline:
      "Autonomous customer-support agent handling WhatsApp tickets end-to-end, 24/7.",
    metrics: [
      { label: "tickets resolved", value: "1.2k+" },
      { label: "avg response", value: "4.2s" },
      { label: "tests", value: "62" },
    ],
    tech: ["Python", "OpenAI", "MCP", "Twilio", "Postgres", "Docker"],
    githubUrl: "https://github.com/Psqasim/crm-digital-fte",
    liveUrl: "https://crm-digital-fte.vercel.app",
  },
  {
    slug: "personal-ai-employee",
    name: "Personal AI Employee",
    status: "SHIPPED",
    tagline:
      "Private multi-skill agent that triages email, runs research, and drafts replies.",
    metrics: [
      { label: "skills", value: "8" },
      { label: "tests", value: "41" },
      { label: "daily runs", value: "200+" },
    ],
    tech: ["TypeScript", "OpenAI", "MCP", "Cloudflare Workers"],
    githubUrl: "https://github.com/Psqasim/personal-ai-employee",
  },
  {
    slug: "taskflow",
    name: "TaskFlow",
    status: "SHIPPED",
    tagline:
      "Agent-orchestrated task pipeline — ingest, plan, execute, report.",
    metrics: [
      { label: "pipelines", value: "30+" },
      { label: "tests", value: "54" },
      { label: "uptime", value: "99.8%" },
    ],
    tech: ["Python", "FastAPI", "Celery", "Redis", "OpenAI"],
    githubUrl: "https://github.com/Psqasim/taskflow",
    liveUrl: "https://taskflow-demo.vercel.app",
  },
  {
    slug: "factory-de-odoo",
    name: "Factory-de-Odoo",
    status: "ACTIVE",
    tagline:
      "Multi-agent Odoo automation for manufacturing — inventory, orders, QA.",
    roleBadge: "Architecture Advisor",
    metrics: [
      { label: "agents", value: "6" },
      { label: "integrations", value: "4" },
      { label: "tests", value: "38" },
    ],
    tech: ["Python", "Odoo", "LangGraph", "Postgres"],
    githubUrl: "https://github.com/Psqasim/factory-de-odoo",
  },
  {
    slug: "mcp-native-developer-tool",
    name: "MCP-Native Developer Tool",
    status: "APPLIED",
    tagline:
      "Dev-loop accelerator built as first-class MCP server — Cerebral Valley entry.",
    metrics: [
      { label: "tools", value: "12" },
      { label: "tests", value: "27" },
    ],
    tech: ["TypeScript", "MCP", "Node", "Zod"],
    githubUrl: "https://github.com/Psqasim/mcp-native-developer-tool",
  },
];
