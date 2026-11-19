import type { SiteConfig } from "../src/config-types";

/** dentaliva.nl — Dutch sister site. */
export const site = {
  id: "nl",
  domain: "www.dentaliva.nl",
  // DSN-97: header dil toggle'ının bugünkü served adresi — custom-domain DNS
  // aktifleşince `https://www.dentaliva.nl`'ye döner; canonical/robots/sitemap
  // `domain` alanını kullanmaya devam eder.
  servedUrl: "https://dentaliva-nl.dentaliva.workers.dev",
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
    // DSN-98: com'un DSN-84 funnel sırası eu/nl'e de uygulanır (Aaron:
    // "tüm değişiklikleri diğer domainlere de uygula") — ticker/about/
    // quickServices/gallery çıkar, cta↔faq yer değişir. videoTestimonials/
    // reviews CMS hiddenSections ile gizli; dizide kalırlar.
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
