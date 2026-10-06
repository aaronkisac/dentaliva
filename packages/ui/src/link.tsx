import NextLink from "next/link";
import { forwardRef, type ComponentPropsWithoutRef } from "react";

import { cn } from "./cn";

const internalHref = /^\/(?!\/)/;

export type LinkProps = ComponentPropsWithoutRef<typeof NextLink>;

/**
 * App link. External hrefs automatically get rel="noopener noreferrer" and
 * target="_blank" (brand convention); internal routes render next/link.
 * Colors: navy on light surfaces, gold on dark — pass via className when
 * overriding. Focus ring matches Button.
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { className, href, children, rel, target, ...rest },
  ref,
) {
  const isExternal = typeof href === "string" && !internalHref.test(href);
  if (!isExternal) {
    return (
      <NextLink
        ref={ref}
        href={href}
        // output:export build'lerinde Next 16'nın istediği
        // __next.*.__PAGE__.txt prefetch dosyaları üretilmiyor; her iç link
        // 404'e düşüyor (design audit FINDING-003). Statik CF edge sitesinde
        // prefetch kazancı minimal — kapat; gezinme doküman yüklemesiyle
        // çalışmaya devam eder.
        prefetch={false}
        className={cn(
          "font-sans underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
          className,
        )}
        {...rest}
      >
        {children}
      </NextLink>
    );
  }
  return (
    <a
      ref={ref}
      href={href}
      target={target ?? "_blank"}
      rel={rel ?? "noopener noreferrer"}
      className={cn(
        "font-sans underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
        className,
      )}
      {...rest}
    >
      {children}
    </a>
  );
});
