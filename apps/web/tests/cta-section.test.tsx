import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import { CtaSection } from "../components/sections/faq-cta";

const render = (props: {
  title?: { tr?: string } | null;
  text?: { tr?: string } | null;
  trustLine?: { tr?: string } | null;
  eyebrow?: { tr?: string } | null;
  phone?: string;
  whatsapp?: string | null;
}) => renderToStaticMarkup(<CtaSection phone={props.phone ?? ""} {...props} />);

describe("CtaSection final conversion block (DSN-64)", () => {
  it("renders nothing without a title", () => {
    expect(render({ title: null })).toBe("");
  });

  it("renders the two-column block with the compact form card and trust line", () => {
    const html = render({
      title: { tr: "Başlamaya hazır mısınız?" },
      text: { tr: "Metin" },
      trustLine: { tr: "Gizlilik politikamıza göre işlenir." },
      eyebrow: { tr: "Buradan başlayın" },
      phone: "+90 212 555 54 82",
    });
    expect(html).toContain("Başlamaya hazır mısınız?");
    expect(html).toContain("Gizlilik politikamıza göre işlenir.");
    expect(html).toContain("Buradan başlayın");
    // Kısa form kartı (dinamik — SSR'de iskelet) ve telefon satırı.
    expect(html).toContain("bg-white");
    expect(html).toContain("+90 212 555 54 82");
  });

  it("gates the WhatsApp button on siteSettings.whatsapp", () => {
    const without = render({ title: { tr: "T" }, whatsapp: null });
    expect(without).not.toContain("wa.me");
    const withNumber = render({ title: { tr: "T" }, whatsapp: "+90 530 840 54 82" });
    expect(withNumber).toContain("https://wa.me/905308405482");
  });
});
