import { Agent } from "@openai/agents";
import { SYSTEM_PROMPT } from "./system-prompt";
import { getSystemsTool, getSkillsTool } from "./tools";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error(
    "OPENAI_API_KEY is not set. Add it to .env.local (server-only — never NEXT_PUBLIC_).",
  );
}

export const chatAgent = new Agent({
  name: "Qasim Portfolio Assistant",
  model: "gpt-4o-mini",
  instructions: SYSTEM_PROMPT,
  tools: [getSystemsTool, getSkillsTool],
});
