/**
 * CLIENT-surface chrome strings (DSN-44 exception, INT-3): error boundaries
 * fetch nothing and carousel/lightbox aria labels live inside client bundles.
 * The client learns the active site at build time via NEXT_PUBLIC_SITE_ID.
 * Server-only copy (metadata titles, empty states, seed placeholder) lives in
 * page-strings.ts so it never ships in first-load JS; editable copy stays in
 * the siteCopy singleton.
 *
 * Turkish is the source of truth; `en` must satisfy the same shape.
 */
const tr = {
  // error boundaries (client — cannot fetch the CMS)
  errorTitle: "Bir sorun oluştu",
  errorBody: "Sayfa yüklenirken beklenmeyen bir hata oluştu.",
  errorRetry: "Tekrar dene",

  // hero CTAs (client hero)
  bookCta: "Randevu Al",
  exploreServicesCta: "Hizmetlerimizi Keşfedin",

  // social proof (client testimonials)
  googleBadge: "Google Değerlendirmeleri · 5,0",
  patientVideoAlt: "Hasta videosu",

  // carousel aria labels
  doctorsRegionAria: "Uzman hekimler",
  doctorsLive: (name: string, i: number, n: number) => `Öne çıkan: ${name} (${i}/${n})`,
  prevDoctors: "Önceki hekimler",
  nextDoctors: "Sonraki hekimler",
  doctorSlideAria: (n: number) => `${n}. hekim`,
  prevServices: "Önceki hizmetler",
  nextServices: "Sonraki hizmetler",
  serviceSlideAria: (n: number) => `${n}. hizmet`,

  // lightbox aria labels
  lightboxImageAria: (n: number) => `Görsel ${n} — büyüt`,
  lightboxFilterAria: "Galeri filtresi",
  prevImages: "Önceki görseller",
  nextImages: "Sonraki görseller",
  galleryImageAria: (n: number) => `${n}. görsel`,
  galleryImageAlt: "Galeri görseli",
};

const en: typeof tr = {
  errorTitle: "Something went wrong",
  errorBody: "An unexpected error occurred while loading the page.",
  errorRetry: "Try again",

  bookCta: "Book an Appointment",
  exploreServicesCta: "Explore our services",

  googleBadge: "Google Reviews · 5.0",
  patientVideoAlt: "Patient video",

  doctorsRegionAria: "Our doctors",
  doctorsLive: (name, i, n) => `Featured: ${name} (${i}/${n})`,
  prevDoctors: "Previous doctors",
  nextDoctors: "Next doctors",
  doctorSlideAria: (n) => `Doctor ${n}`,
  prevServices: "Previous services",
  nextServices: "Next services",
  serviceSlideAria: (n) => `Service ${n}`,

  lightboxImageAria: (n) => `Image ${n} — enlarge`,
  lightboxFilterAria: "Gallery filter",
  prevImages: "Previous images",
  nextImages: "Next images",
  galleryImageAria: (n) => `Image ${n}`,
  galleryImageAlt: "Gallery image",
};

const strings = { tr, en } as const;

function activeLocale(): "tr" | "en" {
  // Build-time constant: Next inlines NEXT_PUBLIC_SITE_ID as a literal, so
  // terser folds this branch and dead-code-eliminates the INACTIVE locale's
  // table from the client bundle. Kept in sync with the site registry by
  // tests/ui-strings.test.ts.
  return process.env.NEXT_PUBLIC_SITE_ID === "eu" ? "en" : "tr";
}

export function uiString<K extends keyof typeof tr>(key: K): (typeof tr)[K] {
  return strings[activeLocale()][key];
}
