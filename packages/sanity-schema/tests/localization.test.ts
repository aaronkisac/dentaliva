import { describe, expect, it } from "vitest";

import { isSingleLocaleSite, pickLocalized } from "../src/localization";

describe("localization policy (PGT-9)", () => {
  it.each([
    [undefined, undefined, "", ""],
    [{ tr: "Gülüş tasarımı", en: "Smile design" }, undefined, "Gülüş tasarımı", "Smile design"],
    [{ tr: "Gülüş tasarımı", en: null }, "en", "Gülüş tasarımı", "Gülüş tasarımı"],
  ] as const)("resolves %j (locale=%s) → tr:%j en:%j", (value, locale, expectedTr, expectedEn) => {
    expect(pickLocalized(value, "tr")).toBe(expectedTr);
    expect(pickLocalized(value, locale ?? "en")).toBe(expectedEn);
  });

  it("single-locale contract holds for v1 (tr only)", () => {
    expect(isSingleLocaleSite(["tr"])).toBe(true);
  });
});
