/** Sitemap entry builders with dormant hreflang support (SEO-3). */

export interface SitemapEntry {
  url: string;
  lastModified?: Date;
  changeFrequency?: "daily" | "weekly" | "monthly" | "yearly";
  priority?: number;
  alternates?: { languages: Record<string, string> };
}

export interface SitemapInputEntry {
  path: string;
  lastModified?: Date;
  changeFrequency?: SitemapEntry["changeFrequency"];
  priority?: number;
  /** locale → absolute URL (hreflang alternates). Empty for single-locale v1. */
  alternatesByLocale?: Record<string, string>;
}

/**
 * hreflang alternates for a path across the sister-domain map
 * (locale → domain). Dormant until a second translated domain ships —
 * callers pass only locales that actually have content.
 */
export function buildAlternates(
  path: string,
  domainByLocale: Record<string, string>,
): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const [locale, domain] of Object.entries(domainByLocale)) {
    languages[locale] = `https://${domain}${path}`;
  }
  return languages;
}

export function buildSitemapEntries(siteUrl: string, entries: SitemapInputEntry[]): SitemapEntry[] {
  const base = siteUrl.replace(/\/+$/, "");
  return entries.map((entry) => {
    const url = `${base}${entry.path === "/" ? "" : entry.path}`;
    const result: SitemapEntry = { url };
    if (entry.lastModified) result.lastModified = entry.lastModified;
    if (entry.changeFrequency) result.changeFrequency = entry.changeFrequency;
    if (entry.priority !== undefined) result.priority = entry.priority;
    if (entry.alternatesByLocale && Object.keys(entry.alternatesByLocale).length > 0) {
      const languages: Record<string, string> = {};
      for (const [locale, domain] of Object.entries(entry.alternatesByLocale)) {
        languages[locale] = `https://${domain}${entry.path}`;
      }
      result.alternates = { languages };
    }
    return result;
  });
}
