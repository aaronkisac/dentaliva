import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "./cn";

/** Surfaces restricted to contrast-validated pairs: ink-on-white, white-on-navy. */
export const cardVariants = cva("border p-6 transition-shadow duration-300", {
  variants: {
    tone: {
      light: "border-[var(--dvn-line-soft)] bg-white text-ink",
      dark: "border-[var(--dvn-line-gold)] bg-navy text-white",
    },
    hover: {
      none: "",
      lift: "hover:shadow-[var(--dvn-shadow-lift)]",
    },
  },
  defaultVariants: { tone: "light", hover: "none" },
});

export type CardProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>;

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, tone, hover, ...rest },
  ref,
) {
  return <div ref={ref} className={cn(cardVariants({ tone, hover }), className)} {...rest} />;
});
