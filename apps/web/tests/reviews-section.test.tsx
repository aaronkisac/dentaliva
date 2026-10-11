import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import { ReviewsSection } from "../components/sections/testimonials";
import type { TestimonialItem } from "../components/sections/testimonials";

const items: TestimonialItem[] = [
  {
    author: "Ayşe Yılmaz",
    quote: {
      tr: "Uzun bir tedavi sürecinde herkese çok teşekkür ederiz, sonuç harikaydı ve her adımda bilgilendirildik.",
    },
    rating: 5,
    source: "Google",
  },
  {
    author: "Mert Kaya",
    quote: { tr: "Kısa ve net: tavsiye ederim." },
    rating: 5,
    source: "Google",
  },
];

const render = (props: Parameters<typeof ReviewsSection>[0]) =>
  renderToStaticMarkup(<ReviewsSection {...props} />);

describe("ReviewsSection carousel (DSN-52)", () => {
  it("renders the CMS heading, google badge, cards and dots", () => {
    const html = render({ items, heading: "Hastalarımızın Yorumları" });
    expect(html).toContain("Hastalarımızın Yorumları");
    expect(html).toContain("Google Değerlendirmeleri · 5,0");
    expect(html).toContain("Ayşe Yılmaz · Google");
    expect(html).toContain("snap-x");
    expect(html).toContain('aria-label="1. yorum"');
  });

  it("omits the heading without CMS copy and keeps the carousel", () => {
    const html = render({ items });
    expect(html).not.toContain("Hastalarımızın Yorumları");
    expect(html).toContain("snap-x");
  });

  it("clamps long quotes at word level (30 words)", () => {
    const long = Array.from({ length: 40 }, (_, i) => `kelime${i}`).join(" ");
    const html = render({ items: [{ ...items[0], quote: { tr: long } }] });
    expect(html).toContain("kelime29…");
    expect(html).not.toContain("kelime30");
  });

  it("renders nothing without items", () => {
    expect(render({ items: [], heading: "Hastalarımızın Yorumları" })).toBe("");
  });
});
