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

describe("GallerySection (DSN-46, DSN-52, DSN-68)", () => {
  it("renders the header row: eyebrow, heading, lead and the all-photos link", () => {
    const html = render({
      images: [img(1), img(2)],
      eyebrow: "Dentaliva",
      heading: "Kliniğimizden Kareler",
      lead: "Modern, steril ve huzurlu bir klinik ortamı.",
      allLabel: "Tüm Fotoğraflar",
      allHref: "/fotograf-galerisi",
    });
    expect(html).toContain("Dentaliva");
    expect(html).toContain(">Kliniğimizden Kareler</h2>");
    expect(html).toContain("Modern, steril ve huzurlu bir klinik ortamı.");
    expect(html).toContain('href="/fotograf-galerisi"');
    expect(html).toContain("Tüm Fotoğraflar →");
    expect(html).toContain("600x400-jpg");
  });

  it("renders no header-row extras and no stats band when copy is missing", () => {
    const html = render({ images: [img(1), img(2)] });
    expect(html).not.toContain("<h2");
    expect(html).not.toContain("13+");
    expect(html).not.toContain("→");
    expect(html).toContain("600x400-jpg");
  });

  it("caps the grid at eight images", () => {
    const many = Array.from({ length: 11 }, (_, i) => img(i + 10));
    const html = render({ images: many });
    expect(html.match(/image-n\d+-600x400-jpg/g)?.length ?? 0).toBeLessThanOrEqual(8);
  });

  it("composes the home mosaic: feature tile first, wide tile last (DSN-68)", () => {
    const eight = Array.from({ length: 8 }, (_, i) => img(i + 1));
    const html = render({ images: eight });
    // İlk kart fetih karesi (2 kolon + 2 satır), son kart geniş (2 kolon).
    expect(html).toContain("col-span-2 aspect-[4/3] md:aspect-auto md:row-span-2");
    expect(html).toContain("col-span-2 aspect-video md:aspect-auto");
  });

  it("renders the hover caption from the CMS alt text", () => {
    const html = render({ images: [img(1), img(2)] });
    expect(html).toContain("Görsel 1");
  });
});
