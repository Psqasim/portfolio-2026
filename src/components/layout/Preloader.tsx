"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { useSessionFlag } from "@/lib/useSessionFlag";

const DISMISS_AFTER_MS = 2600;

const container = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.14, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const kanjiItem = {
  hidden: { opacity: 0, scale: 0.6, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

export function Preloader() {
  const [shown, setShown] = useSessionFlag("portfolio:preloader:shown");
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || shown) return;
    setVisible(true);
    const handle = window.setTimeout(() => setVisible(false), DISMISS_AFTER_MS);
    return () => window.clearTimeout(handle);
  }, [mounted, shown]);

  if (!mounted || shown) return null;

  return (
    <AnimatePresence onExitComplete={() => setShown()}>
      {visible && (
        <m.div
          data-testid="preloader"
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          variants={container}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 overflow-hidden bg-[#0a0e1a] px-6 text-center text-[#e2e8f0]"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 50%, rgba(244,114,182,0.12), transparent 55%), linear-gradient(rgba(34,211,238,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.06) 1px, transparent 1px)",
              backgroundSize: "100% 100%, 32px 32px, 32px 32px",
            }}
          />
          <m.div
            aria-hidden
            className="preloader-scan pointer-events-none absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[#22d3ee]/70 to-transparent"
          />

          <div className="relative flex h-44 w-44 items-center justify-center">
            <m.div
              aria-hidden
              className="absolute inset-0 rounded-full border border-transparent"
              style={{
                borderTopColor: "#f472b6",
                borderRightColor: "#c084fc",
                borderBottomColor: "rgba(34,211,238,0.25)",
                borderLeftColor: "rgba(244,114,182,0.15)",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <m.div
              aria-hidden
              className="absolute inset-4 rounded-full border border-transparent"
              style={{
                borderTopColor: "rgba(34,211,238,0.9)",
                borderBottomColor: "rgba(192,132,252,0.55)",
              }}
              animate={{ rotate: -360 }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
            />
            <m.div
              variants={kanjiItem}
              className="font-[var(--font-jp)] text-6xl font-black text-[#f472b6] md:text-7xl"
              style={{
                textShadow:
                  "0 0 24px rgba(244,114,182,0.65), 0 0 44px rgba(192,132,252,0.35)",
              }}
            >
              起動
            </m.div>
          </div>

          <m.h1
            variants={item}
            className="font-[var(--font-mono)] text-sm tracking-[0.3em] text-[#22d3ee] md:text-base"
          >
            AGENTIC AI ENGINEER
          </m.h1>

          <m.p
            variants={item}
            className="text-2xl font-semibold md:text-3xl"
          >
            Building Autonomous Systems
          </m.p>

          <m.div
            variants={item}
            className="relative h-1 w-56 overflow-hidden rounded-full bg-white/10"
            aria-hidden
          >
            <div className="preloader-bar h-full rounded-full bg-gradient-to-r from-[#f472b6] via-[#c084fc] to-[#22d3ee]" />
          </m.div>

          <m.p
            variants={item}
            className="font-[var(--font-jp)] text-xs text-[#94a3b8] md:text-sm"
          >
            ポートフォリオ起動中
          </m.p>
        </m.div>
      )}
    </AnimatePresence>
  );
}
