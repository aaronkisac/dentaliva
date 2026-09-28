import { afterEach, describe, expect, it } from "vitest";

import { availableSiteIds, getSite, site } from "../src/config";

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
    expect(site.sections.home).toEqual([
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
    ]);
  });
});
