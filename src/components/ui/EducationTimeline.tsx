import type { EducationEntry } from "@/types";

export function EducationTimeline({ entries }: { entries: EducationEntry[] }) {
  return (
    <ol className="relative flex flex-col gap-6 pl-8">
      <span
        aria-hidden
        className="pointer-events-none absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-[#f472b6] via-[#c084fc]/50 to-[#94a3b8]"
      />
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
              "absolute -left-[25px] top-1.5 inline-block h-3 w-3 rounded-full ring-4 ring-[var(--color-bg-navy)] " +
              (entry.current
                ? "bg-[#f472b6] shadow-[0_0_0_6px_color-mix(in_oklab,#f472b6_20%,transparent)]"
                : "bg-[#94a3b8] dark:bg-[#475569]")
            }
          />
          <div className="flex flex-col gap-1">
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
