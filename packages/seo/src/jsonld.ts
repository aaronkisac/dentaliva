/** JSON-LD structured data builders (schema.org). Pure + fully tested. */

export interface LocalBusinessInput {
  name: string;
  url: string;
  logoUrl?: string;
  phone: string;
  email?: string;
  streetAddress: string;
  city: string;
  country?: string;
  openingHours?: string;
  priceRange?: string;
  geo?: { lat?: number; lng?: number };
  sameAs?: string[];
}

/** Dentist/MedicalClinic entity from siteSettings data. */
export function buildDentistJsonLd(input: LocalBusinessInput): Record<string, unknown> {
  const geo =
    input.geo?.lat !== undefined && input.geo?.lng !== undefined
      ? { "@type": "GeoCoordinates", latitude: input.geo.lat, longitude: input.geo.lng }
      : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: input.name,
    url: input.url,
    ...(input.logoUrl ? { logo: input.logoUrl } : {}),
    telephone: input.phone,
    ...(input.email ? { email: input.email } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: input.streetAddress,
      addressLocality: input.city,
      addressCountry: input.country ?? "TR",
    },
    ...(geo ? { geo } : {}),
    ...(input.openingHours ? { openingHours: input.openingHours } : {}),
    ...(input.priceRange ? { priceRange: input.priceRange } : {}),
    ...(input.sameAs && input.sameAs.length > 0 ? { sameAs: input.sameAs } : {}),
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/** BreadcrumbList from the rendered section trail (first = root). */
export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export interface FaqJsonLdItem {
  question: string;
  answer: string;
}

/** FAQPage from rendered FAQ entries (empty entries dropped by caller). */
export function buildFaqJsonLd(items: FaqJsonLdItem[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
