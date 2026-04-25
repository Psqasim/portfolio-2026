import { describe, it, expect } from "vitest";
import { SYSTEM_PROMPT } from "@/lib/chat/system-prompt";

describe("SYSTEM_PROMPT", () => {
  it("is a non-empty string", () => {
    expect(typeof SYSTEM_PROMPT).toBe("string");
    expect(SYSTEM_PROMPT.length).toBeGreaterThan(0);
  });

  it("contains the approved title 'Agentic AI Engineer'", () => {
    expect(SYSTEM_PROMPT).toContain("Agentic AI Engineer");
  });

  it("contains the user-message delimiter token", () => {
    expect(SYSTEM_PROMPT).toContain("<<<USER MESSAGE>>>");
  });

  it.each([
    "junior",
    "aspiring",
    "learning",
    "exploring",
    "Frontend Developer",
    "navy",
    "military",
    "government",
  ])("does not contain forbidden term '%s' (case-insensitive)", (term) => {
    expect(SYSTEM_PROMPT.toLowerCase()).not.toContain(term.toLowerCase());
  });
});
