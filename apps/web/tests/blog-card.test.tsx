import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

// next/image özel loader'ı vitest ortamında yok — lightbox testindeki
// sızdırmaz ikame deseni.
vi.mock("next/image", () => ({
  default: function MockImage(props: { src?: string; alt?: string; className?: string }) {
    return <img src={props.src} alt={props.alt} className={props.className} />;
  },
}));

import { BlogCard, BlogFeature, formatPostDate } from "../components/blog-card";
import type { BlogListItem } from "../src/content/blog";

const base: BlogListItem = {
  title: { tr: "İmplant Fiyatları 2026", en: "Implant Prices 2026" },
  slug: "implant-fiyatlari-2026",
  excerpt: { tr: "Kısa özet." },
  publishedAt: "2026-09-01T09:00:00Z",
};

const withImage: BlogListItem = {
  ...base,
  heroImage: { ref: "image-abc-683x1024-webp", alt: { tr: "Implant görseli" } },
};

describe("formatPostDate (DSN-72)", () => {
  it("formats in the site locale, long month", () => {
    expect(formatPostDate("2026-09-01T09:00:00Z", "tr")).toContain("Eylül");
    expect(formatPostDate("2026-09-01T09:00:00Z", "en")).toContain("September");
  });
});

describe("BlogCard (DSN-72 chromeless grid)", () => {
  const render = (post: BlogListItem, readLabel?: string) =>
    renderToStaticMarkup(<BlogCard post={post} readLabel={readLabel} />);

  it("wraps the whole card in a single link and uses the hero alt", () => {
    const html = render(withImage, "Yazıyı Oku");
    expect(html).toContain('href="/blog/implant-fiyatlari-2026"');
    expect(html).toContain('alt="Implant görseli"');
    expect((html.match(/<a /g) ?? []).length).toBe(1);
    expect(html).toContain("Yazıyı Oku");
  });

  it("clamps long excerpts at 18 words (data level — CSS line-clamp banned)", () => {
    const long = Array.from({ length: 30 }, (_, i) => `kelime${i + 1}`).join(" ");
    const html = render({ ...base, excerpt: { tr: long } });
    expect(html).toContain("kelime18…");
    expect(html).not.toContain("kelime19");
  });

  it("falls back to an espresso monogram when the post has no image", () => {
    const html = render(base);
    expect(html).not.toContain("<img");
    expect(html).toContain("İF"); // İmplant Fiyatları → iki baş harf
  });

  it("renders no read label when siteCopy key is missing", () => {
    expect(render(withImage)).not.toContain("Yazıyı Oku");
  });
});

describe("BlogFeature (DSN-72 vitrin)", () => {
  it("renders the eyebrow, date and a priority portrait", () => {
    const html = renderToStaticMarkup(
      <BlogFeature post={withImage} eyebrow="Öne Çıkan Yazı" readLabel="Yazıyı Oku" />,
    );
    expect(html).toContain("Öne Çıkan Yazı");
    expect(html).toContain("Eylül");
    expect(html).toContain('href="/blog/implant-fiyatlari-2026"');
  });

  it("hides the eyebrow block when copy is absent", () => {
    const html = renderToStaticMarkup(<BlogFeature post={withImage} />);
    expect(html).not.toContain("Öne Çıkan Yazı");
  });
});
