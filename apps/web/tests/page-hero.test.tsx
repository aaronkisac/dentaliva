import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

// next/image özel loader'ı vitest ortamında yok — sızdırmaz ikame deseni.
vi.mock("next/image", () => ({
  default: function MockImage(props: { src?: string; alt?: string }) {
    return <img src={props.src} alt={props.alt} />;
  },
}));

import { PageHero } from "../components/page-hero";

const render = (props: Parameters<typeof PageHero>[0]) =>
  renderToStaticMarkup(<PageHero {...props} />);

describe("PageHero (DSN-25)", () => {
  it("renders eyebrow link, title, lead and media children", () => {
    const html = renderToStaticMarkup(
      <PageHero
        eyebrow="Hizmetlerimiz"
        eyebrowHref="/hizmetlerimiz"
        title="İmplant Tedavisi"
        lead="Eksik dişlerin tedavisi."
      >
        <div>medya</div>
      </PageHero>,
    );
    expect(html).toContain('href="/hizmetlerimiz"');
    expect(html).toContain("Hizmetlerimiz");
    expect(html).toContain("İmplant Tedavisi");
    expect(html).toContain("Eksik dişlerin tedavisi.");
    expect(html).toContain("medya");
  });

  it("renders the eyebrow without a link when no href is given", () => {
    const html = render({ eyebrow: "Dentaliva", title: "Blog" });
    expect(html).toContain("Dentaliva");
    expect(html).toContain("Blog");
    expect(html).not.toContain("<a ");
  });

  it("omits eyebrow, lead and children blocks when absent", () => {
    const html = render({ title: "Şubelerimiz" });
    expect(html).toContain("Şubelerimiz");
    expect(html).not.toContain("mt-6");
    expect(html).not.toContain("uppercase");
  });
});

describe("PageHero media (DSN-83 v3 — duo hero)", () => {
  const media = { ref: `image-${"b".repeat(40)}-1080x1080-webp`, alt: "Klinik" };

  it("renders the duo grid: text column left, gold-framed portrait right", () => {
    const html = render({
      eyebrow: "Tedavilerimiz",
      eyebrowHref: "/hizmetlerimiz",
      title: "Periodontoloji",
      lead: "Diş eti sağlığı.",
      media,
    });
    expect(html).toContain("lg:grid-cols-12");
    expect(html).toContain("lg:col-span-7");
    expect(html).toContain("lg:col-span-5");
    expect(html).toContain("aspect-[3/4]");
    expect(html).toContain("border-[var(--dvn-line-gold)]");
    expect(html).toContain(`src="${media.ref}"`);
    expect(html).toContain('alt="Klinik"');
    expect(html).toContain("Diş eti sağlığı.");
  });

  it("falls back to the treatment title as image alt when alt is empty", () => {
    const html = render({ title: "Periodontoloji", media: { ref: media.ref } });
    expect(html).toContain('alt="Periodontoloji"');
  });

  it("keeps the single-column layout when no media is given (regression)", () => {
    const html = render({ eyebrow: "Tedavilerimiz", title: "Periodontoloji", lead: "x" });
    expect(html).not.toContain("lg:grid-cols-12");
    expect(html).not.toContain("<figure");
    expect(html).toContain("max-w-3xl");
  });
});
