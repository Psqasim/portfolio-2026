import { describe, it, expect, beforeAll, beforeEach, vi } from "vitest";
import { systems } from "@/data/systems";

beforeAll(() => {
  process.env.OPENAI_API_KEY = "test-key-for-integration";
});

// Mock @openai/agents so we can drive the streaming events deterministically.
// Preserve `Agent` + `tool` so the agent module still constructs at import time.
vi.mock("@openai/agents", async () => {
  const actual =
    await vi.importActual<typeof import("@openai/agents")>("@openai/agents");
  return {
    ...actual,
    run: vi.fn(),
  };
});

interface FakeStreamEvent {
  type: string;
  name?: string;
  item?: unknown;
  data?: unknown;
}

function fakeStreamedRunResult(events: FakeStreamEvent[]) {
  return {
    [Symbol.asyncIterator]() {
      let i = 0;
      return {
        async next() {
          if (i < events.length) {
            const value = events[i++];
            return { value, done: false };
          }
          return { value: undefined, done: true };
        },
      };
    },
  };
}

interface ParsedSseEvent {
  name: string;
  data: unknown;
}

async function readSseEvents(response: Response): Promise<ParsedSseEvent[]> {
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  const events: ParsedSseEvent[] = [];
  let buf = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const parts = buf.split("\n\n");
    buf = parts.pop() ?? "";
    for (const part of parts) {
      const lines = part.split("\n");
      const eventLine = lines.find((l) => l.startsWith("event: "));
      const dataLine = lines.find((l) => l.startsWith("data: "));
      if (!eventLine || !dataLine) continue;
      events.push({
        name: eventLine.slice("event: ".length),
        data: JSON.parse(dataLine.slice("data: ".length)),
      });
    }
  }
  return events;
}

describe("POST /api/chat — happy path streaming", () => {
  beforeEach(async () => {
    const { __resetForTests } = await import("@/lib/chat/rate-limiter");
    __resetForTests();
    vi.clearAllMocks();
  });

  it("streams tool_call → multiple deltas → done in order; final text contains a real system name", async () => {
    const { run } = await import("@openai/agents");
    const runMock = run as unknown as ReturnType<typeof vi.fn>;

    const realSystemName = systems[0]!.name;
    runMock.mockResolvedValue(
      fakeStreamedRunResult([
        {
          type: "run_item_stream_event",
          name: "tool_called",
          item: {
            type: "tool_call_item",
            rawItem: { name: "getSystems" },
          },
        },
        {
          type: "raw_model_stream_event",
          data: { type: "output_text_delta", delta: "Qasim has shipped " },
        },
        {
          type: "raw_model_stream_event",
          data: { type: "output_text_delta", delta: `${realSystemName}.` },
        },
      ]),
    );

    const { POST } = await import("@/app/api/chat/route");
    const req = new Request("http://localhost/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "1.1.1.1",
      },
      body: JSON.stringify({
        message: "What systems has Qasim shipped?",
        history: [],
      }),
    });
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toMatch(/text\/event-stream/);

    const events = await readSseEvents(res);
    expect(events.map((e) => e.name)).toEqual([
      "tool_call",
      "delta",
      "delta",
      "done",
    ]);

    const toolCall = events[0]!;
    expect(toolCall.data).toEqual({ name: "getSystems" });

    const fullText = events
      .filter((e) => e.name === "delta")
      .map((e) => (e.data as { text: string }).text)
      .join("");
    expect(fullText).toContain(realSystemName);

    const last = events.at(-1)!;
    expect(last.name).toBe("done");
    expect(last.data).toMatchObject({ finishReason: expect.any(String) });
  });

  it("invokes run() with the user message appended after history", async () => {
    const { run } = await import("@openai/agents");
    const runMock = run as unknown as ReturnType<typeof vi.fn>;
    runMock.mockResolvedValue(
      fakeStreamedRunResult([
        {
          type: "raw_model_stream_event",
          data: { type: "output_text_delta", delta: "ok" },
        },
      ]),
    );

    const { POST } = await import("@/app/api/chat/route");
    const req = new Request("http://localhost/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "2.2.2.2",
      },
      body: JSON.stringify({
        message: "Hello",
        history: [{ role: "user", content: "Salaam!" }],
      }),
    });
    const res = await POST(req);
    await readSseEvents(res); // drain stream so the async loop runs

    expect(runMock).toHaveBeenCalledTimes(1);
    const [, input, options] = runMock.mock.calls[0] as [
      unknown,
      Array<{ role: string; content: string }>,
      { stream?: boolean; maxTurns?: number },
    ];
    // History + new turn are wrapped via the SDK's `user()` / `assistant()`
    // helpers so the OpenAI Agents SDK schema is satisfied (assistant items
    // need status + content arrays). Assert on shape, not on the helper's
    // exact returned object identity.
    expect(input).toHaveLength(2);
    expect(input[0]).toMatchObject({
      role: "user",
      content: [{ type: "input_text", text: "Salaam!" }],
    });
    expect(input[1]).toMatchObject({
      role: "user",
      content: [{ type: "input_text", text: "Hello" }],
    });
    expect(options.stream).toBe(true);
    expect(options.maxTurns).toBe(2);
  });
});
