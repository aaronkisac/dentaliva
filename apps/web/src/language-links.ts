import type { HeaderFlag, HeaderLanguage } from "@dentaliva/ui";

import { allSites, site } from "./config";

/**
 * DSN-97 header dil toggle verisi — orijinal sitedeki bayrak sırasının
 * karşılığı: TR bayrağı com'u (Türkçe), GB bayrağı (İngilizce site) eu'yu,
 * NL bayrağı nl'yi temsil eder. Orijinalin 4. bayrağı (ae — dentaliva.ae)
 * yeni projede karşılıksız; sitesi yokken bayrak render edilmez.
 *
 * Etiketler dil ottonimleridir (Türkçe/English/Nederlands) — ottonimler
 * çevrilmeyen sabit proper noun'lardır; siteCopy'ye taşınmaz.
 *
 * URL'ler `servedUrl`'den gelir (bugün workers.dev; custom-domain DNS
 * dalında sites/*.ts içinde canonical'a döner). Canonical/robots/sitemap
 * `domain` alanını kullanmaya devam eder.
 */
const DISPLAY_ORDER = ["com", "eu", "nl"] as const;

const AUTONYMS: Record<string, string> = {
  tr: "Türkçe",
  en: "English",
  nl: "Nederlands",
};

const FLAGS: Record<string, HeaderFlag> = {
  com: "tr",
  eu: "gb",
  nl: "nl",
};

/** Header'a geçilen çapraz-domain dil listesi — sıra tüm sitelerde sabittir. */
export function buildLanguageLinks(): HeaderLanguage[] {
  const byId = new Map(allSites().map((target) => [target.id, target]));
  return DISPLAY_ORDER.flatMap((id) => {
    const target = byId.get(id);
    const flag = target ? FLAGS[target.id] : undefined;
    if (!target || !flag) return [];
    return [
      {
        flag,
        url: target.servedUrl,
        label: AUTONYMS[target.defaultLocale] ?? target.id,
        ...(target.id === site.id ? { active: true } : {}),
      },
    ];
  });
}
