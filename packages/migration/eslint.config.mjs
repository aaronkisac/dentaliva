import globals from "globals";

import base from "@dentaliva/config/eslint/base";

// Crawler scripts run in Node and log progress.
export default [
  ...base,
  {
    files: ["**/*.mjs", "src/**/*.ts"],
    languageOptions: { globals: { ...globals.node } },
    rules: { "no-console": "off" },
  },
];
