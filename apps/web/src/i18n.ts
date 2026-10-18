import { pickLocalized } from "@dentaliva/sanity-schema/client";
import type { LocalizedValue } from "@dentaliva/sanity-schema/client";

import { site } from "./config";

/**
 * Resolves a localized field for the ACTIVE site's locale (ADR-004): tr on
 * dentaliva.com, en on dentaliva.eu. Every content read in app code goes
 * through here — no literal `.tr` access outside src/content/chatbot.ts,
 * which shapes the bilingual chatbot API contract rather than picking a
 * locale. pickLocalized speaks tr|en; the registry's Locale union also has
 * nl for future sister sites, resolved to the en-style path when it arrives.
 */
export function t(value: LocalizedValue | null | undefined): string {
  return pickLocalized(value, site.defaultLocale === "en" ? "en" : "tr");
}

/**
 * Locale-aware resolver for rich-text (Portable Text) fields, which are
 * block arrays rather than strings — t() must not touch them. Generic so
 * i18n stays free of component-layer imports.
 */
export function tBlocks<T>(value: { tr?: T[]; en?: T[] } | null | undefined): T[] {
  if (!value) return [];
  return (site.defaultLocale === "en" ? value.en : value.tr) ?? value.tr ?? [];
}
