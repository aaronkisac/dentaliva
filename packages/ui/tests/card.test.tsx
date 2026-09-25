import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { Card } from "../src/card";
import { expectNoA11yViolations, renderUi, screen } from "./helpers";

describe("Card", () => {
  it("defaults to a light surface with ink text", () => {
    renderUi(<Card data-testid="card">content</Card>);
    const card = screen.getByTestId("card");
    expect(card).toHaveClass("bg-white");
    expect(card).toHaveClass("text-ink");
  });

  it("supports the dark surface and hover lift", () => {
    const { rerender } = renderUi(
      <Card tone="dark" data-testid="card">
        c
      </Card>,
    );
    expect(screen.getByTestId("card")).toHaveClass("bg-navy");
    rerender(
      <Card hover="lift" data-testid="card">
        c
      </Card>,
    );
    expect(screen.getByTestId("card")).toHaveClass("hover:shadow-[var(--dvn-shadow-lift)]");
  });

  it("forwards refs", () => {
    const ref = createRef<HTMLDivElement>();
    renderUi(<Card ref={ref}>c</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has no axe violations in both tones", async () => {
    await expectNoA11yViolations(<Card>light</Card>);
    await expectNoA11yViolations(<Card tone="dark">dark</Card>);
  });
});
