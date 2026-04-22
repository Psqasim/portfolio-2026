import { test, expect } from "@playwright/test";

const SECTIONS = ["home", "systems", "skills", "about", "contact"] as const;

test("navbar links scroll to each section and set aria-current", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: /primary/i }).first();
  await expect(nav).toBeVisible();

  for (const id of SECTIONS) {
    const link = nav.getByRole("link", { name: new RegExp(`^${id}$`, "i") });
    await link.click();
    await page.waitForTimeout(400);

    const section = page.locator(`#${id}`);
    await expect(section).toBeInViewport({ ratio: 0.1 });

    const active = nav.locator('a[aria-current="true"]');
    await expect(active).toHaveCount(1);
    await expect(active).toHaveText(new RegExp(id, "i"));
  }
});
