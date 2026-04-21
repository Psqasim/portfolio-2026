import { cn } from "@/lib/cn";

type BadgeVariant = "LIVE" | "SHIPPED" | "ACTIVE" | "APPLIED" | "ROLE";

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  LIVE: "bg-[color-mix(in_oklab,var(--color-status-live)_15%,transparent)] text-[var(--color-status-live)] ring-[var(--color-status-live)]/40",
  SHIPPED:
    "bg-[color-mix(in_oklab,var(--color-status-shipped)_15%,transparent)] text-[var(--color-status-shipped)] ring-[var(--color-status-shipped)]/40",
  ACTIVE:
    "bg-[color-mix(in_oklab,var(--color-status-active)_15%,transparent)] text-[var(--color-status-active)] ring-[var(--color-status-active)]/40",
  APPLIED:
    "bg-[color-mix(in_oklab,var(--color-status-applied)_15%,transparent)] text-[var(--color-status-applied)] ring-[var(--color-status-applied)]/30",
  ROLE: "bg-[color-mix(in_oklab,var(--color-accent-pink)_12%,transparent)] text-[var(--color-accent-pink)] ring-[var(--color-accent-pink)]/30",
};

export function Badge({
  variant,
  children,
  className,
  ...rest
}: {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium uppercase tracking-wider rounded-full ring-1",
        VARIANT_CLASSES[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
