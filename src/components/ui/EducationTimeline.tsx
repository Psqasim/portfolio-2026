import type { EducationEntry } from "@/types";

export function EducationTimeline({ entries }: { entries: EducationEntry[] }) {
  return (
    <ol className="relative flex flex-col gap-6 border-l border-[var(--color-border)] pl-6">
      {entries.map((entry) => (
        <li
          key={`${entry.institution}-${entry.dateRange}`}
          data-testid="education-entry"
          data-current={entry.current ? "true" : undefined}
          className="relative"
        >
          <span
            aria-hidden
            className={
              "absolute -left-[calc(0.5rem+1px)] top-1.5 inline-block h-3 w-3 rounded-full " +
              (entry.current
                ? "bg-[var(--color-accent-pink)] shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-accent-pink)_25%,transparent)]"
                : "bg-[var(--color-accent-cyan)]")
            }
          />
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] uppercase tracking-wider text-[var(--color-text-muted)]">
              {entry.dateRange}
              {entry.current ? " · Current" : ""}
            </span>
            <h3 className="text-base font-semibold text-[var(--color-text)]">
              {entry.institution}
            </h3>
            <p className="text-sm text-[var(--color-text-muted)]">{entry.credential}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
