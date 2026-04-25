"use client";

import { useEffect, useRef } from "react";
import { X, Plus } from "lucide-react";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";
import { useChatSession } from "./useChatSession";
import { cn } from "@/lib/cn";

interface ChatPanelProps {
  onClose: () => void;
}

export default function ChatPanel({ onClose }: ChatPanelProps) {
  const { session, send, newChat } = useChatSession();
  const listRef = useRef<HTMLDivElement | null>(null);

  const isStreaming =
    session.status.kind === "streaming" || session.status.kind === "sending";

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [session.messages, session.status.kind]);

  const errorMsg =
    session.status.kind === "error" ? session.status.lastError.message : null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Chat with Qasim's AI"
      className={cn(
        "flex h-full w-full flex-col overflow-hidden border border-[var(--color-border)] bg-[var(--color-card)] shadow-2xl",
        "md:rounded-2xl",
      )}
    >
      <header className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[var(--color-text)]">
            Ask Qasim&rsquo;s AI
          </span>
          <span aria-hidden="true">🤖</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={newChat}
            className="inline-flex h-8 items-center gap-1 rounded-md border border-[var(--color-border)] bg-transparent px-2 text-xs text-[var(--color-text)] hover:border-[var(--color-accent-purple)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-purple)]/60"
            aria-label="Start a new chat"
          >
            <Plus aria-hidden="true" className="h-3.5 w-3.5" />
            New Chat
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-bg-navy)] hover:text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-purple)]/60"
            aria-label="Minimize chat"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div
        ref={listRef}
        className="flex-1 space-y-3 overflow-y-auto bg-[var(--color-bg-navy)] px-3 py-4"
      >
        {session.messages.length === 0 ? (
          <p className="px-2 text-sm text-[var(--color-text-muted)]">
            Hi — ask me about Qasim&rsquo;s shipped systems, tech stack, or
            availability.
          </p>
        ) : (
          session.messages.map((m) => <ChatMessage key={m.id} message={m} />)
        )}
        {isStreaming ? <TypingIndicator label="Thinking" /> : null}
        {errorMsg ? (
          <div
            role="alert"
            className="rounded-md border border-[color-mix(in_oklab,#ef4444_50%,transparent)] bg-[color-mix(in_oklab,#ef4444_10%,transparent)] px-3 py-2 text-xs text-[var(--color-text)]"
          >
            {errorMsg}
          </div>
        ) : null}
      </div>

      <ChatInput disabled={isStreaming} onSend={send} />

      <footer className="border-t border-[var(--color-border)] bg-[var(--color-card)] px-3 py-1.5 text-center text-[10px] text-[var(--color-text-muted)]">
        Powered by OpenAI
      </footer>
    </div>
  );
}
