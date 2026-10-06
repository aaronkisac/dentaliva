import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "./cn";

/** Display sizes from the token type scale (serif brand face via CSS). */
export const headingSize = {
  xl: "text-[length:var(--dvn-text-display-xl-size)] leading-[var(--dvn-text-display-xl-lh)]",
  lg: "text-[length:var(--dvn-text-display-lg-size)] leading-[var(--dvn-text-display-lg-lh)]",
  md: "text-[length:var(--dvn-text-display-md-size)] leading-[var(--dvn-text-display-md-lh)]",
  sm: "text-[length:var(--dvn-text-display-sm-size)] leading-[var(--dvn-text-display-sm-lh)]",
  title: "text-[length:var(--dvn-text-title-size)] leading-[var(--dvn-text-title-lh)]",
} as const;

export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
export type HeadingSize = keyof typeof headingSize;

export type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  /** Semantic heading level — also the rendered tag. */
  level: HeadingLevel;
  size?: HeadingSize;
};

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(function Heading(
  { className, level, size = "lg", ...rest },
  ref,
) {
  const Tag = level;
  return (
    <Tag
      ref={ref}
      // text-wrap: balance — çok satıra düşen serif başlıklar satırlara
      // dengeli dağılır (design audit P-01: mobil hero'da tek kelimelik
      // kısa son satır oluyordu).
      className={cn("font-serif text-navy [text-wrap:balance]", headingSize[size], className)}
      {...rest}
    />
  );
});
