import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { contrastRatio, hexToRgb, meetsWcag } from "../src/contrast";
import { contrastPairs, prohibitedPairs } from "../src/semantic";
import { color } from "../src/tokens";
import { renderTokensCss } from "../src/to-css";

/** Generated files are stored with LF; normalize CRLF checkouts (git autocrlf). */
function readLf(path: string): string {
  return readFileSync(path, "utf8").replace(/\r\n/g, "\n");
}

describe("WCAG contrast of approved token pairs", () => {
  it.each(contrastPairs.map((p) => [p.usage, p.fg, p.bg, p.min] as const))(
    "%s passes its minimum",
    (_usage, fg, bg, min) => {
      expect(meetsWcag(fg, bg, min)).toBe(true);
    },
  );

  it.each(prohibitedPairs.map((p) => [p.usage, p.fg, p.bg, p.min] as const))(
    "prohibited: %s is documented as failing",
    (_usage, fg, bg, min) => {
      expect(meetsWcag(fg, bg, min)).toBe(false);
    },
  );

  it("rejects invalid hex colors", () => {
    expect(() => hexToRgb("#12345")).toThrow(/Invalid hex color/);
    expect(() => hexToRgb("nope")).toThrow(/Invalid hex color/);
  });

  it("handles the sRGB linearization low-channel branch", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBe(21);
  });

  it("reads the exact approved brand colors", () => {
    // ADR-008 (2026-09-28): warm ReoDental-inspired re-theme.
    expect(color.navy).toBe("#1c1610");
    expect(color.gold).toBe("#c09a55");
  });

  it("gold-on-navy has a documented ratio in AA-normal territory", () => {
    expect(contrastRatio(color.gold, color.navy)).toBeGreaterThan(4.5);
  });
});

describe("generated tokens.css", () => {
  const cssPath = fileURLToPath(new URL("../css/tokens.css", import.meta.url));
  const generated = renderTokensCss();

  if (process.env.UPDATE_TOKENS_CSS) {
    it("writes css/tokens.css (UPDATE_TOKENS_CSS=1)", () => {
      writeFileSync(cssPath, generated);
      expect(readLf(cssPath)).toBe(generated);
    });
  } else {
    it("is in sync with src/tokens.ts (run with UPDATE_TOKENS_CSS=1 -u to regenerate)", () => {
      expect(readLf(cssPath)).toBe(generated);
    });
  }
});
