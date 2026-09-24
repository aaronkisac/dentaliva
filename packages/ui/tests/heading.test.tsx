import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { Heading } from "../src/heading";
import { expectNoA11yViolations, renderUi, screen } from "./helpers";

describe("Heading", () => {
  it.each(["h1", "h2", "h3", "h4", "h5", "h6"] as const)("renders <%s> for its level", (level) => {
    renderUi(<Heading level={level}>Title</Heading>);
    expect(screen.getByRole("heading", { level: Number(level[1]) })).toHaveTextContent("Title");
  });

  it("defaults to the lg display size and supports the scale", () => {
    const { rerender } = renderUi(<Heading level="h2">T</Heading>);
    expect(screen.getByRole("heading")).toHaveClass(
      "text-[length:var(--dvn-text-display-lg-size)]",
    );
    rerender(
      <Heading level="h2" size="xl">
        T
      </Heading>,
    );
    expect(screen.getByRole("heading")).toHaveClass(
      "text-[length:var(--dvn-text-display-xl-size)]",
    );
    rerender(
      <Heading level="h2" size="md">
        T
      </Heading>,
    );
    expect(screen.getByRole("heading")).toHaveClass(
      "text-[length:var(--dvn-text-display-md-size)]",
    );
    rerender(
      <Heading level="h2" size="sm">
        T
      </Heading>,
    );
    expect(screen.getByRole("heading")).toHaveClass(
      "text-[length:var(--dvn-text-display-sm-size)]",
    );
    rerender(
      <Heading level="h2" size="title">
        T
      </Heading>,
    );
    expect(screen.getByRole("heading")).toHaveClass("text-[length:var(--dvn-text-title-size)]");
  });

  it("uses the serif brand face and forwards refs", () => {
    const ref = createRef<HTMLHeadingElement>();
    renderUi(
      <Heading level="h1" ref={ref}>
        T
      </Heading>,
    );
    expect(screen.getByRole("heading")).toHaveClass("font-serif");
    expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
  });

  it("has no axe violations", async () => {
    await expectNoA11yViolations(
      <>
        <Heading level="h1">Page</Heading>
        <Heading level="h2">Section</Heading>
      </>,
    );
  });
});
