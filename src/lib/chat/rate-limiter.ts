export const WINDOW_MS = 3_600_000; // 1 hour
export const LIMIT_PER_WINDOW = 10;

interface RateLimitRecord {
  count: number;
  windowStart: number;
}

const buckets = new Map<string, RateLimitRecord>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function check(ip: string): RateLimitResult {
  const now = Date.now();
  let record = buckets.get(ip);

  if (!record || now - record.windowStart >= WINDOW_MS) {
    record = { count: 0, windowStart: now };
  }

  if (record.count >= LIMIT_PER_WINDOW) {
    buckets.set(ip, record);
    return {
      allowed: false,
      remaining: 0,
      resetAt: record.windowStart + WINDOW_MS,
    };
  }

  record.count += 1;
  buckets.set(ip, record);

  return {
    allowed: true,
    remaining: LIMIT_PER_WINDOW - record.count,
    resetAt: record.windowStart + WINDOW_MS,
  };
}

// Test-only escape hatch — not exported via index. Call this in beforeEach if a
// test suite cross-contaminates the module-scope Map.
export function __resetForTests(): void {
  buckets.clear();
}
