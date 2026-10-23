import { expect, test } from "@playwright/test";

// DSN-57/57b: palet seçici davranışları TR etiketleriyle com build'inde doğrulanır.
test.skip(process.env.SITE_ID !== undefined && process.env.SITE_ID !== "com", "com-only e2e");

const TAB = "Renk paleti seçiciyi aç";
const CLOSE = "Renk paleti seçiciyi kapat";
const PANEL = "Renk paleti";

test.describe("theme switcher (DSN-57b)", () => {
  test("edge tab expands on hover and collapses when the pointer leaves", async ({ page }) => {
    await page.goto("/");
    const tab = page.getByRole("button", { name: TAB });
    await expect(tab).toBeVisible();
    await tab.hover();
    await expect(page.getByRole("group", { name: PANEL })).toBeVisible();
    await page.mouse.move(600, 300);
    await expect(page.getByRole("group", { name: PANEL })).toHaveCount(0);
    await expect(tab).toBeVisible();
  });

  test("menu survives tab-to-swatch pointer travel (no hover gap)", async ({ page }) => {
    await page.goto("/");
    const tab = page.getByRole("button", { name: TAB });
    await tab.hover();
    const swatch = page.getByRole("radio", { name: "Gece Mavisi" });
    // Fare sekmeden swatch'ın üzerine: menü kaçmamalı (316 geri bildirimi)
    await swatch.hover();
    await page.waitForTimeout(500);
    await expect(swatch).toBeVisible();
    await swatch.click();
    await expect(page.locator("html")).toHaveAttribute("data-palette", "gece");
  });

  test("ten swatches render; selection applies immediately", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: TAB }).click();
    const swatches = page.getByRole("radio");
    await expect(swatches).toHaveCount(10);
    await swatches.last().click();
    await expect(page.locator("html")).toHaveAttribute("data-palette", "orman");
    await expect(page.getByRole("radio", { name: "Orman" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    await page.getByRole("radio", { name: "Espresso" }).click();
    await expect(page.locator("html")).not.toHaveAttribute("data-palette");
  });

  test("X dismisses across client-side navigation; reload restores tab + palette", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: TAB }).click();
    await page.getByRole("radio", { name: "Gece Mavisi" }).click();
    await page.getByRole("button", { name: CLOSE }).click();
    await expect(page.getByRole("button", { name: TAB })).toHaveCount(0);

    // Client-side geçiş (header CTA — mega menü trigger'ları link değildir):
    // widget gizli kalır, seçili palet yaşamaya devam eder.
    await page.getByRole("banner").getByRole("link", { name: "Randevu Al" }).click();
    await expect(page).toHaveURL(/\/iletisim/);
    await expect(page.getByRole("button", { name: TAB })).toHaveCount(0);
    await expect(page.locator("html")).toHaveAttribute("data-palette", "gece");

    // Tam yenileme: sekme geri gelir (dismiss state storage'a yazılmaz),
    // palet pre-paint script ile flash'sız geri yüklenir.
    await page.reload();
    await expect(page.getByRole("button", { name: TAB })).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("data-palette", "gece");
  });
});
