"use client";

import { skillCategories } from "@/data/skills";
import { FadeInSection } from "@/components/motion/FadeInSection";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function TechStack() {
  return (
    <FadeInSection id="skills" className="py-24">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
        <SectionHeader title="Tech Stack" kanji="技術" />
        <div className="flex flex-col gap-10">
          {skillCategories.map((category) => (
            <div key={category.slug} data-testid="skill-category">
              <div className="mb-4 flex items-baseline gap-3">
                <h3 className="text-lg font-semibold text-[var(--color-text)]">
                  {category.label}
                </h3>
                <span
                  aria-hidden
                  className="font-[var(--font-jp)] text-sm text-[var(--color-accent-purple)]/80"
                >
                  {category.kanji}
                </span>
              </div>
              <ul className="grid grid-cols-2 gap-3 min-[641px]:grid-cols-3 min-[1025px]:grid-cols-4">
                {category.skills.map((skill) => (
                  <li
                    key={skill.name}
                    data-testid="skill-item"
                    className="group flex items-center gap-3 rounded-md border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-sm text-[var(--color-text)] transition hover:border-[var(--color-accent-cyan)] hover:shadow-[0_0_16px_-4px_var(--color-accent-cyan)]"
                  >
                    <span
                      aria-hidden
                      className="inline-flex h-6 w-6 items-center justify-center rounded-sm bg-[var(--color-accent-purple)]/10 font-[var(--font-mono)] text-[10px] uppercase text-[var(--color-accent-purple)]"
                    >
                      {skill.name.slice(0, 2)}
                    </span>
                    <span className="truncate">{skill.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </FadeInSection>
  );
}
