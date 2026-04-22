import { test, expect } from "@playwright/test";

test("about section shows bio, education timeline, and a current GIAIC entry", async ({
  page,
}) => {
  await page.goto("/");
  const about = page.locator("#about");
  await about.scrollIntoViewIfNeeded();
  await expect(about).toBeVisible();

  await expect(about).toContainText(/Karachi/);
  await expect(about).toContainText(/GIAIC/);

  const entries = about.locator('[data-testid="education-entry"]');
  await expect(entries).toHaveCount(3);

  const current = about.locator('[data-testid="education-entry"][data-current="true"]');
  await expect(current).toHaveCount(1);
  await expect(current).toContainText(/GIAIC/);
});
