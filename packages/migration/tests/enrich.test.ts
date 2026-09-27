import { describe, expect, it } from "vitest";

import { parseBranchNap } from "../src/enrich-branch";
import { parseDoctorCv } from "../src/enrich-doctor";

const doctorHtml = `
<html><body><div class="row"><div class="col-md-8"><div class="text-area">
<p><strong>Ünvan:&nbsp; </strong>Diş Hekimi</p>
<p><strong>Eğitim:<br></strong></p>
<ul>
<li><p>Yeditepe Üniversitesi Diş Hekimliği Fakültesi (2019–2024)</p></li>
<li><p>Yaşar Acar Fen Lisesi (2015–2019)</p></li>
</ul>
<p><strong>Deneyim:</strong></p>
<ul><li><p>Dentaliva Ağız ve Diş Sağlığı Polikliniği</p></li></ul>
<p><strong>Diller:</strong></p>
<ul><li><p>Türkçe (Ana Dil)</p></li><li><p>İngilizce (B2)</p></li></ul>
</div></div></div></body></html>`;

const branchHtml = `
<html><body>
<a href="tel:+902125555482"><span>Telefon</span></a>
<a href="tel:+905308405482">WhatsApp</a>
<a href="https://www.google.com/maps/place/Dentaliva+Avcilar/@40.9790000,28.7210000,17z/data=!4m5">Yol Tarifi</a>
<div>Çalışma Günleri &amp; Saatleri Tüm Günler | 9:00 - 23:00 (0212) 555 54 82 info@dentaliva.com</div>
<div>Üniversite Mahallesi Londra Asfaltı E5 Yanyol Çimli Sokak No:24Avcılar/İstanbul</div>
</body></html>`;

describe("parseDoctorCv (CPT-2)", () => {
  const cv = parseDoctorCv(doctorHtml);

  it("extracts the ünvan", () => {
    expect(cv.title).toBe("Diş Hekimi");
  });

  it("collects CV sections without li>p duplicates", () => {
    expect(cv.sections["Eğitim"]).toHaveLength(2);
    expect(cv.sections["Eğitim"]?.[0]).toContain("Yeditepe");
    expect(cv.sections["Diller"]).toHaveLength(2);
  });

  it("formats the bio with labelled bullet sections", () => {
    expect(cv.bioText).toMatch(/^Ünvan: Diş Hekimi\n\nEğitim:\n- Yeditepe/);
    expect(cv.bioText).toContain("Deneyim:\n- Dentaliva");
    expect(cv.bioText).not.toContain("- -");
  });
});

describe("parseBranchNap (CPT-2)", () => {
  const nap = parseBranchNap(branchHtml, "Avcılar");

  it("prefers the canonical phone among all tel: hrefs", () => {
    expect(nap.phones).toHaveLength(2);
    expect(nap.phone).toBe("+902125555482");
  });

  it("parses coordinates embedded in the maps place URL", () => {
    expect(nap.mapUrl).toContain("google.com/maps/place");
    expect(nap.geo).toEqual({ lat: 40.979, lng: 28.721 });
  });

  it("extracts hours and a cleaned address", () => {
    expect(nap.hours).toBe("Tüm Günler | 9:00 - 23:00");
    expect(nap.address).toBe(
      "Üniversite Mahallesi Londra Asfaltı E5 Yanyol Çimli Sokak No:24 Avcılar/İstanbul",
    );
  });
});
