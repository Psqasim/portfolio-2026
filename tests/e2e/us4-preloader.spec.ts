import { test, expect } from "@playwright/test";

test("preloader appears on first visit then stays away on reload", async ({ page, context }) => {
  await context.clearCookies();
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const preloader = page.getByTestId("preloader");
  await expect(preloader).toBeVisible();
  await expect(preloader).toContainText("AGENTIC AI ENGINEER");
  await expect(preloader).toContainText("ポートフォリオ起動中");

  // Must finish within 3.5s.
  await expect(preloader).toBeHidden({ timeout: 3500 });

  // Reload in the same browser context: session flag set → preloader should not mount.
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(200);
  await expect(page.getByTestId("preloader")).toHaveCount(0);
});
