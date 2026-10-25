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
    // DSN-61: funnel strategy order — existing sections move to their final
    // positions; new sections (treatmentPaths, reviewForm, …) are inserted by
    // later waves between these slots.
    home: [
      "hero",
      "ticker",
      "trustStrip",
      "about",
      "quickServices",
      "onceSonra",
      "videoTestimonials",
      "reviews",
      "gallery",
      "doctors",
      "faq",
      "cta",
    ],
  },
} as const satisfies SiteConfig;
