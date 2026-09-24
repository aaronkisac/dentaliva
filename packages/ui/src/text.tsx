import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "./cn";

/** Body copy sizes from the token type scale (sans brand face via CSS). */
export const textSize = {
  lg: "text-[length:var(--dvn-text-body-lg-size)] leading-[var(--dvn-text-body-lg-lh)]",
  base: "text-[length:var(--dvn-text-body-size)] leading-[var(--dvn-text-body-lh)]",
  small: "text-[length:var(--dvn-text-small-size)] leading-[var(--dvn-text-small-lh)]",
  micro: "text-[length:var(--dvn-text-micro-size)] leading-[var(--dvn-text-micro-lh)]",
} as const;

export type TextSize = keyof typeof textSize;

/**
 * Paragraph text. `tone` is restricted to validated pairs: `muted` is only
 * guaranteed on white surfaces (see @dentaliva/tokens semantic.ts).
 */
export type TextProps = HTMLAttributes<HTMLParagraphElement> & {
  size?: TextSize;
  tone?: "ink" | "muted" | "white" | "gold";
};

export const Text = forwardRef<HTMLParagraphElement, TextProps>(function Text(
  { className, size = "base", tone = "ink", ...rest },
  ref,
) {
  const toneClass =
    tone === "muted"
      ? "text-muted"
      : tone === "white"
        ? "text-white"
        : tone === "gold"
          ? "text-gold"
          : "text-ink";
  return (
    <p ref={ref} className={cn("font-sans", textSize[size], toneClass, className)} {...rest} />
  );
});
