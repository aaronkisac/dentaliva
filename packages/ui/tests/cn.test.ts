import { describe, expect, it } from "vitest";

import { cn } from "../src/cn";

describe("cn()", () => {
  it("joins conditional classes", () => {
    const includeB = false as boolean;
    expect(cn("a", includeB && "b", undefined, "c")).toBe("a c");
  });

  it("resolves tailwind conflicts, last wins", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});
