"use client";

import { systems } from "@/data/systems";
import { FadeInSection } from "@/components/motion/FadeInSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SystemCard } from "@/components/ui/SystemCard";

export function Systems() {
  return (
    <FadeInSection id="systems" className="py-24">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
        <SectionHeader title="Systems I've Shipped" kanji="実績" />
        <div className="grid grid-cols-1 min-[641px]:grid-cols-2 min-[1025px]:grid-cols-3 gap-6">
          {systems.map((s) => (
            <SystemCard key={s.slug} system={s} />
          ))}
        </div>
      </div>
    </FadeInSection>
  );
}
