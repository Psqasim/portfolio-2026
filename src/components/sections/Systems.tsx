"use client";

import { useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { earlierWork, systems } from "@/data/systems";
import { FadeInSection } from "@/components/motion/FadeInSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SystemCard } from "@/components/ui/SystemCard";
import { EarlierWorkCard } from "@/components/ui/EarlierWorkCard";

export function Systems() {
  const [showEarlier, setShowEarlier] = useState(false);

  return (
    <FadeInSection id="systems" className="py-24">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
        <SectionHeader title="Systems I've Shipped" kanji="実績" />
        <div className="grid grid-cols-1 min-[641px]:grid-cols-2 min-[1025px]:grid-cols-3 gap-6">
          {systems.map((s) => (
            <SystemCard key={s.slug} system={s} />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={() => setShowEarlier((v) => !v)}
            aria-expanded={showEarlier}
            aria-controls="earlier-work-panel"
            className="inline-flex items-center gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-2 text-sm font-medium text-[var(--color-text)] transition hover:border-[var(--color-accent-pink)] hover:text-[var(--color-accent-pink)]"
          >
            {showEarlier ? "Hide Earlier Work" : "View Earlier Work"}
            <ChevronDown
              className={
                "h-4 w-4 transition-transform " +
                (showEarlier ? "rotate-180" : "rotate-0")
              }
              aria-hidden
            />
          </button>
        </div>

        <AnimatePresence initial={false}>
          {showEarlier ? (
            <m.div
              key="earlier-work-panel"
              id="earlier-work-panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="mt-8 grid grid-cols-1 min-[641px]:grid-cols-2 min-[1025px]:grid-cols-3 gap-4">
                {earlierWork.map((project) => (
                  <EarlierWorkCard key={project.name} project={project} />
                ))}
              </div>
            </m.div>
          ) : null}
        </AnimatePresence>
      </div>
    </FadeInSection>
  );
}
