// Shared Vitest preset. Coverage thresholds are the quality gate from the brief:
// 100% for ui/lib/seo (+ clinic schema helpers), >=90% global. Every exclusion
// below carries a reason — do not add exclusions without one.
//
// Threshold shape note (vitest 4/5): flat keys (`statements: 90`) are the
// GLOBAL thresholds; glob keys map to per-path thresholds. `global:` is NOT a
// valid key anymore (it would be read as a file glob matching nothing).
// Glob keys are resolved relative to each package root, so 100% packages pass
// their own thresholds via the `coverage.thresholds` override in their
// vitest.config.ts.
import { defineConfig } from "vitest/config";

export interface BaseVitestOverrides {
  test?: { include?: string[]; environment?: "node" | "jsdom"; setupFiles?: string[] };
  coverage?: { exclude?: string[]; thresholds?: Record<string, unknown> };
}

export function baseVitestConfig(overrides: BaseVitestOverrides = {}) {
  return defineConfig({
    test: {
      environment: "node",
      ...overrides.test,
      coverage: {
        provider: "v8",
        reporter: ["text", "json-summary", "lcov"],
        include: ["src/**"],
        // Exclusions (each with a reason):
        // - tests/, *.test.* — test code itself is not under test
        exclude: [
          "tests/**",
          "src/**/*.test.*",
          "src/**/*.stories.*",
          ...(overrides.coverage?.exclude ?? []),
        ],
        thresholds: {
          statements: 90,
          branches: 90,
          functions: 90,
          lines: 90,
          ...overrides.coverage?.thresholds,
        },
      },
    },
  });
}
