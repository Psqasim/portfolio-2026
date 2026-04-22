import type { SkillCategory } from "@/types";

export const skillCategories: SkillCategory[] = [
  {
    slug: "ai-agents",
    label: "AI & Agents",
    kanji: "知能",
    skills: [
      { name: "OpenAI", icon: "openai" },
      { name: "Anthropic Claude", icon: "anthropic" },
      { name: "MCP", icon: "mcp" },
      { name: "LangGraph", icon: "langgraph" },
      { name: "Agent SDK", icon: "agent-sdk" },
      { name: "Hugging Face", icon: "huggingface" },
    ],
  },
  {
    slug: "languages-frameworks",
    label: "Languages & Frameworks",
    kanji: "言語",
    skills: [
      { name: "TypeScript", icon: "typescript" },
      { name: "Python", icon: "python" },
      { name: "Node.js", icon: "nodejs" },
      { name: "FastAPI", icon: "fastapi" },
      { name: "Next.js", icon: "nextjs" },
    ],
  },
  {
    slug: "infrastructure-devops",
    label: "Infrastructure & DevOps",
    kanji: "基盤",
    skills: [
      { name: "Docker", icon: "docker" },
      { name: "Kubernetes", icon: "kubernetes" },
      { name: "GitHub Actions", icon: "github-actions" },
      { name: "Vercel", icon: "vercel" },
      { name: "AWS", icon: "aws" },
      { name: "Cloudflare", icon: "cloudflare" },
      { name: "Nginx", icon: "nginx" },
      { name: "Linux", icon: "linux" },
      { name: "Git", icon: "git" },
    ],
  },
  {
    slug: "data-storage",
    label: "Data & Storage",
    kanji: "情報",
    skills: [
      { name: "PostgreSQL", icon: "postgres" },
      { name: "Redis", icon: "redis" },
    ],
  },
  {
    slug: "frontend",
    label: "Frontend",
    kanji: "画面",
    skills: [
      { name: "React", icon: "react" },
      { name: "Tailwind CSS", icon: "tailwind" },
      { name: "Framer Motion", icon: "framer" },
      { name: "shadcn/ui patterns", icon: "shadcn" },
    ],
  },
];
