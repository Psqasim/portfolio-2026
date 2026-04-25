import { test, expect, type Route } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { systems } from "../../src/data/systems";

// Mock the streaming /api/chat endpoint with deterministic SSE so the
// test does not require an OPENAI_API_KEY or any network access.
async function mockChat(route: Route, deltas: string[], toolCall = "getSystems") {
  const lines: string[] = [];
  if (toolCall) {
    lines.push(`event: tool_call`);
    lines.push(`data: ${JSON.stringify({ name: toolCall })}`);
    lines.push("");
  }
  for (const d of deltas) {
    lines.push(`event: delta`);
    lines.push(`data: ${JSON.stringify({ text: d })}`);
    lines.push("");
  }
  lines.push(`event: done`);
  lines.push(`data: ${JSON.stringify({ finishReason: "stop" })}`);
  lines.push("");
  await route.fulfill({
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
    },
    body: lines.join("\n") + "\n",
  });
}

test.describe("ChatWidget — US1 grounded English answer", () => {
  test("opens panel, streams reply, contains a real system name", async ({
    page,
  }) => {
    const realSystem = systems[0]!.name;

    await page.route("**/api/chat", (route) =>
      mockChat(route, [
        "Qasim has shipped ",
        `${realSystem}, `,
        "and several other production systems.",
      ]),
    );

    await page.goto("/");

    const trigger = page.getByRole("button", { name: /open chat/i });
    await expect(trigger).toBeVisible();
    await trigger.click();

    const panel = page.getByRole("dialog", { name: /chat with qasim/i });
    await expect(panel).toBeVisible();

    const input = panel.getByRole("textbox", { name: /type your message/i });
    await input.fill("What systems has Qasim shipped?");
    await page.getByRole("button", { name: /send message/i }).click();

    await expect(panel.getByText(realSystem)).toBeVisible({ timeout: 5_000 });
  });
});

test.describe("ChatWidget — accessibility", () => {
  for (const viewport of [
    { width: 360, height: 800, label: "mobile-360" },
    { width: 1440, height: 900, label: "desktop-1440" },
  ]) {
    for (const theme of ["dark", "light"] as const) {
      test(`axe: chat panel — ${viewport.label} / ${theme}`, async ({
        page,
      }) => {
        await page.setViewportSize({
          width: viewport.width,
          height: viewport.height,
        });

        await page.route("**/api/chat", (route) =>
          mockChat(route, ["Hello — how can I help?"], ""),
        );

        await page.addInitScript(
          ([t]) => {
            try {
              localStorage.setItem("theme", t!);
            } catch {
              /* ignore */
            }
          },
          [theme],
        );

        await page.goto("/");
        await page.getByRole("button", { name: /open chat/i }).click();
        const panel = page.getByRole("dialog", { name: /chat with qasim/i });
        await expect(panel).toBeVisible();

        const results = await new AxeBuilder({ page })
          .include('[role="dialog"]')
          .withTags(["wcag2a", "wcag2aa"])
          .analyze();

        const blocking = results.violations.filter(
          (v) => v.impact === "critical" || v.impact === "serious",
        );
        expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
      });
    }
  }
});
