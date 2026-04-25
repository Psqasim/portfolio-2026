"use client";

import { Bot } from "lucide-react";
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

  if (isUser) {
    return (
      <div className="flex w-full justify-end">
        <div
          className={cn(
            "max-w-[85%] rounded-2xl rounded-br-sm px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words",
            "bg-gradient-to-br from-[var(--color-accent-purple)]/30 to-[var(--color-accent-pink)]/25",
            "border border-[var(--color-accent-purple)]/40 text-[var(--color-text)]",
            isFailed && "border-[color-mix(in_oklab,#ef4444_60%,transparent)]",
          )}
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

  return (
    <div className="flex w-full items-start gap-2 justify-start">
      <span
        aria-hidden="true"
        className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-accent-purple)] to-[var(--color-accent-pink)] text-white"
      >
        <Bot className="h-3.5 w-3.5" />
      </span>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words",
          "bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-text)]",
          isFailed && "border-[color-mix(in_oklab,#ef4444_60%,transparent)]",
        )}
        aria-live={message.state === "streaming" ? "polite" : "off"}
      >
        {message.content.length > 0 ? (
          renderText(message.content)
        ) : message.state === "streaming" ? (
          <span className="text-[var(--color-text-muted)]">…</span>
        ) : null}
        {isFailed ? (
          <span className="ml-1 text-[var(--color-text-muted)]">
            (failed)
          </span>
        ) : null}
      </div>
    </div>
  );
}
