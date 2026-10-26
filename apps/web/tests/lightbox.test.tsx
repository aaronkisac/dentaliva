import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

// next/image özel loader'ı vitest ortamında yok — ui paketindeki next-link
// mock deseni gibi sızdırmaz bir ikame.
vi.mock("next/image", () => ({
  default: function MockImage(props: { src?: string; alt?: string }) {
    return <img src={props.src} alt={props.alt} />;
  },
}));

import { GalleryLightbox, LightboxStage, galleryMode, mosaicSpan } from "../components/lightbox";
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

  it("keeps m-auto on the dialog — preflight zeroes margins and the UA's dialog:centering dies without it", () => {
    const html = render({ images: [img("image-a1b2c3d4e5-800x600-jpg")] });
    expect(html).toMatch(/<dialog[^>]*class="[^"]*\bm-auto\b/);
  });
});

describe("GalleryLightbox mosaic rhythm (DSN-68)", () => {
  it("keeps a uniform grid under six images — the rhythm cannot establish", () => {
    expect(mosaicSpan(0, 5)).toBeNull();
    expect(mosaicSpan(2, 3)).toBeNull();
  });

  it("uses the home pattern for an eight-image set: feature first, wide last", () => {
    expect(mosaicSpan(0, 8)).toBe("feature");
    expect(mosaicSpan(7, 8)).toBe("wide");
    expect(mosaicSpan(3, 8)).toBeNull();
  });

  it("features every seventh image in larger sets", () => {
    expect(mosaicSpan(0, 24)).toBe("feature");
    expect(mosaicSpan(7, 24)).toBe("feature");
    expect(mosaicSpan(14, 24)).toBe("feature");
    expect(mosaicSpan(21, 24)).toBe("feature");
    expect(mosaicSpan(5, 24)).toBeNull();
  });

  it("renders the mosaic grid classes on the klinik tab", () => {
    const many = Array.from({ length: 8 }, (_, i) =>
      img(`image-${String(i + 1).padStart(40, "3")}-800x800-jpg`),
    );
    const html = render({ images: many });
    expect(html).toContain("grid-flow-dense");
    expect(html).toContain("md:row-span-2");
  });
});

describe("GalleryLightbox once/sonra carousel (DSN-51)", () => {
  const many = Array.from({ length: 5 }, (_, i) => ({
    asset: { _ref: `image-${String(i + 1).padStart(40, "4")}-800x800-jpg` },
    alt: { tr: `Önce sonra ${i + 1}` },
    lqip: undefined,
  }));

  it("goes carousel over three images on the once/sonra tab only", () => {
    expect(galleryMode(5, "onceSonra")).toBe("carousel");
    expect(galleryMode(3, "onceSonra")).toBe("grid");
    expect(galleryMode(5, "klinik")).toBe("grid");
  });

  it("renders the tab filter and keeps the klinik grid on first paint", () => {
    const list = many.slice(0, 1);
    const html = renderToStaticMarkup(
      <GalleryLightbox images={list} onceSonra={list} closeLabel="Kapat" />,
    );
    expect(html).toContain("Önce / Sonra");
    expect(html).toContain("grid-flow-dense");
  });
});

describe("LightboxStage (DSN-68)", () => {
  const items = [
    img("image-a1b2c3d4e5-800x600-jpg"),
    img("image-b2c3d4e5f6-800x600-jpg"),
    img("image-c3d4e5f6a7-800x600-jpg"),
  ];
  const noop = () => {};

  it("renders arrows, counter and caption", () => {
    const html = renderToStaticMarkup(
      <LightboxStage
        items={items}
        active={1}
        closeLabel="Kapat"
        onClose={noop}
        onNavigate={noop}
      />,
    );
    expect(html).toContain('aria-label="Önceki görseller"');
    expect(html).toContain('aria-label="Sonraki görseller"');
    expect(html).toContain("2 / 3");
    expect(html).toContain("Görsel image-b2c3d4e5f6-800x600-jpg");
    expect(html).toContain("Kapat ✕");
  });

  it("disables the arrows at both ends", () => {
    const first = renderToStaticMarkup(
      <LightboxStage items={items} active={0} onClose={noop} onNavigate={noop} />,
    );
    const last = renderToStaticMarkup(
      <LightboxStage items={items} active={2} onClose={noop} onNavigate={noop} />,
    );
    expect(first.match(/disabled=""/g)?.length).toBe(1);
    expect(last.match(/disabled=""/g)?.length).toBe(1);
  });
});
