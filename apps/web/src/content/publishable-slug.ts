// DSN-100: Studio'daki publishableSlugValidation'ın (packages/clinic/src/slug.ts)
// çalışma-zamanı ikizi — zaten yayınlanmış bozuk slug'lı dokümanlar (ör. test
// tedavisi "ornek"in "google.com" slug'ı) liste, sitemap ve chatbot
// yüzeylerine sızmadan düşürülür. Şema validator'u gelecekteki hataları
// önler; bu filtre mevcut veriyi zararsızlaştırır. GROQ match() yerine JS
// tarafında uygulanır — match'in noktalama tokenizasyonu güvenilmez
// (DSN-77 dersi).
export const PUBLISHABLE_SLUG_PATTERN = /^[a-z0-9-]+$/;

export function isPublishableSlug(slug: string | undefined | null): slug is string {
  return typeof slug === "string" && slug.length > 0 && PUBLISHABLE_SLUG_PATTERN.test(slug);
}

export function filterPublishable<T extends { slug?: string | null }>(
  items: readonly T[] | null | undefined,
): T[] {
  return (items ?? []).filter((item) => isPublishableSlug(item.slug));
}
