import { describe, expect, it, vi } from "vitest";

import { fetchLegalPageBySlug } from "../src/content/legal";

function mockClient(responses: unknown[]) {
  let call = 0;
  return {
    fetch: vi.fn().mockImplementation(() => Promise.resolve(responses[call++] ?? null)),
  } as unknown as Parameters<typeof fetchLegalPageBySlug>[0];
}

describe("legal content fetcher (KVKK)", () => {
  it("fetches the legal page by slug with a slug param", async () => {
    const page = { title: { tr: "KVKK Aydınlatma Metni" }, body: { tr: "Madde 1…" } };
    const client = mockClient([page]);
    expect(await fetchLegalPageBySlug(client, "kvkk")).toEqual(page);
    expect((client.fetch as ReturnType<typeof vi.fn>).mock.calls[0]?.[1]).toEqual({ slug: "kvkk" });
  });

  it("null-safes a missing page", async () => {
    expect(await fetchLegalPageBySlug(mockClient([null]), "yok")).toBeNull();
  });
});
