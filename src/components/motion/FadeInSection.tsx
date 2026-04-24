"use client";

import { m } from "framer-motion";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type FadeInSectionProps = {
  children: ReactNode;
  /** Viewport intersection amount before animation fires. */
  amount?: number | "some" | "all";
} & Omit<
  ComponentPropsWithoutRef<typeof m.section>,
  "initial" | "whileInView" | "viewport" | "transition"
>;

/**
 * Reusable <section> that fades/slides into view when any part is visible.
 * A fractional threshold (e.g. 0.25) can strand tall sections on mobile —
 * if the section is taller than ~4× viewport, 25% never intersects and the
 * content stays at opacity 0 forever. Default to "some" (any intersection)
 * and allow callers to override with a fraction when they need it.
 * Respects prefers-reduced-motion via the MotionConfig ancestor
 * (see MotionProvider: reducedMotion="user").
 */
export function FadeInSection({
  children,
  amount = "some",
  ...rest
}: FadeInSectionProps) {
  return (
    <m.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount, margin: "0px 0px 40% 0px" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      {...rest}
    >
      {children}
    </m.section>
  );
}
