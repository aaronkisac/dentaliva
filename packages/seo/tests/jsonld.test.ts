import { describe, expect, it } from "vitest";

import { buildBreadcrumbJsonLd, buildDentistJsonLd, buildFaqJsonLd } from "../src/jsonld";

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
