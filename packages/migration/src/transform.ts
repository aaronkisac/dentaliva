/**
 * Normalized crawler pages → Sanity documents (TR-only v1).
 * Conservative mapping: name/slug/summary/body only — structured extras
 * (benefits/steps/faqs) are curated manually at MIG-5 review.
 */

export interface NormalizedPage {
  url: string;
  title: string;
  h1: string;
  paragraphs: string[];
}

export interface SanityDoc {
  _id: string;
  _type: string;
  [key: string]: unknown;
}

function slugFromUrl(url: string): string {
  const segments = new URL(url).pathname.split("/").filter(Boolean);
  return segments[segments.length - 1] ?? "";
}

function docId(type: string, slug: string): string {
  return `${type}.${slug}`;
}

function cleanName(h1: string): string {
  return h1.replace(/\s*\|\s*Dentaliva.*$/i, "").trim();
}

/** h1 → title → slug-derived name chain (slugs yield readable interim names). */
export function nameFrom(page: NormalizedPage): string {
  const fromH1 = cleanName(page.h1);
  if (fromH1) return fromH1;
  const fromTitle = cleanName(page.title);
  if (fromTitle) return fromTitle;
  return slugFromUrl(page.url)
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function treatmentToSanity(page: NormalizedPage): SanityDoc {
  const slug = slugFromUrl(page.url);
  const name = nameFrom(page);
  const [summary, ...rest] = page.paragraphs.filter((p) => !p.startsWith("## "));
  const body = rest.join("\n\n") || summary || "";
  return {
    _id: docId("treatment", slug),
    _type: "treatment",
    name: { tr: name },
    slug: { _type: "slug", current: slug },
    summary: { tr: summary ?? name },
    body: { tr: body },
  };
}

export function doctorToSanity(page: NormalizedPage): SanityDoc {
  const slug = slugFromUrl(page.url);
  const name = nameFrom(page);
  return {
    _id: docId("doctor", slug),
    _type: "doctor",
    name,
    slug: { _type: "slug", current: slug },
  };
}

export function branchToSanity(page: NormalizedPage): SanityDoc {
  const slug = slugFromUrl(page.url);
  const name = nameFrom(page);
  return {
    _id: docId("branch", slug),
    _type: "branch",
    name,
    slug: { _type: "slug", current: slug },
  };
}

/** Known canonical NAP (live site wins; AGENTS.md documents the conflicts). */
export const CANONICAL_NAP = {
  phone: "+90 212 555 54 82",
  email: "info@dentaliva.com",
  whatsapp: "905308405482",
  hours: "Her gün 09:00 – 23:00",
} as const;

// Digit-boundary lookarounds keep 10-digit matches inside longer numbers.
const PHONE_PATTERN =
  /(?<!\d)(?:\+90[\s.-]?)?(?:0[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{2}[\s.-]?\d{2}(?!\d)/g;

export function extractPhones(text: string): string[] {
  return [...new Set(text.match(PHONE_PATTERN) ?? [])];
}

export function extractEmails(text: string): string[] {
  return [...new Set(text.match(/[\w.+-]+@[\w-]+\.[\w.]+/g) ?? [])];
}

/** Digits with country code and trunk prefix stripped, for NAP comparison. */
export function normalizePhone(phone: string): string {
  const digits = phone.replaceAll(/\D/g, "");
  return digits.replace(/^(90|0)/, "");
}

export interface NapDiff {
  canonical: typeof CANONICAL_NAP;
  found: { phones: string[]; emails: string[] };
  /** Canonical values missing from the crawled content. */
  missing: string[];
  /** Non-canonical values found in crawled content (deviations). */
  deviations: string[];
}

export function buildNapReport(pages: NormalizedPage[]): NapDiff {
  const allText = pages.map((p) => [...p.paragraphs, p.h1, p.title].join(" ")).join("\n");
  const phones = extractPhones(allText);
  const emails = extractEmails(allText);
  const canonicalDigits = new Set([
    normalizePhone(CANONICAL_NAP.phone),
    normalizePhone(CANONICAL_NAP.whatsapp),
  ]);
  const deviations = phones.filter((p) => !canonicalDigits.has(normalizePhone(p)));
  const missing: string[] = [];
  if (!phones.some((p) => canonicalDigits.has(normalizePhone(p)))) {
    missing.push(`phone: ${CANONICAL_NAP.phone}`);
  }
  if (!emails.includes(CANONICAL_NAP.email)) missing.push(`email: ${CANONICAL_NAP.email}`);
  return { canonical: CANONICAL_NAP, found: { phones, emails }, missing, deviations };
}

/** Round-trip guard: every doc must have _id, _type and a non-empty slug. */
export function validateDocs(docs: SanityDoc[]): string[] {
  const errors: string[] = [];
  for (const doc of docs) {
    if (!doc._id) errors.push(`${doc._type}: missing _id`);
    if (!doc._type) errors.push(`${doc._id}: missing _type`);
    const slug = doc.slug as { current?: string } | undefined;
    if (!slug?.current) errors.push(`${doc._id}: missing slug.current`);
    // name is a plain string (doctor/branch) or a localized object (treatment).
    const rawName: unknown = doc.name;
    let nameText = "";
    if (typeof rawName === "string") {
      nameText = rawName.trim();
    } else if (typeof rawName === "object" && rawName !== null && "tr" in rawName) {
      const tr: unknown = (rawName as { tr?: unknown }).tr;
      nameText = typeof tr === "string" ? tr.trim() : "";
    }
    if (!nameText) errors.push(`${doc._id}: missing name`);
  }
  return errors;
}
