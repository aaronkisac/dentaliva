import { beforeEach, describe, expect, it } from "vitest";

import { paletteIds } from "@dentaliva/tokens";

import {
  PALETTE_STORAGE_KEY,
  applyPalette,
  palettePrepaintScript,
  resolveStoredPalette,
} from "../src/theme";

describe("resolveStoredPalette (DSN-57)", () => {
  it("accepts known ids and rejects everything else", () => {
    expect(resolveStoredPalette("gece")).toBe("gece");
    expect(resolveStoredPalette("espresso")).toBe("espresso");
    expect(resolveStoredPalette(null)).toBeNull();
    expect(resolveStoredPalette(undefined)).toBeNull();
    expect(resolveStoredPalette("")).toBeNull();
    expect(resolveStoredPalette("javascript:alert(1)")).toBeNull();
  });
});

describe("applyPalette (DSN-57)", () => {
  beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.palette;
  });

  it("sets the attribute and persists a non-default palette", () => {
    applyPalette("gece");
    expect(document.documentElement.dataset.palette).toBe("gece");
    expect(localStorage.getItem(PALETTE_STORAGE_KEY)).toBe("gece");
  });

  it("clears the attribute when the default palette is chosen again", () => {
    applyPalette("deniz");
    applyPalette("espresso");
    expect(document.documentElement.dataset.palette).toBeUndefined();
    expect(localStorage.getItem(PALETTE_STORAGE_KEY)).toBe("espresso");
  });
});

describe("palettePrepaintScript (DSN-57)", () => {
  it("embeds exactly the non-default palette ids and the storage key", () => {
    expect(palettePrepaintScript).toContain(PALETTE_STORAGE_KEY);
    for (const id of paletteIds) {
      expect(palettePrepaintScript.includes(`"${id}"`)).toBe(id !== "espresso");
    }
  });

  it("validates the stored value before touching the document element", () => {
    expect(palettePrepaintScript).toMatch(/^\(function\(\)/);
    expect(palettePrepaintScript).toContain("indexOf(p)<0)return");
    expect(palettePrepaintScript).toContain("try{");
  });
});
