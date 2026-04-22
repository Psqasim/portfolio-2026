import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const SECTIONS = ["home", "systems", "skills", "about", "contact"] as const;

for (const id of SECTIONS) {
  test(`axe: ${id} section has zero critical violations`, async ({ page }) => {
    await page.goto("/");
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();

    const results = await new AxeBuilder({ page })
      .include(`#${id}`)
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const critical = results.violations.filter((v) => v.impact === "critical");
    expect(critical, JSON.stringify(critical, null, 2)).toEqual([]);
  });
}
