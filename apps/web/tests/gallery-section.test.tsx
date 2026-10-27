import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

// next/image özel loader'ı vitest ortamında yok — sızdırmaz ikame deseni.
vi.mock("next/image", () => ({
  default: function MockImage(props: { src?: string; alt?: string }) {
    return <img src={props.src} alt={props.alt} />;
  },
}));

import { GallerySection, pickHomeGallery } from "../components/sections/gallery";

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

  it("caps the grid at five images (home composition: feature + 4 squares)", () => {
    const many = Array.from({ length: 11 }, (_, i) => img(i + 10));
    const html = render({ images: many });
    expect(new Set(html.match(/image-\d+-600x400-jpg/g)).size).toBe(5);
  });

  it("composes the home mosaic: one feature tile, uniform squares (DSN-68)", () => {
    const five = Array.from({ length: 5 }, (_, i) => img(i + 1));
    const html = render({ images: five });
    // Tek fetih karesi (2 kolon + 2 satır); geniş şerit sınıfı kalktı.
    expect(html.match(/md:row-span-2/g)?.length).toBe(1);
    expect(html).not.toContain("aspect-video");
  });

  it("renders the hover caption from the CMS alt text", () => {
    const html = render({ images: [img(1), img(2)] });
    expect(html).toContain("Görsel 1");
  });
});

describe("pickHomeGallery (DSN-68 ana sayfa seçkisi)", () => {
  const full = [img(1), img(2), img(3)];
  const curated = [img(9), img(7), img(5), img(3)];

  it("prefers the curated selection when it has refs", () => {
    expect(pickHomeGallery(curated, full)).toEqual(curated);
  });

  it("falls back to the full gallery when the selection is empty or unset", () => {
    expect(pickHomeGallery(undefined, full)).toEqual(full);
    expect(pickHomeGallery([], full)).toEqual(full);
  });

  it("drops ref-less selection entries instead of falling back for them", () => {
    const withJunk = [{ alt: { tr: "bozuk" } }, img(4)];
    expect(pickHomeGallery(withJunk, full)).toEqual([img(4)]);
  });
});
