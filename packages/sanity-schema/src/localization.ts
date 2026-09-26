/**
 * Localization rendering policy (PGT-9) — the single documented source for
 * how localized fields resolve at render time.
 *
 * Rules:
 * 1. v1 ships Turkish only: one locale per deployment, NO /en URL segment.
 *    (dentaliva.eu is the English site — separate dataset, separate deploy.)
 * 2. Schema level: `tr` is required (requireTr); `en` is optional.
 * 3. Render level: empty `en` falls back to `tr` (pickLocalized below) —
 *    half-translated pages never render mixed-language content.
 * 4. A future /en segment on an existing domain is additive: enable locale
 *    routing in the site config + generateStaticParams over locales — no
 *    schema change.
 */

export type Locale = "tr" | "en";

export interface LocalizedInput {
  tr?: string | null;
  en?: string | null;
}

export function pickLocalized(
  value: LocalizedInput | null | undefined,
  locale: Locale = "tr",
): string {
  if (locale === "en") return value?.en ?? value?.tr ?? "";
  return value?.tr ?? "";
}

/** True when a site config ships exactly one locale (v1 contract). */
export function isSingleLocaleSite(locales: readonly Locale[]): boolean {
  return locales.length === 1;
}
