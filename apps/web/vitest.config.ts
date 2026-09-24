import { baseVitestConfig } from "@dentaliva/config/vitest/base";

// App code is covered by E2E (Playwright) — unit coverage gates target the
// reusable packages, so no coverage thresholds here by design.
export default baseVitestConfig({
  test: { include: ["tests/**/*.test.ts"] },
  coverage: { exclude: ["**"] },
});
