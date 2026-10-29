import { expect, test } from "@playwright/test";

// DSN-84: doküman #14 — ekip bölümü Dentia deseninde 4 kartlık sunucu
// grid'i (DSN-18/19/20 carousel'i v1'de emekli; git tag homepage-v1).
// Seçki CMS teamSection.doctors'tan; boşsa hekim listesinin ilk 4'ü.
// INT-9 deseni: hekim bölümü com içeriğiyle; eu boş CMS'te koşmaz.
test.skip(process.env.SITE_ID !== undefined && process.env.SITE_ID !== "com", "com-only e2e");

test.describe("doctors grid (DSN-84)", () => {
  test("renders four doctor cards linking to profile pages", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator('[data-section="doctors"]').locator("a[href^='/hekimlerimiz/']");
    await expect(cards).toHaveCount(4);
  });

  test("curated fallback keeps the grid stable across reloads", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator('[data-section="doctors"]').locator("a[href^='/hekimlerimiz/']");
    const first = await cards.nth(0).textContent();
    await page.reload();
    const again = page.locator('[data-section="doctors"]').locator("a[href^='/hekimlerimiz/']");
    await expect(again.nth(0)).toContainText(first ?? "");
  });

  test("carousel controls are gone (no auto/arrow chrome)", async ({ page }) => {
    await page.goto("/");
    const section = page.locator('[data-section="doctors"]');
    await expect(section.getByRole("button", { name: "Sonraki hekimler" })).toHaveCount(0);
    await expect(section.getByRole("button", { name: "Önceki hekimler" })).toHaveCount(0);
    await expect(section.locator('[role="status"]')).toHaveCount(0);
  });

  test("team CTA links to the doctors listing when CMS copy exists", async ({ page }) => {
    await page.goto("/");
    // CTA copy'si CMS'ten (teamSection.ctaLabel) — varsa hekimler sayfasına gider.
    const cta = page.locator('[data-section="doctors"]').locator("a[href='/hekimlerimiz']").last();
    const count = await cta.count();
    if (count > 0) {
      await expect(cta).toBeVisible();
    }
  });
});
