import { describe, expect, it } from "vitest";
import { skillCategories } from "@/data/skills";

describe("skillCategories", () => {
  it("has five ordered categories with the expected shape", () => {
    expect(skillCategories).toHaveLength(5);
  });

  it("each category has the expected skill count", () => {
    const counts = skillCategories.map((c) => c.skills.length);
    expect(counts).toEqual([6, 5, 9, 2, 4]);
  });

  it("each category carries the expected kanji label", () => {
    const kanji = skillCategories.map((c) => c.kanji);
    expect(kanji).toEqual(["知能", "言語", "基盤", "情報", "画面"]);
  });

  it("no skill metadata mentions levels, years, or stars", () => {
    const blob = JSON.stringify(skillCategories);
    expect(blob).not.toMatch(/[★☆]/);
    expect(blob).not.toMatch(/%/);
    expect(blob).not.toMatch(/level/i);
    expect(blob).not.toMatch(/years?/i);
  });
});
