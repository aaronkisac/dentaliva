import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

import { baseVitestConfig } from "@dentaliva/config/vitest/base";

// DSN quality gate: the ui package is held to 100% coverage.
const config = baseVitestConfig({
  test: {
    include: ["tests/**/*.test.tsx", "tests/**/*.test.ts"],
    environment: "jsdom",
    setupFiles: ["vitest.setup.ts"],
  },
  coverage: {
    thresholds: { statements: 100, branches: 100, functions: 100, lines: 100 },
  },
});

// next/link pulls Next's runtime into unit tests; the stub keeps component
// tests hermetic (E2E covers real navigation).
config.plugins = [react()];
config.resolve ??= {};
config.resolve.alias = {
  ...(config.resolve.alias ?? {}),
  "next/link": fileURLToPath(new URL("./tests/mocks/next-link.tsx", import.meta.url)),
};

export default config;
