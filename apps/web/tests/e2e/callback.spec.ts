import { expect, test } from "@playwright/test";

// DEP-2 itibarıyla playwright webServer wrangler dev'i (MOCK_EXTERNAL=1) her
// ortamda başlatır — FRM-4 yolculuğu CI'da da koşar (DEP-1 yeniden bağlama).
test.describe.configure({ mode: "serial" });

// INT-9: form yolculuğu com (TR mesajlar) için yazıldı; eu boş CMS job'ı koşturmaz.
test.skip(process.env.SITE_ID !== undefined && process.env.SITE_ID !== "com", "com-only e2e");

test.describe("callback form journey (FRM-4, mocked externals)", () => {
  test("successful submission shows the confirmation state", async ({ page }) => {
    await page.goto("/iletisim");
    await page.getByLabel("Ad Soyad *").fill("Test Kullanıcı");
    await page.getByLabel("Telefon *").fill("0532 000 00 00");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Geri arama talep et" }).click();
    await expect(page.getByText("Talebiniz alındı")).toBeVisible();
  });

  test("empty submit shows Turkish validation errors", async ({ page }) => {
    await page.goto("/iletisim");
    await page.getByRole("button", { name: "Geri arama talep et" }).click();
    await expect(page.getByText("Lütfen adınızı ve soyadınızı girin.")).toBeVisible();
    await expect(page.getByText("Telefon numarası zorunludur.")).toBeVisible();
    await expect(page.getByText("KVKK aydınlatma metnini onaylamanız gerekiyor.")).toBeVisible();
  });
});
