"use client";

import type { Message } from "@/types/chat";
import { cn } from "@/lib/cn";

interface ChatMessageProps {
  message: Message;
}

function renderText(content: string): React.ReactNode {
  const lines = content.split("\n");
  return lines.map((line, i) => (
    <span key={i}>
      {line}
      {i < lines.length - 1 ? <br /> : null}
    </span>
  ));
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const isFailed = message.state === "failed";

  return (
    <div
      className={cn(
        "flex w-full",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words",
          isUser
            ? "bg-[var(--color-accent-purple)]/20 text-[var(--color-text)] border border-[var(--color-accent-purple)]/40"
            : "bg-[var(--color-card)] text-[var(--color-text)] border border-[var(--color-border)]",
          isFailed && "border-[color-mix(in_oklab,#ef4444_50%,transparent)]",
        )}
        aria-live={!isUser && message.state === "streaming" ? "polite" : "off"}
      >
        {renderText(message.content)}
        {isFailed ? (
          <span className="ml-1 text-[var(--color-text-muted)]">
            (failed)
          </span>
        ) : null}
      </div>
    </div>
  );
}
