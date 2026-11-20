import { describe, expect, it } from "vitest";

import {
  buildBlogPostingJsonLd,
  buildBreadcrumbJsonLd,
  buildDentistJsonLd,
  buildFaqJsonLd,
  buildPhysicianJsonLd,
} from "../src/jsonld";

const fullInput = {
  name: "Dentaliva",
  url: "https://www.dentaliva.com",
  logoUrl: "https://cdn.sanity.io/logo.png",
  phone: "+90 212 555 54 82",
  email: "info@dentaliva.com",
  streetAddress: "Avcılar",
  city: "İstanbul",
  country: "TR",
  openingHours: "Mo-Su 09:00-23:00",
  priceRange: "₺₺",
  geo: { lat: 40.98, lng: 28.72 },
  sameAs: ["https://instagram.com/dentaliva"],
};

describe("buildDentistJsonLd", () => {
  it("builds a Dentist entity with every optional field", () => {
    const ld = buildDentistJsonLd(fullInput);
    expect(ld["@context"]).toBe("https://schema.org");
    expect(ld["@type"]).toBe("Dentist");
    expect(ld.name).toBe("Dentaliva");
    expect(ld.telephone).toBe("+90 212 555 54 82");
    expect(ld.email).toBe("info@dentaliva.com");
    expect(ld.logo).toBe("https://cdn.sanity.io/logo.png");
    expect(ld.openingHours).toBe("Mo-Su 09:00-23:00");
    expect(ld.priceRange).toBe("₺₺");
    expect(ld.sameAs).toEqual(["https://instagram.com/dentaliva"]);
    const geo = ld.geo as { latitude: number; longitude: number };
    expect(geo.latitude).toBe(40.98);
    expect(geo.longitude).toBe(28.72);
    const address = ld.address as { streetAddress: string; addressCountry: string };
    expect(address.streetAddress).toBe("Avcılar");
    expect(address.addressCountry).toBe("TR");
  });

  it("builds a minimal entity when optional fields are absent", () => {
    const ld = buildDentistJsonLd({
      name: "Dentaliva",
      url: "https://www.dentaliva.com",
      phone: "+90",
      streetAddress: "Avcılar",
      city: "İstanbul",
    });
    expect(ld.telephone).toBe("+90");
    expect("logo" in ld).toBe(false);
    expect("email" in ld).toBe(false);
    expect("geo" in ld).toBe(false);
    expect("openingHours" in ld).toBe(false);
    expect("priceRange" in ld).toBe(false);
    expect("sameAs" in ld).toBe(false);
  });
});

describe("buildBreadcrumbJsonLd", () => {
  it("numbers items from 1", () => {
    const ld = buildBreadcrumbJsonLd([
      { name: "Ana Sayfa", url: "https://www.dentaliva.com" },
      { name: "Hizmetlerimiz", url: "https://www.dentaliva.com/hizmetlerimiz" },
    ]) as unknown as {
      "@type": string;
      itemListElement: Array<{ position: number; item: string; name: string }>;
    };
    expect(ld["@type"]).toBe("BreadcrumbList");
    expect(ld.itemListElement).toHaveLength(2);
    expect(ld.itemListElement[0]).toMatchObject({ position: 1, name: "Ana Sayfa" });
    expect(ld.itemListElement[1]).toMatchObject({ position: 2, name: "Hizmetlerimiz" });
  });
});

describe("buildFaqJsonLd", () => {
  it("builds Q/A pairs", () => {
    const ld = buildFaqJsonLd([
      { question: "İmplant ağrılı mı?", answer: "Lokal anestezi ile ağrısızdır." },
    ]) as unknown as {
      "@type": string;
      mainEntity: Array<{
        "@type": string;
        name: string;
        acceptedAnswer: { "@type": string; text: string };
      }>;
    };
    expect(ld["@type"]).toBe("FAQPage");
    expect(ld.mainEntity[0]).toMatchObject({ "@type": "Question", name: "İmplant ağrılı mı?" });
    expect(ld.mainEntity[0]?.acceptedAnswer.text).toContain("Lokal anestezi");
  });
});

describe("buildPhysicianJsonLd (DSN-101)", () => {
  it("builds a Physician with photo, title and organization", () => {
    const ld = buildPhysicianJsonLd({
      name: "Dt. Emel Özdemir",
      url: "https://www.dentaliva.com/hekimlerimiz/emel",
      imageUrl: "https://cdn.sanity.io/portre.jpg",
      jobTitle: "Periodontolog",
      organizationName: "Dentaliva",
      organizationUrl: "https://www.dentaliva.com",
    });
    expect(ld["@type"]).toBe("Physician");
    expect(ld.image).toBe("https://cdn.sanity.io/portre.jpg");
    expect(ld.jobTitle).toBe("Periodontolog");
    expect(ld.worksFor).toMatchObject({ "@type": "Dentist", name: "Dentaliva" });
  });

  it("omits optional fields and worksFor when absent", () => {
    const ld = buildPhysicianJsonLd({
      name: "Dt. Ayşe",
      url: "https://www.dentaliva.com/hekimlerimiz/ayse",
    });
    expect(ld.image).toBeUndefined();
    expect(ld.jobTitle).toBeUndefined();
    expect(ld.worksFor).toBeUndefined();
  });

  it("builds worksFor without an organization url (DSN-101)", () => {
    const ld = buildPhysicianJsonLd({
      name: "Dt. Ayşe",
      url: "https://www.dentaliva.com/hekimlerimiz/ayse",
      organizationName: "Dentaliva",
    });
    expect(ld.worksFor).toMatchObject({ "@type": "Dentist", name: "Dentaliva" });
  });
});

describe("buildBlogPostingJsonLd (DSN-101)", () => {
  it("builds a BlogPosting with image, dates and author", () => {
    const ld = buildBlogPostingJsonLd({
      headline: "İmplant mı köprü mü?",
      url: "https://www.dentaliva.com/blog/implant-mi-kopru-mu",
      imageUrl: "https://cdn.sanity.io/kapak.jpg",
      datePublished: "2026-09-01T09:00:00Z",
      authorName: "Dt. Emel Özdemir",
    });
    expect(ld["@type"]).toBe("BlogPosting");
    expect(ld.image).toEqual(["https://cdn.sanity.io/kapak.jpg"]);
    expect(ld.datePublished).toBe("2026-09-01T09:00:00Z");
    expect(ld.author).toMatchObject({ "@type": "Person", name: "Dt. Emel Özdemir" });
  });

  it("emits dateModified when provided (DSN-101)", () => {
    const ld = buildBlogPostingJsonLd({
      headline: "Güncellendi",
      url: "https://www.dentaliva.com/blog/x",
      dateModified: "2026-10-01T09:00:00Z",
    });
    expect(ld.dateModified).toBe("2026-10-01T09:00:00Z");
    expect(ld.datePublished).toBeUndefined();
  });

  it("omits image/dates/author when absent", () => {
    const ld = buildBlogPostingJsonLd({
      headline: "Başlık",
      url: "https://www.dentaliva.com/blog/x",
    });
    expect(ld.image).toBeUndefined();
    expect(ld.datePublished).toBeUndefined();
    expect(ld.author).toBeUndefined();
  });
});
