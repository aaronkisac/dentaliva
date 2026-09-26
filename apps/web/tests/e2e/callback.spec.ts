import { expect, test } from "@playwright/test";

// Bu yolculuk yerelde (wrangler dev + MOCK_EXTERNAL=1) çalışır; CI'da
// wrangler dev webServer'ı güvenilir başlamadığından CI dışına alındı
// (DEP-1 ile CI'a taşınacak).
test.describe.configure({ mode: "serial" });
const skipInCI = Boolean(process.env.CI);

test.describe("callback form journey (FRM-4, mocked externals)", () => {
  test.skip(skipInCI, "CI'da wrangler dev başlatılamıyor; yerelde çalışır");

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
