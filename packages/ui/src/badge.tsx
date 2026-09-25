import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "./cn";

/** Small labels; every combination is a validated pair in @dentaliva/tokens. */
export const badgeVariants = cva(
  "inline-flex items-center px-3 py-1 font-sans text-[length:var(--dvn-text-micro-size)] font-semibold uppercase tracking-widest",
  {
    variants: {
      tone: {
        goldOnNavy: "bg-navy text-gold",
        navyOnGold: "bg-gold text-navy",
        neutral: "bg-white text-ink",
      },
    },
    defaultVariants: { tone: "goldOnNavy" },
  },
);

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { className, tone, ...rest },
  ref,
) {
  return <span ref={ref} className={cn(badgeVariants({ tone }), className)} {...rest} />;
});
