import { baseVitestConfig } from "@dentaliva/config/vitest/base";

// SEO-1 quality gate: this package is held to 100% coverage.
const config = baseVitestConfig({
  test: { include: ["tests/**/*.test.ts"] },
  coverage: {
    exclude: ["src/index.ts"], // barrel re-export only
    thresholds: { statements: 100, branches: 100, functions: 100, lines: 100 },
  },
});

export default config;
