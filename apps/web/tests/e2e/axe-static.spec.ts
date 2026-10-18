import { existsSync, readFileSync } from "node:fs";
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/** PRF-2: statik export HTML'lerinde axe taraması (sunucu gerektirmez). */
// INT-9: rota listesi aktif siteye göre — com içerikli dinamik örneklerle,
// eu boş CMS'te yalnız statik segmentlerle taranır.
const SITE = process.env.SITE_ID ?? "com";
const ROUTES_BY_SITE: Record<string, string[]> = {
  com: [
    "",
    "/hakkimizda",
    "/hizmetlerimiz",
    "/hizmetlerimiz/implant-tedavisi",
    "/hekimlerimiz/dr-dt-emel-ozdemir",
    "/subelerimiz/avcilar",
    "/fotograf-galerisi",
    "/iletisim",
    "/kvkk",
    "/blog",
    "/blog/en-iyi-ve-guvenilir-dis-dolgusu-cesitleri",
  ],
  eu: ["", "/about", "/services", "/doctors", "/branches", "/gallery", "/contact", "/blog"],
  nl: [
    "",
    "/over-ons",
    "/behandelingen",
    "/onze-tandartsen",
    "/onze-filialen",
    "/fotogalerij",
    "/contact",
  ],
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

test.describe("PRF-2: axe erişilebilirlik taraması (statik export)", () => {
  for (const route of routes) {
    test(`axe temiz: ${route || "/"}`, async ({ page }) => {
      const html = decodedHtml(route);
      await page.setContent(html, { waitUntil: "load" });
      const results = await new AxeBuilder({ page }).analyze();
      const serious = results.violations.filter(
        (v) => v.impact === "serious" || v.impact === "critical",
      );
      const summary = serious.map((v) => `${v.id}×${v.nodes.length}`).join(", ");
      expect(serious, `ciddi ihlaller: ${summary}`).toEqual([]);
    });
  }
});
