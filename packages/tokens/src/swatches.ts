/**
 * Minimal two-color preview per palette for the theme-switcher swatch grid
 * (DSN-57b). Kept as an independent literal — NOT derived from palettes.ts —
 * so the client bundle ships 20 hexes instead of every palette's full
 * property set; tests/tokens.test.ts asserts it stays in sync with
 * palettes.ts + tokens.ts (the sources of truth).
 */
import type { PaletteId } from "./palettes";

export interface PaletteSwatch {
  dark: string;
  accent: string;
}

export const paletteSwatches: Record<PaletteId, PaletteSwatch> = {
  espresso: { dark: "#1c1610", accent: "#c09a55" },
  gece: { dark: "#0c1f38", accent: "#c9a35c" },
  deniz: { dark: "#0d2630", accent: "#8fd0c3" },
  bordeaux: { dark: "#291016", accent: "#cf9a6a" },
  zeytin: { dark: "#232a19", accent: "#cfc07a" },
  lila: { dark: "#241a2e", accent: "#c9b2e0" },
  okyanus: { dark: "#0b2545", accent: "#a8cfe8" },
  gul: { dark: "#2e1a22", accent: "#d99ba6" },
  tarcin: { dark: "#301c12", accent: "#d98e4a" },
  orman: { dark: "#14251c", accent: "#a3c9a8" },
};
