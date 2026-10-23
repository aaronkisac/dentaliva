import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { contrastRatio, hexToRgb, meetsWcag } from "../src/contrast";
import { palettes, paletteIds, type Palette } from "../src/palettes";
import { contrastPairs, prohibitedPairs } from "../src/semantic";
import { color } from "../src/tokens";
import { renderPalettesCss, renderTokensCss } from "../src/to-css";

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

/** semantic.ts pairs mapped onto palette roles — white is palette-neutral. */
function rolePairs(p: Palette) {
  return [
    { usage: "body text on ivory sections", fg: p.ink, bg: p.ivory, min: 4.5 },
    { usage: "body text on white", fg: p.ink, bg: "#ffffff", min: 4.5 },
    { usage: "secondary text on white", fg: p.muted, bg: "#ffffff", min: 4.5 },
    { usage: "accent text on navy sections", fg: p.gold, bg: p.navy, min: 4.5 },
    { usage: "soft accent text on navy", fg: p.goldSoft, bg: p.navy, min: 4.5 },
    { usage: "primary text on navy", fg: "#ffffff", bg: p.navy, min: 4.5 },
    { usage: "button text on gold buttons", fg: p.navy, bg: p.gold, min: 4.5 },
    { usage: "large serif accents on light", fg: p.goldDeep, bg: "#ffffff", min: 3 },
  ] as const;
}

describe("alternate palettes (DSN-57)", () => {
  it.each(Object.entries(palettes))("%s passes the approved contrast pairs", (_id, palette) => {
    for (const { usage, fg, bg, min } of rolePairs(palette)) {
      expect(meetsWcag(fg, bg, min), `${usage}: ${fg} on ${bg}`).toBe(true);
    }
  });

  it("keeps ids attribute-safe for data-palette and storage", () => {
    for (const id of paletteIds) {
      expect(id).toMatch(/^[a-z][a-z-]*$/);
    }
    expect(paletteIds[0]).toBe("espresso");
  });

  it("orders the id registry as default first, then alternates", () => {
    expect(paletteIds).toEqual(["espresso", "gece", "deniz", "bordeaux"]);
  });
});

describe("generated palettes.css", () => {
  const cssPath = fileURLToPath(new URL("../css/palettes.css", import.meta.url));
  const generated = renderPalettesCss();

  if (process.env.UPDATE_TOKENS_CSS) {
    it("writes css/palettes.css (UPDATE_TOKENS_CSS=1)", () => {
      writeFileSync(cssPath, generated);
      expect(readLf(cssPath)).toBe(generated);
    });
  } else {
    it("is in sync with src/palettes.ts (run with UPDATE_TOKENS_CSS=1 -u to regenerate)", () => {
      expect(readLf(cssPath)).toBe(generated);
    });
  }
});
