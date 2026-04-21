import { test, expect } from "@playwright/test";

test.describe("US1 — Hero CTA smooth scroll", () => {
  test("clicking 'View My Work' scrolls to #systems", async ({ page }) => {
    await page.goto("/");

    const initialY = await page.evaluate(() => window.scrollY);
    expect(initialY).toBe(0);

    await page.getByRole("link", { name: /view my work/i }).click();
    await page.waitForTimeout(1000);

    const finalY = await page.evaluate(() => window.scrollY);
    expect(finalY).toBeGreaterThan(0);

    const systemsInView = await page.evaluate(() => {
      const el = document.getElementById("systems");
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    });
    expect(systemsInView).toBe(true);
  });
});
