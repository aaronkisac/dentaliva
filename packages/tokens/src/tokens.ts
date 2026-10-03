/**
 * Single source of truth for design tokens (ADR-005, amended by ADR-008).
 * The structure (semantic names, scales) comes from the approved prototype;
 * the palette was re-themed 2026-09-28 toward a warm, ReoDental-inspired
 * identity (espresso darks, bronze accent, warm off-white) — ADR-005's
 * "layout patterns only" rule still applies to the reference template.
 * Consumed as CSS custom properties (css/tokens.css, generated) and mapped
 * into Tailwind v4 via @dentaliva/config/tailwind/theme.css. No design
 * values may exist outside this package.
 *
 * Legacy key names (navy/gold) are kept for stability — `navy` now holds
 * the warm espresso dark, `gold` the bronze accent.
 */

export const color = {
  navy: "#1c1610",
  navy2: "#241d15",
  navy3: "#322a1f",
  gold: "#c09a55",
  goldSoft: "#e3d2ab",
  goldDeep: "#96733f",
  ivory: "#faf9f6",
  ivory2: "#f2efe7",
  white: "#ffffff",
  ink: "#2b2620",
  muted: "#7a746b",
} as const;

export const line = {
  gold: "rgba(192, 154, 85, 0.35)",
  soft: "rgba(28, 22, 16, 0.1)",
} as const;

export const gradient = {
  gold: "linear-gradient(120deg, #96733f 0%, #e3d2ab 45%, #c09a55 100%)",
  navy: "linear-gradient(160deg, #1c1610 0%, #322a1f 100%)",
} as const;

export const shadow = {
  soft: "0 10px 30px -12px rgba(28, 22, 16, 0.14)",
  lift: "0 30px 60px -25px rgba(28, 22, 16, 0.3)",
  gold: "0 18px 40px -18px rgba(192, 154, 85, 0.55)",
} as const;

export const fontFamily = {
  serif: "'Cormorant Garamond', 'Georgia', serif",
  sans: "'Montserrat', 'Segoe UI', sans-serif",
} as const;

/**
 * Square corners are a brand trait (DSN-32: the round avatar exception is
 * retired — portraits use the 4px carousel radius in the app layer).
 */
export const radius = {
  none: "0px",
  full: "9999px",
} as const;

/** Prototype breakpoints (px): grid collapse points measured in the design. */
export const breakpoint = {
  sm: 640,
  md: 900,
  lg: 1080,
  xl: 1440,
} as const;

export const layout = {
  containerMax: "1180px",
  containerGutter: "28px",
  sectionPaddingY: "110px",
  sectionPaddingYMd: "80px",
  headerHeight: "84px",
} as const;

/** Spacing scale, px-based 4pt grid. */
export const space = {
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "24px",
  6: "32px",
  8: "48px",
  10: "64px",
  12: "80px",
} as const;

/** Type scale (px / unitless line-height). Display faces are the serif. */
export const typeScale = {
  displayXl: { size: "64px", lineHeight: "1.05" },
  displayLg: { size: "48px", lineHeight: "1.1" },
  displayMd: { size: "40px", lineHeight: "1.15" },
  displaySm: { size: "32px", lineHeight: "1.2" },
  title: { size: "24px", lineHeight: "1.3" },
  bodyLg: { size: "18px", lineHeight: "1.6" },
  body: { size: "16px", lineHeight: "1.6" },
  small: { size: "14px", lineHeight: "1.6" },
  micro: { size: "12px", lineHeight: "1.5" },
} as const;

/** Motion tokens; all motion must be gated by prefers-reduced-motion (DSN-6). */
export const motion = {
  durationFast: "150ms",
  durationBase: "300ms",
  durationSlow: "600ms",
  easingOut: "cubic-bezier(0.22, 1, 0.36, 1)",
  stagger: "60ms",
} as const;

export const zIndex = {
  behind: -1,
  base: 0,
  raised: 10,
  header: 100,
  overlay: 200,
  modal: 300,
} as const;
