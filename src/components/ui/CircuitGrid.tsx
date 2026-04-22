import { cn } from "@/lib/cn";

export function CircuitGrid({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "absolute inset-0 pointer-events-none overflow-hidden opacity-[0.08]",
        className,
      )}
    >
      <svg
        className="h-full w-full text-[var(--color-accent-cyan)] circuit-grid-pan"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="circuit-grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
            <circle cx="0" cy="0" r="1.5" fill="currentColor" />
            <circle cx="40" cy="0" r="1.5" fill="currentColor" />
            <circle cx="0" cy="40" r="1.5" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuit-grid)" />
      </svg>
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .circuit-grid-pan {
            animation: circuit-pan 40s linear infinite;
          }
          @keyframes circuit-pan {
            from { transform: translate3d(0, 0, 0); }
            to { transform: translate3d(-40px, -40px, 0); }
          }
        }
      `}</style>
    </div>
  );
}
