import { describe, expect, it } from "vitest";

import { buildAlternates, buildSitemapEntries } from "../src/sitemap";

const SITE = "https://www.dentaliva.com";

describe("buildAlternates", () => {
  it("builds cross-domain alternates per locale", () => {
    expect(
      buildAlternates("/hizmetler/", { tr: "www.dentaliva.com", en: "www.dentaliva.eu" }),
    ).toEqual({
      tr: "https://www.dentaliva.com/hizmetler/",
      en: "https://www.dentaliva.eu/hizmetler/",
    });
  });

  it("returns an empty map for empty domains", () => {
    expect(buildAlternates("/x/", {})).toEqual({});
  });
});

describe("buildSitemapEntries", () => {
  it("builds entries with defaults for single-locale sites", () => {
    const entries = buildSitemapEntries(SITE, [
      { path: "/", changeFrequency: "weekly", priority: 1 },
      { path: "/hizmetlerimiz/implant/", changeFrequency: "monthly" },
    ]);
    expect(entries).toHaveLength(2);
    expect(entries[0]?.url).toBe("https://www.dentaliva.com");
    expect(entries[0]?.changeFrequency).toBe("weekly");
    expect(entries[0]?.priority).toBe(1);
    expect(entries[1]?.url).toBe("https://www.dentaliva.com/hizmetlerimiz/implant/");
    expect("alternates" in entries[1]!).toBe(false);
  });

  it("emits alternates when configured", () => {
    const entries = buildSitemapEntries(SITE, [
      { path: "/", alternatesByLocale: { tr: "www.dentaliva.com", en: "www.dentaliva.eu" } },
    ]);
    expect(entries[0]?.alternates?.languages).toEqual({
      tr: "https://www.dentaliva.com/",
      en: "https://www.dentaliva.eu/",
    });
  });
});

describe("buildSitemapEntries edge paths", () => {
  it("covers every optional-field branch", () => {
    const entries = buildSitemapEntries(SITE, [
      {
        path: "/blog/yazi/",
        lastModified: new Date("2026-09-01"),
        changeFrequency: "monthly",
        priority: 0.7,
        alternatesByLocale: { tr: "www.dentaliva.com" },
      },
    ]);
    expect(entries[0]?.lastModified).toEqual(new Date("2026-09-01"));
    expect(entries[0]?.changeFrequency).toBe("monthly");
    expect(entries[0]?.priority).toBe(0.7);
    expect(entries[0]?.alternates?.languages.tr).toBe("https://www.dentaliva.com/blog/yazi/");
  });
});
