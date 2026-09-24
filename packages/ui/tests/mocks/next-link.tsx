import type { ComponentProps, ReactNode } from "react";

/**
 * next/link stub for component tests: renders a plain anchor with the same
 * props. Real router behavior (prefetch, client navigation) is covered by
 * Playwright E2E, not unit tests.
 */
export default function NextLinkStub({
  children,
  ...props
}: ComponentProps<"a"> & { children?: ReactNode }) {
  return <a {...props}>{children}</a>;
}
