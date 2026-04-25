"use client";

import type { CSSProperties, ReactNode } from "react";

type InfiniteMarqueeProps = {
  children: ReactNode;
  direction?: "left" | "right";
  speedSeconds?: number;
  pauseOnHover?: boolean;
  className?: string;
};

export function InfiniteMarquee({
  children,
  direction = "left",
  speedSeconds = 40,
  pauseOnHover = true,
  className = "",
}: InfiniteMarqueeProps) {
  const style = {
    "--marquee-duration": `${speedSeconds}s`,
  } as CSSProperties;

  return (
    <div
      className={`marquee-mask ${className}`.trim()}
      data-pause-hover={pauseOnHover ? "true" : undefined}
      style={style}
    >
      <div className="marquee-track" data-dir={direction}>
        <div className="marquee-set">{children}</div>
        <div className="marquee-set" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
