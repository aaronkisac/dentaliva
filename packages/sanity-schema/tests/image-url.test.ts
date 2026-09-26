import { describe, expect, it } from "vitest";

import { refToBase, urlForImage } from "../src/image-url";

const REF = "image-abc123-1900x1200-jpg";

describe("refToBase", () => {
  it("converts a reference to the CDN file path", () => {
    expect(refToBase(REF)).toBe("abc123-1900x1200.jpg");
  });

  it("rejects malformed references", () => {
    expect(() => refToBase("not-a-ref")).toThrow(/Invalid Sanity image reference/);
  });
});

describe("urlForImage", () => {
  it("builds a CDN URL with format, fit and size", () => {
    const url = urlForImage(
      REF,
      { width: 1024, quality: 80 },
      { projectId: "86x2hbzv", dataset: "production" },
    );
    expect(url).toContain("https://cdn.sanity.io/images/86x2hbzv/production/abc123-1900x1200.jpg");
    expect(url).toContain("auto=format");
    expect(url).toContain("fit=crop");
    expect(url).toContain("w=1024");
    expect(url).toContain("q=80");
  });

  it("defaults quality and omits width when not given", () => {
    const url = urlForImage(REF, {}, { projectId: "p", dataset: "d" });
    expect(url).not.toContain("w=");
    expect(url).toContain("fit=crop");
  });
});
