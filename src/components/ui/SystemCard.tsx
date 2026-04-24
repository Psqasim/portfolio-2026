import Image from "next/image";
import { Github, ExternalLink, Network } from "lucide-react";
import type { System } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { GlowCard } from "@/components/ui/GlowCard";

export function SystemCard({ system }: { system: System }) {
  return (
    <GlowCard data-testid="system-card" className="flex flex-col gap-4 overflow-hidden">
      {system.image ? (
        <div className="-mx-6 -mt-6 relative h-[140px] md:h-[180px] overflow-hidden rounded-t-xl border-b border-[var(--color-border)] bg-[var(--color-bg-navy)]">
          <Image
            src={system.image}
            alt={`${system.name} preview`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      ) : null}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant={system.status} data-testid="system-status">
            {system.status}
          </Badge>
          {system.roleBadge ? (
            <Badge variant="ROLE">{system.roleBadge}</Badge>
          ) : null}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-[var(--color-text)]">
          {system.name}
        </h3>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          {system.tagline}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {system.metrics.map((m) => (
          <div
            key={m.label}
            data-testid="system-metric"
            className="rounded-md border border-[var(--color-border)] px-3 py-2"
          >
            <div className="font-[var(--font-mono)] text-lg font-bold text-[var(--color-accent-cyan)]">
              {m.value}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">
              {m.label}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {system.tech.map((t) => (
          <span
            key={t}
            data-testid="system-tech"
            className="rounded-full border border-[var(--color-border)] px-2 py-0.5 text-xs text-[var(--color-text-muted)]"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
        {system.githubUrl ? (
          <a
            href={system.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="system-github"
            className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-[var(--color-text)] hover:border-[var(--color-accent-pink)]"
          >
            <Github className="h-3.5 w-3.5" aria-hidden />
            GitHub
          </a>
        ) : null}
        {system.liveUrl ? (
          <a
            href={system.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="system-live"
            className="inline-flex items-center gap-1.5 rounded-md bg-[var(--color-accent-cyan)]/15 px-3 py-1.5 text-xs font-medium text-[var(--color-accent-cyan)] hover:bg-[var(--color-accent-cyan)]/25"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            Live
          </a>
        ) : null}
        <span
          aria-disabled="true"
          title="Coming soon"
          className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-700 cursor-not-allowed select-none"
        >
          <Network className="h-3.5 w-3.5" aria-hidden />
          View Architecture →
        </span>
      </div>
    </GlowCard>
  );
}
