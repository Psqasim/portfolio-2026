import Image from "next/image";
import { ExternalLink, Github, Lock } from "lucide-react";
import type { EarlierProject } from "@/data/systems";

export function EarlierWorkCard({ project }: { project: EarlierProject }) {
  return (
    <article
      data-testid="earlier-work-card"
      className="flex flex-col gap-3 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4 transition hover:border-[var(--color-accent-purple)]"
    >
      {project.image ? (
        <div className="-mx-4 -mt-4 relative h-[110px] md:h-[120px] overflow-hidden rounded-t-lg border-b border-[var(--color-border)] bg-[var(--color-bg-navy)]">
          <Image
            src={project.image}
            alt={`${project.name} preview`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      ) : null}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-[var(--color-text)]">
          {project.name}
        </h3>
        <span className="shrink-0 rounded-full border border-[var(--color-accent-purple)]/40 px-2 py-0.5 text-[10px] uppercase tracking-wider text-[var(--color-accent-purple)]">
          {project.category}
        </span>
      </div>
      <p className="text-xs leading-relaxed text-[var(--color-text-muted)]">
        {project.description}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {project.tech.map((t) => (
          <span
            key={t}
            className="rounded-full border border-[var(--color-border)] px-2 py-0.5 text-[10px] text-[var(--color-text-muted)]"
          >
            {t}
          </span>
        ))}
      </div>
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
        {project.privateRepo ? (
          <span
            title="Private repository"
            aria-label="Private repository"
            className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-border)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-text-muted)] cursor-not-allowed select-none"
          >
            <Lock className="h-3 w-3" aria-hidden />
            Private
          </span>
        ) : project.github ? (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-border)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-text)] hover:border-[var(--color-accent-pink)] hover:text-[var(--color-accent-pink)]"
          >
            <Github className="h-3 w-3" aria-hidden />
            GitHub
          </a>
        ) : null}
        {project.liveUrl ? (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md bg-[var(--color-accent-cyan)]/15 px-2.5 py-1 text-[11px] font-medium text-[var(--color-accent-cyan)] hover:bg-[var(--color-accent-cyan)]/25"
          >
            <ExternalLink className="h-3 w-3" aria-hidden />
            Live
          </a>
        ) : null}
      </div>
    </article>
  );
}
