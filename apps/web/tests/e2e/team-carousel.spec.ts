import { expect, test } from "@playwright/test";

// DSN-18: tek carousel — 4 görünür hekim; sıra 1 büyük (col-span-2),
// ok butonları ve 5 sn otomatik dönüş sırayı kaydırır.
test.describe("team carousel", () => {
  test("renders 4 cards with the first one big", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator('[data-section="doctors"]').locator("a[href^='/hekimlerimiz/']");
    await expect(cards).toHaveCount(4);
    await expect(cards.nth(0)).toHaveClass(/col-span-2/);
    for (let i = 1; i < 4; i++) {
      await expect(cards.nth(i)).not.toHaveClass(/col-span-2/);
    }
  });

  test("next arrow rotates the window - the big card doctor changes", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator('[data-section="doctors"]').locator("a[href^='/hekimlerimiz/']");
    const before = (await cards.nth(0).locator("p").first().textContent()) ?? "";
    await page.getByRole("button", { name: "Sonraki hekimler" }).click();
    const after = (await cards.nth(0).locator("p").first().textContent()) ?? "";
    expect(after).not.toBe(before);
  });

  test("auto-rotates every 5 seconds", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator('[data-section="doctors"]').locator("a[href^='/hekimlerimiz/']");
    const before = (await cards.nth(0).locator("p").first().textContent()) ?? "";
    await page.waitForTimeout(5400);
    const after = (await cards.nth(0).locator("p").first().textContent()) ?? "";
    expect(after).not.toBe(before);
  });
});
