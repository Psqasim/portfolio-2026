"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Menu, X } from "lucide-react";
import { smoothScrollTo } from "@/lib/scroll";
import { useScrollSpy } from "@/lib/useScrollSpy";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const LINKS = [
  { id: "home", label: "Home" },
  { id: "systems", label: "Systems" },
  { id: "skills", label: "Skills" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const;

export function Navbar() {
  const sectionIds = useMemo(() => LINKS.map((l) => l.id), []);
  const active = useScrollSpy(sectionIds);
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!drawerOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [drawerOpen]);

  function onNavClick(event: React.MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault();
    setDrawerOpen(false);
    smoothScrollTo(id, 72);
  }

  return (
    <>
      <nav
        aria-label="Primary"
        className={
          "fixed inset-x-0 top-0 z-40 transition-colors " +
          (scrolled
            ? "border-b border-[var(--color-border)] bg-[var(--color-bg-navy)]/80 backdrop-blur"
            : "bg-transparent")
        }
      >
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-3 md:px-10">
          <a
            href="#home"
            onClick={(e) => onNavClick(e, "home")}
            className="font-[var(--font-mono)] text-sm text-[var(--color-text)] hover:text-[var(--color-accent-pink)]"
          >
            &lt;Muhammad Qasim /&gt;
          </a>

          <ul className="hidden items-center gap-6 md:flex">
            {LINKS.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  aria-current={active === link.id ? "true" : undefined}
                  onClick={(e) => onNavClick(e, link.id)}
                  className={
                    "text-sm transition-colors " +
                    (active === link.id
                      ? "text-[var(--color-accent-pink)]"
                      : "text-[var(--color-text)] hover:text-[var(--color-accent-pink)]")
                  }
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--color-border)] text-[var(--color-text)] md:hidden"
              aria-label="Open menu"
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen(true)}
            >
              <Menu className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {drawerOpen && (
          <m.div
            key="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setDrawerOpen(false)}
          />
        )}
        {drawerOpen && (
          <m.aside
            key="drawer"
            role="dialog"
            aria-label="Navigation menu"
            aria-modal="true"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
            className="fixed right-0 top-0 z-50 flex h-full w-72 flex-col gap-6 border-l border-[var(--color-border)] bg-[var(--color-bg-navy)] px-6 py-5 md:hidden"
          >
            <div className="flex items-center justify-between">
              <ThemeToggle />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setDrawerOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--color-border)] text-[var(--color-text)]"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <ul className="flex flex-col gap-2">
              {LINKS.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    aria-current={active === link.id ? "true" : undefined}
                    onClick={(e) => onNavClick(e, link.id)}
                    className={
                      "block rounded-md px-3 py-2 text-base " +
                      (active === link.id
                        ? "bg-[var(--color-accent-pink)]/10 text-[var(--color-accent-pink)]"
                        : "text-[var(--color-text)] hover:bg-[var(--color-border)]/30")
                    }
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </m.aside>
        )}
      </AnimatePresence>
    </>
  );
}
