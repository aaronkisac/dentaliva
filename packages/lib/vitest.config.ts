import { baseVitestConfig } from "@dentaliva/config/vitest/base";

// FRM quality gate: the production form validation logic lives here — held to
// 100% coverage like the other core packages.
const config = baseVitestConfig({
  test: { include: ["tests/**/*.test.ts"] },
  coverage: {
    exclude: ["src/index.ts"], // placeholder barrel — doldurulacak bir sonraki lib modülüyle
    thresholds: { statements: 100, branches: 100, functions: 100, lines: 100 },
  },
});

export default config;
