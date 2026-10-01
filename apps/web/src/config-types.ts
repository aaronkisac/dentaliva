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
  "quickServices",
  "about",
  "videoTestimonials",
  "reviews",
  "gallery",
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

export interface SiteConfig {
  /** Short registry key — set as SITE_ID at build time. */
  id: string;
  domain: string;
  locales: Locale[];
  defaultLocale: Locale;
  sanity: SanityTarget;
  /** Sister domains for hreflang alternates once ≥2 translated sites exist. */
  sisterDomains: string[];
  features: SiteFeatures;
  /** Structural navigation (labels are domain-fixed; dropdown children come from CMS). */
  nav: NavItem[];
  sections: {
    home: HomeSectionId[];
  };
}
