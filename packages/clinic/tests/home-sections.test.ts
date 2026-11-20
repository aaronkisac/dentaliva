import { describe, expect, it } from "vitest";

import { HOME_SECTION_IDS } from "@dentaliva/config/home-sections";

import { homePage } from "../src/documents/home-page";

type AnyField = { name: string; options?: { list?: Array<{ title: string; value: string }> } };

describe("hiddenSections options derive from HOME_SECTION_IDS (DSN-105)", () => {
  it("the Studio option set equals the composition engine id set", () => {
    const field = (homePage.fields as AnyField[]).find((f) => f.name === "hiddenSections");
    expect(field).toBeDefined();
    const options = field?.options?.list ?? [];
    expect(options.map((option) => option.value)).toEqual([...HOME_SECTION_IDS]);
    expect(new Set(options.map((option) => option.title)).size).toBe(options.length);
  });
});
