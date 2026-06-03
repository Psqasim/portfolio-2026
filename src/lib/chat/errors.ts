import type { ChatError, ChatErrorCode } from "@/types/chat";

const HTTP_STATUS: Record<ChatErrorCode, number> = {
  invalid_input: 400,
  input_too_long: 413,
  rate_limited: 429,
  invalid_api_key: 401,
  insufficient_quota: 429,
  rate_limit_exceeded: 429,
  provider_unavailable: 503,
  provider_error: 502,
  internal_error: 500,
};

const PROVIDER_UNAVAILABLE_MSG = "AI is temporarily unavailable. Please try again later.";

const USER_MESSAGE: Record<ChatErrorCode, string> = {
  invalid_input: "Please enter a message.",
  input_too_long: "Messages are limited to 500 characters.",
  rate_limited: "You've hit the per-hour limit. Please try again later.",
  // All provider-side failures share one friendly message — internals never leak.
  invalid_api_key: PROVIDER_UNAVAILABLE_MSG,
  insufficient_quota: PROVIDER_UNAVAILABLE_MSG,
  rate_limit_exceeded: PROVIDER_UNAVAILABLE_MSG,
  provider_unavailable: PROVIDER_UNAVAILABLE_MSG,
  provider_error: PROVIDER_UNAVAILABLE_MSG,
  internal_error: "Something went wrong. Please try again.",
};

const RETRYABLE: Record<ChatErrorCode, boolean> = {
  invalid_input: false,
  input_too_long: false,
  rate_limited: false,
  invalid_api_key: true,
  insufficient_quota: true,
  rate_limit_exceeded: true,
  provider_unavailable: true,
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

// Map an unknown upstream error (OpenAI SDK / Agents SDK) onto our error code.
// We inspect status + code defensively — the SDK shape can vary.
export function classifyProviderError(error: unknown): ChatErrorCode {
  if (!error || typeof error !== "object") return "provider_error";
  const e = error as {
    status?: number;
    statusCode?: number;
    code?: string;
    type?: string;
    error?: { code?: string; type?: string };
    message?: string;
  };
  const status = e.status ?? e.statusCode;
  const code = e.code ?? e.error?.code;
  const type = e.type ?? e.error?.type;

  if (code === "invalid_api_key" || type === "invalid_request_error" && status === 401) {
    return "invalid_api_key";
  }
  if (status === 401) return "invalid_api_key";
  if (code === "insufficient_quota" || code === "billing_hard_limit_reached") {
    return "insufficient_quota";
  }
  if (code === "rate_limit_exceeded") return "rate_limit_exceeded";
  if (status === 429) return "rate_limit_exceeded";
  if (status !== undefined && status >= 500 && status < 600) {
    return "provider_unavailable";
  }
  return "provider_error";
}

// Developer-only server log line. Never reaches the client.
export function logProviderError(code: ChatErrorCode, error: unknown): void {
  const e = error as { status?: number; code?: string; message?: string } | null;
  // Single-line structured log — easy to grep, no stack noise.
  console.error(
    `[chat] provider error code=${code} status=${e?.status ?? "?"} upstreamCode=${e?.code ?? "?"} msg=${e?.message ?? String(error)}`,
  );
}
