import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

// next/image özel loader'ı vitest ortamında yok — ui paketindeki next-link
// mock deseni gibi sızdırmaz bir ikame.
vi.mock("next/image", () => ({
  default: function MockImage(props: { src?: string; alt?: string }) {
    return <img src={props.src} alt={props.alt} />;
  },
}));

import { GalleryLightbox } from "../components/lightbox";
import type { GalleryImage } from "../src/content/home";

const img = (ref: string): GalleryImage => ({
  asset: { _ref: ref },
  alt: { tr: `Görsel ${ref}` },
  lqip: undefined,
});

const render = (props: Parameters<typeof GalleryLightbox>[0]) =>
  renderToStaticMarkup(<GalleryLightbox {...props} />);

describe("GalleryLightbox (DSN-29)", () => {
  it("renders a single grid without tabs when no once/sonra images exist", () => {
    const html = render({
      images: [img("image-a1b2c3d4e5-800x600-jpg"), img("image-b2c3d4e5f6-800x600-jpg")],
    });
    expect(html).toContain("image-a1b2c3d4e5-800x600-jpg");
    expect(html).not.toContain("Galeri filtresi");
    expect(html).not.toContain("Önce / Sonra");
  });

  it("renders the tab filter once once/sonra images exist", () => {
    const html = render({
      images: [img("image-a1b2c3d4e5-800x600-jpg")],
      onceSonra: [img("image-c3d4e5f6a7-800x600-jpg")],
    });
    expect(html).toContain("Galeri filtresi");
    expect(html).toContain("Önce / Sonra");
    // Varsayılan sekme Klinik: önce/sonra görseli grid'de yer almaz.
    expect(html).toContain("image-a1b2c3d4e5-800x600-jpg");
    expect(html).not.toContain("image-c3d4e5f6a7-800x600-jpg");
    expect(html).toContain('aria-pressed="true"');
  });

  it("filters out images without asset refs", () => {
    const html = render({ images: [img("image-a1b2c3d4e5-800x600-jpg"), { asset: {} }] });
    expect(html).toContain("image-a1b2c3d4e5-800x600-jpg");
    expect(html).not.toContain("undefined");
  });
});
