import { describe, expect, it } from "vitest";

import {
  branchToSanity,
  normalizePhone,
  buildNapReport,
  doctorToSanity,
  extractEmails,
  extractPhones,
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
