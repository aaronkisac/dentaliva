import { describe, expect, it } from "vitest";

import { buildRedirects } from "../src/redirects";

describe("buildRedirects", () => {
  it("emits 301 lines for permanent redirects", () => {
    expect(buildRedirects([{ from: "/blog/eski", to: "/", permanent: true }])).toBe(
      "/blog/eski  /  301\n",
    );
  });

  it("emits 302 when not permanent", () => {
    expect(buildRedirects([{ from: "/a", to: "/b", permanent: false }])).toBe("/a  /b  302\n");
  });

  it("returns an empty string for no entries", () => {
    expect(buildRedirects([])).toBe("");
  });
});
