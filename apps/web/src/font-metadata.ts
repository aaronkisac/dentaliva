/**
 * Declared font-loader metadata, mirrored by the inline literals in
 * src-fonts.ts (next/font requires call-site literals, so they cannot import
 * this object). Tests assert this file; the build proves the literals.
 * `latin-ext` is mandatory for Turkish glyphs (ğ, ş, İ, ı).
 */
export const fontMetadata = {
  cormorant: {
    subsets: ["latin", "latin-ext"],
    weight: ["300", "400", "500", "600", "700"],
    style: ["normal", "italic"],
    display: "swap",
    variable: "--dvn-font-cormorant",
  },
  montserrat: {
    subsets: ["latin", "latin-ext"],
    weight: ["400", "500", "600", "700"],
    style: ["normal"],
    display: "swap",
    variable: "--dvn-font-montserrat",
  },
} as const;
