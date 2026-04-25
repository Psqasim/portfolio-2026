// POST /api/chat — streamed agent route. Server-side only.
// Contract: specs/002-chatbot-widget/contracts/chat-api.md

import { z } from "zod";
import { run } from "@openai/agents";
import { chatAgent } from "@/lib/chat/agent";
import { sanitize } from "@/lib/chat/sanitizer";
import { check as checkRateLimit } from "@/lib/chat/rate-limiter";
import {
  errorResponseBody,
  httpStatusFor,
  makeChatError,
} from "@/lib/chat/errors";
import { SSE_HEADERS, makeSseStream } from "@/lib/chat/sse";
import type { ChatErrorCode } from "@/types/chat";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RequestSchema = z.object({
  message: z.string().min(1).max(500),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(8000),
      }),
    )
    .max(40)
    .default([]),
});

function jsonError(
  code: ChatErrorCode,
  options: { resetAt?: string } = {},
): Response {
  const error = makeChatError(code, options);
  return Response.json(errorResponseBody(error), {
    status: httpStatusFor(code),
  });
}

function resolveIp(headers: Headers): string {
  const xff = headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = headers.get("x-real-ip");
  if (real && real.trim()) return real.trim();
  return "unknown";
}

function isMessageTooBig(error: z.ZodError): boolean {
  return error.issues.some(
    (issue) =>
      issue.path[0] === "message" &&
      issue.code === "too_big",
  );
}

export async function POST(request: Request): Promise<Response> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return jsonError("invalid_input");
  }

  const parsed = RequestSchema.safeParse(raw);
  if (!parsed.success) {
    if (isMessageTooBig(parsed.error)) {
      return jsonError("input_too_long");
    }
    return jsonError("invalid_input");
  }

  const ip = resolveIp(request.headers);
  const limit = checkRateLimit(ip);
  if (!limit.allowed) {
    return jsonError("rate_limited", {
      resetAt: new Date(limit.resetAt).toISOString(),
    });
  }

  const sanitized = sanitize(parsed.data.message);
  if (!sanitized.ok) {
    return jsonError(
      sanitized.reason === "too_long" ? "input_too_long" : "invalid_input",
    );
  }

  const input = [
    ...parsed.data.history.map((m) => ({ role: m.role, content: m.content })),
    { role: "user" as const, content: sanitized.text },
  ];

  let streamed: AsyncIterable<unknown>;
  try {
    // The SDK's `run` overloads infer a more specific input type than our
    // plain {role, content}[] shape; cast at the call boundary.
    streamed = (await run(
      chatAgent,
      input as unknown as Parameters<typeof run>[1],
      { stream: true, maxTurns: 2 },
    )) as unknown as AsyncIterable<unknown>;
  } catch {
    return jsonError("provider_error");
  }

  const { stream, emit, close } = makeSseStream();

  void (async () => {
    try {
      for await (const ev of streamed) {
        const evt = ev as {
          type?: string;
          name?: string;
          item?: { rawItem?: { name?: string }; toolName?: string };
          data?: { type?: string; delta?: string };
        };
        if (
          evt.type === "run_item_stream_event" &&
          evt.name === "tool_called"
        ) {
          const toolName =
            evt.item?.rawItem?.name ?? evt.item?.toolName ?? "unknown";
          emit("tool_call", { name: toolName });
          continue;
        }
        if (evt.type === "raw_model_stream_event") {
          const data = evt.data;
          if (
            data?.type === "output_text_delta" &&
            typeof data.delta === "string" &&
            data.delta.length > 0
          ) {
            emit("delta", { text: data.delta });
          }
        }
      }
      emit("done", { finishReason: "stop" });
    } catch {
      emit("error", makeChatError("provider_error"));
    } finally {
      close();
    }
  })();

  return new Response(stream, { status: 200, headers: SSE_HEADERS });
}

export function GET(): Response {
  return new Response(null, {
    status: 405,
    headers: { Allow: "POST" },
  });
}

export const PUT = GET;
export const DELETE = GET;
export const PATCH = GET;
