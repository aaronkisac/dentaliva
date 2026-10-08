import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

// next/image özel loader'ı vitest ortamında yok — lightbox testindeki
// sızdırmaz ikame deseni.
vi.mock("next/image", () => ({
  default: function MockImage(props: { src?: string; alt?: string; className?: string }) {
    return <img src={props.src} alt={props.alt} className={props.className} />;
  },
}));

import { TreatmentCard } from "../components/treatment-card";
import type { TreatmentListItem } from "../src/content/treatments";

const base: TreatmentListItem = {
  name: { tr: "İmplant", en: "Implant" },
  slug: "implant",
  summary: { tr: "Uzun bir özet metni." },
};

describe("TreatmentCard (DSN-45)", () => {
  it("renders image, name, clamped summary and the detail link", () => {
    const html = renderToStaticMarkup(
      <TreatmentCard
        item={{
          ...base,
          heroImage: {
            ref: "image-abc-600x400-jpg",
            lqip: "data:image/jpeg;base64,abc",
            alt: { tr: "İmplant" },
          },
        }}
      />,
    );
    expect(html).toContain('src="image-abc-600x400-jpg"');
    expect(html).toContain('alt="İmplant"');
    expect(html).toContain("İmplant");
    expect(html).toContain("line-clamp-3");
    expect(html).toContain("Detay →");
    expect(html).toContain('href="/hizmetlerimiz/implant"');
  });

  it("renders no image area without heroImage", () => {
    const html = renderToStaticMarkup(<TreatmentCard item={base} />);
    expect(html).not.toContain("<img");
    expect(html).toContain('href="/hizmetlerimiz/implant"');
  });

  it("omits the detail link without a slug", () => {
    const html = renderToStaticMarkup(<TreatmentCard item={{ ...base, slug: undefined }} />);
    expect(html).toContain("İmplant");
    expect(html).not.toContain("Detay →");
  });

  it("falls back to an empty alt text", () => {
    const html = renderToStaticMarkup(
      <TreatmentCard item={{ ...base, heroImage: { ref: "image-abc-600x400-jpg" } }} />,
    );
    expect(html).toContain('alt=""');
  });
});
