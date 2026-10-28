import { describe, expect, it } from "vitest";

import { bodyBreakIndex, splitBodyParagraphs } from "../src/content/treatment-body";

describe("splitBodyParagraphs (DSN-70)", () => {
  it("splits on single and double newlines, trimming empties", () => {
    const out = splitBodyParagraphs("İlk paragraf.\n\nİkinci.\nÜçüncü.\n\n\n  \nDördüncü.");
    expect(out).toEqual(["İlk paragraf.", "İkinci.", "Üçüncü.", "Dördüncü."]);
  });

  it("returns a single paragraph for uninterrupted text", () => {
    expect(splitBodyParagraphs("Tek blok.")).toEqual(["Tek blok."]);
    expect(splitBodyParagraphs("")).toEqual([]);
  });
});

describe("bodyBreakIndex (DSN-70)", () => {
  it("places breaks proportionally in long bodies", () => {
    expect(bodyBreakIndex(20, 0.3)).toBe(6);
    expect(bodyBreakIndex(20, 0.65)).toBe(13);
  });

  it("keeps the index inside the body (at least 1, never the last slot)", () => {
    expect(bodyBreakIndex(6, 0.3)).toBe(2);
    expect(bodyBreakIndex(6, 0.9)).toBe(5);
  });

  it("returns null for short bodies — no artificial break", () => {
    expect(bodyBreakIndex(5, 0.3)).toBeNull();
    expect(bodyBreakIndex(0, 0.3)).toBeNull();
  });
});
