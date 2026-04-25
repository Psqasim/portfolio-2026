"use client";

// ChatHost — owns the chat session state so that minimizing the panel
// preserves the conversation (FR-005). Lives in the lazy bundle so the
// homepage's eager First Load JS stays at the Sprint 1 baseline; once
// loaded, the host stays mounted for the rest of the page lifetime.

import { cn } from "@/lib/cn";
import ChatPanel from "./ChatPanel";
import { useChatSession } from "./useChatSession";

interface ChatHostProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatHost({ isOpen, onClose }: ChatHostProps) {
  const { session, send, newChat } = useChatSession();

  return (
    <div
      className={cn(
        "fixed z-50",
        "inset-x-0 bottom-0 top-auto h-[80dvh]",
        "md:inset-auto md:bottom-24 md:right-6 md:h-[600px] md:w-[400px]",
        isOpen ? "block" : "hidden",
      )}
      aria-hidden={!isOpen}
    >
      <ChatPanel
        session={session}
        send={send}
        newChat={newChat}
        onClose={onClose}
      />
    </div>
  );
}
