import { describe, expect, it } from "vitest";

import { isJunkLine } from "../src/extract";
import {
  branchToSanity,
  normalizePhone,
  buildNapReport,
  doctorToSanity,
  extractEmails,
  extractPhones,
  realSummary,
  treatmentToSanity,
  validateDocs,
  type NormalizedPage,
} from "../src/transform";

const page: NormalizedPage = {
  url: "https://www.dentaliva.com/implant-tedavisi/",
  title: "İmplant Tedavisi | Dentaliva",
  h1: "İmplant Tedavisi",
  paragraphs: [
    "Eksik dişlerin yerine titanyum implantlar yerleştirilir ve uzun yıllar kullanılır.",
    "## Tedavi süreci",
    "Planlama, yerleştirme ve protez aşamalarından oluşur.",
  ],
};

describe("transform to Sanity documents", () => {
  it("maps a treatment page with name/slug/summary/body", () => {
    const doc = treatmentToSanity(page);
    expect(doc._id).toBe("treatment.implant-tedavisi");
    expect(doc._type).toBe("treatment");
    expect(doc.slug).toEqual({ _type: "slug", current: "implant-tedavisi" });
    expect(doc.name).toEqual({ tr: "İmplant Tedavisi" });
    expect(doc.summary).toEqual({ tr: page.paragraphs[0] });
    expect(doc.body).toEqual({ tr: "Planlama, yerleştirme ve protez aşamalarından oluşur." });
  });

  it("maps doctor and branch pages", () => {
    const doctor = doctorToSanity({
      url: "https://www.dentaliva.com/dr-dt-emel-ozdemir/",
      title: "x",
      h1: "Dr. Dt. Emel Özdemir",
      paragraphs: [],
    });
    expect(doctor._id).toBe("doctor.dr-dt-emel-ozdemir");
    expect(doctor.name).toBe("Dr. Dt. Emel Özdemir");
    const branch = branchToSanity({
      url: "https://www.dentaliva.com/avcilar/",
      title: "x",
      h1: "Avcılar",
      paragraphs: [],
    });
    expect(branch._id).toBe("branch.avcilar");
  });
});

describe("NAP extraction and diff", () => {
  it("extracts phones and emails", () => {
    expect(extractPhones("Tel: +90 212 555 54 82 / 0532 000 00 00")).toEqual([
      "+90 212 555 54 82",
      "0532 000 00 00",
    ]);
    expect(extractEmails("Yazın: info@dentaliva.com")).toEqual(["info@dentaliva.com"]);
  });

  it("flags missing canonical values and non-canonical deviations", () => {
    const report = buildNapReport([
      {
        url: "https://www.dentaliva.com/iletisim/",
        title: "İletişim",
        h1: "İletişim",
        paragraphs: ["Bizi arayın: 0532 000 00 00"],
      },
    ]);
    expect(report.missing.length).toBeGreaterThan(0);
    expect(report.deviations).toContain("0532 000 00 00");
  });
});

describe("round-trip validation", () => {
  it("accepts complete docs and flags incomplete ones", () => {
    const good = treatmentToSanity(page);
    expect(validateDocs([good])).toEqual([]);
    const bad = { _id: "treatment.x", _type: "treatment", name: {}, slug: {} };
    expect(validateDocs([bad as never]).length).toBeGreaterThan(0);
  });
});

describe("fallback branches", () => {
  it("treatment without h1 falls back to title", () => {
    const doc = treatmentToSanity({
      url: "https://www.dentaliva.com/zirkonyum-kaplama/",
      title: "Zirkonyum Kaplama | Dentaliva",
      h1: "",
      paragraphs: ["Zirkonyum kaplamalar estetik ve dayanıklıdır."],
    });
    expect(doc.name).toEqual({ tr: "Zirkonyum Kaplama" });
  });

  it("treatment with a single paragraph reuses it as body", () => {
    const doc = treatmentToSanity({
      url: "https://www.dentaliva.com/dis-beyazlatma/",
      title: "x",
      h1: "Diş Beyazlatma",
      paragraphs: ["Beyazlatma tek seansda tamamlanabilir."],
    });
    expect(doc.summary).toEqual({ tr: "Beyazlatma tek seansda tamamlanabilir." });
    expect(doc.body).toEqual({ tr: "Beyazlatma tek seansda tamamlanabilir." });
  });

  it("doctor and branch fall back to title when h1 is empty", () => {
    const doctor = doctorToSanity({
      url: "https://www.dentaliva.com/dt-x/",
      title: "Dt. X | Dentaliva",
      h1: "",
      paragraphs: [],
    });
    expect(doctor.name).toBe("Dt. X");
    const branch = branchToSanity({
      url: "https://www.dentaliva.com/avcilar/",
      title: "Avcılar Şubesi",
      h1: "",
      paragraphs: [],
    });
    expect(branch.name).toBe("Avcılar Şubesi");
  });
});

describe("remaining edge paths", () => {
  it("treatment with no paragraphs keeps empty body", () => {
    const doc = treatmentToSanity({
      url: "https://www.dentaliva.com/bos-sayfa/",
      title: "Boş",
      h1: "Boş Sayfa",
      paragraphs: [],
    });
    expect(doc.body).toEqual({ tr: "" });
    expect(validateDocs([doc])).toEqual([]);
  });

  it("nap report is clean when every canonical value is present", () => {
    const report = buildNapReport([
      {
        url: "https://www.dentaliva.com/iletisim/",
        title: "İletişim",
        h1: "İletişim",
        paragraphs: [
          "Bizi arayın: +90 212 555 54 82",
          "WhatsApp: 905308405482",
          "Yazın: info@dentaliva.com",
        ],
      },
    ]);
    expect(report.missing).toEqual([]);
    expect(report.deviations).toEqual([]);
  });

  it("extracts phones in parenthesized format", () => {
    expect(extractPhones("Ara: (212) 555 54 82")).toEqual(["(212) 555 54 82"]);
  });
});

describe("phone normalization", () => {
  it("treats the whatsapp number as canonical", () => {
    expect(normalizePhone("905308405482")).toBe("5308405482");
    expect(normalizePhone("05308405482")).toBe("5308405482");
  });
});

describe("validator name-shape edge", () => {
  it("flags a name object without tr", () => {
    const errors = validateDocs([
      { _id: "treatment.x", _type: "treatment", name: {}, slug: { current: "x" } },
    ]);
    expect(errors).toEqual(["treatment.x: missing name"]);
  });
});

describe("CPT-1 junk filters and structured extras", () => {
  const junkPage: NormalizedPage = {
    url: "https://www.dentaliva.com/implant-tedavisi/",
    title: "İmplant Tedavisi | Dentaliva",
    h1: "İmplant Tedavisi",
    paragraphs: [
      "Hakkımızda İnsan Kaynakları Fotoğraf Galerisi",
      "Eksik dişlerin yerine titanyum implantlar yerleştirilir ve onlarca yıl sorunsuz kullanılır.",
      "## İmplant Tedavisi Uygulama Süreci",
      "### İmplantın çene kemiğine yerleştirilmesi",
      "### Protez üst yapının hazırlanması ve takılması",
      "© Copyright Dentaliva 2026 – Tüm hakları saklıdır.",
    ],
    blocks: [
      {
        type: "p",
        text: "Eksik dişlerin yerine titanyum implantlar yerleştirilir ve onlarca yıl sorunsuz kullanılır.",
      },
      { type: "h2", text: "İmplant Tedavisinin Diğer Diş Tedavilerinden Farkları" },
      {
        type: "li",
        text: "Kalıcı ve doğal dişe çok yakın bir sonuç sunması sayesinde çiğneme konforu kaybolmaz",
      },
      { type: "h2", text: "İmplant Tedavisi Uygulama Süreci" },
      { type: "h3", text: "İmplantın çene kemiğine yerleştirilmesi" },
      { type: "h3", text: "Protez üst yapının hazırlanması ve takılması" },
    ],
  };

  it("isJunkLine catches menu concatenations and footer lines", () => {
    expect(isJunkLine("Hakkımızda İnsan Kaynakları Fotoğraf Galerisi")).toBe(true);
    expect(isJunkLine("© Copyright Dentaliva 2026 – Tüm hakları saklıdır.")).toBe(true);
    expect(isJunkLine("Eksik dişlerin yerine titanyum implantlar yerleştirilir.")).toBe(false);
  });

  it("realSummary picks the first substantial non-heading line", () => {
    expect(realSummary(junkPage.paragraphs)).toContain("titanyum implantlar");
    expect(realSummary(["## Başlık", "Hakkımızda İnsan Kaynakları Fotoğraf Galerisi"])).toBe("");
  });

  it("maps benefits and steps from blocks and drops junk", () => {
    const doc = treatmentToSanity(junkPage);
    const summary = String((doc.summary as { tr?: string }).tr ?? "");
    expect(summary).toContain("titanyum implantlar");
    const body = JSON.stringify(doc.body);
    expect(body).not.toContain("Hakkımızda");
    expect(body).not.toContain("Copyright");
    const benefits = doc.benefits as Array<{ _key: string; tr: string }>;
    expect(benefits).toHaveLength(1);
    expect(benefits[0]?.tr).toContain("çiğneme konforu");
    const steps = doc.steps as Array<{ title: { tr: string }; _key: string }>;
    expect(steps).toHaveLength(2);
    expect(steps[0]?.title.tr).toContain("çene kemiğine");
  });

  it("keeps legacy normalized pages working (no blocks)", () => {
    const doc = treatmentToSanity(page);
    expect(doc.benefits).toBeUndefined();
    expect(doc.steps).toBeUndefined();
  });
});
