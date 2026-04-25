"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";

// ChatHost holds the session state. It's lazy-loaded the first time the
// user opens the panel so the homepage's eager bundle stays unchanged.
const ChatHost = dynamic(() => import("./ChatHost"), {
  ssr: false,
  loading: () => null,
});

export function ChatWidget() {
  const [hasOpened, setHasOpened] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  function toggle() {
    setIsOpen((open) => {
      const next = !open;
      if (next) setHasOpened(true);
      return next;
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        title="Need help? Ask AI ✨"
        aria-label={isOpen ? "Close chat" : "Open chat"}
        aria-expanded={isOpen}
        className={cn(
          "fixed bottom-4 right-4 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent-purple)] text-[var(--color-bg-navy)] shadow-lg",
          "hover:bg-[var(--color-accent-pink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-purple)]/70 focus:ring-offset-2 focus:ring-offset-[var(--color-bg-navy)]",
          "transition-colors md:bottom-6 md:right-6",
        )}
      >
        <Sparkles aria-hidden="true" className="h-5 w-5" />
      </button>

      {hasOpened ? (
        <ChatHost isOpen={isOpen} onClose={() => setIsOpen(false)} />
      ) : null}
    </>
  );
}
