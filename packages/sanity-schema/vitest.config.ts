import { baseVitestConfig } from "@dentaliva/config/vitest/base";

export default baseVitestConfig({
  test: { include: ["tests/**/*.test.ts"] },
  coverage: { exclude: ["src/index.ts", "sanity.types.ts"] },
});
