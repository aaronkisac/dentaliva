/**
 * Approved foreground/background token pairs with their minimum WCAG level.
 * UI must use these pairs (or text sizes that satisfy the noted exemption);
 * pairs listed in `prohibited` are forbidden in components and asserted here
 * so accidental use is caught by reading this file.
 */
import { color } from "./tokens";

export interface ContrastPair {
  /** e.g. "body text on section background" */
  usage: string;
  fg: string;
  bg: string;
  /** 3 = large text / UI shapes only; 4.5 = normal text; 7 = enhanced */
  min: 3 | 4.5 | 7;
}

export const contrastPairs: ContrastPair[] = [
  { usage: "body text on ivory sections", fg: color.ink, bg: color.ivory, min: 4.5 },
  { usage: "body text on white", fg: color.ink, bg: color.white, min: 4.5 },
  { usage: "secondary text on white", fg: color.muted, bg: color.white, min: 4.5 },
  { usage: "accent text on navy sections", fg: color.gold, bg: color.navy, min: 4.5 },
  { usage: "soft accent text on navy", fg: color.goldSoft, bg: color.navy, min: 4.5 },
  { usage: "primary text on navy", fg: color.white, bg: color.navy, min: 4.5 },
  { usage: "button text on gold buttons", fg: color.navy, bg: color.gold, min: 4.5 },
  {
    usage: "large serif accents on light (display sizes only)",
    fg: color.goldDeep,
    bg: color.white,
    min: 3,
  },
];

/** Documented NON-combinations — asserted to fail so nobody "fixes" them in. */
export const prohibitedPairs: ContrastPair[] = [
  { usage: "muted text on ivory (fails AA — use ink)", fg: color.muted, bg: color.ivory, min: 4.5 },
  {
    usage: "gold text on white (decorative lines only, never text)",
    fg: color.gold,
    bg: color.white,
    min: 3,
  },
];
