// DSN-92: hekim biyosu → yapılandırılmış CV bölümleri (parser + render).
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import { DoctorBio } from "../components/doctor-bio";
import { parseDoctorBio } from "../src/content/doctor-bio";

const EMEL = [
  "Ünvan: Diş Hekimi",
  "",
  "Eğitim:",
  "- Lisans : İstanbul Üniversitesi Çapa Diş Hekimliği Fakültesi",
  "- Doktora: Gazi Üniversitesi Ortodonti Anabilim Dalı",
  "- Yayınlar",
  "- ”A Demographic Assesment” poster sunumu",
  "- Üyelikler",
  "- Türk Ortodonti Derneği",
  "- Türk Aligner Derneği",
  "- Katılınan Kurs, Sempozyum ve Kongreler",
  "- Invisalign Certification Course,Gil J.Laks,19 Mayıs 2016 ,DUBAI,BAE.",
  "- Adres 1: Başakşehir Mahallesi Hürriyet Bulvarı No:131/A",
  "- Adres 2: Üniversite Mahallesi Londra Asfaltı E5 Yanyol",
].join("\n");

describe("parseDoctorBio (DSN-92)", () => {
  it("splits the legacy flat bio into titled sections", () => {
    const parsed = parseDoctorBio(EMEL);
    expect(parsed?.title).toBe("Diş Hekimi");
    expect(parsed?.sections.map((s) => `${s.heading}[${s.items.length}]`)).toEqual([
      "Eğitim[2]",
      "Yayınlar[1]",
      "Üyelikler[2]",
      "Katılınan Kurs, Sempozyum ve Kongreler[1]",
      "Adresler[2]",
    ]);
  });

  it("labels degree rows and address rows", () => {
    const parsed = parseDoctorBio(EMEL)!;
    expect(parsed.sections[0]?.items[0]).toEqual({
      label: "Lisans",
      text: "İstanbul Üniversitesi Çapa Diş Hekimliği Fakültesi",
    });
    expect(parsed.sections[4]?.items[1]).toEqual({
      label: "Adres 2",
      text: "Üniversite Mahallesi Londra Asfaltı E5 Yanyol",
    });
  });

  it("carries a value-less label onto the next row (- Lisans: + next line)", () => {
    const parsed = parseDoctorBio(
      [
        "Eğitim:",
        "- Lisans:",
        "- İstanbul Üniversitesi Diş Hekimliği Fakültesi",
        "- Projelerde Yaptığı Görevler:",
        "- Adeziv sistemleri çalışması",
      ].join("\n"),
    )!;
    expect(parsed.sections[0]?.items).toEqual([
      { label: "Lisans", text: "İstanbul Üniversitesi Diş Hekimliği Fakültesi" },
    ]);
    expect(parsed.sections[1]?.heading).toBe("Projelerde Yaptığı Görevler");
  });

  it("opens default sections when rows precede any heading", () => {
    const labeledFirst = parseDoctorBio(
      ["- Lisans: Ankara Üniversitesi", "- Üyelikler", "- Türk Diş Hekimleri Birliği"].join("\n"),
    )!;
    expect(labeledFirst.sections[0]?.heading).toBe("Eğitim");

    const plainFirst = parseDoctorBio(
      ["Serbest diş hekimi", "- Üyelikler", "- Türk Diş Hekimleri Birliği"].join("\n"),
    )!;
    expect(plainFirst.sections[0]).toEqual({
      heading: "Özgeçmiş",
      items: [{ text: "Serbest diş hekimi" }],
    });
  });

  it("groups a single unnumbered address under a singular heading", () => {
    const parsed = parseDoctorBio(
      ["Eğitim:", "- Lisans: Ege Üniversitesi", "- Adres: Avcılar, İstanbul"].join("\n"),
    )!;
    expect(parsed.sections[1]).toEqual({
      heading: "Adres",
      items: [{ label: "Adres", text: "Avcılar, İstanbul" }],
    });
  });

  it("does not treat long, wordy or colon-less rows as headings", () => {
    const parsed = parseDoctorBio(
      [
        "Eğitim:",
        "- Lisans: Ege Üniversitesi",
        "- Orthodontic Mechanics:Old and New,for Children and Adults with Postural and Bidimentional Approach,Dr. Marcel Korn,4 Kasım 2011",
        "- Eğitim ve araştırma alanında çok sayıda uluslararası çalışmaya katkı sundu",
        "- Üyelikler",
        "- Türk Ortodonti Derneği",
      ].join("\n"),
    )!;
    expect(parsed.sections.map((s) => s.heading)).toEqual(["Eğitim", "Üyelikler"]);
    expect(parsed.sections[0]?.items).toHaveLength(3);
  });

  it("returns null when fewer than two sections are recognised", () => {
    expect(parseDoctorBio("Diş hekimi.")).toBeNull();
    expect(parseDoctorBio("Ünvan: Diş Hekimi")).toBeNull();
    expect(parseDoctorBio("Eğitim:\n- :")).toBeNull();
    expect(parseDoctorBio("")).toBeNull();
    expect(parseDoctorBio(null)).toBeNull();
  });
});

describe("DoctorBio", () => {
  it("renders numbered serif sections with hairline rows and gold labels", () => {
    const html = renderToStaticMarkup(<DoctorBio bio={EMEL} heroTitle="Diş Hekimi" />);
    expect(html).toContain(">01<");
    expect(html).toContain(">05<");
    expect(html).toContain("Yayınlar");
    expect(html).toContain("Türk Aligner Derneği");
    expect(html).toContain("text-gold-deep");
    expect(html).toContain(">Lisans<");
    // Ham "- " önekleri ve ham ünvan satırı basılmaz.
    expect(html).not.toContain("- Yayınlar");
    expect(html).not.toContain("Ünvan:");
    expect(html).not.toContain("whitespace-pre-line");
  });

  it("shows the bio title as a lead only when it differs from the hero title", () => {
    const same = renderToStaticMarkup(<DoctorBio bio={EMEL} heroTitle=" diş hekimi " />);
    expect(same).not.toContain('font-serif text-2xl text-navy">Diş Hekimi');
    const differs = renderToStaticMarkup(<DoctorBio bio={EMEL} heroTitle="Ortodonti Uzmanı" />);
    expect(differs).toContain("Diş Hekimi</p>");
    const noHero = renderToStaticMarkup(<DoctorBio bio={EMEL} />);
    expect(noHero).toContain("Diş Hekimi</p>");
  });

  it("falls back to the legacy plain render for unstructured bios", () => {
    const html = renderToStaticMarkup(<DoctorBio bio="Kısa biyografi metni." />);
    expect(html).toContain("whitespace-pre-line");
    expect(html).toContain("Kısa biyografi metni.");
  });

  it("renders nothing without a bio", () => {
    expect(renderToStaticMarkup(<DoctorBio bio={null} />)).toBe("");
  });
});
