import { expect, test } from "@playwright/test";

// DSN-57: palet seçici davranışları TR etiketleriyle com build'inde doğrulanır.
test.skip(process.env.SITE_ID !== undefined && process.env.SITE_ID !== "com", "com-only e2e");

const TAB = "Renk paleti seçiciyi aç";
const CLOSE = "Renk paleti seçiciyi kapat";
const PANEL = "Renk paleti";

test.describe("theme switcher (DSN-57)", () => {
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

  test("selecting a palette applies the attribute immediately", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: TAB }).click();
    await page.getByRole("combobox").selectOption("gece");
    await expect(page.locator("html")).toHaveAttribute("data-palette", "gece");
    await page.getByRole("combobox").selectOption("espresso");
    await expect(page.locator("html")).not.toHaveAttribute("data-palette");
  });

  test("X dismisses across client-side navigation; reload restores tab + palette", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: TAB }).click();
    await page.getByRole("combobox").selectOption("gece");
    await page.getByRole("button", { name: CLOSE }).click();
    await expect(page.getByRole("button", { name: TAB })).toHaveCount(0);

    // Client-side geçiş: widget gizli kalır, seçili palet yaşamaya devam eder.
    await page
      .getByRole("navigation", { name: "Main" })
      .getByRole("link", { name: "Hizmetlerimiz" })
      .click();
    await expect(page).toHaveURL(/\/hizmetlerimiz/);
    await expect(page.getByRole("button", { name: TAB })).toHaveCount(0);
    await expect(page.locator("html")).toHaveAttribute("data-palette", "gece");

    // Tam yenileme: sekme geri gelir (dismiss state storage'a yazılmaz),
    // palet pre-paint script ile flash'sız geri yüklenir.
    await page.reload();
    await expect(page.getByRole("button", { name: TAB })).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("data-palette", "gece");
  });
});
