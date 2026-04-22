import type { SkillCategory } from "@/types";

export const skillCategories: SkillCategory[] = [
  {
    slug: "ai-agents",
    label: "AI & Agents",
    kanji: "知能",
    skills: [
      { name: "OpenAI Agents SDK", icon: "openai-agents" },
      { name: "Claude Code", icon: "claude-code" },
      { name: "MCP (Model Context Protocol)", icon: "mcp" },
      { name: "FastMCP", icon: "fastmcp" },
      { name: "Prompt Engineering", icon: "prompt" },
      { name: "A2A Protocol", icon: "a2a" },
    ],
  },
  {
    slug: "languages-frameworks",
    label: "Languages & Frameworks",
    kanji: "言語",
    skills: [
      { name: "Python", icon: "python" },
      { name: "TypeScript", icon: "typescript" },
      { name: "Next.js", icon: "nextjs" },
      { name: "FastAPI", icon: "fastapi" },
      { name: "Node.js", icon: "nodejs" },
    ],
  },
  {
    slug: "infrastructure-devops",
    label: "Infrastructure & DevOps",
    kanji: "基盤",
    skills: [
      { name: "Docker", icon: "docker" },
      { name: "Kubernetes", icon: "kubernetes" },
      { name: "Dapr", icon: "dapr" },
      { name: "Kafka", icon: "kafka" },
      { name: "Oracle Cloud", icon: "oracle-cloud" },
      { name: "Hugging Face Spaces", icon: "huggingface" },
      { name: "Vercel", icon: "vercel" },
      { name: "PM2", icon: "pm2" },
      { name: "WSL2", icon: "wsl" },
    ],
  },
  {
    slug: "data-storage",
    label: "Data & Storage",
    kanji: "情報",
    skills: [
      { name: "Neon PostgreSQL", icon: "neon" },
      { name: "Confluent Kafka", icon: "confluent" },
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
      { name: "NextAuth.js", icon: "nextauth" },
    ],
  },
];
