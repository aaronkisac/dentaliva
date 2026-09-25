import { cleanup, render, screen, type RenderResult } from "@testing-library/react";
import { axe } from "jest-axe";
import { expect } from "vitest";
import type { ReactElement } from "react";

/** Standard render for component tests. */
export function renderUi(ui: ReactElement): RenderResult {
  return render(ui);
}

/** Assert the rendered container passes axe (jest-axe). */
export async function expectNoA11yViolations(ui: ReactElement): Promise<void> {
  cleanup(); // multiple axe runs per test would otherwise stack duplicate <main> landmarks
  const { container } = render(<main>{ui}</main>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
}

export { screen };
