"use client";

import { useEffect, useMemo, useState } from "react";
import { Menu } from "lucide-react";
import { smoothScrollTo } from "@/lib/scroll";
import { useScrollSpy } from "@/lib/useScrollSpy";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { MobileNavMenu } from "@/components/layout/MobileNavMenu";

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

      <MobileNavMenu
        open={drawerOpen}
        active={active}
        links={LINKS}
        onClose={() => setDrawerOpen(false)}
        onNavigate={onNavClick}
      />
    </>
  );
}
