"use client";

import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/cn";

const MAX_LEN = 500;

interface ChatInputProps {
  disabled: boolean;
  onSend: (text: string) => void;
}

export function ChatInput({ disabled, onSend }: ChatInputProps) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const trimmed = value.trim();
  const canSend = !disabled && trimmed.length > 0 && trimmed.length <= MAX_LEN;

  function submit() {
    if (!canSend) return;
    onSend(trimmed);
    setValue("");
    requestAnimationFrame(() => ref.current?.focus());
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  function onFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    submit();
  }

  const overCap = value.length > MAX_LEN;
  const showCounter = value.length >= MAX_LEN - 50;

  return (
    <form
      onSubmit={onFormSubmit}
      className="flex items-end gap-2 border-t border-[var(--color-border)] bg-[var(--color-card)] p-3"
    >
      <div className="flex-1">
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          rows={1}
          maxLength={MAX_LEN + 50}
          placeholder="Ask about Qasim's work…"
          aria-label="Type your message"
          disabled={disabled}
          className={cn(
            "w-full resize-none rounded-md border bg-[var(--color-bg-navy)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-purple)]/60",
            overCap
              ? "border-[color-mix(in_oklab,#ef4444_50%,transparent)]"
              : "border-[var(--color-border)]",
            disabled && "opacity-60",
          )}
        />
        {showCounter ? (
          <div
            className={cn(
              "mt-1 text-right text-[10px]",
              overCap
                ? "text-[color-mix(in_oklab,#ef4444_70%,white)]"
                : "text-[var(--color-text-muted)]",
            )}
            aria-live="polite"
          >
            {value.length} / {MAX_LEN}
          </div>
        ) : null}
      </div>
      <button
        type="submit"
        disabled={!canSend}
        aria-label="Send message"
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors",
          canSend
            ? "bg-[var(--color-accent-purple)] text-[var(--color-bg-navy)] hover:bg-[var(--color-accent-pink)]"
            : "bg-[var(--color-border)] text-[var(--color-text-muted)] cursor-not-allowed",
        )}
      >
        <Send aria-hidden="true" className="h-4 w-4" />
      </button>
    </form>
  );
}
