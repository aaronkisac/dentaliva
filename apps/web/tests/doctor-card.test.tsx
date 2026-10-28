import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

// next/image özel loader'ı vitest ortamında yok — sızdırmaz ikame deseni.
vi.mock("next/image", () => ({
  default: function MockImage(props: { src?: string; alt?: string; className?: string }) {
    return <img src={props.src} alt={props.alt} className={props.className} />;
  },
}));

import { monogramInitials } from "../components/doctor-portrait";
import { DoctorCard as Card } from "../components/doctor-card";

describe("DoctorCard (DSN-69 portre vitrini)", () => {
  const photo = { ref: "image-abc123-1080x1350-jpg", lqip: undefined };

  const render = (props: Parameters<typeof Card>[0]) =>
    renderToStaticMarkup(<Card {...props} />);

  it("renders a whole-card link to the doctor detail — no per-card Detay link", () => {
    const html = render({ name: "Dr. Dt. Emel Özdemir", title: "Diş Hekimi", slug: "dr-dt-emel-ozdemir", photo });
    expect(html).toContain('href="/hekimlerimiz/dr-dt-emel-ozdemir"');
    // Eski kart dilindeki tekrarlayan "Detay →" linki kalktı.
    expect(html).not.toContain("Detay");
    expect(html).toContain("1080x1350-jpg");
  });

  it("keeps the title label with the gold dash and the 4/5 frame", () => {
    const html = render({ name: "Dt. Barış Kolik", title: "Ortodonti", slug: "dt-baris-kolik", photo });
    expect(html).toContain("Ortodonti");
    expect(html).toContain("aspect-[4/5]");
  });

  it("renders the monogram branch without a photo", () => {
    const html = render({ name: "Dt. Şehmus Saygın", title: "Diş Hekimi", slug: "dt-sehmus-saygin" });
    expect(html).toContain("ŞS");
    expect(html).not.toContain("<img");
  });
});

describe("monogramInitials (DSN-43, yeniden dışa açık)", () => {
  it("strips title prefixes with Turkish casing", () => {
    expect(monogramInitials("Dr. Dt. Emel Özdemir")).toBe("EÖ");
    expect(monogramInitials("Dt. Şehmus Saygın")).toBe("ŞS");
  });
});
