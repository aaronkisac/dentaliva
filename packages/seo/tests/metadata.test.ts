import { describe, expect, it } from "vitest";

import { buildMetadata, joinUrl } from "../src/metadata";

const SITE = "https://www.dentaliva.com";

describe("joinUrl", () => {
  it("joins base and path with a single slash", () => {
    expect(joinUrl("https://x.com", "/a")).toBe("https://x.com/a");
    expect(joinUrl("https://x.com/", "/a")).toBe("https://x.com/a");
    expect(joinUrl("https://x.com", "a")).toBe("https://x.com/a");
  });

  it("keeps the homepage path empty", () => {
    expect(joinUrl("https://x.com", "/")).toBe("https://x.com");
  });
});

describe("buildMetadata", () => {
  const base = {
    siteUrl: SITE,
    path: "/hizmetlerimiz/implant/",
    fallbackTitle: "İmplant Tedavisi",
    fallbackDescription: "İmplant tedavisi hakkında bilgi.",
  };

  it("uses fallbacks when no seo object exists", () => {
    const meta = buildMetadata({ ...base });
    expect(meta.title).toBe("İmplant Tedavisi");
    expect(meta.description).toBe("İmplant tedavisi hakkında bilgi.");
    expect(meta.canonical).toBe("https://www.dentaliva.com/hizmetlerimiz/implant/");
    expect(meta.robots).toBe("index, follow");
    expect(meta.openGraph.images).toEqual([]);
    expect(meta.twitter.card).toBe("summary");
  });

  it("prefers CMS values and switches to large card with an image", () => {
    const meta = buildMetadata({
      ...base,
      ogImageUrl: "https://cdn.sanity.io/img.jpg",
      ogImageAlt: "İmplant",
      seo: {
        metaTitle: "İmplant Tedavisi İstanbul",
        metaDescription: "Titanyum implantlarla kalıcı çözüm.",
        canonicalOverride: "https://www.dentaliva.com/implant/",
      },
    });
    expect(meta.title).toBe("İmplant Tedavisi İstanbul");
    expect(meta.description).toBe("Titanyum implantlarla kalıcı çözüm.");
    expect(meta.canonical).toBe("https://www.dentaliva.com/implant/");
    expect(meta.openGraph.images[0]?.url).toBe("https://cdn.sanity.io/img.jpg");
    expect(meta.openGraph.images[0]?.alt).toBe("İmplant");
    expect(meta.twitter.card).toBe("summary_large_image");
  });

  it("emits noindex when the CMS flags it", () => {
    const meta = buildMetadata({
      ...base,
      seo: { noIndex: true, metaTitle: "Taslak", metaDescription: "" },
    });
    expect(meta.robots).toBe("noindex, nofollow");
  });

  it("ogImageAlt falls back to the title", () => {
    const meta = buildMetadata({ ...base, ogImageUrl: "https://cdn.sanity.io/i.jpg" });
    expect(meta.openGraph.images[0]?.alt).toBe("İmplant Tedavisi");
  });

  it("has no axe-style surprises: description fallback used when seo description empty", () => {
    const meta = buildMetadata({ ...base, seo: { metaTitle: "", metaDescription: "  " } });
    expect(meta.description).toBe("İmplant tedavisi hakkında bilgi.");
  });
});
