import type { SlugRule } from "sanity";

// DSN-100: URL slug'ı küçük ASCII harf, rakam ve tire ile sınırlar. Bozuk bir
// slug (ör. test tedavisi "ornek"in "google.com" slug'ı) liste, sitemap ve
// chatbot yüzeylerine sızabiliyordu; bu validator gelecekteki hataları
// Studio'da yakalar. Zaten yayınlanmış veriyi web tarafındaki ikizi
// (apps/web/src/content/publishable-slug.ts) yüzeylerden düşürerek
// zararsızlaştırır — iki taraf aynı deseni paylaşır.
const SLUG_PATTERN = /^[a-z0-9-]+$/;

/** Web tarafındaki ikizle (apps/web publishable-slug.ts) paylaşılan desen. */
export const PUBLISHABLE_SLUG_PATTERN = SLUG_PATTERN;

export function publishableSlugValidation(rule: SlugRule) {
  return rule
    .required()
    .error("URL zorunludur.")
    .custom((slug?: { current?: string }) => {
      if (!slug?.current) return true;
      return SLUG_PATTERN.test(slug.current)
        ? true
        : "URL yalnızca küçük harf, rakam ve tire içerebilir.";
    });
}
