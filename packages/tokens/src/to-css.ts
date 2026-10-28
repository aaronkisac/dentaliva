/** Serializes tokens to the `--dvn-*` custom properties consumed by the app. */
import {
  breakpoint,
  color,
  fontFamily,
  gradient,
  layout,
  line,
  motion,
  radius,
  shadow,
  space,
  typeScale,
  zIndex,
} from "./tokens";
import { palettes, type Palette } from "./palettes";

/** Explicit var names keep the generated CSS stable and greppable. */
export const cssVariables: Record<string, string> = {
  "--dvn-navy": color.navy,
  "--dvn-navy-2": color.navy2,
  "--dvn-navy-3": color.navy3,
  "--dvn-gold": color.gold,
  "--dvn-gold-soft": color.goldSoft,
  "--dvn-gold-deep": color.goldDeep,
  "--dvn-ivory": color.ivory,
  "--dvn-ivory-2": color.ivory2,
  "--dvn-white": color.white,
  "--dvn-ink": color.ink,
  "--dvn-muted": color.muted,
  "--dvn-line-gold": line.gold,
  "--dvn-line-soft": line.soft,
  "--dvn-grad-gold": gradient.gold,
  "--dvn-grad-navy": gradient.navy,
  "--dvn-shadow-soft": shadow.soft,
  "--dvn-shadow-lift": shadow.lift,
  "--dvn-shadow-gold": shadow.gold,
  "--dvn-font-serif": fontFamily.serif,
  "--dvn-font-sans": fontFamily.sans,
  "--dvn-radius-none": radius.none,
  "--dvn-radius-full": radius.full,
  "--dvn-container-max": layout.containerMax,
  "--dvn-container-gutter": layout.containerGutter,
  "--dvn-section-y": layout.sectionPaddingY,
  "--dvn-section-y-md": layout.sectionPaddingYMd,
  "--dvn-header-h": layout.headerHeight,
  ...Object.fromEntries(Object.entries(space).map(([k, v]) => [`--dvn-space-${k}`, v])),
  ...Object.fromEntries(
    Object.entries(typeScale).flatMap(([k, v]) => [
      [`--dvn-text-${kebab(k)}-size`, v.size],
      [`--dvn-text-${kebab(k)}-lh`, v.lineHeight],
    ]),
  ),
  "--dvn-duration-fast": motion.durationFast,
  "--dvn-duration-base": motion.durationBase,
  "--dvn-duration-slow": motion.durationSlow,
  "--dvn-ease-out": motion.easingOut,
  "--dvn-stagger": motion.stagger,
  "--dvn-z-behind": String(zIndex.behind),
  "--dvn-z-base": String(zIndex.base),
  "--dvn-z-raised": String(zIndex.raised),
  "--dvn-z-header": String(zIndex.header),
  "--dvn-z-overlay": String(zIndex.overlay),
  "--dvn-z-modal": String(zIndex.modal),
};

function kebab(key: string): string {
  return key.replaceAll(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
}

export function renderTokensCss(): string {
  const lines = Object.entries(cssVariables).map(([name, value]) => `  ${name}: ${value};`);
  return `/* GENERATED from src/tokens.ts — edit tokens.ts, then run:
     pnpm --filter @dentaliva/tokens test -- -u */
:root {\n${lines.join("\n")}\n}\n
/* DSN-60: wide-screen container cap — every --dvn-container-max consumer
   (Container, header row, mega panel, footer) widens together above the
   prototype breakpoints. */
@media (min-width: ${layout.containerWideMin}) {
  :root {
    --dvn-container-max: ${layout.containerMaxWide};
  }
}
/* DSN-80: mobil display adımı — 64px hero başlığı küçük ekranda metni
   ekrana sıkıştırıyordu (8 satır, CTA'lar fold altında). md altında display
   ölçeği bir adım iner; kırılım değerleri değişmez. */
@media (max-width: ${breakpoint.md - 1}px) {
  :root {
    --dvn-text-display-xl-size: 40px;
    --dvn-text-display-xl-lh: 1.15;
    --dvn-text-display-lg-size: 32px;
    --dvn-text-display-lg-lh: 1.2;
  }
}\n`;
}

/** Same explicit-name discipline as cssVariables, keyed by Palette field. */
const paletteVariables: Record<keyof Palette, string> = {
  navy: "--dvn-navy",
  navy2: "--dvn-navy-2",
  navy3: "--dvn-navy-3",
  gold: "--dvn-gold",
  goldSoft: "--dvn-gold-soft",
  goldDeep: "--dvn-gold-deep",
  ivory: "--dvn-ivory",
  ivory2: "--dvn-ivory-2",
  ink: "--dvn-ink",
  muted: "--dvn-muted",
  lineGold: "--dvn-line-gold",
  lineSoft: "--dvn-line-soft",
  gradGold: "--dvn-grad-gold",
  gradNavy: "--dvn-grad-navy",
  shadowSoft: "--dvn-shadow-soft",
  shadowLift: "--dvn-shadow-lift",
  shadowGold: "--dvn-shadow-gold",
};

/** One [data-palette] override block per alternate palette (DSN-57). Equal
    specificity with the :root block above — palettes.css must be imported
    AFTER tokens.css so the attribute wins on source order. */
export function renderPalettesCss(): string {
  const blocks = Object.entries(palettes).map(([id, palette]) => {
    const lines = Object.entries(paletteVariables).map(
      ([key, name]) => `  ${name}: ${palette[key as keyof Palette]};`,
    );
    return `[data-palette="${id}"] {\n${lines.join("\n")}\n}`;
  });
  return `/* GENERATED from src/palettes.ts — edit palettes.ts, then run:
     pnpm --filter @dentaliva/tokens test -- -u */
${blocks.join("\n\n")}\n`;
}
