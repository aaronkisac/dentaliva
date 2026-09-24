import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { Text } from "../src/text";
import { expectNoA11yViolations, renderUi, screen } from "./helpers";

describe("Text", () => {
  it("renders a paragraph with ink tone and base size by default", () => {
    renderUi(<Text>copy</Text>);
    const p = screen.getByText("copy");
    expect(p.tagName).toBe("P");
    expect(p).toHaveClass("text-ink");
    expect(p).toHaveClass("text-[length:var(--dvn-text-body-size)]");
  });

  it("maps every tone to its validated color", () => {
    const { rerender } = renderUi(<Text tone="muted">t</Text>);
    expect(screen.getByText("t")).toHaveClass("text-muted");
    rerender(<Text tone="white">t</Text>);
    expect(screen.getByText("t")).toHaveClass("text-white");
    rerender(<Text tone="gold">t</Text>);
    expect(screen.getByText("t")).toHaveClass("text-gold");
    rerender(<Text tone="ink">t</Text>);
    expect(screen.getByText("t")).toHaveClass("text-ink");
  });

  it("maps every size to the type scale", () => {
    const { rerender } = renderUi(<Text size="lg">t</Text>);
    expect(screen.getByText("t")).toHaveClass("text-[length:var(--dvn-text-body-lg-size)]");
    rerender(<Text size="small">t</Text>);
    expect(screen.getByText("t")).toHaveClass("text-[length:var(--dvn-text-small-size)]");
    rerender(<Text size="micro">t</Text>);
    expect(screen.getByText("t")).toHaveClass("text-[length:var(--dvn-text-micro-size)]");
  });

  it("forwards refs", () => {
    const ref = createRef<HTMLParagraphElement>();
    renderUi(<Text ref={ref}>t</Text>);
    expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
  });

  it("has no axe violations", async () => {
    await expectNoA11yViolations(<Text>Readable copy</Text>);
  });
});
