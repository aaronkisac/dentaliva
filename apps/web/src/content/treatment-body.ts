/**
 * DSN-70: legacy localeText gövdeyi okunabilir paragraflara bölen yardımcılar.
 * GövdePortableText'e geçene kadar (planlı ayrı iş) render katmanında ritim
 * kurar: paragraf dizisi + ara öğe (görsel/CTA) ekleme konumları.
 */

/** Gövde metnini boş olmayan paragraflara böler (tek/çift satır sonu ikisi de). */
export function splitBodyParagraphs(body: string): string[] {
  return body
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

/**
 * Ara öğenin hangi paragrafdan SONRA geleceğini söyler. Kısa gövdelerde
 * (<6 paragraf) ara öğe kurulmaz — null döner, çağıran sonda basar.
 */
export function bodyBreakIndex(paragraphCount: number, ratio: number): number | null {
  if (paragraphCount < 6) return null;
  return Math.max(1, Math.min(paragraphCount - 1, Math.round(paragraphCount * ratio)));
}
