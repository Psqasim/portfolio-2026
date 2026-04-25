import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";

describe("rateLimiter.check", () => {
  beforeEach(async () => {
    vi.resetModules();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-25T10:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows the first 10 calls in a window with decrementing remaining", async () => {
    const { check, LIMIT_PER_WINDOW, WINDOW_MS } = await import(
      "@/lib/chat/rate-limiter"
    );
    const ip = "1.2.3.4";
    for (let i = 1; i <= LIMIT_PER_WINDOW; i++) {
      const r = check(ip);
      expect(r.allowed).toBe(true);
      expect(r.remaining).toBe(LIMIT_PER_WINDOW - i);
      expect(r.resetAt).toBeGreaterThan(Date.now());
      expect(r.resetAt).toBeLessThanOrEqual(Date.now() + WINDOW_MS);
    }
  });

  it("rejects the 11th call without incrementing the counter", async () => {
    const { check, LIMIT_PER_WINDOW } = await import("@/lib/chat/rate-limiter");
    const ip = "1.2.3.4";
    for (let i = 0; i < LIMIT_PER_WINDOW; i++) check(ip);

    const eleventh = check(ip);
    expect(eleventh.allowed).toBe(false);
    expect(eleventh.remaining).toBe(0);

    // calling again should remain blocked, not 12-block
    const twelfth = check(ip);
    expect(twelfth.allowed).toBe(false);
  });

  it("resets the counter when the 1-hour window has passed", async () => {
    const { check, WINDOW_MS, LIMIT_PER_WINDOW } = await import(
      "@/lib/chat/rate-limiter"
    );
    const ip = "1.2.3.4";
    for (let i = 0; i < LIMIT_PER_WINDOW; i++) check(ip);
    expect(check(ip).allowed).toBe(false);

    vi.advanceTimersByTime(WINDOW_MS + 1);

    const fresh = check(ip);
    expect(fresh.allowed).toBe(true);
    expect(fresh.remaining).toBe(LIMIT_PER_WINDOW - 1);
    expect(fresh.resetAt).toBe(Date.now() + WINDOW_MS);
  });

  it("buckets per IP — different IPs have independent counters", async () => {
    const { check, LIMIT_PER_WINDOW } = await import("@/lib/chat/rate-limiter");
    for (let i = 0; i < LIMIT_PER_WINDOW; i++) check("a.a.a.a");
    expect(check("a.a.a.a").allowed).toBe(false);
    expect(check("b.b.b.b").allowed).toBe(true);
  });

  it("treats 'unknown' IP as its own bucket", async () => {
    const { check, LIMIT_PER_WINDOW } = await import("@/lib/chat/rate-limiter");
    for (let i = 0; i < LIMIT_PER_WINDOW; i++) check("unknown");
    expect(check("unknown").allowed).toBe(false);
    expect(check("real-ip").allowed).toBe(true);
  });

  it("resetAt equals windowStart + WINDOW_MS", async () => {
    const { check, WINDOW_MS } = await import("@/lib/chat/rate-limiter");
    const before = Date.now();
    const r = check("x.x.x.x");
    expect(r.resetAt).toBe(before + WINDOW_MS);
  });
});
