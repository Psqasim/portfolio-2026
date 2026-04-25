// Chat-widget type surface (client + transport).
// Source: specs/002-chatbot-widget/data-model.md (Entities 1, 2, 5).

export type ChatErrorCode =
  | "invalid_input"
  | "input_too_long"
  | "rate_limited"
  | "provider_error"
  | "internal_error";

export interface ChatError {
  code: ChatErrorCode;
  message: string;
  resetAt?: string;
  retryable: boolean;
}

export type MessageRole = "user" | "assistant";

export type MessageState = "complete" | "streaming" | "failed";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  state: MessageState;
  createdAt: number;
}

// Wire shape — what the client POSTs in `history[]` and what the server accepts.
// Subset of `Message` without React-specific fields.
export interface WireMessage {
  role: MessageRole;
  content: string;
}

export type ChatSessionStatus =
  | { kind: "idle" }
  | { kind: "sending"; pendingMessageId: string }
  | { kind: "streaming"; pendingMessageId: string }
  | { kind: "error"; lastError: ChatError };

export interface ChatSession {
  id: string;
  messages: Message[];
  status: ChatSessionStatus;
  isOpen: boolean;
}
