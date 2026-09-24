// Shared Vitest preset. Coverage thresholds are the quality gate from the brief:
// 100% for ui/lib/seo (+ clinic schema helpers), >=90% global. Every exclusion
// below carries a reason — do not add exclusions without one.
import { defineConfig } from "vitest/config";

const PERFECT = { statements: 100, branches: 100, functions: 100, lines: 100 };

export interface BaseVitestOverrides {
  test?: { include?: string[]; environment?: "node" | "jsdom" };
  coverage?: { exclude?: string[] };
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
        exclude: ["tests/**", "src/**/*.test.*", "src/**/*.stories.*", ...overrides.coverage?.exclude ?? []],
        thresholds: {
          global: { statements: 90, branches: 90, functions: 90, lines: 90 },
          // Reusable, content-independent packages are held to 100%:
          "packages/ui/src/**": PERFECT,
          "packages/lib/src/**": PERFECT,
          "packages/seo/src/**": PERFECT,
        },
      },
    },
  });
}
