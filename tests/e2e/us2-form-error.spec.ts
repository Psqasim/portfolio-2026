import { test, expect } from "@playwright/test";

test("error response shows error toast and retains fields", async ({ page }) => {
  await page.route("**/api.web3forms.com/submit", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: false, message: "rate limit" }),
    }),
  );

  await page.goto("/");
  const contact = page.locator("#contact");
  await contact.scrollIntoViewIfNeeded();

  const name = contact.getByLabel(/^name/i);
  const email = contact.getByLabel(/^email/i);
  const message = contact.getByLabel(/^message/i);

  await name.fill("Test Visitor");
  await email.fill("visitor@example.com");
  await message.fill("This should fail with rate limit.");

  await contact.getByRole("button", { name: /send/i }).click();

  // Exclude Next.js App Router's `__next-route-announcer__`, which is also
  // `role="alert"`. Match by text to target the toast.
  const alert = page
    .getByRole("alert")
    .filter({ hasText: /rate limit|error|trouble|retry/i });
  await expect(alert).toBeVisible({ timeout: 5000 });

  await expect(name).toHaveValue("Test Visitor");
  await expect(email).toHaveValue("visitor@example.com");
  await expect(message).toHaveValue("This should fail with rate limit.");
});
