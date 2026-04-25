"use client";

import { useEffect, useRef } from "react";
import { X, RotateCcw, Bot } from "lucide-react";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";
import type { ChatSession } from "@/types/chat";
import { cn } from "@/lib/cn";

const SUGGESTIONS: readonly string[] = [
  "What systems has he built?",
  "What's his tech stack?",
  "Is he available for hire?",
  "Tell me about MCP servers",
];

interface ChatPanelProps {
  session: ChatSession;
  send: (text: string) => Promise<void>;
  newChat: () => void;
  onClose: () => void;
}

export default function ChatPanel({
  session,
  send,
  newChat,
  onClose,
}: ChatPanelProps) {
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

  const isEmpty = session.messages.length === 0;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Chat with Qasim's AI"
      className={cn(
        "flex h-full w-full flex-col overflow-hidden",
        "border border-[var(--color-border)] bg-[var(--color-card)]",
        "shadow-2xl shadow-[var(--color-accent-purple)]/10",
        "md:rounded-2xl md:border-[var(--color-accent-purple)]/30",
      )}
    >
      <header
        className={cn(
          "flex items-center justify-between gap-2 border-b border-[var(--color-border)] px-4 py-3",
          "bg-gradient-to-r from-[var(--color-accent-purple)]/10 via-transparent to-[var(--color-accent-pink)]/10",
        )}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            aria-hidden="true"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-accent-purple)] to-[var(--color-accent-pink)] text-white"
          >
            <Bot className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[var(--color-text)] truncate">
              Ask Qasim&rsquo;s AI
            </p>
            <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">
              Online · gpt-4o-mini
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={newChat}
            title="Start a new chat"
            className="inline-flex h-8 items-center gap-1 rounded-md border border-[var(--color-border)] bg-transparent px-2 text-xs text-[var(--color-text-muted)] hover:border-[var(--color-accent-purple)] hover:text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-purple)]/60"
            aria-label="Start a new chat"
          >
            <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">New</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-border)]/40 hover:text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-purple)]/60"
            aria-label="Minimize chat"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div
        ref={listRef}
        className="flex-1 space-y-3 overflow-y-auto bg-[var(--color-bg-navy)] px-3 py-4"
      >
        {isEmpty ? (
          <WelcomeBlock disabled={isStreaming} onPick={send} />
        ) : (
          session.messages.map((m) => <ChatMessage key={m.id} message={m} />)
        )}
        {isStreaming ? <TypingIndicator label="Thinking" /> : null}
        {errorMsg ? (
          <div
            role="alert"
            className="rounded-lg border border-[color-mix(in_oklab,#ef4444_50%,transparent)] bg-[color-mix(in_oklab,#ef4444_10%,transparent)] px-3 py-2 text-xs text-[var(--color-text)]"
          >
            {errorMsg}
          </div>
        ) : null}
      </div>

      <ChatInput disabled={isStreaming} onSend={send} />

      <footer className="border-t border-[var(--color-border)] bg-[var(--color-card)] px-3 py-1.5 text-center text-[10px] text-[var(--color-text-muted)]">
        Powered by OpenAI · session-only memory
      </footer>
    </div>
  );
}

interface WelcomeBlockProps {
  disabled: boolean;
  onPick: (text: string) => Promise<void>;
}

function WelcomeBlock({ disabled, onPick }: WelcomeBlockProps) {
  return (
    <div className="space-y-4 px-1 py-2">
      <div className="flex items-start gap-2">
        <span
          aria-hidden="true"
          className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-accent-purple)] to-[var(--color-accent-pink)] text-white"
        >
          <Bot className="h-3.5 w-3.5" />
        </span>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] px-3.5 py-2.5 text-sm text-[var(--color-text)]">
          Salam! I&rsquo;m Qasim&rsquo;s AI assistant. Ask me anything about
          his work — in English, اردو, or Roman Urdu.
        </div>
      </div>
      <div>
        <p className="px-2 pb-2 text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
          Try asking
        </p>
        <ul className="flex flex-wrap gap-2 px-1">
          {SUGGESTIONS.map((s) => (
            <li key={s}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => {
                  void onPick(s);
                }}
                className={cn(
                  "rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-1.5 text-xs text-[var(--color-text)]",
                  "transition-colors hover:border-[var(--color-accent-purple)] hover:bg-[var(--color-accent-purple)]/10",
                  "focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-purple)]/60",
                  disabled && "opacity-50 cursor-not-allowed",
                )}
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
