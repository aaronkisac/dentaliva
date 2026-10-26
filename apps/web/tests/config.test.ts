import { afterEach, describe, expect, it } from "vitest";

import { availableSiteIds, getSite, site } from "../src/config";
import { imageTarget } from "../src/image-target";

afterEach(() => {
  delete process.env.SITE_ID;
});

describe("site config (PGT-1)", () => {
  it("resolves the default site (com) with the live Sanity target", () => {
    expect(site.id).toBe("com");
    expect(site.domain).toBe("www.dentaliva.com");
    expect(site.sanity.projectId).toBe("86x2hbzv");
    expect(site.sanity.dataset).toBe("production");
    expect(site.defaultLocale).toBe("tr");
  });

  it("resolves by explicit id", () => {
    expect(getSite("com").id).toBe("com");
    expect(getSite("eu").id).toBe("eu");
  });

  it("resolves the eu sister site with its own Sanity project and locale", () => {
    const eu = getSite("eu");
    expect(eu.domain).toBe("www.dentaliva.eu");
    expect(eu.defaultLocale).toBe("en");
    expect(eu.sanity.projectId).toBe("84n9qnfg");
    expect(eu.sanity.dataset).toBe("production");
    expect(eu.features.chatbotApi).toBe(false);
    expect(eu.features.blog).toBe(true);
  });

  it("keeps public route segments per site (localized routes are data)", () => {
    const com = getSite("com");
    expect(com.routes.treatments).toBe("/hizmetlerimiz");
    expect(com.routes.contact).toBe("/iletisim");
    expect(com.routes.legal).toBe("/kvkk");
    const eu = getSite("eu");
    expect(eu.routes.treatments).toBe("/services");
    expect(eu.routes.contact).toBe("/contact");
    expect(eu.routes.legal).toBe("/privacy");
  });

  it("resolves the nl sister site with its own Sanity project and locale", () => {
    const nl = getSite("nl");
    expect(nl.domain).toBe("www.dentaliva.nl");
    expect(nl.defaultLocale).toBe("nl");
    expect(nl.sanity.projectId).toBe("x8kdvsh2");
    expect(nl.features.chatbotApi).toBe(false);
    expect(nl.features.blog).toBe(false);
    expect(nl.routes.treatments).toBe("/behandelingen");
    expect(nl.routes.doctors).toBe("/onze-tandartsen");
    expect(nl.routes.legal).toBe("/privacybeleid");
  });

  it("registers every site for loud unknown-id errors", () => {
    expect(availableSiteIds()).toEqual(["com", "eu", "nl"]);
  });

  it("resolves from SITE_ID env", () => {
    process.env.SITE_ID = "com";
    expect(getSite().id).toBe("com");
  });

  it("fails loudly on an unknown SITE_ID, listing available sites", () => {
    expect(() => getSite("xx")).toThrowError(/Unknown SITE_ID "xx".*com/);
  });

  it("exposes the registry for error messages", () => {
    expect(availableSiteIds()).toContain("com");
  });

  it("orders the home sections per the approved design", () => {
    // DSN-61: funnel strategy order — mevcut bölümler final konumlarına
    // taşındı; sonraki dalgalar yeni bölümleri bu slotların arasına ekler.
    expect(site.sections.home).toEqual([
      "hero",
      "ticker",
      "trustStrip",
      "about",
      "treatmentPaths",
      "quickServices",
      "onceSonra",
      "videoTestimonials",
      "reviewForm",
      "howItWorks",
      "decisionModules",
      "travelStay",
      "aftercare",
      "reviews",
      "gallery",
      "doctors",
      "faq",
      "cta",
    ]);
    expect(getSite("eu").sections.home).toEqual(site.sections.home);
    expect(getSite("nl").sections.home).toEqual(site.sections.home);
  });

  it("binds the image CDN project to the registry; the dataset follows the build", () => {
    // A stale SANITY_PROJECT_ID in .env must never cross-wire a SITE_ID=eu
    // build onto the com project's CDN (INT-1). The dataset is per-build on
    // purpose: the eu staging deploy targets that site's staging dataset
    // within its own project (INT-8).
    process.env.SANITY_PROJECT_ID = "decoy123";
    process.env.SANITY_DATASET = "decoy-dataset";
    expect(imageTarget()).toEqual({ projectId: "86x2hbzv", dataset: "decoy-dataset" });
    delete process.env.SANITY_PROJECT_ID;
    delete process.env.SANITY_DATASET;
    expect(imageTarget()).toEqual({ projectId: "86x2hbzv", dataset: "production" });
  });
});
