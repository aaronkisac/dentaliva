import { describe, expect, it, vi } from "vitest";

import { fetchHomeData, fetchHomePageDocument, fetchSiteSettings } from "../src/content/home";

function failingClient() {
  return {
    fetch: vi.fn().mockRejectedValue(new Error("sanity down")),
  } as unknown as Parameters<typeof fetchSiteSettings>[0];
}

function mockClient(responses: unknown[]) {
  let call = 0;
  return {
    fetch: vi.fn().mockImplementation(() => Promise.resolve(responses[call++] ?? null)),
  } as unknown as Parameters<typeof fetchSiteSettings>[0];
}

describe("build resilience (home content)", () => {
  it("returns null and warns when siteSettings is unreachable", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(await fetchSiteSettings(failingClient())).toBeNull();
    expect(warn).toHaveBeenCalledWith("[sanity] siteSettings fetch failed:", expect.any(Error));
    warn.mockRestore();
  });

  it("null-safes missing documents and lists (fetchHomeData)", async () => {
    const data = await fetchHomeData(mockClient([null, null, null, null, null, null, null]));
    expect(data.homePage).toBeNull();
    expect(data.quickServices).toEqual([]);
    expect(data.doctors).toEqual([]);
    expect(data.faqs).toEqual([]);
    expect(data.testimonials).toEqual([]);
    expect(data.siteSettings).toBeNull();
  });

  it("authored quickServiceLinks override the full treatment list", async () => {
    const links = [
      {
        name: { tr: "İmplant" },
        slug: "implant",
        summary: { tr: "X" },
        heroImage: { ref: "image-abc-600x400-jpg", lqip: "data:image/jpeg;base64,abc" },
      },
    ];
    const data = await fetchHomeData(
      mockClient([{ quickServiceLinks: links }, null, null, null, null, null]),
    );
    expect(data.quickServices).toEqual(links);
  });

  it("carries the full treatment list through — the carousel shows every service (DSN-51)", async () => {
    const list = Array.from({ length: 7 }, (_, i) => ({
      name: { tr: `Tedavi ${i + 1}` },
      slug: `tedavi-${i + 1}`,
      summary: { tr: "X" },
    }));
    const data = await fetchHomeData(mockClient([null, list, null, null, null, null, null]));
    expect(data.quickServices).toHaveLength(7);
  });

  it("treats an empty quickServiceLinks array as unauthored (fallback)", async () => {
    const list = [{ name: { tr: "İmplant" }, slug: "implant", summary: { tr: "X" } }];
    const data = await fetchHomeData(
      mockClient([{ quickServiceLinks: [] }, list, null, null, null, null, null]),
    );
    expect(data.quickServices).toEqual(list);
  });

  it("treats a null quickServiceLinks field as unauthored (live dataset)", async () => {
    const list = [{ name: { tr: "İmplant" }, slug: "implant", summary: { tr: "X" } }];
    const data = await fetchHomeData(
      mockClient([{ quickServiceLinks: null }, list, null, null, null, null, null]),
    );
    expect(data.quickServices).toEqual(list);
  });

  it("null-safes a missing homePage document", async () => {
    expect(await fetchHomePageDocument(mockClient([null]))).toBeNull();
  });
});

describe("siteCopy resilience (DSN-44)", () => {
  it("returns null and warns when siteCopy is unreachable", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { fetchSiteCopy } = await import("../src/content/site-copy");
    expect(await fetchSiteCopy(failingClient())).toBeNull();
    expect(warn).toHaveBeenCalledWith("[sanity] siteCopy fetch failed:", expect.any(Error));
    warn.mockRestore();
  });

  it("fetchHomeData carries siteCopy through", async () => {
    const copy = { footer: { contactHeading: { tr: "İletişim" } } };
    const data = await fetchHomeData(mockClient([null, null, null, null, null, null, copy]));
    expect(data.siteCopy?.footer?.contactHeading?.tr).toBe("İletişim");
  });
});
