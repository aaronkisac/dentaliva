import { afterEach, describe, expect, it, vi } from "vitest";

import { t, tBlocks } from "../src/i18n";

afterEach(() => {
  delete process.env.SITE_ID;
  vi.resetModules();
});

describe("t() locale resolution (INT-2)", () => {
  it("resolves tr on the com site with en untouched", () => {
    expect(t({ tr: "Anasayfa", en: "Home" })).toBe("Anasayfa");
  });

  it("returns an empty string for missing values", () => {
    expect(t(undefined)).toBe("");
    expect(t(null)).toBe("");
    expect(t({})).toBe("");
    expect(t({ tr: null, en: "EN" })).toBe("");
  });

  it("resolves en with a tr fallback when SITE_ID=eu", async () => {
    process.env.SITE_ID = "eu";
    vi.resetModules();
    const { t: tEu } = await import("../src/i18n");
    expect(tEu({ tr: "TR", en: "Home" })).toBe("Home");
    expect(tEu({ tr: "sadece-tr" })).toBe("sadece-tr");
    expect(tEu(undefined)).toBe("");
  });
});

describe("tBlocks() rich-text resolution (INT-2)", () => {
  it("returns the tr block array on the com site", () => {
    const trBlock = [{ _type: "block", children: [] }];
    const enBlock = [{ _type: "block", children: [] }];
    expect(tBlocks({ tr: trBlock, en: enBlock })).toBe(trBlock);
    expect(tBlocks(undefined)).toEqual([]);
    expect(tBlocks({})).toEqual([]);
  });

  it("falls back to tr blocks when en is unset under SITE_ID=eu", async () => {
    process.env.SITE_ID = "eu";
    vi.resetModules();
    const { tBlocks: tBlocksEu } = await import("../src/i18n");
    const trBlock = [{ _type: "block", children: [] }];
    expect(tBlocksEu<(typeof trBlock)[number]>({ tr: trBlock })).toEqual(trBlock);
    expect(tBlocksEu({ en: undefined, tr: undefined })).toEqual([]);
  });
});
