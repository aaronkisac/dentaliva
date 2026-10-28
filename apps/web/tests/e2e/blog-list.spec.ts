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

    // Link iddiaları yalnız com'da: CI'daki eu build'i anonim okur
    // (SANITY_READ_TOKEN_EU repo secret'ı yok — INT-9 açık kalemi) ve
    // blogPost dokümanları hiç gelmez — grid 0 link render eder; com
    // build'i token'lıdır. eu'da yalnız statik yapı iddiası kalır.
    if (SITE === "com") {
      const postLinks = page.locator('a[href^="/blog/"]:not([href="/blog"])');
      // 24 yazılı üretim dataset'inde 24 link.
      expect(await postLinks.count()).toBeGreaterThanOrEqual(10);

      const first = postLinks.first();
      await expect(first).toContainText(/./);

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
