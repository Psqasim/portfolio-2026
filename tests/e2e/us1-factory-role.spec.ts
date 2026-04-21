import { test, expect } from "@playwright/test";

test.describe("US1 — Factory-de-Odoo role badge", () => {
  test("factory-de-odoo card shows 'Architecture Advisor'", async ({ page }) => {
    await page.goto("/");

    const card = page
      .locator('[data-testid="system-card"]')
      .filter({ hasText: "Factory-de-Odoo" });
    await expect(card).toHaveCount(1);
    await expect(card.getByText("Architecture Advisor")).toBeVisible();
  });
});
