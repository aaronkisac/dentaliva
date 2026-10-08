import { describe, expect, it } from "vitest";

import { schemaTypes, singletonTypes } from "../src/schema";

const names = schemaTypes.map((type) => type.name);

describe("schema assembly (SAN-4)", () => {
  it("contains every clinic document type", () => {
    for (const name of [
      "treatment",
      "doctor",
      "branch",
      "faq",
      "testimonial",
      "legalPage",
      "blogPost",
      "redirect",
      "homePage",
      "siteSettings",
      "siteCopy",
    ]) {
      expect(names).toContain(name);
    }
  });

  it("contains the kernel and shared objects", () => {
    for (const name of [
      "localeString",
      "localeText",
      "seo",
      "imageWithAlt",
      "localeBlockContent",
    ]) {
      expect(names).toContain(name);
    }
  });

  it("has no duplicate type names", () => {
    expect(new Set(names).size).toBe(names.length);
  });

  it("marks exactly the two content singletons", () => {
    expect(singletonTypes).toEqual(["siteCopy", "siteSettings", "homePage"]);
  });

  it("gives every document type a preview config", () => {
    for (const type of schemaTypes) {
      if (singletonTypes.includes(type.name) || !("fields" in type)) continue;
      if (
        ![
          "treatment",
          "doctor",
          "branch",
          "faq",
          "testimonial",
          "legalPage",
          "blogPost",
          "redirect",
        ].includes(type.name)
      ) {
        continue;
      }
      expect("preview" in type, type.name + " needs preview").toBe(true);
    }
  });
});
