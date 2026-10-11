import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

// next/image özel loader'ı vitest ortamında yok — sızdırmaz ikame deseni.
vi.mock("next/image", () => ({
  default: function MockImage(props: { src?: string; alt?: string }) {
    return <img src={props.src} alt={props.alt} />;
  },
}));

import { GallerySection } from "../components/sections/gallery";

const img = (n: number): React.ComponentProps<typeof GallerySection>["images"][number] => ({
  asset: { _ref: `image-${String(n).padStart(40, "3")}-600x400-jpg` },
  alt: { tr: `Görsel ${n}` },
  lqip: undefined,
});

const render = (props: React.ComponentProps<typeof GallerySection>) =>
  renderToStaticMarkup(<GallerySection {...props} />);

describe("GallerySection (DSN-46, DSN-52)", () => {
  it("renders the heading and the lightbox grid", () => {
    const html = render({
      images: [img(1), img(2)],
      heading: "Galeri",
      closeLabel: "Kapat",
    });
    expect(html).toContain(">Galeri</h2>");
    expect(html).toContain("600x400-jpg");
  });

  it("renders no stats band — the surface moved to the about overlay (DSN-52)", () => {
    const html = render({
      images: [img(1), img(2)],
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
