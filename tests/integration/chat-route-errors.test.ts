import { describe, it, expect, beforeAll, beforeEach, vi } from "vitest";

beforeAll(() => {
  process.env.OPENAI_API_KEY = "test-key-for-integration-errors";
});

vi.mock("@openai/agents", async () => {
  const actual =
    await vi.importActual<typeof import("@openai/agents")>("@openai/agents");
  return {
    ...actual,
    run: vi.fn(),
  };
});

function makeReq(
  body: string | object,
  headers: Record<string, string> = {},
): Request {
  return new Request("http://localhost/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": "9.9.9.9",
      ...headers,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("POST /api/chat — error responses", () => {
  beforeEach(async () => {
    const { __resetForTests } = await import("@/lib/chat/rate-limiter");
    __resetForTests();
    vi.clearAllMocks();
  });

  it("returns 400 invalid_input on empty message", async () => {
    const { POST } = await import("@/app/api/chat/route");
    const res = await POST(makeReq({ message: "", history: [] }));
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: { code: string } };
    expect(body.error.code).toBe("invalid_input");
  });

  it("returns 400 invalid_input on malformed JSON", async () => {
    const { POST } = await import("@/app/api/chat/route");
    const res = await POST(makeReq("{not-json"));
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: { code: string } };
    expect(body.error.code).toBe("invalid_input");
  });

  it("returns 400 invalid_input on missing message field", async () => {
    const { POST } = await import("@/app/api/chat/route");
    const res = await POST(makeReq({ history: [] }));
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: { code: string } };
    expect(body.error.code).toBe("invalid_input");
  });

  it("returns 413 input_too_long on a 501-character message", async () => {
    const { POST } = await import("@/app/api/chat/route");
    const message = "x".repeat(501);
    const res = await POST(makeReq({ message, history: [] }));
    expect(res.status).toBe(413);
    const body = (await res.json()) as {
      error: { code: string; retryable: boolean };
    };
    expect(body.error.code).toBe("input_too_long");
    expect(body.error.retryable).toBe(false);
  });

  it("returns 429 rate_limited on the 11th call from the same IP", async () => {
    const { run } = await import("@openai/agents");
    const runMock = run as unknown as ReturnType<typeof vi.fn>;
    runMock.mockImplementation(() =>
      Promise.resolve({
        [Symbol.asyncIterator]() {
          return {
            async next() {
              return { value: undefined, done: true };
            },
          };
        },
      }),
    );
    const { POST } = await import("@/app/api/chat/route");

    // First 10 should pass through to streaming (200).
    for (let i = 0; i < 10; i++) {
      const res = await POST(
        makeReq({ message: "hi", history: [] }, { "x-forwarded-for": "5.5.5.5" }),
      );
      expect(res.status).toBe(200);
      // drain
      const reader = res.body!.getReader();
      while (!(await reader.read()).done) {
        /* drain */
      }
    }

    const eleventh = await POST(
      makeReq({ message: "hi", history: [] }, { "x-forwarded-for": "5.5.5.5" }),
    );
    expect(eleventh.status).toBe(429);
    const body = (await eleventh.json()) as {
      error: { code: string; resetAt?: string; retryable: boolean };
    };
    expect(body.error.code).toBe("rate_limited");
    expect(body.error.retryable).toBe(false);
    expect(typeof body.error.resetAt).toBe("string");
  });

  it("returns 502 provider_error when run() throws before any token", async () => {
    const { run } = await import("@openai/agents");
    const runMock = run as unknown as ReturnType<typeof vi.fn>;
    runMock.mockRejectedValue(new Error("upstream 500 from openai"));

    const { POST } = await import("@/app/api/chat/route");
    const res = await POST(makeReq({ message: "hello", history: [] }));
    expect(res.status).toBe(502);
    const body = (await res.json()) as {
      error: { code: string; retryable: boolean };
    };
    expect(body.error.code).toBe("provider_error");
    expect(body.error.retryable).toBe(true);
  });

  it("uses x-real-ip when x-forwarded-for is absent", async () => {
    const { run } = await import("@openai/agents");
    const runMock = run as unknown as ReturnType<typeof vi.fn>;
    runMock.mockResolvedValue({
      [Symbol.asyncIterator]() {
        return {
          async next() {
            return { value: undefined, done: true };
          },
        };
      },
    });
    const { POST } = await import("@/app/api/chat/route");

    const req = new Request("http://localhost/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-real-ip": "7.7.7.7" },
      body: JSON.stringify({ message: "hi", history: [] }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
  });
});
