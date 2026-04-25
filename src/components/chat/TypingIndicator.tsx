"use client";

import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

interface TypingIndicatorProps {
  label?: string;
}

export function TypingIndicator({ label = "Typing" }: TypingIndicatorProps) {
  const reduced = useReducedMotion();

  return (
    <div
      className="flex items-center gap-2 px-1 py-2 text-xs text-[var(--color-text-muted)]"
      role="status"
      aria-label={`${label}…`}
    >
      <span className="sr-only">{label}…</span>
      <div className="flex items-center gap-1" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={cn(
              "block h-1.5 w-1.5 rounded-full bg-[var(--color-accent-purple)]",
              !reduced && "animate-pulse",
            )}
            style={
              reduced
                ? undefined
                : { animationDelay: `${i * 150}ms`, animationDuration: "1s" }
            }
          />
        ))}
      </div>
      <span>{label}…</span>
    </div>
  );
}
