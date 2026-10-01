import { describe, expect, it, vi } from "vitest";

import { fetchBranchBySlug, fetchBranches } from "../src/content/branches";

const fixture = [
  {
    name: "Avcılar",
    slug: "avcilar",
    address: { tr: "Avcılar, İstanbul" },
    phone: "+90 212 555 54 82",
  },
  {
    name: "Başakşehir",
    slug: "basaksehir",
    address: { tr: "Başakşehir, İstanbul" },
    phone: "+90 212 555 54 82",
  },
];

function mockClient(responses: unknown[]) {
  let call = 0;
  return {
    fetch: vi.fn().mockImplementation(() => Promise.resolve(responses[call++] ?? null)),
  } as unknown as Parameters<typeof fetchBranches>[0];
}

describe("branch content fetchers (PGT-6)", () => {
  it("returns an empty array when CMS has no branches", async () => {
    expect(await fetchBranches(mockClient([null]))).toEqual([]);
  });

  it("returns the branch list", async () => {
    expect(await fetchBranches(mockClient([fixture]))).toEqual(fixture);
  });

  it("fetches a branch by slug (single-doc query) and null-safes misses", async () => {
    const client = mockClient([fixture[0]]);
    expect((await fetchBranchBySlug(client, "avcilar"))?.name).toBe("Avcılar");
    expect((client.fetch as ReturnType<typeof vi.fn>).mock.calls[0]?.[1]).toEqual({
      slug: "avcilar",
    });
    expect(await fetchBranchBySlug(mockClient([null]), "yok")).toBeNull();
  });
});
