/**
 * Per-domain site configuration contract (ADR-004).
 * A site is fully described by one file in apps/web/sites/ — adding a domain
 * is configuration + platform setup, never a refactor.
 */

export type Locale = "tr" | "en" | "nl";

export interface SanityTarget {
  projectId: string;
  dataset: string;
  stagingDataset: string;
}

export interface SiteFeatures {
  chatbotApi: boolean;
  blog: boolean;
}

/** Home page section ids rendered by the composition engine (PGT-3). */
export const homeSectionIds = [
  "hero",
  "ticker",
  "trustStrip",
  "quickServices",
  "about",
  "treatmentPaths",
  "videoTestimonials",
  "reviews",
  "gallery",
  "onceSonra",
  "doctors",
  "faq",
  "cta",
] as const;

export type HomeSectionId = (typeof homeSectionIds)[number];

export interface NavItem {
  label: string;
  href: string;
  children?: Array<{ label: string; href: string }>;
}

/**
 * Public path segments per site. Route names are localized data (Turkish
 * segments on the TR site, English on the EU site), never literals scattered
 * through code — app code links through these values only.
 */
export interface SiteRoutes {
  about: string;
  treatments: string;
  doctors: string;
  branches: string;
  blog: string;
  contact: string;
  gallery: string;
  /** Static legal segment; the document slug itself comes from the CMS. */
  legal: string;
}

export interface SiteConfig {
  /** Short registry key — set as SITE_ID at build time. */
  id: string;
  domain: string;
  locales: Locale[];
  defaultLocale: Locale;
  sanity: SanityTarget;
  /** Sister domains for hreflang alternates once ≥2 translated sites exist. */
  sisterDomains: string[];
  /** Localized public segments — see SiteRoutes. */
  routes: SiteRoutes;
  features: SiteFeatures;
  /** Structural navigation (labels are domain-fixed; dropdown children come from CMS). */
  nav: NavItem[];
  sections: {
    home: HomeSectionId[];
  };
}
