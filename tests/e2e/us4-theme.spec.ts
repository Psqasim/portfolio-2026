import { test, expect } from "@playwright/test";

test("theme toggle flips dark class, persists across reload, no flash", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/dark/);

  await page.getByRole("button", { name: /toggle theme/i }).click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);

  // Capture class at domcontentloaded and at load — must match (no flash).
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const atDCL = await page.locator("html").getAttribute("class");
  await page.waitForLoadState("load");
  const atLoad = await page.locator("html").getAttribute("class");
  expect(atDCL).toBe(atLoad);
  await expect(page.locator("html")).not.toHaveClass(/dark/);
});
