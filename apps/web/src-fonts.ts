/**
 * Self-hosted brand typography via next/font (DSN-2): files are downloaded and
 * bundled at build time — no runtime request to fonts.googleapis.com.
 * Call-site literals are a next/font requirement; see src/font-metadata.ts.
 */
import { Cormorant_Garamond, Montserrat } from "next/font/google";

export const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--dvn-font-cormorant",
});

export const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
  display: "swap",
  variable: "--dvn-font-montserrat",
});

export const fontVariables = `${cormorant.variable} ${montserrat.variable}`;
