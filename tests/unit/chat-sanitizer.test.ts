import { describe, it, expect } from "vitest";
import { sanitize } from "@/lib/chat/sanitizer";

describe("sanitize", () => {
  it("redacts email addresses", () => {
    const result = sanitize("Reach me at foo@bar.com please");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.text).toContain("[email redacted]");
      expect(result.text).not.toContain("foo@bar.com");
    }
  });

  it("redacts phone numbers", () => {
    const result = sanitize("Call +1 415 555 1234 anytime");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.text).toContain("[phone redacted]");
      expect(result.text).not.toMatch(/\d{3}[\s-]\d{4}/);
    }
  });

  it("redacts credit-card-like digit groups", () => {
    const result = sanitize("Card 4111 1111 1111 1111 expires soon");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.text).toContain("[card redacted]");
      expect(result.text).not.toContain("4111");
    }
  });

  it("redacts mixed PII (email + phone + card) in one message", () => {
    const result = sanitize(
      "Email foo@bar.com, phone +1 415 555 1234, card 4111-1111-1111-1111",
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.text).toContain("[email redacted]");
      expect(result.text).toContain("[phone redacted]");
      expect(result.text).toContain("[card redacted]");
    }
  });

  it("rejects messages over 500 chars with reason 'too_long'", () => {
    const result = sanitize("x".repeat(600));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("too_long");
  });

  it("accepts a 500-char message exactly at the cap", () => {
    const result = sanitize("a".repeat(500));
    expect(result.ok).toBe(true);
  });

  it("rejects whitespace-only input with reason 'empty'", () => {
    const result = sanitize("   \n  \t ");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("empty");
  });

  it("rejects empty string with reason 'empty'", () => {
    const result = sanitize("");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("empty");
  });

  it("preserves a clean message untouched apart from trim", () => {
    const result = sanitize("  What systems has Qasim shipped?  ");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.text).toBe("What systems has Qasim shipped?");
    }
  });
});
