import { test, expect } from "@playwright/test";

test("submitting with empty message shows inline error and no network request", async ({
  page,
}) => {
  let submitted = false;
  page.on("request", (req) => {
    if (req.url().includes("api.web3forms.com/submit")) submitted = true;
  });

  await page.goto("/");
  const contact = page.locator("#contact");
  await contact.scrollIntoViewIfNeeded();

  await contact.getByLabel(/^name/i).fill("Test Visitor");
  await contact.getByLabel(/^email/i).fill("visitor@example.com");
  // Leave message empty.

  await contact.getByRole("button", { name: /send/i }).click();

  await expect(
    contact.getByText(/required|please enter|cannot be empty|missing/i).first(),
  ).toBeVisible();

  // Give the network a moment to fire — it must not.
  await page.waitForTimeout(300);
  expect(submitted).toBe(false);
});
