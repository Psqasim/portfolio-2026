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

test.describe("ChatWidget — US2 multilingual mirroring", () => {
  test("Roman Urdu input gets a Roman Urdu reply with tech-stack content", async ({
    page,
  }) => {
    await page.route("**/api/chat", (route) =>
      mockChat(
        route,
        [
          "Qasim Python, FastAPI, ",
          "OpenAI Agents SDK, MCP, aur ",
          "Next.js pe kaam karta hai.",
        ],
        "getSkills",
      ),
    );

    await page.goto("/");
    await page.getByRole("button", { name: /open chat/i }).click();
    const panel = page.getByRole("dialog", { name: /chat with qasim/i });
    await panel.getByRole("textbox", { name: /type your message/i }).fill(
      "Qasim kis tech stack pe kaam karta hai?",
    );
    await page.getByRole("button", { name: /send message/i }).click();

    await expect(panel.getByText(/Python/i)).toBeVisible({ timeout: 5_000 });
    // Both the user message ("…karta hai?") and the bot reply contain
    // "karta hai" — assert the bot reply (rendered last) is visible.
    await expect(panel.getByText(/karta hai/i).last()).toBeVisible();
  });

  test("Urdu-script input gets an Urdu-script reply", async ({ page }) => {
    await page.route("**/api/chat", (route) =>
      mockChat(
        route,
        ["قاسم نے کئی پروڈکشن سسٹمز ", "بنائے ہیں۔"],
        "getSystems",
      ),
    );

    await page.goto("/");
    await page.getByRole("button", { name: /open chat/i }).click();
    const panel = page.getByRole("dialog", { name: /chat with qasim/i });
    await panel.getByRole("textbox", { name: /type your message/i }).fill(
      "قاسم نے کیا کیا بنایا ہے؟",
    );
    await page.getByRole("button", { name: /send message/i }).click();

    // Both the user prompt and the bot reply start with "قاسم" — assert
    // the bot reply (rendered last) carries Urdu-script characters.
    const reply = panel.getByText(/قاسم/).last();
    await expect(reply).toBeVisible({ timeout: 5_000 });
    const text = await reply.textContent();
    expect(text).toMatch(/[؀-ۿ]/);
  });
});

test.describe("ChatWidget — US3 session controls", () => {
  test("minimize preserves messages; reopen shows the same conversation", async ({
    page,
  }) => {
    let call = 0;
    await page.route("**/api/chat", (route) => {
      call += 1;
      return mockChat(route, [`reply ${call}`], "");
    });

    await page.goto("/");
    await page.getByRole("button", { name: /open chat/i }).click();
    const panel = page.getByRole("dialog", { name: /chat with qasim/i });
    const input = panel.getByRole("textbox", { name: /type your message/i });
    const send = page.getByRole("button", { name: /send message/i });

    for (let i = 1; i <= 3; i++) {
      await input.fill(`msg ${i}`);
      await send.click();
      await expect(panel.getByText(`reply ${i}`)).toBeVisible({
        timeout: 5_000,
      });
    }

    await page.getByRole("button", { name: /minimize chat/i }).click();
    await expect(panel).toBeHidden();

    await page.getByRole("button", { name: /open chat/i }).click();
    await expect(panel).toBeVisible();

    for (let i = 1; i <= 3; i++) {
      await expect(panel.getByText(`msg ${i}`)).toBeVisible();
      await expect(panel.getByText(`reply ${i}`)).toBeVisible();
    }
  });

  test("New Chat clears the session and the next request omits prior history", async ({
    page,
  }) => {
    const requestBodies: unknown[] = [];

    await page.route("**/api/chat", async (route) => {
      try {
        const post = route.request().postData();
        if (post) requestBodies.push(JSON.parse(post));
      } catch {
        /* ignore parse errors */
      }
      return mockChat(route, ["ack"], "");
    });

    await page.goto("/");
    await page.getByRole("button", { name: /open chat/i }).click();
    const panel = page.getByRole("dialog", { name: /chat with qasim/i });
    const input = panel.getByRole("textbox", { name: /type your message/i });

    await input.fill("first");
    await page.getByRole("button", { name: /send message/i }).click();
    await expect(panel.getByText("ack").first()).toBeVisible({ timeout: 5_000 });

    await page.getByRole("button", { name: /start a new chat/i }).click();
    // Use exact match: the welcome screen's suggestion "What's his tech
    // stack?" otherwise substring-matches "ack".
    await expect(panel.getByText("first", { exact: true })).toHaveCount(0);
    await expect(panel.getByText("ack", { exact: true })).toHaveCount(0);

    await input.fill("second");
    await page.getByRole("button", { name: /send message/i }).click();
    await expect(panel.getByText("ack", { exact: true }).first()).toBeVisible({
      timeout: 5_000,
    });

    expect(requestBodies.length).toBe(2);
    const second = requestBodies[1] as {
      message: string;
      history: Array<{ content: string }>;
    };
    expect(second.message).toBe("second");
    expect(second.history.find((h) => h.content === "first")).toBeUndefined();
  });

  test("page reload starts an empty session", async ({ page }) => {
    await page.route("**/api/chat", (route) =>
      mockChat(route, ["hello back"], ""),
    );

    await page.goto("/");
    await page.getByRole("button", { name: /open chat/i }).click();
    const panel = page.getByRole("dialog", { name: /chat with qasim/i });
    await panel
      .getByRole("textbox", { name: /type your message/i })
      .fill("survives reload?");
    await page.getByRole("button", { name: /send message/i }).click();
    await expect(panel.getByText("hello back")).toBeVisible({ timeout: 5_000 });

    await page.reload();

    await page.getByRole("button", { name: /open chat/i }).click();
    const refreshed = page.getByRole("dialog", { name: /chat with qasim/i });
    await expect(refreshed.getByText("survives reload?")).toHaveCount(0);
    await expect(refreshed.getByText("hello back")).toHaveCount(0);
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
