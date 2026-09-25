import { describe, expect, it, vi } from "vitest";

import { fetchDoctorBySlug, fetchDoctors } from "../src/content/doctors";

const fixture = [
  { name: "Dt. Emel Özdemir", slug: "dr-dt-emel-ozdemir", title: { tr: "Diş Hekimi" } },
];

function mockClient(responses: unknown[]) {
  let call = 0;
  return {
    fetch: vi.fn().mockImplementation(() => Promise.resolve(responses[call++] ?? null)),
  } as unknown as Parameters<typeof fetchDoctors>[0];
}

describe("doctor content fetchers (PGT-5)", () => {
  it("returns an empty array when CMS has no doctors", async () => {
    expect(await fetchDoctors(mockClient([null]))).toEqual([]);
  });

  it("returns the doctor list", async () => {
    expect(await fetchDoctors(mockClient([fixture]))).toEqual(fixture);
  });

  it("fetches detail by slug and null-safes misses", async () => {
    const detail = { ...fixture[0], bio: { tr: "Özgeçmiş" } };
    const client = mockClient([detail]);
    await fetchDoctorBySlug(client, "dr-dt-emel-ozdemir");
    expect((client.fetch as ReturnType<typeof vi.fn>).mock.calls[0]?.[1]).toEqual({
      slug: "dr-dt-emel-ozdemir",
    });
    expect(await fetchDoctorBySlug(mockClient([null]), "yok")).toBeNull();
  });
});
