import { describe, it, expect } from "vitest";
import { systems } from "@/data/systems";

describe("systems data module", () => {
  it("exports exactly 5 entries", () => {
    expect(systems).toHaveLength(5);
  });

  it("each entry has 2–4 metrics inclusive", () => {
    for (const s of systems) {
      expect(s.metrics.length).toBeGreaterThanOrEqual(2);
      expect(s.metrics.length).toBeLessThanOrEqual(4);
    }
  });

  it("each githubUrl starts with https://github.com/", () => {
    for (const s of systems) {
      expect(s.githubUrl).toMatch(/^https:\/\/github\.com\//);
    }
  });

  it("Factory-de-Odoo entry has roleBadge 'Architecture Advisor'", () => {
    const entry = systems.find((s) => /factory-de-odoo/i.test(s.slug));
    expect(entry).toBeDefined();
    expect(entry?.roleBadge).toBe("Architecture Advisor");
  });

  it("every entry has at least one tech tag", () => {
    for (const s of systems) {
      expect(s.tech.length).toBeGreaterThan(0);
    }
  });
});
