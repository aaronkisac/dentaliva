/**
 * Alternate palettes for the runtime palette switcher (DSN-57). The default
 * identity lives in tokens.ts (espresso/bronze, ADR-008) and needs no override
 * block; each entry below re-themes every color-carrying custom property via
 * the generated [data-palette] blocks (css/palettes.css).
 *
 * Legacy key names (navy/gold) are ROLES, not hues: `navy*` are the dark
 * surfaces, `gold*` the accent ramp, `ivory*` the light surfaces. Every
 * palette must pass the approved WCAG pairs in tests/tokens.test.ts — a new
 * palette that fails contrast fails CI.
 *
 * `gece` revives the approved prototype navy/gold direction (2026-09-24
 * prototype :root). `deniz` and `bordeaux` are review alternates.
 */

export interface Palette {
  navy: string;
  navy2: string;
  navy3: string;
  gold: string;
  goldSoft: string;
  goldDeep: string;
  ivory: string;
  ivory2: string;
  ink: string;
  muted: string;
  lineGold: string;
  lineSoft: string;
  gradGold: string;
  gradNavy: string;
  shadowSoft: string;
  shadowLift: string;
  shadowGold: string;
}

export const defaultPaletteId = "espresso" as const;

export const palettes: { gece: Palette; deniz: Palette; bordeaux: Palette } = {
  gece: {
    navy: "#0c1f38",
    navy2: "#122b4a",
    navy3: "#1a3a5f",
    gold: "#c9a35c",
    goldSoft: "#e6cfa0",
    goldDeep: "#a8823d",
    ivory: "#faf7f2",
    ivory2: "#f3eee4",
    ink: "#2a3648",
    muted: "#6b7686",
    lineGold: "rgba(201, 163, 92, 0.35)",
    lineSoft: "rgba(12, 31, 56, 0.1)",
    gradGold: "linear-gradient(120deg, #a8823d 0%, #e6cfa0 45%, #c9a35c 100%)",
    gradNavy: "linear-gradient(160deg, #0c1f38 0%, #1a3a5f 100%)",
    shadowSoft: "0 10px 30px -12px rgba(12, 31, 56, 0.14)",
    shadowLift: "0 30px 60px -25px rgba(12, 31, 56, 0.3)",
    shadowGold: "0 18px 40px -18px rgba(201, 163, 92, 0.55)",
  },
  deniz: {
    navy: "#0d2630",
    navy2: "#12333e",
    navy3: "#1a4553",
    gold: "#8fd0c3",
    goldSoft: "#c9e8e1",
    goldDeep: "#2e7d72",
    ivory: "#f7fafa",
    ivory2: "#eaf1f0",
    ink: "#22333a",
    muted: "#64777d",
    lineGold: "rgba(143, 208, 195, 0.4)",
    lineSoft: "rgba(13, 38, 48, 0.1)",
    gradGold: "linear-gradient(120deg, #2e7d72 0%, #c9e8e1 45%, #8fd0c3 100%)",
    gradNavy: "linear-gradient(160deg, #0d2630 0%, #1a4553 100%)",
    shadowSoft: "0 10px 30px -12px rgba(13, 38, 48, 0.14)",
    shadowLift: "0 30px 60px -25px rgba(13, 38, 48, 0.3)",
    shadowGold: "0 18px 40px -18px rgba(143, 208, 195, 0.5)",
  },
  bordeaux: {
    navy: "#291016",
    navy2: "#361620",
    navy3: "#47202c",
    gold: "#cf9a6a",
    goldSoft: "#ecd0bd",
    goldDeep: "#9c5f41",
    ivory: "#fbf6f3",
    ivory2: "#f4ebe6",
    ink: "#302226",
    muted: "#7d6a6e",
    lineGold: "rgba(207, 154, 106, 0.35)",
    lineSoft: "rgba(41, 16, 22, 0.1)",
    gradGold: "linear-gradient(120deg, #9c5f41 0%, #ecd0bd 45%, #cf9a6a 100%)",
    gradNavy: "linear-gradient(160deg, #291016 0%, #47202c 100%)",
    shadowSoft: "0 10px 30px -12px rgba(41, 16, 22, 0.14)",
    shadowLift: "0 30px 60px -25px rgba(41, 16, 22, 0.3)",
    shadowGold: "0 18px 40px -18px rgba(207, 154, 106, 0.55)",
  },
};

export type PaletteId = typeof defaultPaletteId | keyof typeof palettes;

export const paletteIds: PaletteId[] = [
  defaultPaletteId,
  ...(Object.keys(palettes) as PaletteId[]),
];
