import { describe, expect, it } from "vitest";

import { HOME_SECTION_IDS, HOME_SECTION_OPTIONS, HOME_SECTION_TITLES } from "../src/home-sections";

describe("home sections single source (DSN-105)", () => {
  it("derives one Studio option per id, in order", () => {
    expect(HOME_SECTION_OPTIONS.map((option) => option.value)).toEqual([...HOME_SECTION_IDS]);
  });

  it("every option title matches the titles table and stays unique", () => {
    expect(
      HOME_SECTION_OPTIONS.every((option) => option.title === HOME_SECTION_TITLES[option.value]),
    ).toBe(true);
    expect(new Set(Object.values(HOME_SECTION_TITLES)).size).toBe(HOME_SECTION_IDS.length);
  });
});
