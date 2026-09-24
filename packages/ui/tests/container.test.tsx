import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { Container } from "../src/container";
import { expectNoA11yViolations, renderUi, screen } from "./helpers";

describe("Container", () => {
  it("applies the brand width and gutter", () => {
    renderUi(<Container data-testid="container">content</Container>);
    const el = screen.getByTestId("container");
    expect(el).toHaveClass("max-w-[var(--dvn-container-max)]");
    expect(el).toHaveClass("px-[var(--dvn-container-gutter)]");
  });

  it("merges custom classNames after the defaults", () => {
    renderUi(<Container className="py-8" data-testid="container" />);
    expect(screen.getByTestId("container")).toHaveClass("py-8");
  });

  it("forwards refs", () => {
    const ref = createRef<HTMLDivElement>();
    renderUi(<Container ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has no axe violations", async () => {
    await expectNoA11yViolations(<Container>content</Container>);
  });
});
