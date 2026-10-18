/**
 * Pure validators shared by schema fields. Kept free of Sanity's Rule API so
 * they are unit-testable without a Sanity context; schema files wrap them in
 * Rule.custom (which passes `unknown` values — guards live here).
 */

export interface LocalizedValue {
  tr?: string | null;
  en?: string | null;
  /** Dutch slot (NL-1): filled by the dentaliva.nl project's editors. */
  nl?: string | null;
}

function asLocalized(value: unknown): LocalizedValue | null {
  if (typeof value === "object" && value !== null) return value;
  return null;
}

function asString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

/** Turkish copy is mandatory; English is authored opportunistically. */
export function requireTr(value: unknown): string | true {
  const localized = asLocalized(value);
  const tr = localized?.tr;
  if (typeof tr !== "string" || tr.trim() === "") {
    return "Türkçe içerik zorunludur";
  }
  return true;
}

/** Non-empty string required (trims — whitespace-only counts as empty). */
export function requireNonEmpty(value: unknown): string | true {
  const text = asString(value);
  if (text === null || text.trim() === "") return "Bu alan zorunludur";
  return true;
}

/**
 * Turkish phone: optional +90 country code, optional trunk 0, then 10 digits
 * starting non-zero (mobile 5xx and landline 2xx/3xx).
 */
export function validTrPhone(value: unknown): string | true {
  const text = asString(value);
  if (text === null || text.trim() === "") return true;
  const digits = text.replaceAll(/[^0-9]/g, "");
  const ok = /^(90)?0?[1-9]\d{9}$/.test(digits);
  return ok ? true : "Geçerli bir telefon girin (örn. +90 212 555 54 82)";
}

/** Redirect targets must be root-relative or absolute https URLs. */
export function validRedirectTarget(value: unknown): string | true {
  const text = asString(value);
  if (text === null || text.trim() === "") return "Hedef zorunludur";
  const ok = text.startsWith("/") || /^https:\/\/[^\s]+$/.test(text);
  return ok ? true : 'Hedef "/" ile başlamalı veya https:// adresi olmalı';
}
