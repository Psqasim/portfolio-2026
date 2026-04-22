import { cn } from "@/lib/cn";

export function GlowCard({
  children,
  className,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "group relative rounded-xl border bg-[var(--color-card)] border-[var(--color-border)] p-6 transition-all duration-300",
        "hover:border-[var(--color-accent-pink)] hover:shadow-[0_0_32px_-8px_var(--color-accent-pink)]",
        "focus-within:border-[var(--color-accent-pink)] focus-within:shadow-[0_0_32px_-8px_var(--color-accent-pink)]",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
