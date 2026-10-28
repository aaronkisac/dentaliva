import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import { CtaBand } from "../components/cta-band";

const render = (props: Parameters<typeof CtaBand>[0]) =>
  renderToStaticMarkup(<CtaBand {...props} />);

describe("CtaBand (DSN-24, DSN-68)", () => {
  it("renders CMS title/text, the appointment CTA and the phone link", () => {
    const html = render({
      title: { tr: "Randevu Alın" },
      text: { tr: "Size yardımcı olmaktan memnuniyet duyarız." },
      phone: "+90 212 555 54 82",
      actionLabel: "Randevu Al",
    });
    expect(html).toContain("Randevu Alın");
    expect(html).toContain("Size yardımcı olmaktan memnuniyet duyarız.");
    expect(html).toContain('href="/iletisim"');
    expect(html).toContain('href="tel:+90 212 555 54 82"');
  });

  it("renders nothing without a CMS title (no hardcoded fallback copy)", () => {
    expect(render({ title: null, text: { tr: "meta" }, phone: "+90" })).toBe("");
    expect(render({})).toBe("");
  });

  it("omits the phone link when no phone is given", () => {
    const html = render({
      title: { tr: "Randevu Alın" },
      text: null,
      phone: undefined,
      actionLabel: "Randevu Al",
    });
    expect(html).toContain('href="/iletisim"');
    expect(html).not.toContain("tel:");
  });

  it("omits the appointment button without an action label (DSN-68: no hardcoded copy)", () => {
    const html = render({ title: { tr: "Randevu Alın" }, text: null, phone: "+90 212" });
    expect(html).not.toContain('href="/iletisim"');
    expect(html).toContain('href="tel:+90 212"');
  });
});
