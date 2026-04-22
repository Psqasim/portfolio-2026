import { test, expect } from "@playwright/test";

test("submitting a valid form shows a success toast within 5s", async ({ page }) => {
  await page.route("**/api.web3forms.com/submit", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true, message: "Email sent successfully" }),
    }),
  );

  await page.goto("/");
  const contact = page.locator("#contact");
  await contact.scrollIntoViewIfNeeded();

  await contact.getByLabel(/^name/i).fill("Test Visitor");
  await contact.getByLabel(/^email/i).fill("visitor@example.com");
  await contact.getByLabel(/^message/i).fill("Hi Qasim — let's talk.");

  const pressedAt = Date.now();
  await contact.getByRole("button", { name: /send/i }).click();

  const toast = page.getByRole("status").filter({ hasText: /sent|success|thanks|thank/i });
  await expect(toast).toBeVisible({ timeout: 5000 });
  expect(Date.now() - pressedAt).toBeLessThan(5000);

  await expect(contact.getByLabel(/^name/i)).toHaveValue("");
  await expect(contact.getByLabel(/^email/i)).toHaveValue("");
  await expect(contact.getByLabel(/^message/i)).toHaveValue("");
});
