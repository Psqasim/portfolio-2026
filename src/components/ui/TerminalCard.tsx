"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

const LOG_LINES = [
  { tag: "Agent", text: "Incoming ticket via WhatsApp..." },
  { tag: "SkillsInvoker", text: "Routing to TroubleshootSkill..." },
  { tag: "MCP", text: "Querying knowledge base..." },
  { tag: "Agent", text: "Response sent. Resolution time: 4.2s" },
] as const;

const CHAR_MS = 25;
const LINE_GAP_MS = 400;

export function TerminalCard() {
  const prefersReduced = useReducedMotion();
  const [lines, setLines] = useState<string[]>(
    prefersReduced ? LOG_LINES.map(formatLine) : [],
  );

  useEffect(() => {
    if (prefersReduced) {
      setLines(LOG_LINES.map(formatLine));
      return;
    }

    let cancelled = false;
    setLines([]);

    async function play() {
      for (let i = 0; i < LOG_LINES.length; i++) {
        const entry = LOG_LINES[i];
        if (!entry) break;
        const full = formatLine(entry);
        for (let c = 1; c <= full.length; c++) {
          if (cancelled) return;
          await new Promise((r) => setTimeout(r, CHAR_MS));
          setLines((prev) => {
            const next = [...prev];
            next[i] = full.slice(0, c);
            return next;
          });
        }
        if (cancelled) return;
        await new Promise((r) => setTimeout(r, LINE_GAP_MS));
      }
    }

    play();
    return () => {
      cancelled = true;
    };
  }, [prefersReduced]);

  return (
    <div className="rounded-xl border border-[#1e293b] bg-[#0a0e1a] p-5 font-[var(--font-mono)] text-sm text-[#e2e8f0] shadow-xl">
      <div className="mb-3 flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-red-400/70" />
        <span className="h-3 w-3 rounded-full bg-yellow-400/70" />
        <span className="h-3 w-3 rounded-full bg-green-400/70" />
        <span className="ml-3 text-xs text-slate-500">agent.log</span>
      </div>
      <div className="space-y-2 min-h-[120px]">
        {LOG_LINES.map((entry, i) => (
          <div key={i} className="text-slate-200">
            <span className="text-[#22d3ee]">▸ </span>
            {lines[i] ?? ""}
            {!prefersReduced && i === lines.length - 1 && lines[i] ? (
              <span className="ml-0.5 inline-block w-2 animate-pulse bg-[#22d3ee]">
                &nbsp;
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function formatLine(entry: { tag: string; text: string }): string {
  return `[${entry.tag}] ${entry.text}`;
}
