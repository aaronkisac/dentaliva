// Base ESLint flat config. Type-checked rules apply only to TS/TSX files with a
// tsconfig (projectService); plain JS (scripts, config files) gets the fast path.
// Package-specific boundaries belong in each package's own eslint.config.mjs
// (see tests in this package for the enforced pattern).
import eslint from "@eslint/js";
import prettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["**/node_modules/**", "**/out/**", "**/dist/**", "**/.next/**", "**/coverage/**", "**/.sanity/**"] },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  prettier,
  {
    files: ["**/*.ts", "**/*.tsx"],
    extends: [tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: { projectService: true },
    },
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
);
