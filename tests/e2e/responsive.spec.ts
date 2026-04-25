import { test, expect } from "@playwright/test";

const WIDTHS = [360, 414, 768, 1024, 1440, 1920];
const THEMES = ["dark", "light"] as const;

for (const width of WIDTHS) {
  for (const theme of THEMES) {
    test(`responsive ${width}px · ${theme}: no horizontal overflow`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript((target) => {
        try {
          window.localStorage.setItem("theme", target);
        } catch {
          /* ignore */
        }
      }, theme);

      await page.goto("/");
      await page.locator("#home h1").waitFor({ state: "visible" });

      const pageScrolls = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(pageScrolls.scrollWidth).toBeLessThanOrEqual(pageScrolls.clientWidth + 1);

      const overflow = await page.evaluate(() => {
        const results: string[] = [];
        const vw = window.innerWidth;
        document.querySelectorAll("main *").forEach((el) => {
          // Skip marquee track + its descendants: the parent .marquee-mask
          // has overflow:hidden so wide children are visually clipped.
          if ((el as HTMLElement).closest(".marquee-track")) return;
          const rect = (el as HTMLElement).getBoundingClientRect();
          if (rect.right > vw + 1) {
            results.push(`${el.tagName.toLowerCase()}.${(el as HTMLElement).className || ""}`);
          }
        });
        return results.slice(0, 10);
      });
      expect(overflow, overflow.join("\n")).toEqual([]);
    });
  }
}
