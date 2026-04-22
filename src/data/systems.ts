import type { System } from "@/types";

export const systems: System[] = [
  {
    slug: "crm-digital-fte",
    name: "CRM Digital FTE",
    status: "SHIPPED",
    tagline:
      "Autonomous agent handling support tickets across Gmail, WhatsApp, and Web — with cross-channel identity resolution.",
    metrics: [
      { label: "tests", value: "101" },
      { label: "MCP tools", value: "7" },
      { label: "agent skills", value: "5" },
      { label: "channels", value: "3" },
    ],
    tech: [
      "Python",
      "FastAPI",
      "FastMCP",
      "OpenAI Agents SDK",
      "Next.js",
      "NextAuth.js",
    ],
    githubUrl: "https://github.com/Psqasim/crm-digital-fte",
    liveUrl: "https://crm-digital-fte-two.vercel.app",
  },
  {
    slug: "personal-ai-employee",
    name: "Personal AI Employee",
    status: "LIVE",
    tagline:
      "24/7 task execution with Claude Code + Obsidian. WhatsApp auto-reply, natural language commands, Odoo accounting integration.",
    metrics: [
      { label: "commits", value: "122" },
      { label: "test coverage", value: "97%" },
      { label: "agent skills", value: "7" },
      { label: "MCP servers", value: "5" },
    ],
    tech: [
      "Claude Code",
      "MCP",
      "A2A Protocol",
      "PM2",
      "Oracle Cloud",
      "WhatsApp (Baileys)",
    ],
    githubUrl: "https://github.com/Psqasim/personal-ai-employee",
  },
  {
    slug: "taskflow",
    name: "TaskFlow",
    status: "SHIPPED",
    tagline:
      "5-phase evolution from console app to Kubernetes-deployed system with event-driven architecture.",
    metrics: [
      { label: "evolution phases", value: "5" },
      { label: "architecture", value: "K8s" },
      { label: "pattern", value: "Event-Driven" },
    ],
    tech: [
      "Next.js",
      "FastAPI",
      "Kafka",
      "Dapr",
      "OpenAI Agents SDK",
      "Oracle Cloud OKE",
      "Kubernetes",
    ],
    githubUrl: "https://github.com/Psqasim/hackathon-todo",
  },
  {
    slug: "factory-de-odoo",
    name: "Factory-de-Odoo",
    status: "ACTIVE",
    tagline:
      "Architecture reviewer for a 33,200+ line GSD orchestration framework generating full Odoo ERPs from a PRD.",
    roleBadge: "Architecture Advisor",
    metrics: [
      { label: "lines of code", value: "33,200+" },
      { label: "AI agents", value: "28" },
      { label: "templates", value: "60" },
      { label: "tests", value: "4,093+" },
    ],
    tech: ["Python", "Jinja2", "AI Agents", "Odoo"],
    githubUrl: "https://github.com/TIFAQM/Factory-de-Odoo",
  },
  {
    slug: "mcp-native-developer-tool",
    name: "MCP-Native Developer Tool",
    status: "APPLIED",
    tagline:
      "Multi-MCP orchestration for automated PR reviews, test generation, and project scaffolding — extending Claude Code.",
    metrics: [
      { label: "status", value: "Proposed" },
      { label: "scope", value: "Multi-MCP" },
    ],
    tech: ["Claude Code", "MCP", "TypeScript"],
  },
];
