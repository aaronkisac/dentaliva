import { site } from "./config";

/**
 * Public paths for the ACTIVE site (ADR-004): segment names are localized
 * data on the site config (INT-1) and every internal link in app code is
 * built from here — no route literals outside sites/*.ts. Detail helpers
 * keep slug joining consistent for links, sitemap and breadcrumbs.
 */
export const routes = {
  home: "/",
  about: site.routes.about,
  treatments: site.routes.treatments,
  doctors: site.routes.doctors,
  branches: site.routes.branches,
  blog: site.routes.blog,
  contact: site.routes.contact,
  gallery: site.routes.gallery,
  legal: site.routes.legal,
  // Slug projections from the CMS are typed optional; Sanity requires slugs,
  // so the undefined case degrades to the listing segment — never a dead link.
  treatment: (slug?: string) =>
    slug ? `${site.routes.treatments}/${slug}` : site.routes.treatments,
  doctor: (slug?: string) => (slug ? `${site.routes.doctors}/${slug}` : site.routes.doctors),
  branch: (slug?: string) => (slug ? `${site.routes.branches}/${slug}` : site.routes.branches),
  blogPost: (slug?: string) => (slug ? `${site.routes.blog}/${slug}` : site.routes.blog),
};
