import type { SiteConfig } from "../src/config-types";

/** dentaliva.com — Turkish production site (v1). */
export const site = {
  id: "com",
  domain: "www.dentaliva.com",
  locales: ["tr"],
  defaultLocale: "tr",
  sanity: { projectId: "86x2hbzv", dataset: "production", stagingDataset: "staging" },
  sisterDomains: ["dentaliva.eu", "dentaliva.nl"],
  features: {
    callbackForm: true,
    chatbotApi: true,
    blog: true,
    careers: false,
  },
  sections: {
    home: [
      "hero",
      "quickServices",
      "about",
      "videoTestimonials",
      "reviews",
      "gallery",
      "doctors",
      "faq",
      "cta",
    ],
  },
} as const satisfies SiteConfig;
