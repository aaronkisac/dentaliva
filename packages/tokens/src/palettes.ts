/**
 * Alternate palettes for the runtime palette switcher (DSN-57, DSN-57b/316).
 * The default identity lives in tokens.ts (espresso/bronze, ADR-008) and needs
 * no override block; each entry below re-themes every color-carrying custom
 * property via the generated [data-palette] blocks (css/palettes.css).
 *
 * Legacy key names (navy/gold) are ROLES, not hues: `navy*` are the dark
 * surfaces, `gold*` the accent ramp, `ivory*` the light surfaces, `ink`/`muted`
 * the text family. Per Aaron's 316 feedback each palette is a COMPLETE
 * identity — light surfaces and text shift hue together with the darks, so a
 * theme change is visible on every section, not just dark bands.
 *
 * Every palette must pass the WCAG pairs in tests/tokens.test.ts. Alternates
 * are held to a STRICTER bar than the default: `muted` on `ivory` must also
 * pass 4.5 (the default espresso's 4.39 there is the pre-existing prohibited
 * pair documented in semantic.ts — not propagated to new palettes).
 *
 * `gece` revives the approved prototype navy/gold direction (2026-09-24
 * prototype :root). The rest are review alternates.
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

export const palettes: {
  gece: Palette;
  deniz: Palette;
  bordeaux: Palette;
  zeytin: Palette;
  lila: Palette;
  okyanus: Palette;
  gul: Palette;
  tarcin: Palette;
  orman: Palette;
} = {
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
    muted: "#5f6c7d",
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
    muted: "#5a6e75",
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
  zeytin: {
    navy: "#232a19",
    navy2: "#2d351f",
    navy3: "#3c4529",
    gold: "#cfc07a",
    goldSoft: "#e8e0b8",
    goldDeep: "#84783f",
    ivory: "#f8f8f1",
    ivory2: "#eef0e1",
    ink: "#2c2f22",
    muted: "#63685a",
    lineGold: "rgba(207, 192, 122, 0.35)",
    lineSoft: "rgba(35, 42, 25, 0.1)",
    gradGold: "linear-gradient(120deg, #84783f 0%, #e8e0b8 45%, #cfc07a 100%)",
    gradNavy: "linear-gradient(160deg, #232a19 0%, #3c4529 100%)",
    shadowSoft: "0 10px 30px -12px rgba(35, 42, 25, 0.14)",
    shadowLift: "0 30px 60px -25px rgba(35, 42, 25, 0.3)",
    shadowGold: "0 18px 40px -18px rgba(207, 192, 122, 0.55)",
  },
  lila: {
    navy: "#241a2e",
    navy2: "#2f2340",
    navy3: "#3f2f55",
    gold: "#c9b2e0",
    goldSoft: "#e6dcf2",
    goldDeep: "#7d5fa0",
    ivory: "#f9f7fb",
    ivory2: "#f0ecf6",
    ink: "#2d2438",
    muted: "#6b6377",
    lineGold: "rgba(201, 178, 224, 0.35)",
    lineSoft: "rgba(36, 26, 46, 0.1)",
    gradGold: "linear-gradient(120deg, #7d5fa0 0%, #e6dcf2 45%, #c9b2e0 100%)",
    gradNavy: "linear-gradient(160deg, #241a2e 0%, #3f2f55 100%)",
    shadowSoft: "0 10px 30px -12px rgba(36, 26, 46, 0.14)",
    shadowLift: "0 30px 60px -25px rgba(36, 26, 46, 0.3)",
    shadowGold: "0 18px 40px -18px rgba(201, 178, 224, 0.55)",
  },
  okyanus: {
    navy: "#0b2545",
    navy2: "#123154",
    navy3: "#1a4068",
    gold: "#a8cfe8",
    goldSoft: "#d6e8f4",
    goldDeep: "#4a7fa5",
    ivory: "#f6f9fb",
    ivory2: "#e9f0f5",
    ink: "#1f3242",
    muted: "#5d7183",
    lineGold: "rgba(168, 207, 232, 0.35)",
    lineSoft: "rgba(11, 37, 69, 0.1)",
    gradGold: "linear-gradient(120deg, #4a7fa5 0%, #d6e8f4 45%, #a8cfe8 100%)",
    gradNavy: "linear-gradient(160deg, #0b2545 0%, #1a4068 100%)",
    shadowSoft: "0 10px 30px -12px rgba(11, 37, 69, 0.14)",
    shadowLift: "0 30px 60px -25px rgba(11, 37, 69, 0.3)",
    shadowGold: "0 18px 40px -18px rgba(168, 207, 232, 0.55)",
  },
  gul: {
    navy: "#2e1a22",
    navy2: "#3c222c",
    navy3: "#4e2e3a",
    gold: "#d99ba6",
    goldSoft: "#f2d7dc",
    goldDeep: "#a85568",
    ivory: "#fbf5f6",
    ivory2: "#f4e9ec",
    ink: "#332228",
    muted: "#75606a",
    lineGold: "rgba(217, 155, 166, 0.35)",
    lineSoft: "rgba(46, 26, 34, 0.1)",
    gradGold: "linear-gradient(120deg, #a85568 0%, #f2d7dc 45%, #d99ba6 100%)",
    gradNavy: "linear-gradient(160deg, #2e1a22 0%, #4e2e3a 100%)",
    shadowSoft: "0 10px 30px -12px rgba(46, 26, 34, 0.14)",
    shadowLift: "0 30px 60px -25px rgba(46, 26, 34, 0.3)",
    shadowGold: "0 18px 40px -18px rgba(217, 155, 166, 0.55)",
  },
  tarcin: {
    navy: "#301c12",
    navy2: "#3e2618",
    navy3: "#523122",
    gold: "#d98e4a",
    goldSoft: "#f0d4bc",
    goldDeep: "#a35c2e",
    ivory: "#faf5f0",
    ivory2: "#f2e9e0",
    ink: "#33261d",
    muted: "#76655a",
    lineGold: "rgba(217, 142, 74, 0.35)",
    lineSoft: "rgba(48, 28, 18, 0.1)",
    gradGold: "linear-gradient(120deg, #a35c2e 0%, #f0d4bc 45%, #d98e4a 100%)",
    gradNavy: "linear-gradient(160deg, #301c12 0%, #523122 100%)",
    shadowSoft: "0 10px 30px -12px rgba(48, 28, 18, 0.14)",
    shadowLift: "0 30px 60px -25px rgba(48, 28, 18, 0.3)",
    shadowGold: "0 18px 40px -18px rgba(217, 142, 74, 0.55)",
  },
  orman: {
    navy: "#14251c",
    navy2: "#1b3125",
    navy3: "#254232",
    gold: "#a3c9a8",
    goldSoft: "#d5e6d7",
    goldDeep: "#4f7d58",
    ivory: "#f5f9f5",
    ivory2: "#e8f0e9",
    ink: "#22332a",
    muted: "#64736a",
    lineGold: "rgba(163, 201, 168, 0.35)",
    lineSoft: "rgba(20, 37, 28, 0.1)",
    gradGold: "linear-gradient(120deg, #4f7d58 0%, #d5e6d7 45%, #a3c9a8 100%)",
    gradNavy: "linear-gradient(160deg, #14251c 0%, #254232 100%)",
    shadowSoft: "0 10px 30px -12px rgba(20, 37, 28, 0.14)",
    shadowLift: "0 30px 60px -25px rgba(20, 37, 28, 0.3)",
    shadowGold: "0 18px 40px -18px rgba(163, 201, 168, 0.55)",
  },
};

export type PaletteId = typeof defaultPaletteId | keyof typeof palettes;

export const paletteIds: PaletteId[] = [
  defaultPaletteId,
  ...(Object.keys(palettes) as PaletteId[]),
];
