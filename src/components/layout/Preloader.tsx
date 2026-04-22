"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { useSessionFlag } from "@/lib/useSessionFlag";

const DISMISS_AFTER_MS = 2600;

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
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-[#0a0e1a] px-6 text-center text-[#e2e8f0]"
        >
          <div className="flex flex-col gap-2">
            <h1 className="font-[var(--font-mono)] text-sm tracking-[0.3em] text-[#22d3ee] md:text-base">
              AGENTIC AI ENGINEER
            </h1>
            <p className="text-2xl font-semibold md:text-3xl">
              Building Autonomous Systems
            </p>
          </div>
          <div
            className="relative h-1 w-48 overflow-hidden rounded-full bg-white/10"
            aria-hidden
          >
            <div className="preloader-bar h-full rounded-full bg-gradient-to-r from-[#f472b6] via-[#c084fc] to-[#22d3ee]" />
          </div>
          <p className="font-[var(--font-jp)] text-xs text-[#94a3b8] md:text-sm">
            ポートフォリオ起動中
          </p>
        </m.div>
      )}
    </AnimatePresence>
  );
}
