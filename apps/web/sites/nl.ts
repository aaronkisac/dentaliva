import type { SiteConfig } from "../src/config-types";

/** dentaliva.nl — Dutch sister site. */
export const site = {
  id: "nl",
  domain: "www.dentaliva.nl",
  locales: ["nl"],
  defaultLocale: "nl",
  sanity: { projectId: "x8kdvsh2", dataset: "production", stagingDataset: "staging" },
  sisterDomains: ["dentaliva.com", "dentaliva.eu"],
  routes: {
    about: "/over-ons",
    treatments: "/behandelingen",
    doctors: "/onze-tandartsen",
    branches: "/onze-filialen",
    blog: "/blog",
    contact: "/contact",
    gallery: "/fotogalerij",
    legal: "/privacybeleid",
  },
  nav: [
    { label: "Over ons", href: "/over-ons" },
    { label: "Behandelingen", href: "/behandelingen" },
    { label: "Onze Tandartsen", href: "/onze-tandartsen" },
    { label: "Vestigingen", href: "/onze-filialen" },
    { label: "Contact", href: "/contact" },
  ],
  features: {
    // The source dentaliva.nl has no blog — the route is pruned from the export.
    chatbotApi: false,
    blog: false,
  },
  sections: {
    // DSN-61: funnel strategy order — see com.ts.
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
