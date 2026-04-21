export function smoothScrollTo(id: string, offsetPx = 0): void {
  if (typeof window === "undefined") return;
  const hash = id.startsWith("#") ? id.slice(1) : id;
  const el = document.getElementById(hash);
  if (!el) return;

  const prefersReducedMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const top = el.getBoundingClientRect().top + window.scrollY - offsetPx;

  window.scrollTo({
    top,
    behavior: prefersReducedMotion ? "auto" : "smooth",
  });
}
