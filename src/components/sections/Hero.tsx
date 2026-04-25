"use client";

import Link from "next/link";
import { Download } from "lucide-react";
import { personal } from "@/data/personal";
import { CircuitGrid } from "@/components/ui/CircuitGrid";
import { TerminalCard } from "@/components/ui/TerminalCard";
import { smoothScrollTo } from "@/lib/scroll";

export function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      <CircuitGrid />

      <div className="relative mx-auto w-full max-w-6xl px-6 md:px-10 py-24 grid gap-12 md:grid-cols-2 md:items-center">
        <div className="space-y-6">
          <p className="font-[var(--font-mono)] text-sm text-[var(--color-accent-cyan)] uppercase tracking-wider">
            {personal.japaneseName}
          </p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
            {personal.fullName}
          </h1>
          <p className="text-xl md:text-2xl text-[var(--color-accent-pink)] font-semibold">
            {personal.title}
          </p>
          <p className="text-base md:text-lg text-[var(--color-text-muted)] max-w-xl">
            {personal.heroDescription}
          </p>
          <p className="font-[var(--font-mono)] text-sm text-[var(--color-text-muted)]">
            {personal.heroMetrics}
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="#systems"
              onClick={(e) => {
                e.preventDefault();
                smoothScrollTo("#systems");
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent-pink)] px-5 py-3 text-sm font-semibold text-[#0a0e1a] shadow-[0_0_24px_-6px_var(--color-accent-pink)] transition-transform hover:scale-[1.02]"
            >
              View My Work ↓
            </Link>
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new CustomEvent("chat:open"));
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-accent-purple)] px-5 py-3 text-sm font-semibold text-[var(--color-text)] transition-colors hover:bg-[var(--color-accent-purple)]/10 hover:text-[var(--color-accent-purple)]"
            >
              Ask My AI Agent
            </button>
            <a
              href="/muhammad-qasim-cv-2026.pdf"
              download
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-accent-cyan)]/60 px-5 py-3 text-sm font-semibold text-[var(--color-text)] transition-colors hover:bg-[var(--color-accent-cyan)]/10 hover:text-[var(--color-accent-cyan)]"
            >
              <Download className="h-4 w-4" aria-hidden />
              Download CV
            </a>
          </div>
        </div>

        <div className="relative">
          <TerminalCard />
        </div>
      </div>
    </section>
  );
}
