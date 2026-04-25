import { test, expect } from "@playwright/test";

test.use({ viewport: { width: 375, height: 812 } });

test("hamburger opens drawer with 5 links; tapping Systems closes and scrolls", async ({ page }) => {
  await page.goto("/");
  const hamburger = page.getByRole("button", { name: /open menu/i });
  await hamburger.click();

  const drawer = page.getByRole("dialog", { name: /menu|navigation/i });
  await expect(drawer).toBeVisible();
  await expect(drawer.getByRole("link")).toHaveCount(5);

  await drawer.getByRole("link", { name: /systems/i }).click();
  await expect(drawer).toBeHidden();
  await expect(page.locator("#systems")).toBeInViewport({ ratio: 0.1 });
});
