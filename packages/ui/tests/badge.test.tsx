import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { Badge } from "../src/badge";
import { expectNoA11yViolations, renderUi, screen } from "./helpers";

describe("Badge", () => {
  it("defaults to gold-on-navy and supports all tones", () => {
    const { rerender } = renderUi(<Badge>tag</Badge>);
    expect(screen.getByText("tag")).toHaveClass("bg-navy");
    expect(screen.getByText("tag")).toHaveClass("text-gold");
    rerender(<Badge tone="navyOnGold">tag</Badge>);
    expect(screen.getByText("tag")).toHaveClass("bg-gold");
    expect(screen.getByText("tag")).toHaveClass("text-navy");
    rerender(<Badge tone="neutral">tag</Badge>);
    expect(screen.getByText("tag")).toHaveClass("bg-white");
    expect(screen.getByText("tag")).toHaveClass("text-ink");
  });

  it("renders a span and forwards refs", () => {
    const ref = createRef<HTMLSpanElement>();
    renderUi(<Badge ref={ref}>tag</Badge>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it("has no axe violations", async () => {
    await expectNoA11yViolations(<Badge>implant</Badge>);
  });
});
