import { describe, expect, it, vi } from "vitest";

import { fetchTreatmentBySlug, fetchTreatments } from "../src/content/treatments";

const fixture = [
  {
    name: { tr: "İmplant Tedavisi", en: "Implant treatment" },
    slug: "implant-tedavisi",
    summary: { tr: "Eksik dişlerin tedavisi." },
  },
];

function mockClient(responses: unknown[]) {
  let call = 0;
  return {
    fetch: vi.fn().mockImplementation(() => Promise.resolve(responses[call++] ?? null)),
  } as unknown as Parameters<typeof fetchTreatments>[0];
}

describe("treatment content fetchers (PGT-4)", () => {
  it("returns an empty array when CMS has no treatments", async () => {
    expect(await fetchTreatments(mockClient([null]))).toEqual([]);
  });

  it("returns the treatment list as-is", async () => {
    expect(await fetchTreatments(mockClient([fixture]))).toEqual(fixture);
  });

  it("fetches a detail by slug param and null-safes misses", async () => {
    const detail = { name: { tr: "İmplant" }, slug: "implant-tedavisi", steps: [] };
    const client = mockClient([detail]);
    await fetchTreatmentBySlug(client, "implant-tedavisi");
    expect((client.fetch as ReturnType<typeof vi.fn>).mock.calls[0]?.[1]).toEqual({
      slug: "implant-tedavisi",
    });
    expect(await fetchTreatmentBySlug(mockClient([null]), "yok")).toBeNull();
  });
});
