"use client";

import { m } from "framer-motion";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type FadeInSectionProps = {
  children: ReactNode;
  /** Viewport intersection amount before animation fires. */
  amount?: number;
} & Omit<
  ComponentPropsWithoutRef<typeof m.section>,
  "initial" | "whileInView" | "viewport" | "transition"
>;

/**
 * Reusable <section> that fades/slides into view when ≥ 25% visible.
 * Respects prefers-reduced-motion via the MotionConfig ancestor
 * (see MotionProvider: reducedMotion="user").
 */
export function FadeInSection({
  children,
  amount = 0.25,
  ...rest
}: FadeInSectionProps) {
  return (
    <m.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      {...rest}
    >
      {children}
    </m.section>
  );
}
