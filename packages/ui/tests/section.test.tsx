import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { Section } from "../src/section";
import { expectNoA11yViolations, renderUi, screen } from "./helpers";

describe("Section", () => {
  it("renders a landmark section with brand rhythm and an inner container", () => {
    renderUi(
      <Section data-testid="section">
        <p data-testid="inner">content</p>
      </Section>,
    );
    expect(screen.getByTestId("section")).toHaveClass("py-[var(--dvn-section-y)]");
    expect(screen.getByTestId("inner").parentElement).toHaveClass(
      "max-w-[var(--dvn-container-max)]",
    );
  });

  it("passes custom classes to both layers", () => {
    renderUi(
      <Section className="bg-navy" innerClassName="text-center" data-testid="section">
        content
      </Section>,
    );
    expect(screen.getByTestId("section")).toHaveClass("bg-navy");
    expect(screen.getByTestId("section").querySelector("div")).toHaveClass("text-center");
  });

  it("forwards refs to the section element", () => {
    const ref = createRef<HTMLElement>();
    renderUi(<Section ref={ref}>content</Section>);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it("has no axe violations", async () => {
    await expectNoA11yViolations(
      <Section>
        <h2>Heading</h2>
      </Section>,
    );
  });
});
