/**
 * Self-hosted brand typography via next/font (DSN-2): files are downloaded and
 * bundled at build time — no runtime request to fonts.googleapis.com.
 * Call-site literals are a next/font requirement; see src/font-metadata.ts.
 *
 * display: optional (PRF-3) pins the LCP to the first paint: the swap repaint
 * of the serif display face was the LCP element (~3.6 s under throttled 4G).
 * With a preloaded self-hosted file, optional applies the brand font within
 * its 100 ms window on real connections and keeps the system fallback (never
 * a late reflow) when it doesn't. Unused Cormorant weights (300/500/600) are
 * pruned — every declared weight competes in the preload queue.
 */
import { Cormorant_Garamond, Montserrat } from "next/font/google";

export const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "optional",
  variable: "--dvn-font-cormorant",
});

export const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
  display: "optional",
  variable: "--dvn-font-montserrat",
});

export const fontVariables = `${cormorant.variable} ${montserrat.variable}`;
