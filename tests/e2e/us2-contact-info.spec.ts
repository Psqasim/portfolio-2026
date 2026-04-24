import { test, expect } from "@playwright/test";

test("contact info renders required channels without a phone number", async ({ page }) => {
  await page.goto("/");
  const contact = page.locator("#contact");
  await contact.scrollIntoViewIfNeeded();
  await expect(contact).toBeVisible();

  await expect(
    contact.getByRole("link", { name: /muhammadqasim0326@gmail\.com/i }),
  ).toHaveAttribute("href", /^mailto:muhammadqasim0326@gmail\.com$/);

  await expect(contact.getByText(/Karachi, Pakistan/i)).toBeVisible();

  await expect(
    contact.getByRole("link", { name: /github/i }).first(),
  ).toHaveAttribute("href", /github\.com\//);

  const linkedin = contact.getByRole("link", { name: /linkedin/i }).first();
  await expect(linkedin).toHaveAttribute(
    "href",
    "https://linkedin.com/in/muhammadqasim-dev",
  );

  await expect(contact.getByRole("link", { name: /^x( |$)|twitter/i }).first()).toBeVisible();

  // FR-024: no phone number must appear in visible page text.
  // Scope to body innerText to avoid matching Next.js dev-mode cache-bust
  // timestamps (`?v=...`) or asset hashes in HTML attributes.
  const visibleText = await page.locator("body").innerText();
  expect(visibleText).not.toMatch(/\+?\d[\d\s()-]{7,}/);
});
