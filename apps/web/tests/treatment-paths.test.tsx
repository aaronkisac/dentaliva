import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import { TreatmentPathsSection } from "../components/sections/treatment-paths";
import type { TreatmentPathItem } from "../src/content/home";

const render = (items: TreatmentPathItem[], props?: { eyebrow?: string; heading?: string }) =>
  renderToStaticMarkup(
    <TreatmentPathsSection items={items} eyebrow={props?.eyebrow} heading={props?.heading} />,
  );

describe("TreatmentPathsSection (DSN-62)", () => {
  it("renders nothing without items (empty section never ships)", () => {
    expect(render([])).toBe("");
  });

  it("renders the full card as a single link to the treatment page", () => {
    const html = render([
      {
        headline: { tr: "Eksik dişinizi tamamlanın" },
        subline: { tr: "İmplant tedavisi" },
        treatment: { slug: "implant-tedavisi" },
      },
    ]);
    expect(html).toContain('href="/hizmetlerimiz/implant-tedavisi"');
    expect(html).toContain("Eksik dişinizi tamamlanın");
    expect(html).toContain("İmplant tedavisi");
    // Tek link — kartın tamamı tıklanabilir, içinde ikinci çapa yok.
    expect(html.match(/<a /g)?.length).toBe(1);
  });

  it("renders a linkless article when the treatment reference is missing", () => {
    const html = render([{ headline: { tr: "Başlık" } }]);
    expect(html).toContain("<article");
    expect(html).not.toContain("<a ");
  });

  it("drops cards without a headline and renders the heading block", () => {
    const html = render([{ subline: { tr: "altsız" } }, { headline: { tr: "Dolu kart" } }], {
      eyebrow: "Dentaliva",
      heading: "Size Uygun Yolu Bulun",
    });
    expect(html).toContain("Dolu kart");
    expect(html).not.toContain("altsız");
    expect(html).toContain("Dentaliva");
    expect(html).toContain("Size Uygun Yolu Bulun");
  });
});
