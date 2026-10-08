import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

// next/image özel loader'ı vitest ortamında yok — lightbox testindeki sızdırmaz
// ikame deseni.
vi.mock("next/image", () => ({
  default: function MockImage(props: { src?: string; alt?: string }) {
    return <img src={props.src} alt={props.alt} />;
  },
}));

import { GallerySection } from "../components/sections/gallery";

const img = (n: number): GallerySectionType => ({
  asset: { _ref: `image-${String(n).padStart(40, "3")}-600x400-jpg` },
  alt: { tr: `Görsel ${n}` },
  lqip: undefined,
});
type GallerySectionType = React.ComponentProps<typeof GallerySection>["images"][number];

const render = (props: React.ComponentProps<typeof GallerySection>) =>
  renderToStaticMarkup(<GallerySection {...props} />);

describe("GallerySection (DSN-46)", () => {
  it("renders heading, stats band (>=2) and the lightbox grid", () => {
    const html = render({
      images: [img(1), img(2)],
      stats: [
        { value: "13+", label: { tr: "yıl deneyim" } },
        { value: "3", label: { tr: "şube" } },
      ],
      heading: "Galeri",
      closeLabel: "Kapat",
    });
    expect(html).toContain(">Galeri</h2>");
    expect(html).toContain("13+");
    expect(html).toContain("3</p>");
    expect(html).toContain("600x400-jpg");
  });

  it("hides a single-stat band (one card reads as clutter)", () => {
    const html = render({
      images: [img(1)],
      stats: [{ value: "13+", label: { tr: "yıl" } }],
      heading: "Galeri",
    });
    expect(html).not.toContain("13+");
    expect(html).toContain("600x400-jpg");
  });

  it("hides the heading when siteCopy has no galleryHome", () => {
    const html = render({ images: [img(1)] });
    expect(html).not.toContain("<h2");
    expect(html).toContain("600x400-jpg");
  });

  it("caps the grid at eight images", () => {
    const many = Array.from({ length: 11 }, (_, i) => img(i + 10));
    const html = render({ images: many });
    expect(html.match(/image-n\d+-600x400-jpg/g)?.length ?? 0).toBeLessThanOrEqual(8);
  });
});
