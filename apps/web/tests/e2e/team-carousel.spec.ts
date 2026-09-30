import { expect, test, type Page } from "@playwright/test";

// DSN-19: tamamen manuel carousel — 4 görünür hekim; sıra 1 büyük
// (col-span-2 / w-[38%]), küçükler alt kenara hizalı; ok butonları sırayı
// ±1 kaydırır ve kayma animasyonu oynar; otomatik dönüş YOKTUR.
test.describe("team carousel (manuel)", () => {
  test("renders 4 cards with the first one big", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator('[data-section="doctors"]').locator("a[href^='/hekimlerimiz/']");
    await expect(cards).toHaveCount(4);
    const bigBox = await cards.nth(0).boundingBox();
    const smallBox = await cards.nth(1).boundingBox();
    expect(bigBox?.width ?? 0).toBeGreaterThan((smallBox?.width ?? 0) * 1.5);
    // Alt kenar hizası: büyük ve küçük kartlar aynı hatta bitmeli
    expect(
      Math.abs(
        (bigBox?.y ?? 0) + (bigBox?.height ?? 0) - ((smallBox?.y ?? 0) + (smallBox?.height ?? 0)),
      ),
    ).toBeLessThan(2);
  });

  test("next arrow slides the window - big card doctor changes", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator('[data-section="doctors"]').locator("a[href^='/hekimlerimiz/']");
    const before = (await cards.nth(0).locator("p").first().textContent()) ?? "";
    await page.getByRole("button", { name: "Sonraki hekimler" }).click();
    await expect(cards.nth(0).locator("p").first()).not.toHaveText(before);
  });

  test("prev arrow slides back", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Sonraki hekimler" }).click();
    const afterNext = (await cards0Name(page)) ?? "";
    await page.getByRole("button", { name: "Önceki hekimler" }).click();
    const afterPrev = (await cards0Name(page)) ?? "";
    expect(afterPrev).not.toBe(afterNext);
  });

  test("no auto-rotation - window stays until an arrow is used", async ({ page }) => {
    await page.goto("/");
    const before = (await cards0Name(page)) ?? "";
    await page.waitForTimeout(5400);
    expect((await cards0Name(page)) ?? "").toBe(before);
  });

  test("tum-uzmanlarimiz button is removed", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Tüm Uzmanlarımız")).toHaveCount(0);
  });
});

async function cards0Name(page: Page): Promise<string | null> {
  return page
    .locator('[data-section="doctors"]')
    .locator("a[href^='/hekimlerimiz/']")
    .nth(0)
    .locator("p")
    .first()
    .textContent();
}
