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
    liveUrl: "https://crm-digital-fte-two.vercel.app/",
    image: "/projects/crm-digital-fte.png",
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
    liveUrl: "http://129.151.151.212:3000/dashboard",
    image: "/projects/personal-ai-employee.png",
  },
  {
    slug: "physical-ai-textbook",
    name: "Physical AI Humanoid Textbook",
    status: "SHIPPED",
    tagline: "Interactive AI Education Platform",
    metrics: [
      { label: "Type", value: "Textbook" },
      { label: "Platform", value: "Docusaurus" },
      { label: "Status", value: "Published" },
    ],
    tech: ["Docusaurus", "TypeScript", "GitHub Pages", "MDX"],
    githubUrl: "https://github.com/Psqasim/physical-ai-humanoid-textbook",
    liveUrl: "https://psqasim.github.io/physical-ai-humanoid-textbook/",
    image: "/projects/physical-ai-textbook.png",
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
    liveUrl: "https://hackathon-todo-orcin.vercel.app/",
    image: "/projects/taskflow.png",
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
    githubUrl: "https://github.com/Inshal5Rauf1/Odoo-Development-Automation",
    image: "/projects/factory-de-odoo.png",
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

export interface EarlierProject {
  name: string;
  description: string;
  tech: string[];
  category: string;
  status: "Completed" | "In Progress";
  github?: string;
  liveUrl?: string;
  privateRepo?: boolean;
  image?: string;
}

export const earlierWork: EarlierProject[] = [
  {
    name: "E-commerce FullStack Platform",
    description:
      "Advanced full-stack e-commerce with admin dashboard, order tracking, Clerk auth, and SendGrid email confirmations.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Sanity", "Clerk", "SendGrid"],
    category: "E-Commerce",
    status: "Completed",
    privateRepo: true,
    liveUrl: "https://e-commerce-fullstack-website.vercel.app",
    image: "/projects/ecommerce-fullstack.png",
  },
  {
    name: "Chicken E-commerce Website",
    description:
      "Dynamic e-commerce platform with admin panel for managing products, orders, analytics, and customer DMs.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Sanity", "Clerk", "SendGrid"],
    category: "E-Commerce",
    status: "Completed",
    privateRepo: true,
    liveUrl: "https://chicken-website-two.vercel.app",
    image: "/projects/chicken-ecommerce.png",
  },
  {
    name: "Dynamic Blog Platform",
    description:
      "Modern responsive blog with seamless content creation and management via headless CMS.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Sanity"],
    category: "Blog/CMS",
    status: "Completed",
    github: "https://github.com/Psqasim/Blog-Website",
    liveUrl: "https://blog-website-psqasim.vercel.app",
    image: "/projects/blog-platform.png",
  },
  {
    name: "Hackathon E-commerce Website",
    description:
      "Responsive online store designed from Figma prototype with dynamic product management.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Sanity", "Clerk", "Figma"],
    category: "E-Commerce",
    status: "Completed",
    github: "https://github.com/Psqasim/hackathon-figma",
    liveUrl: "https://hackathon-figma-ecommmerce-psqasim.vercel.app",
    image: "/projects/hackathon-ecommerce.png",
  },
];
