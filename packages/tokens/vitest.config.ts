import { baseVitestConfig } from "@dentaliva/config/vitest/base";

export default baseVitestConfig({
  test: { include: ["tests/**/*.test.ts"] },
  coverage: { exclude: ["src/index.ts"] }, // barrel re-export only — no runtime code
});
