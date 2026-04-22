import { cn } from "@/lib/cn";

export function SectionHeader({
  title,
  kanji,
  id,
  className,
}: {
  title: string;
  kanji?: string;
  id: string;
  className?: string;
}) {
  return (
    <div className={cn("relative mb-10", className)}>
      {kanji ? (
        <span
          aria-hidden
          className="absolute -top-4 right-0 font-[var(--font-jp)] text-6xl md:text-7xl leading-none text-[var(--color-accent-purple)]/15 select-none pointer-events-none"
        >
          {kanji}
        </span>
      ) : null}
      <h2
        id={id}
        className="relative text-3xl md:text-4xl font-bold tracking-tight text-[var(--color-text)]"
      >
        {title}
      </h2>
      <div className="mt-3 h-px w-16 bg-gradient-to-r from-[var(--color-accent-pink)] to-transparent" />
    </div>
  );
}
