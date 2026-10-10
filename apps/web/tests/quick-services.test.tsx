import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

// TreatmentCard hero görselini next/image ile basar — sızdırmaz ikame deseni.
vi.mock("next/image", () => ({
  default: function MockImage(props: { src?: string; alt?: string }) {
    return <img src={props.src} alt={props.alt} />;
  },
}));

import { QuickServicesSection } from "../components/sections/quick-services";
import type { QuickServiceItem } from "../src/content/home";

const items: QuickServiceItem[] = [
  { name: { tr: "İmplant" }, slug: "implant", summary: { tr: "Özet." } },
  { name: { tr: "Ortodonti" }, slug: "ortodonti", summary: { tr: "Özet." } },
];

const render = (props: Parameters<typeof QuickServicesSection>[0]) =>
  renderToStaticMarkup(<QuickServicesSection {...props} />);

describe("QuickServicesSection carousel (DSN-50)", () => {
  it("renders nothing without items", () => {
    expect(render({ items: [], heading: "Hizmetlerimiz" })).toBe("");
  });

  it("renders the snap track, cards, arrows and the CTA text link", () => {
    const html = render({
      items,
      eyebrow: "Dentaliva",
      heading: "Hizmetlerimiz",
      ctaLabel: "Tüm Hizmetlerimiz",
    });
    expect(html).toContain("snap-x");
    expect(html).toContain('href="/hizmetlerimiz/implant"');
    expect(html).toContain('aria-label="Önceki hizmetler"');
    expect(html).toContain('aria-label="Sonraki hizmetler"');
    expect(html).toContain("Tüm Hizmetlerimiz");
    expect(html).toContain("Özet.");
  });

  it("keeps arrows but drops the text link when ctaLabel is absent", () => {
    const html = render({ items });
    expect(html).toContain("İmplant");
    expect(html).toContain("Önceki hizmetler");
    expect(html).not.toContain(">Tüm Hizmetlerimiz");
  });

  it("marks the previous arrow disabled at the start of the track", () => {
    const html = render({ items, heading: "Hizmetlerimiz" });
    expect(html).toMatch(/aria-label="Önceki hizmetler"[^>]*disabled/);
  });
});
