import { test, expect } from "@playwright/test";

test.describe("US1 — Systems grid", () => {
  test("renders exactly 5 cards, each with badge, metrics, tech, github link", async ({
    page,
  }) => {
    await page.goto("/");

    const cards = page.locator('[data-testid="system-card"]');
    await expect(cards).toHaveCount(5);

    const count = await cards.count();
    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);
      await expect(card.locator('[data-testid="system-status"]')).toBeVisible();
      await expect(
        card.locator('[data-testid="system-metric"]').first(),
      ).toBeVisible();
      const metricCount = await card
        .locator('[data-testid="system-metric"]')
        .count();
      expect(metricCount).toBeGreaterThanOrEqual(2);
      expect(metricCount).toBeLessThanOrEqual(4);
      await expect(
        card.locator('[data-testid="system-tech"]').first(),
      ).toBeVisible();
      const githubHref = await card
        .locator('a[data-testid="system-github"]')
        .getAttribute("href");
      expect(githubHref).toMatch(/^https:\/\/github\.com\//);
    }
  });
});
