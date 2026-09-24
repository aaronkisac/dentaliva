import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "./cn";

/** Page-width container: 1180px max with the brand gutter. */
export type ContainerProps = HTMLAttributes<HTMLDivElement>;

export const Container = forwardRef<HTMLDivElement, ContainerProps>(function Container(
  { className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        "mx-auto w-full max-w-[var(--dvn-container-max)] px-[var(--dvn-container-gutter)]",
        className,
      )}
      {...rest}
    />
  );
});
