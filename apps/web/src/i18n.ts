import { pickLocalized } from "@dentaliva/sanity-schema/client";
import type { LocalizedValue } from "@dentaliva/sanity-schema/client";

import { site } from "./config";

/**
 * Resolves a localized field for the ACTIVE site's locale (ADR-004): tr on
 * dentaliva.com, en on dentaliva.eu, nl on dentaliva.nl (NL-1). Every content
 * read in app code goes through here — no literal `.tr` access outside
 * src/content/chatbot.ts, which shapes the bilingual chatbot API contract
 * rather than picking a locale.
 */
export function t(value: LocalizedValue | null | undefined): string {
  return pickLocalized(
    value,
    site.defaultLocale === "en" ? "en" : site.defaultLocale === "nl" ? "nl" : "tr",
  );
}

/**
 * Locale-aware resolver for rich-text (Portable Text) fields, which are
 * block arrays rather than strings — t() must not touch them. Generic so
 * i18n stays free of component-layer imports.
 */
export function tBlocks<T>(value: { tr?: T[]; en?: T[]; nl?: T[] } | null | undefined): T[] {
  if (!value) return [];
  const locale = site.defaultLocale;
  const primary = locale === "en" ? value.en : locale === "nl" ? value.nl : value.tr;
  return primary ?? value.tr ?? [];
}
