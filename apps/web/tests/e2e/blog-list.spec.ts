import { expect, test } from "@playwright/test";

/**
 * DSN-72: blog listeleme düzeni — vitrin + kartsız portre grid.
 * Veri-bağımsız yapı iddiaları (_CI anonim eu build'inde deref'ler null
 * döner; görsel iddiası yalnız com'da — üretim dataset'i token'lı okunur).
 */
const SITE = process.env.SITE_ID ?? "com";
const BLOG_BY_SITE: Record<string, string> = {
  com: "/blog",
  eu: "/blog",
};

test.describe("DSN-72: blog listeleme", () => {
  const route = BLOG_BY_SITE[SITE] ?? "";
  test.skip(!route, "bu sitede blog yok");

  test("vitrin + grid bağlantıları render ediliyor", async ({ page }) => {
    await page.goto(route, { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { level: 1, name: "Blog" })).toBeVisible();

    // Vitrin (ilk link) + grid: 24 yazılı üretim dataset'inde 24 link.
    const postLinks = page.locator('a[href^="/blog/"]:not([href="/blog"])');
    const count = await postLinks.count();
    expect(count).toBeGreaterThanOrEqual(10);

    // Kartların tamamı tek link: her link başlık (serif) taşıyor.
    const first = postLinks.first();
    await expect(first).toContainText(/./);

    if (SITE === "com") {
      // Backfill sonrası vitrin görseli dolu gelir (üretim dataset'i);
      // loader boyutlandırması viewport'a göre değişir — yüklenmiş olması yeter.
      await expect
        .poll(() =>
          first
            .locator("img")
            .first()
            .evaluate((el) => (el as HTMLImageElement).naturalWidth),
        )
        .toBeGreaterThan(0);
    }
  });
});
