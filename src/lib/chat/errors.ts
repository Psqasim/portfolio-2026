import type { ChatError, ChatErrorCode } from "@/types/chat";

const HTTP_STATUS: Record<ChatErrorCode, number> = {
  invalid_input: 400,
  input_too_long: 413,
  rate_limited: 429,
  provider_error: 502,
  internal_error: 500,
};

const USER_MESSAGE: Record<ChatErrorCode, string> = {
  invalid_input: "Please enter a message.",
  input_too_long: "Messages are limited to 500 characters.",
  rate_limited: "You've hit the per-hour limit. Please try again later.",
  provider_error: "AI provider is unavailable. Please try again.",
  internal_error: "Something went wrong. Please try again.",
};

const RETRYABLE: Record<ChatErrorCode, boolean> = {
  invalid_input: false,
  input_too_long: false,
  rate_limited: false,
  provider_error: true,
  internal_error: true,
};

export function httpStatusFor(code: ChatErrorCode): number {
  return HTTP_STATUS[code];
}

export interface MakeChatErrorOptions {
  message?: string;
  resetAt?: string;
}

export function makeChatError(
  code: ChatErrorCode,
  options: MakeChatErrorOptions = {},
): ChatError {
  const error: ChatError = {
    code,
    message: options.message ?? USER_MESSAGE[code],
    retryable: RETRYABLE[code],
  };
  if (options.resetAt !== undefined) {
    error.resetAt = options.resetAt;
  }
  return error;
}

export function errorResponseBody(error: ChatError): { error: ChatError } {
  return { error };
}
