import { describe, expect, it } from "vitest";

import { filterPublishable, isPublishableSlug } from "../src/content/publishable-slug";

describe("publishable slug guard (DSN-100)", () => {
  it("accepts the slug shapes the site actually ships", () => {
    for (const slug of [
      "avcilar",
      "dis-beyazlatma",
      "all-on-four",
      "emel-ozdemir",
      "implant-tedavisi",
    ]) {
      expect(isPublishableSlug(slug)).toBe(true);
    }
  });

  it("rejects malformed slugs (dot, case, space, turkish chars, empty)", () => {
    for (const slug of [
      "google.com",
      "Hizmet",
      "guzel alan",
      "diş-beyazlatma",
      "",
      null,
      undefined,
    ]) {
      expect(isPublishableSlug(slug)).toBe(false);
    }
  });

  it("filterPublishable drops malformed entries and null-safes", () => {
    const list = [{ slug: "implant" }, { slug: "google.com" }, { name: "slug yok" }];
    expect(filterPublishable(list).map((item) => item.slug)).toEqual(["implant"]);
    expect(filterPublishable(null)).toEqual([]);
    expect(filterPublishable(undefined)).toEqual([]);
  });
});
