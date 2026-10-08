import { describe, expect, it, vi } from "vitest";

import { homeSectionIds } from "../src/config-types";
import { fetchHomeData, type HomeData } from "../src/content/home";
import { sectionRegistry } from "../components/sections/compose";

const emptyData: HomeData = {
  homePage: null,
  quickServices: [],
  doctors: [],
  faqs: [],
  testimonials: [],
  siteSettings: null,
  siteCopy: null,
};

describe("home composition engine (PGT-3)", () => {
  it("registry covers every home section id (exhaustive)", () => {
    expect(Object.keys(sectionRegistry).sort()).toEqual([...homeSectionIds].sort());
  });

  it("each renderer returns without crashing on empty CMS data", () => {
    for (const id of homeSectionIds) {
      expect(() => sectionRegistry[id](emptyData)).not.toThrow();
    }
  });

  it("fetchHomeData shapes parallel CMS responses with null-safe defaults", async () => {
    const responses = [
      { hero: { headline: { tr: "Merhaba" } } },
      [{ name: { tr: "İmplant" } }],
      null,
      null,
      null,
      { phone: "+90 212 555 54 82" },
    ];
    let call = 0;
    const client = {
      fetch: vi.fn().mockImplementation(() => Promise.resolve(responses[call++] ?? null)),
    };
    const data = await fetchHomeData(client as unknown as Parameters<typeof fetchHomeData>[0]);
    expect(data.homePage).toEqual({ hero: { headline: { tr: "Merhaba" } } });
    expect(data.quickServices).toHaveLength(1);
    expect(data.doctors).toEqual([]);
    expect(data.siteSettings).toEqual({ phone: "+90 212 555 54 82" });
  });
});
