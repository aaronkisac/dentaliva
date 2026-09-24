// The next/font loaders are build-time transforms (not callable under plain
// vitest) — this suite covers the declared metadata; the build in CI proves
// the loader accepts the literals, and self-hosting is asserted in E2E
// (no runtime request to fonts.googleapis.com).
import { describe, expect, it } from "vitest";

import { fontMetadata } from "../src/font-metadata";

describe("brand typography (DSN-2)", () => {
  it("covers Turkish glyphs via latin-ext on both families", () => {
    for (const family of [fontMetadata.cormorant, fontMetadata.montserrat]) {
      expect(family.subsets).toContain("latin");
      expect(family.subsets).toContain("latin-ext");
    }
  });

  it("exposes the token CSS variable names the app consumes", () => {
    expect(fontMetadata.cormorant.variable).toBe("--dvn-font-cormorant");
    expect(fontMetadata.montserrat.variable).toBe("--dvn-font-montserrat");
  });

  it("uses swap display to avoid invisible text", () => {
    expect(fontMetadata.cormorant.display).toBe("swap");
    expect(fontMetadata.montserrat.display).toBe("swap");
  });
});
