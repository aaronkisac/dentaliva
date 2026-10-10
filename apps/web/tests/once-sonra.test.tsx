import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

vi.mock("next/image", () => ({
  default: function MockImage(props: { src?: string; alt?: string }) {
    return <img src={props.src} alt={props.alt} />;
  },
}));

import { OnceSonraSection } from "../components/sections/once-sonra";
import type { BeforeAfterCase } from "../src/content/home";

const item = (n: number, slug?: string): BeforeAfterCase => ({
  before: { ref: `image-before-${n}`, alt: { tr: `Önce ${n}` } },
  after: { ref: `image-after-${n}`, alt: { tr: `Sonra ${n}` } },
  title: { tr: `Vaka ${n}` },
  text: { tr: `Açıklama ${n}` },
  treatment: slug ? { name: { tr: slug }, slug } : undefined,
});

const render = (props: Parameters<typeof OnceSonraSection>[0]) =>
  renderToStaticMarkup(<OnceSonraSection {...props} />);

describe("OnceSonraSection (DSN-50)", () => {
  it("renders nothing without complete pairs (boş bölüm render edilmez)", () => {
    expect(render({ items: [], heading: "Önce / Sonra" })).toBe("");
    expect(
      render({ items: [{ before: { ref: "image-x" }, title: { tr: "X" } }], heading: "x" }),
    ).toBe("");
  });

  it("renders cards with number chips, CMS copy and images", () => {
    const html = render({
      items: [item(1), item(2)],
      heading: "Önce / Sonra",
      eyebrow: "Dentaliva",
    });
    expect(html).toContain("Dentaliva");
    expect(html).toContain("Önce / Sonra");
    expect(html).toContain(">01<");
    expect(html).toContain(">02<");
    expect(html).toContain("Vaka 1");
    expect(html).toContain("Açıklama 2");
    expect(html).toContain('src="image-before-1"');
  });

  it("links the title to the treatment detail when a reference exists", () => {
    const html = render({ items: [item(1, "dis-beyazlatma")] });
    expect(html).toContain('href="/hizmetlerimiz/dis-beyazlatma"');
  });

  it("hides the heading block without copy while the grid stays", () => {
    const html = render({ items: [item(1)] });
    expect(html).not.toContain("<h2");
    expect(html).toContain("Vaka 1");
  });
});
