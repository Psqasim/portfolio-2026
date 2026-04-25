import { test, expect } from "@playwright/test";

test.describe("US1 — Hero", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("hero announces identity and metrics without horizontal scroll", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page.locator("h1")).toContainText("Muhammad Qasim");
    await expect(page.getByText("Agentic AI Engineer").first()).toBeVisible();
    await expect(
      page.getByText(
        "6 systems shipped · 200+ tests passing · Deployed on cloud",
      ),
    ).toBeVisible();

    const noHScroll = await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 1,
    );
    expect(noHScroll).toBe(true);
  });
});
