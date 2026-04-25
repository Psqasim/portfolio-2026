import { test, expect } from "@playwright/test";

test("skills section renders 5 categories with counts [6, 5, 9, 2, 4] and no proficiency metadata", async ({
  page,
}) => {
  await page.goto("/");
  const skills = page.locator("#skills");
  await skills.scrollIntoViewIfNeeded();
  await expect(skills).toBeVisible();

  const categories = skills.locator('[data-testid="skill-category"]');
  await expect(categories).toHaveCount(5);

  const expectedCounts = [6, 5, 9, 2, 4];
  for (let i = 0; i < expectedCounts.length; i++) {
    // Scope to the primary marquee set; the duplicate copy is aria-hidden.
    await expect(
      categories
        .nth(i)
        .locator('.marquee-set:not([aria-hidden]) [data-testid="skill-item"]'),
    ).toHaveCount(expectedCounts[i]!);
  }

  const skillsHtml = await skills.innerHTML();
  expect(skillsHtml).not.toMatch(/[★☆]/);
  expect(skillsHtml).not.toMatch(/%/);
  expect(skillsHtml).not.toMatch(/\byears?\b/i);
  expect(skillsHtml).not.toMatch(/\blevel\b/i);
});
