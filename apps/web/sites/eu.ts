import type { SiteConfig } from "../src/config-types";

/** dentaliva.eu — English sister site for international patients. */
export const site = {
  id: "eu",
  domain: "www.dentaliva.eu",
  locales: ["en"],
  defaultLocale: "en",
  sanity: { projectId: "84n9qnfg", dataset: "production", stagingDataset: "staging" },
  sisterDomains: ["dentaliva.com", "dentaliva.nl"],
  routes: {
    about: "/about",
    treatments: "/services",
    doctors: "/doctors",
    branches: "/branches",
    blog: "/blog",
    contact: "/contact",
    gallery: "/gallery",
    legal: "/privacy",
  },
  nav: [
    { label: "About Us", href: "/about" },
    { label: "Our Treatments", href: "/services" },
    { label: "Our Doctors", href: "/doctors" },
    { label: "Branches", href: "/branches" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  features: {
    // The chatbot JSON contract is a dentaliva.com v1 feature (ADR decision);
    // the EU site starts without it.
    chatbotApi: false,
    blog: true,
  },
  sections: {
    home: [
      "hero",
      "ticker",
      "quickServices",
      "about",
      "videoTestimonials",
      "reviews",
      "gallery",
      "onceSonra",
      "doctors",
      "faq",
      "cta",
    ],
  },
} as const satisfies SiteConfig;
