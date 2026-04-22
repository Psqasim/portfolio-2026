"use client";

import { useState } from "react";
import Image from "next/image";
import { personal } from "@/data/personal";
import { FadeInSection } from "@/components/motion/FadeInSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EducationTimeline } from "@/components/ui/EducationTimeline";

export function About() {
  const [imgOk, setImgOk] = useState(true);

  return (
    <FadeInSection className="py-24">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
        <SectionHeader title="About" kanji="自己紹介" id="about" />
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[240px_1fr]">
          <div className="flex justify-center md:justify-start">
            <div className="relative h-60 w-60 overflow-hidden rounded-2xl shadow-[0_0_48px_-12px_var(--color-accent-pink)] ring-1 ring-[var(--color-accent-pink)]/40">
              {imgOk ? (
                <Image
                  src="/profile.jpg"
                  alt="Portrait of Muhammad Qasim"
                  width={240}
                  height={240}
                  priority={false}
                  className="h-full w-full object-cover"
                  onError={() => setImgOk(false)}
                />
              ) : (
                <div
                  aria-hidden
                  className="h-full w-full bg-gradient-to-br from-[var(--color-accent-pink)] via-[var(--color-accent-purple)] to-[var(--color-accent-cyan)]"
                />
              )}
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <p className="text-base leading-relaxed text-[var(--color-text)] md:text-lg">
              {personal.aboutBio}
            </p>
            <EducationTimeline entries={personal.education} />
          </div>
        </div>
      </div>
    </FadeInSection>
  );
}
