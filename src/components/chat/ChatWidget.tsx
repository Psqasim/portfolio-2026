"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Bot, X } from "lucide-react";
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

  function open() {
    setHasOpened(true);
    setIsOpen(true);
  }

  function toggle() {
    if (isOpen) {
      setIsOpen(false);
    } else {
      open();
    }
  }

  // Listen for `chat:open` events dispatched from elsewhere on the page
  // (e.g., the Hero's "Ask My AI Agent" button).
  useEffect(() => {
    const handler = () => open();
    window.addEventListener("chat:open", handler);
    return () => window.removeEventListener("chat:open", handler);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 md:bottom-6 md:right-6">
      {/* Pill label — makes the FAB's purpose obvious without a hover. */}
      {!isOpen ? (
        <button
          type="button"
          onClick={open}
          aria-label="Ask Qasim's AI"
          className={cn(
            "inline-flex h-9 items-center gap-1.5 rounded-full pl-2.5 pr-3 sm:h-10 sm:pl-3 sm:pr-3.5",
            "border border-[var(--color-accent-purple)]/40 bg-[var(--color-card)]/90 backdrop-blur",
            "text-[11px] font-semibold text-[var(--color-text)] sm:text-xs shadow-lg shadow-[var(--color-accent-purple)]/15",
            "transition-all hover:border-[var(--color-accent-purple)] hover:text-[var(--color-accent-purple)]",
            "focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-purple)]/60",
          )}
        >
          <span
            aria-hidden="true"
            className="inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-accent-cyan)]"
          />
          Ask Qasim&rsquo;s AI
        </button>
      ) : null}

      <button
        type="button"
        onClick={toggle}
        title={isOpen ? "Close chat" : "Need help? Ask AI 🤖"}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        aria-expanded={isOpen}
        className={cn(
          "inline-flex h-14 w-14 items-center justify-center rounded-full",
          "bg-gradient-to-br from-[var(--color-accent-purple)] to-[var(--color-accent-pink)] text-white",
          "shadow-[0_0_24px_-4px_var(--color-accent-purple)]",
          "transition-transform hover:scale-105",
          "focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-purple)]/70 focus:ring-offset-2 focus:ring-offset-[var(--color-bg-navy)]",
          !isOpen && "chat-fab-pulse",
        )}
      >
        {isOpen ? (
          <X aria-hidden="true" className="h-5 w-5" />
        ) : (
          <Bot aria-hidden="true" className="h-6 w-6" />
        )}
      </button>

      {hasOpened ? (
        <ChatHost isOpen={isOpen} onClose={() => setIsOpen(false)} />
      ) : null}
    </div>
  );
}
