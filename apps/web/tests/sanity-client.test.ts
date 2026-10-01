import { describe, expect, it } from "vitest";

import { getSite } from "../src/config";
import { readClient } from "../src/sanity";

describe("read client wiring (build-time)", () => {
  it("binds to the active site's Sanity target", () => {
    const target = getSite().sanity;
    expect(readClient.config().projectId).toBe(target.projectId);
    expect(readClient.config().dataset).toBe(target.dataset);
  });
});
