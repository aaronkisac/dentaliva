/** Serializes tokens to the `--dvn-*` custom properties consumed by the app. */
import {
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
:root {\n${lines.join("\n")}\n}\n`;
}
