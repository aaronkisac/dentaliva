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

/** DSN-101: hekim detay sayfası için Physician varlığı. */
export interface PhysicianInput {
  name: string;
  url: string;
  /** Prebuilt absolute image URL; omitted → alan çıkmaz. */
  imageUrl?: string;
  /** Unvan (ör. "Periodontolog"); omitted → alan çıkmaz. */
  jobTitle?: string;
  /** Kurum adı (worksFor). */
  organizationName?: string;
  organizationUrl?: string;
}

/** Physician entity from doctor profile data (local pack + rich results). */
export function buildPhysicianJsonLd(input: PhysicianInput): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: input.name,
    url: input.url,
    ...(input.imageUrl ? { image: input.imageUrl } : {}),
    ...(input.jobTitle ? { jobTitle: input.jobTitle } : {}),
    ...(input.organizationName
      ? {
          worksFor: {
            "@type": "Dentist",
            name: input.organizationName,
            ...(input.organizationUrl ? { url: input.organizationUrl } : {}),
          },
        }
      : {}),
  };
}

/** DSN-101: blog detay sayfası için BlogPosting varlığı. */
export interface BlogPostingInput {
  headline: string;
  url: string;
  /** Prebuilt absolute image URL; omitted → alan çıkmaz. */
  imageUrl?: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
}

/** BlogPosting entity from post data (article rich results). */
export function buildBlogPostingJsonLd(input: BlogPostingInput): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.headline,
    url: input.url,
    ...(input.imageUrl ? { image: [input.imageUrl] } : {}),
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    ...(input.authorName ? { author: { "@type": "Person", name: input.authorName } } : {}),
  };
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
