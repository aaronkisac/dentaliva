import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "./cn";

/** Page section with the brand vertical rhythm (reduced on md breakpoints). */
export type SectionProps = HTMLAttributes<HTMLElement> & { innerClassName?: string };

export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  { className, innerClassName, children, ...rest },
  ref,
) {
  return (
    <section
      ref={ref}
      className={cn("py-[var(--dvn-section-y)] md:py-[var(--dvn-section-y-md)]", className)}
      {...rest}
    >
      <div
        className={cn(
          "mx-auto w-full max-w-[var(--dvn-container-max)] px-[var(--dvn-container-gutter)]",
          innerClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
});
