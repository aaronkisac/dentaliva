import { expect, test, type Page } from "@playwright/test";

// DSN-19: tamamen manuel carousel — 4 görünür hekim; sıra 1 büyük
// (col-span-2 / w-[38%]), küçükler alt kenara hizalı; ok butonları sırayı
// ±1 kaydırır ve kayma animasyonu oynar; otomatik dönüş YOKTUR.
// INT-9: hekim carousel'i com içeriğiyle Manuel doğrulandı; eu boş CMS'te koşmaz.
test.skip(process.env.SITE_ID !== undefined && process.env.SITE_ID !== "com", "com-only e2e");

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

  test("prev arrow slides back to the original doctor", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator('[data-section="doctors"]').locator("a[href^='/hekimlerimiz/']");
    const original = (await cards0Name(page)) ?? "";
    await page.getByRole("button", { name: "Sonraki hekimler" }).click();
    await expect(cards.nth(0).locator("p").first()).not.toHaveText(original);
    await page.getByRole("button", { name: "Önceki hekimler" }).click();
    await expect(cards.nth(0).locator("p").first()).toHaveText(original);
  });

  // A11y (WCAG 4.1.3): slayt değişimi role="status" ile duyurulur —
  // öne çıkan hekim ve konum göstergesi her ok tıklamasında güncellenir.
  test("live region announces the featured doctor position", async ({ page }) => {
    await page.goto("/");
    const status = page.locator('[data-section="doctors"]').locator('[role="status"]');
    await expect(status).toContainText("(1/");
    await page.getByRole("button", { name: "Sonraki hekimler" }).click();
    await expect(status).toContainText("(2/");
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

  // DSN-20: portre fotolar kareye sığmıyor — slaytlar %5 uzun (20/21).
  test("slides are 5 percent taller than square", async ({ page }) => {
    await page.goto("/");
    const img = page
      .locator('[data-section="doctors"]')
      .locator("a[href^='/hekimlerimiz/']")
      .nth(0)
      .locator("img");
    const box = await img.boundingBox();
    expect((box?.height ?? 0) / (box?.width || 1)).toBeCloseTo(1.05, 1);
  });

  // DSN-20: büyük karta gelen görsel, gidiş yönünden küçük kart boyutunda
  // başlayıp büyüyerek yerleşir (next -> sağdan, prev -> soldan).
  test("featured image plays direction-aware grow-in", async ({ page }) => {
    await page.goto("/");
    const section = page.locator('[data-section="doctors"]');
    await page.getByRole("button", { name: "Sonraki hekimler" }).click();
    await expect(section.locator(".team-featured-next")).toHaveCount(1);
    await page.getByRole("button", { name: "Önceki hekimler" }).click();
    await expect(section.locator(".team-featured-prev")).toHaveCount(1);
  });

  // DSN-20: ok butonları desktop'ta küçük kartların üstündeki boşlukta,
  // sağ kenarı son kartla aynı hizada.
  test("arrow buttons sit above the small cards on desktop", async ({ page }) => {
    await page.goto("/");
    const section = page.locator('[data-section="doctors"]');
    const prevBox = await page.getByRole("button", { name: "Önceki hekimler" }).boundingBox();
    const nextBox = await page.getByRole("button", { name: "Sonraki hekimler" }).boundingBox();
    const lastBox = await section.locator("a[href^='/hekimlerimiz/']").nth(3).boundingBox();
    if (!prevBox || !nextBox || !lastBox) throw new Error("carousel boxes missing");
    expect(prevBox.y + prevBox.height).toBeLessThanOrEqual(lastBox.y + 2);
    expect(Math.abs(nextBox.x + nextBox.width - (lastBox.x + lastBox.width))).toBeLessThan(2);
  });

  // DSN-20: mobilde mutlak boşluk yok — butonlar akışta, sıranın altında.
  test("arrow buttons stay in flow below the row on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/");
    const section = page.locator('[data-section="doctors"]');
    const nextBox = await page.getByRole("button", { name: "Sonraki hekimler" }).boundingBox();
    const lastBox = await section.locator("a[href^='/hekimlerimiz/']").nth(3).boundingBox();
    if (!nextBox || !lastBox) throw new Error("carousel boxes missing");
    expect(nextBox.y).toBeGreaterThanOrEqual(lastBox.y + lastBox.height);
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
