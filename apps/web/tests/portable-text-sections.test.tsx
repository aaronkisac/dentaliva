// DSN-93: PortableText gövdesi editoryal bantlar (gruplama + render).
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import {
  PortableTextSections,
  blockText,
  groupBlocksByHeading,
} from "../components/portable-text-sections";
import type { PortableBlock } from "../src/content/blog";

const h2 = (text: string, key: string): PortableBlock => ({
  _type: "block",
  style: "h2",
  _key: key,
  children: [{ _type: "span", text, _key: `${key}-c` }],
});

const h3 = (text: string, key: string): PortableBlock => ({
  _type: "block",
  style: "h3",
  _key: key,
  children: [{ _type: "span", text, _key: `${key}-c` }],
});

const p = (text: string, key: string): PortableBlock => ({
  _type: "block",
  _key: key,
  children: [{ _type: "span", text, _key: `${key}-c` }],
});

describe("groupBlocksByHeading", () => {
  it("splits at h2 boundaries by default; lead group stays heading-less", () => {
    const groups = groupBlocksByHeading([
      p("giriş", "a"),
      h2("Bir", "b"),
      p("x", "c"),
      h2("İki", "d"),
    ]);
    expect(groups).toHaveLength(3);
    expect(groups[0]?.heading).toBeNull();
    expect(blockText(groups[1]?.heading ?? { _type: "block" })).toBe("Bir");
  });

  it("splitAt h3: şube deseni — tek h2 intro'da kalır, h3'lerde böler", () => {
    const groups = groupBlocksByHeading(
      [h2("SEO satırı", "a"), p("gövde", "b"), h3("İmplant", "c"), p("x", "d"), h3("Kanal", "e")],
      "h3",
    );
    expect(groups).toHaveLength(3);
    expect(groups[0]?.heading).toBeNull();
    expect(groups[0]?.children[0]?.style).toBe("h2");
    expect(blockText(groups[1]?.heading ?? { _type: "block" })).toBe("İmplant");
    expect(blockText(groups[2]?.heading ?? { _type: "block" })).toBe("Kanal");
  });

  it("drops empty non-block entries and keeps heading-only groups", () => {
    const groups = groupBlocksByHeading([h2("Boş", "a"), h2("Dolu", "b"), p("metin", "c")]);
    expect(groups).toHaveLength(2);
    expect(groups[0]?.children).toHaveLength(0);
  });
});

describe("PortableTextSections", () => {
  it("renders alternating white/ivory bands with gold serif counters", () => {
    const html = renderToStaticMarkup(
      <PortableTextSections
        blocks={[
          p("giriş", "a"),
          h2("Bir", "b"),
          p("x", "c"),
          h2("İki", "d"),
          h3("Alt", "e"),
          p("y", "f"),
        ]}
      />,
    );
    expect(html.match(/bg-white"/g)?.length).toBe(1);
    expect(html.match(/class="bg-ivory"/g)?.length).toBe(1);
    expect(html).toContain(">01<");
    expect(html).toContain(">02<");
    expect(html).toContain("Bir");
    expect(html).toContain("İki");
    expect(html).toContain("Alt");
  });

  it("splitAt h3 (şube): h2 intro başlığı olur, h3'ler bant başlığıdır", () => {
    const html = renderToStaticMarkup(
      <PortableTextSections
        blocks={[
          h2("Avcılar Diş, Avcılar Diş Hastanesi", "a"),
          p("Avcılar'da gülüşünüz için buradayız.", "b"),
          h3("İmplant Tedavileri", "c"),
          p("Eksik dişler için.", "d"),
          h3("Kanal Tedavileri", "e"),
          p("Kök kanal.", "f"),
        ]}
        splitAt="h3"
      />,
    );
    // Intro: h2 display-md; bantlar: h3 metni 2xl serif başlık öğesinde.
    expect(html).toContain("text-[length:var(--dvn-text-display-md-size)]");
    expect(html).toContain("Avcılar Diş, Avcılar Diş Hastanesi");
    expect(html).toContain(">01<");
    expect(html).toContain(">02<");
    expect(html).toContain("İmplant Tedavileri");
    expect(html).toContain("Kanal Tedavileri");
    expect(html.match(/class="bg-white"/g)?.length).toBe(1);
    expect(html.match(/class="bg-ivory"/g)?.length).toBe(1);
  });

  it("renders nothing without blocks", () => {
    expect(renderToStaticMarkup(<PortableTextSections blocks={[]} />)).toBe("");
    expect(renderToStaticMarkup(<PortableTextSections />)).toBe("");
  });

  it("renders a plain lead when the body has no heading at all", () => {
    const html = renderToStaticMarkup(<PortableTextSections blocks={[p("Tek paragraf.", "a")]} />);
    expect(html).toContain("Tek paragraf.");
    expect(html).not.toContain(">01<");
  });
});
