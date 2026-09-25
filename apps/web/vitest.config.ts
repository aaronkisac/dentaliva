import react from "@vitejs/plugin-react";

import { baseVitestConfig } from "@dentaliva/config/vitest/base";

const config = baseVitestConfig({
  test: {
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
    environment: "jsdom",
  },
});

// JSX in test fixtures (composition registry imports .tsx sections).
config.plugins = [react()];

export default config;
