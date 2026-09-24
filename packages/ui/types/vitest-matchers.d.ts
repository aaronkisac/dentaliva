// Teach vitest's expect() the jest-axe matcher added in vitest.setup.ts.
import "vitest";

declare module "vitest" {
  interface Assertion {
    toHaveNoViolations(): void;
  }
}
