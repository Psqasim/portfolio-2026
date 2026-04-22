import { test, expect } from "@playwright/test";

test("footer renders full-name block, quote, copyright, and AI teaser", async ({ page }) => {
  await page.goto("/");
  const footer = page.getByRole("contentinfo");
  await footer.scrollIntoViewIfNeeded();

  await expect(footer).toContainText("MUHAMMAD QASIM");
  await expect(footer).toContainText("ムハンマド・カシム");
  await expect(footer).toContainText("Surpass your limits. Right here, right now.");
  await expect(footer).toContainText(/Yami Sukehiro/);
  await expect(footer).toContainText("© 2026 Muhammad Qasim");
  await expect(footer).toContainText(/embedded AI agent/i);

  const quote = footer.locator("blockquote, em, i").filter({
    hasText: /Surpass your limits/,
  });
  await expect(quote.first()).toBeVisible();
});
