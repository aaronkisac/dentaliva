import "@testing-library/jest-dom/vitest";

import { toHaveNoViolations } from "jest-axe";
import { cleanup } from "@testing-library/react";
import { afterEach, expect } from "vitest";

expect.extend(toHaveNoViolations as Parameters<typeof expect.extend>[0]);

afterEach(() => {
  cleanup();
});
