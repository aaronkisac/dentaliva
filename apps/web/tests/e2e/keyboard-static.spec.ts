import { existsSync, readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

/** PRF-2: klavye geçişi + landmark denetimi (statik export, sunucu gerektirmez). */
// INT-9/NL-2: site-farkındalı rota listesi.
const SITE = process.env.SITE_ID ?? "com";
const ROUTES_BY_SITE: Record<string, string[]> = {
  com: ["", "/hizmetlerimiz", "/fotograf-galerisi", "/iletisim"],
  eu: ["", "/services", "/gallery", "/contact"],
  nl: ["", "/behandelingen", "/fotogalerij", "/contact"],
};
const routes = ROUTES_BY_SITE[SITE] ?? ROUTES_BY_SITE.com ?? [];

function decodedHtml(route: string): string {
  const file = route === "" ? "index.html" : `${route.replace(/^\//, "")}.html`;
  const full = `out/${file}`;
  if (!existsSync(full)) throw new Error(`Export bulunamadı: ${full} (önce build al)`);
  return readFileSync(full, "utf8")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec: string) => String.fromCodePoint(Number(dec)));
}

test.describe("PRF-2: klavye geçişi ve landmarklar (statik export)", () => {
  for (const route of routes) {
    test(`klavye + landmark: ${route || "/"}`, async ({ page }) => {
      await page.setContent(decodedHtml(route), { waitUntil: "load" });

      // Tek main landmark'ı (banner/contentinfo Header/Footer'dan gelir).
      const mains = page.locator("main");
      expect(await mains.count()).toBe(1);

      // Skip link ilk Tab'da odak alır; Enter main'e taşır (adı site dilinden).
      const SKIP_LABELS: Record<string, string> = {
        com: "İçeriğe atla",
        eu: "Skip to content",
        nl: "Doorgaan naar de inhoud",
      };
      const skipLabel = SKIP_LABELS[SITE] ?? "İçeriğe atla";
      await page.keyboard.press("Tab");
      await expect(page.getByRole("link", { name: skipLabel })).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(mains).toBeFocused();

      // Pozitif tabindex anti-deseni yok (DOM sekme sırası bozulmaz).
      const positive = await page
        .locator('[tabindex]:not([tabindex="0"]):not([tabindex="-1"])')
        .count();
      expect(positive).toBe(0);

      // Klavye tuzağı yok: sekme turu belgeyi terk edene dek her adımda YENİ bir
      // öğeye gider (geri dönüş yok). Tur sayısı sekme sırasının gerçek uzunluğu.
      let stops = 0;
      for (let i = 0; i < 200; i += 1) {
        await page.keyboard.press("Tab");
        const state = await page.evaluate(() => {
          const el = document.activeElement as HTMLElement | null;
          if (!el || el === document.body || el === document.documentElement) return "off-page";
          return el.dataset.kbVisited === "1" ? "revisit" : "new";
        });
        if (state === "off-page") break;
        expect(state, `${i + 1}. Tab adımında odak geri döndü`).toBe("new");
        await page.evaluate(() => {
          (document.activeElement as HTMLElement).dataset.kbVisited = "1";
        });
        stops += 1;
      }
      // Empty-CMS sister sites legitimately render fewer focusables than
      // the content-rich com pages; the trap detection above is the point.
      const minStops = SITE === "com" ? 5 : 2;
      expect(stops).toBeGreaterThan(minStops);
    });
  }
});
