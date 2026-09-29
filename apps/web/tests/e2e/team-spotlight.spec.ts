import { expect, test } from "@playwright/test";

// DSN-17: spot-ışık ekip bölümü — featured kart değişimi + 4'lü şerit.
test.describe("team spotlight", () => {
  test("featured doctor grows in and rotates when a strip card is clicked", async ({ page }) => {
    await page.goto("/");
    const section = page.locator('[data-section="doctors"]');
    const featured = section.locator(".team-grow");
    await expect(featured).toBeVisible();

    const initialName = (await featured.locator("p").first().textContent()) ?? "";
    const stripCards = section.getByRole("button", { name: /— öne çıkar/ });
    await expect(stripCards).toHaveCount(4);

    // Aktif hekim şeritte olmamalı
    const labels = await stripCards.all();
    for (const card of labels) {
      expect(await card.getAttribute("aria-label")).not.toContain(initialName);
    }

    // İlk şerit kartına tıkla → o hekim büyüyerek öne gelir
    await stripCards.nth(0).click();
    await expect(featured.locator("p").first()).not.toHaveText(initialName);
  });

  test("auto-rotates to the next doctor after 5 seconds", async ({ page }) => {
    await page.goto("/");
    const section = page.locator('[data-section="doctors"]');
    await section.scrollIntoViewIfNeeded();
    const featured = section.locator(".team-grow");
    await expect(featured).toBeVisible();
    const before = (await featured.locator("p").first().textContent()) ?? "";
    await page.waitForTimeout(5400);
    const after = (await featured.locator("p").first().textContent()) ?? "";
    expect(after).not.toBe(before);
  });
});
