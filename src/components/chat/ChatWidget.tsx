"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";

const ChatPanel = dynamic(() => import("./ChatPanel"), {
  ssr: false,
  loading: () => null,
});

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
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

      {isOpen ? (
        <div
          className={cn(
            "fixed z-50",
            "inset-x-0 bottom-0 top-auto h-[80dvh]",
            "md:inset-auto md:bottom-24 md:right-6 md:h-[600px] md:w-[400px]",
          )}
        >
          <ChatPanel onClose={() => setIsOpen(false)} />
        </div>
      ) : null}
    </>
  );
}
