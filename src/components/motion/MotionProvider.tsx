"use client";

import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Wraps the app in LazyMotion (domAnimation feature bundle) + MotionConfig.
 * Components MUST import `m` from `framer-motion` — using `motion.*` under
 * `strict` mode throws at runtime (ADR-0001). This keeps the animation
 * bundle at ~17 KB gz (domAnimation) instead of ~29 KB gz (domMax).
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
