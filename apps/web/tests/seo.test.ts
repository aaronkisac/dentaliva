/** SEO-5: pageMetadata mapping — canonical/OG/twitter/robots branches. */
import { describe, expect, it } from "vitest";

import { absoluteUrl, pageMetadata, siteUrl } from "../src/seo";

describe("absoluteUrl", () => {
  it("joins the site domain with a single slash", () => {
    expect(absoluteUrl("/hizmetlerimiz")).toBe(`${siteUrl}/hizmetlerimiz`);
  });

  it("keeps the root path bare", () => {
    expect(absoluteUrl("/")).toBe(siteUrl);
  });

  it("prefixes a leading slash when the path lacks one", () => {
    expect(absoluteUrl("hizmetlerimiz")).toBe(`${siteUrl}/hizmetlerimiz`);
  });
});

describe("pageMetadata", () => {
  it("builds a canonical from the site domain and path", () => {
    const meta = pageMetadata({ path: "/hizmetlerimiz/implant-tedavisi", title: "İmplant" });
    expect(meta.alternates).toEqual({
      canonical: `${siteUrl}/hizmetlerimiz/implant-tedavisi`,
    });
    expect(meta.openGraph).toMatchObject({ url: `${siteUrl}/hizmetlerimiz/implant-tedavisi` });
  });

  it("prefers seo overrides over the fallback title/description", () => {
    const meta = pageMetadata({
      path: "/blog/yazi",
      title: "Yazi",
      description: "fallback açıklama",
      seo: { metaTitle: "SEO başlığı", metaDescription: "SEO açıklaması" },
    });
    expect(meta.title).toBe("SEO başlığı");
    expect(meta.description).toBe("SEO açıklaması");
  });

  it("falls back to the TR description when seo is absent", () => {
    const meta = pageMetadata({ path: "/hakkimizda", title: "Hakkımızda", description: "özet" });
    expect(meta.title).toBe("Hakkımızda");
    expect(meta.description).toBe("özet");
  });

  it("renders noindex robots when the seo flag is set", () => {
    const meta = pageMetadata({ path: "/tesekkur", title: "Teşekkür", seo: { noIndex: true } });
    expect(meta.robots).toBe("noindex, nofollow");
    expect(pageMetadata({ path: "/tesekkur", title: "Teşekkür" }).robots).toBe("index, follow");
  });

  it("uses the canonical override when provided", () => {
    const meta = pageMetadata({
      path: "/eski-yol",
      title: "X",
      seo: { canonicalOverride: "https://www.dentaliva.com/yeni-yol" },
    });
    expect(meta.alternates).toEqual({ canonical: "https://www.dentaliva.com/yeni-yol" });
  });

  it("maps a Sanity image ref to an absolute OG image and large twitter card", () => {
    const meta = pageMetadata({
      path: "/hizmetlerimiz/implant-tedavisi",
      title: "İmplant",
      ogImageRef: "image-bbe55cc642177ee3f0b29dbe6ca980f6946155a7-1024x1024-webp",
      ogImageAlt: "İmplant tedavisi",
    });
    const images = (meta.openGraph?.images ?? []) as Array<{ url: string; alt?: string }>;
    expect(images).toHaveLength(1);
    const image = images[0];
    expect(image?.url).toContain("https://cdn.sanity.io/images/");
    expect(image?.alt).toBe("İmplant tedavisi");
    const withImage = meta.twitter as { card?: string } | null | undefined;
    expect(withImage?.card).toBe("summary_large_image");
  });

  it("falls the OG alt back to the title when ogImageAlt is omitted", () => {
    const meta = pageMetadata({
      path: "/hizmetlerimiz/implant-tedavisi",
      title: "İmplant",
      ogImageRef: "image-bbe55cc642177ee3f0b29dbe6ca980f6946155a7-1024x1024-webp",
    });
    const images = meta.openGraph?.images as Array<{ url: string; alt?: string }>;
    expect(images[0]?.alt).toBe("İmplant");
  });

  it("falls back to a summary twitter card without an image", () => {
    const meta = pageMetadata({ path: "/iletisim", title: "İletişim" });
    expect(meta.openGraph?.images).toHaveLength(0);
    const twitter = meta.twitter as { card?: string } | null | undefined;
    expect(twitter?.card).toBe("summary");
  });

  it("emits an absolute title for the home page (no template suffix)", () => {
    const meta = pageMetadata({ path: "/", title: "Dentaliva", absoluteTitle: true });
    expect(meta.title).toEqual({ absolute: "Dentaliva" });
    expect(pageMetadata({ path: "/blog", title: "Blog" }).title).toBe("Blog");
  });
});
