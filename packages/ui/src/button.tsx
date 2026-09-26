import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";

import { cn } from "./cn";

/**
 * Brand button. Colors come from validated token pairs (see @dentaliva/tokens
 * semantic.ts): gold surface carries navy text, navy surface carries white.
 * `focus-visible` rings are keyboard-only styling per WCAG 2.2.
 */
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-sans font-semibold uppercase tracking-widest transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        gold: "bg-gold text-navy hover:bg-gold-soft",
        navy: "bg-navy text-white hover:bg-navy-3",
        outline: "border border-gold bg-transparent text-navy hover:bg-navy hover:text-white",
        ghostLight: "bg-transparent text-white hover:text-gold",
      },
      size: {
        sm: "px-4 py-2 text-xs",
        md: "px-6 py-3 text-xs",
        lg: "px-8 py-4 text-sm",
      },
    },
    defaultVariants: { variant: "gold", size: "md" },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, type = "button", ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...rest}
    />
  );
});
