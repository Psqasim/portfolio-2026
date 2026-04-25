"use client";

import type { MouseEvent as ReactMouseEvent } from "react";
import { AnimatePresence, m, type Variants } from "framer-motion";
import { X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

type NavLink = { id: string; label: string };

type MobileNavMenuProps = {
  open: boolean;
  active: string | null;
  links: ReadonlyArray<NavLink>;
  onClose: () => void;
  onNavigate: (event: ReactMouseEvent<HTMLAnchorElement>, id: string) => void;
};

const listVariants: Variants = {
  open: {
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
  closed: {
    transition: { staggerChildren: 0 },
  },
};

const itemVariants: Variants = {
  open: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
  closed: { opacity: 0, y: 8, transition: { duration: 0.15, ease: "easeIn" } },
};

const panelTransition = { type: "tween" as const, duration: 0.3, ease: [0.16, 1, 0.3, 1] as const };

export function MobileNavMenu({
  open,
  active,
  links,
  onClose,
  onNavigate,
}: MobileNavMenuProps) {
  return (
    <AnimatePresence>
      {open && (
        <m.div
          key="mobile-nav-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}
      {open && (
        <m.aside
          key="mobile-nav-panel"
          role="dialog"
          aria-label="Navigation menu"
          aria-modal="true"
          initial={{ x: "100%", opacity: 0, scale: 0.98 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: "100%", opacity: 0, scale: 0.98 }}
          transition={panelTransition}
          className="fixed right-0 top-0 z-50 flex h-full w-72 max-w-[85vw] flex-col gap-6 border-l border-[var(--color-border)] bg-[var(--color-bg-navy)] px-6 py-5 md:hidden"
        >
          <div className="flex items-center justify-between">
            <ThemeToggle />
            <button
              type="button"
              aria-label="Close menu"
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--color-border)] text-[var(--color-text)]"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>
          <m.ul
            className="flex flex-col gap-2"
            variants={listVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {links.map((link) => (
              <m.li key={link.id} variants={itemVariants}>
                <a
                  href={`#${link.id}`}
                  aria-current={active === link.id ? "true" : undefined}
                  onClick={(e) => onNavigate(e, link.id)}
                  className={
                    "block rounded-md px-3 py-2 text-base " +
                    (active === link.id
                      ? "bg-[var(--color-accent-pink)]/10 text-[var(--color-accent-pink)]"
                      : "text-[var(--color-text)] hover:bg-[var(--color-border)]/30")
                  }
                >
                  {link.label}
                </a>
              </m.li>
            ))}
          </m.ul>
        </m.aside>
      )}
    </AnimatePresence>
  );
}
