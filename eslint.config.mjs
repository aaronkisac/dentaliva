import globals from "globals";

import base from "@dentaliva/config/eslint/base";

export default [
  ...base,
  { ignores: ["scripts/created-issues.json"] },
  {
    // Repo automation scripts run in Node; console output is their purpose.
    files: ["scripts/**/*.mjs"],
    languageOptions: { globals: { ...globals.node } },
    rules: { "no-console": "off" },
  },
];
