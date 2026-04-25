// Minimal SSE-over-ReadableStream encoder for /api/chat.
// Event names used on the wire: "delta" | "tool_call" | "done" | "error".

const encoder = new TextEncoder();

function frame(name: string, data: unknown): Uint8Array {
  return encoder.encode(`event: ${name}\ndata: ${JSON.stringify(data)}\n\n`);
}

export interface SseStream {
  stream: ReadableStream<Uint8Array>;
  emit: (name: string, data: unknown) => void;
  close: () => void;
}

export function makeSseStream(): SseStream {
  let controller!: ReadableStreamDefaultController<Uint8Array>;
  let closed = false;

  const stream = new ReadableStream<Uint8Array>({
    start(c) {
      controller = c;
    },
    cancel() {
      closed = true;
    },
  });

  function emit(name: string, data: unknown): void {
    if (closed) return;
    try {
      controller.enqueue(frame(name, data));
    } catch {
      closed = true;
    }
  }

  function close(): void {
    if (closed) return;
    closed = true;
    try {
      controller.close();
    } catch {
      // already closed
    }
  }

  return { stream, emit, close };
}

export const SSE_HEADERS = {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache, no-transform",
  Connection: "keep-alive",
  "X-Accel-Buffering": "no",
} as const;
