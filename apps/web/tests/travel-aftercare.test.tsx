import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import { AftercareSection, TravelStaySection } from "../components/sections/travel-aftercare";

describe("TravelStaySection (DSN-66)", () => {
  const render = (data: { checklist?: Array<{ tr?: string }> } | null) =>
    renderToStaticMarkup(<TravelStaySection data={data} />);

  it("renders nothing without data or checklist items", () => {
    expect(render(null)).toBe("");
    expect(render({})).toBe("");
    expect(render({ checklist: [] })).toBe("");
  });

  it("renders the planning checklist with check marks", () => {
    const html = render({ checklist: [{ tr: "Yazılı planınız" }, { tr: "Ziyaret sayısı" }] });
    expect(html).toContain("Yazılı planınız");
    expect(html).toContain("Ziyaret sayısı");
  });

  it("caps the checklist at eight items", () => {
    const items = Array.from({ length: 10 }, (_, i) => ({ tr: `Madde ${i + 1}` }));
    const html = render({ checklist: items });
    expect(html).toContain("Madde 8");
    expect(html).not.toContain("Madde 9");
  });
});

describe("AftercareSection (DSN-66)", () => {
  const render = (
    data: {
      normal?: Array<{ tr?: string }>;
      urgent?: Array<{ tr?: string }>;
      contactNote?: { tr?: string };
    } | null,
    props?: { normalTitle?: string; urgentTitle?: string },
  ) =>
    renderToStaticMarkup(
      <AftercareSection
        data={data}
        normalTitle={props?.normalTitle}
        urgentTitle={props?.urgentTitle}
      />,
    );

  it("renders nothing without data", () => {
    expect(render(null)).toBe("");
    expect(render({})).toBe("");
  });

  it("renders the two symptom cards with CMS titles and the contact note", () => {
    const html = render(
      {
        normal: [{ tr: "Hafif hassasiyet" }],
        urgent: [{ tr: "Uzayan kanama" }],
        contactNote: { tr: "Sorularınız için bize yazın." },
      },
      { normalTitle: "Normal iyileşme", urgentTitle: "Bize ulaşın" },
    );
    expect(html).toContain("Normal iyileşme");
    expect(html).toContain("Hafif hassasiyet");
    expect(html).toContain("Bize ulaşın");
    expect(html).toContain("Uzayan kanama");
    expect(html).toContain("Sorularınız için bize yazın.");
  });

  it("drops a card whose CMS title is missing (zero-hardcoded-copy)", () => {
    const html = render({ normal: [{ tr: "Madde" }] }, { normalTitle: undefined });
    expect(html).not.toContain("Madde");
  });
});
