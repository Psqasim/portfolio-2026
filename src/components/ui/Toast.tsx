"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

export type ToastVariant = "success" | "error";

interface ToastEntry {
  id: number;
  variant: ToastVariant;
  message: string;
}

interface ToastContextValue {
  push: (variant: ToastVariant, message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within <ToastProvider>");
  }
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const nextId = useRef(1);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback<ToastContextValue["push"]>((variant, message) => {
    const id = nextId.current++;
    setToasts((prev) => [...prev, { id, variant, message }]);
  }, []);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4"
      >
        {toasts.map((t) => (
          <ToastView key={t.id} entry={t} onDismiss={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastView({ entry, onDismiss }: { entry: ToastEntry; onDismiss: () => void }) {
  useEffect(() => {
    if (entry.variant !== "success") return;
    const handle = window.setTimeout(onDismiss, 6000);
    return () => window.clearTimeout(handle);
  }, [entry.variant, onDismiss]);

  const isSuccess = entry.variant === "success";
  return (
    <div
      role={isSuccess ? "status" : "alert"}
      className={
        "pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-lg border px-4 py-3 text-sm shadow-lg backdrop-blur " +
        (isSuccess
          ? "border-[var(--color-accent-cyan)]/40 bg-[var(--color-accent-cyan)]/10 text-[var(--color-text)]"
          : "border-[color-mix(in_oklab,#ef4444_60%,transparent)] bg-[color-mix(in_oklab,#ef4444_15%,transparent)] text-[var(--color-text)]")
      }
    >
      <span className="flex-1 leading-snug">{entry.message}</span>
      {!isSuccess && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="rounded-md p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      )}
    </div>
  );
}
