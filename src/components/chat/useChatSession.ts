"use client";

import { useCallback, useRef, useState } from "react";
import type {
  ChatError,
  ChatSession,
  Message,
  WireMessage,
} from "@/types/chat";

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function freshSession(isOpen: boolean): ChatSession {
  return {
    id: newId(),
    messages: [],
    status: { kind: "idle" },
    isOpen,
  };
}

interface ParsedSseEvent {
  name: string;
  data: unknown;
}

function* parseSseChunks(buffer: string): Generator<ParsedSseEvent> {
  const blocks = buffer.split("\n\n");
  for (const block of blocks) {
    if (!block.trim()) continue;
    const lines = block.split("\n");
    let name = "message";
    let dataRaw = "";
    for (const line of lines) {
      if (line.startsWith("event: ")) name = line.slice("event: ".length);
      else if (line.startsWith("data: ")) dataRaw += line.slice("data: ".length);
    }
    let data: unknown = dataRaw;
    try {
      data = JSON.parse(dataRaw);
    } catch {
      // leave as string
    }
    yield { name, data };
  }
}

export interface UseChatSessionResult {
  session: ChatSession;
  send: (text: string) => Promise<void>;
  newChat: () => void;
  setOpen: (open: boolean) => void;
}

export function useChatSession(): UseChatSessionResult {
  const [session, setSession] = useState<ChatSession>(() => freshSession(false));
  const abortRef = useRef<AbortController | null>(null);

  const setOpen = useCallback((open: boolean) => {
    setSession((s) => ({ ...s, isOpen: open }));
  }, []);

  const newChat = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setSession(freshSession(true));
  }, []);

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: newId(),
      role: "user",
      content: trimmed,
      state: "complete",
      createdAt: Date.now(),
    };
    const assistantId = newId();
    const assistantMsg: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
      state: "streaming",
      createdAt: Date.now(),
    };

    let history: WireMessage[] = [];
    setSession((s) => {
      history = s.messages
        .filter((m) => m.state === "complete")
        .map(({ role, content }) => ({ role, content }));
      return {
        ...s,
        messages: [...s.messages, userMsg, assistantMsg],
        status: { kind: "sending", pendingMessageId: assistantId },
      };
    });

    const controller = new AbortController();
    abortRef.current = controller;

    let response: Response;
    try {
      response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history }),
        signal: controller.signal,
      });
    } catch {
      const err: ChatError = {
        code: "internal_error",
        message: "Network error. Please try again.",
        retryable: true,
      };
      setSession((s) => ({
        ...s,
        messages: s.messages.map((m) =>
          m.id === assistantId ? { ...m, state: "failed" } : m,
        ),
        status: { kind: "error", lastError: err },
      }));
      return;
    }

    if (!response.ok) {
      let body: { error?: ChatError } = {};
      try {
        body = (await response.json()) as { error?: ChatError };
      } catch {
        // ignore parse failure
      }
      const err: ChatError = body.error ?? {
        code: "internal_error",
        message: "Something went wrong. Please try again.",
        retryable: true,
      };
      setSession((s) => ({
        ...s,
        messages: s.messages.map((m) =>
          m.id === assistantId ? { ...m, state: "failed" } : m,
        ),
        status: { kind: "error", lastError: err },
      }));
      return;
    }

    if (!response.body) {
      const err: ChatError = {
        code: "internal_error",
        message: "Empty response.",
        retryable: true,
      };
      setSession((s) => ({
        ...s,
        messages: s.messages.map((m) =>
          m.id === assistantId ? { ...m, state: "failed" } : m,
        ),
        status: { kind: "error", lastError: err },
      }));
      return;
    }

    setSession((s) => ({
      ...s,
      status: { kind: "streaming", pendingMessageId: assistantId },
    }));

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let streamError: ChatError | null = null;
    let receivedDone = false;

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const blockEnd = buffer.lastIndexOf("\n\n");
        if (blockEnd === -1) continue;
        const ready = buffer.slice(0, blockEnd + 2);
        buffer = buffer.slice(blockEnd + 2);

        for (const ev of parseSseChunks(ready)) {
          if (ev.name === "delta") {
            const text = (ev.data as { text?: string } | null)?.text ?? "";
            if (text) {
              setSession((s) => ({
                ...s,
                messages: s.messages.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: m.content + text }
                    : m,
                ),
              }));
            }
          } else if (ev.name === "error") {
            streamError = ev.data as ChatError;
          } else if (ev.name === "done") {
            receivedDone = true;
          }
        }
      }
    } catch {
      streamError = {
        code: "internal_error",
        message: "Stream interrupted.",
        retryable: true,
      };
    } finally {
      abortRef.current = null;
    }

    if (streamError) {
      const err = streamError;
      setSession((s) => ({
        ...s,
        messages: s.messages.map((m) =>
          m.id === assistantId ? { ...m, state: "failed" } : m,
        ),
        status: { kind: "error", lastError: err },
      }));
      return;
    }

    setSession((s) => ({
      ...s,
      messages: s.messages.map((m) =>
        m.id === assistantId
          ? { ...m, state: receivedDone ? "complete" : "complete" }
          : m,
      ),
      status: { kind: "idle" },
    }));
  }, []);

  return { session, send, newChat, setOpen };
}
