import type { SiteConfig } from "../src/config-types";

/** dentaliva.com — Turkish production site (v1). */
export const site = {
  id: "com",
  domain: "www.dentaliva.com",
  locales: ["tr"],
  defaultLocale: "tr",
  sanity: { projectId: "86x2hbzv", dataset: "production", stagingDataset: "staging" },
  sisterDomains: ["dentaliva.eu", "dentaliva.nl"],
  routes: {
    about: "/hakkimizda",
    treatments: "/hizmetlerimiz",
    doctors: "/hekimlerimiz",
    branches: "/subelerimiz",
    blog: "/blog",
    contact: "/iletisim",
    gallery: "/fotograf-galerisi",
    legal: "/kvkk",
  },
  nav: [
    { label: "Hakkımızda", href: "/hakkimizda" },
    { label: "Tedavilerimiz", href: "/hizmetlerimiz" },
    { label: "Hekimlerimiz", href: "/hekimlerimiz" },
    { label: "Şubelerimiz", href: "/subelerimiz" },
    { label: "Blog", href: "/blog" },
    { label: "İletişim", href: "/iletisim" },
  ],
  features: {
    chatbotApi: true,
    blog: true,
  },
  sections: {
    // DSN-84: funnel dokümanı sırası — 16 bölüm birebir. ticker/about/
    // quickServices/gallery dokümanda yok; com'dan çıkar (bileşenler ve
    // eu/nl config'leri korunur). videoTestimonials/reviews CMS
    // hiddenSections ile gizli (TR uyum); dizide kalırlar. v1 sırası:
    // git tag homepage-v1.
    home: [
      "hero",
      "trustStrip",
      "treatmentPaths",
      "onceSonra",
      "videoTestimonials",
      "reviewForm",
      "howItWorks",
      "decisionModules",
      "travelStay",
      "aftercare",
      "reviews",
      "clinics",
      "doctors",
      "cta",
      "faq",
    ],
  },
} as const satisfies SiteConfig;
