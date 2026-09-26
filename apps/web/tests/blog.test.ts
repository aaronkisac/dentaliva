import { describe, expect, it, vi } from "vitest";

import { fetchBlogPostBySlug, fetchBlogPosts } from "../src/content/blog";

const fixture = [
  {
    title: { tr: "İmplant mı köprü mü?" },
    slug: "implant-mi-kopru-mu",
    excerpt: { tr: "Karşılaştırmalı bakış." },
    publishedAt: "2026-09-01T09:00:00Z",
  },
];

function mockClient(responses: unknown[]) {
  let call = 0;
  return {
    fetch: vi.fn().mockImplementation(() => Promise.resolve(responses[call++] ?? null)),
  } as unknown as Parameters<typeof fetchBlogPosts>[0];
}

describe("blog content fetchers (PGT-8)", () => {
  it("returns an empty array when CMS has no posts", async () => {
    expect(await fetchBlogPosts(mockClient([null]))).toEqual([]);
  });

  it("returns posts newest-first (CMS order)", async () => {
    expect(await fetchBlogPosts(mockClient([fixture]))).toEqual(fixture);
  });

  it("fetches detail by slug and null-safes misses", async () => {
    const detail = { ...fixture[0], body: { tr: [{ _type: "block", style: "normal" }] } };
    const client = mockClient([detail]);
    await fetchBlogPostBySlug(client, "implant-mi-kopru-mu");
    expect((client.fetch as ReturnType<typeof vi.fn>).mock.calls[0]?.[1]).toEqual({
      slug: "implant-mi-kopru-mu",
    });
    expect(await fetchBlogPostBySlug(mockClient([null]), "yok")).toBeNull();
  });
});
