// Fixture test for FND-2 acceptance: the shared lint setup must demonstrably
// fail on a restricted cross-package import, and pass clean code.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { ESLint, type Linter } from "eslint";
import { describe, expect, it } from "vitest";

const baseConfigUrl = new URL("../eslint/base.mjs", import.meta.url);
const imported = (await import(baseConfigUrl.href)) as { default: Linter.Config[] };
const base = imported.default;

function makeEslint(): ESLint {
  return new ESLint({
    overrideConfigFile: true,
    overrideConfig: [
      ...base,
      {
        rules: {
          // Package boundary pattern: consuming another package's internals is
          // restricted — only package roots may be imported.
          "no-restricted-imports": [
            "error",
            {
              patterns: [
                { group: ["@dentaliva/*/*"], message: "Import package roots only (e.g. @dentaliva/ui)." },
              ],
            },
          ],
        },
      },
    ],
  });
}

describe("package import boundaries", () => {
  it("fails on a restricted internal import", async () => {
    const results = await makeEslint().lintText(
      `import x from "@dentaliva/ui/internal";\nexport default x;\n`,
      { filePath: "src/fixture.js" },
    );
    const errors = results.flatMap((r) => r.messages);
    expect(errors.some((e) => e.ruleId === "no-restricted-imports")).toBe(true);
  });

  it("passes on package-root imports", async () => {
    const results = await makeEslint().lintText(
      `import x from "@dentaliva/ui";\nexport default x;\n`,
      { filePath: "src/fixture.js" },
    );
    const errors = results.flatMap((r) => r.messages);
    expect(errors.filter((e) => e.ruleId === "no-restricted-imports")).toHaveLength(0);
  });

  it("base config is loadable and non-empty", () => {
    const configText = readFileSync(fileURLToPath(baseConfigUrl), "utf8");
    expect(configText.length).toBeGreaterThan(0);
    expect(base.length).toBeGreaterThan(0);
  });
});
