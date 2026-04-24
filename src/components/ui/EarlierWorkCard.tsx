import type { EarlierProject } from "@/data/systems";

export function EarlierWorkCard({ project }: { project: EarlierProject }) {
  return (
    <article
      data-testid="earlier-work-card"
      className="flex flex-col gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4 transition hover:border-[var(--color-accent-purple)]"
    >
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
      <div className="mt-auto flex flex-wrap gap-1.5">
        {project.tech.map((t) => (
          <span
            key={t}
            className="rounded-full border border-[var(--color-border)] px-2 py-0.5 text-[10px] text-[var(--color-text-muted)]"
          >
            {t}
          </span>
        ))}
      </div>
    </article>
  );
}
