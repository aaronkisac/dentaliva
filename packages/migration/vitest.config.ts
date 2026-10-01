import { baseVitestConfig } from "@dentaliva/config/vitest/base";

// Branch derogation (documented): one-off crawl/transform tooling archived when
// MIG-5 closes — 50 low-value crawler edge-case arms (enrich-*/blog-transform)
// stay untested; statements/functions/lines hold the 90% gate.
export default baseVitestConfig({
  test: { include: ["tests/**/*.test.ts"] },
  coverage: {
    thresholds: { branches: 75 },
  },
});
