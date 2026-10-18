/**
 * Normalized crawler pages → Sanity documents (TR-only v1).
 * CPT-1: summaries come from the first real paragraph, and structured
 * `benefits[]`/`steps[]` are mapped from the H2 sections the live pages
 * already have (avantaj/fark lists, uygulama süreci sub-steps).
 */
import { isJunkLine, type ContentBlock } from "./extract.ts";

export interface NormalizedPage {
  url: string;
  title: string;
  h1: string;
  /** Flat lines with `## `/`### ` heading markers. */
  paragraphs: string[];
  /** Typed blocks from the v2 crawler; absent in legacy normalized files. */
  blocks?: ContentBlock[];
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
/** INT-10: which localeText slot the source copy fills (com tr, eu en). */
export type MigrateLocale = "tr" | "en";

/** H2 heading patterns for structured extras, per source language. */
const HEADING_PATTERNS: Record<MigrateLocale, { benefits: RegExp; process: RegExp }> = {
  tr: { benefits: /avantaj|fark/i, process: /uygulama süreci|süreç/i },
  en: { benefits: /advantage|benefit/i, process: /procedure|process|how (is|are)/i },
};

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

/** First substantial, non-junk, non-heading line — the treatment summary. */
export function realSummary(lines: string[]): string {
  return (
    lines.find((line) => !line.startsWith("#") && !isJunkLine(line) && line.length >= 80) ?? ""
  );
}

/** Lines after `headingPattern`'s H2/H3 until the next heading. */
export function sectionLines(blocks: ContentBlock[], headingPattern: RegExp): string[] {
  const start = blocks.findIndex((block) => block.type === "h2" && headingPattern.test(block.text));
  if (start === -1) return [];
  const lines: string[] = [];
  for (const block of blocks.slice(start + 1)) {
    if (block.type === "h2") break;
    if (block.type === "h3" || block.type === "p" || block.type === "li") lines.push(block.text);
  }
  return lines;
}

export function treatmentToSanity(page: NormalizedPage, locale: MigrateLocale = "tr"): SanityDoc {
  const slug = slugFromUrl(page.url);
  const name = nameFrom(page);
  const nonHeading = page.paragraphs.filter((p) => !p.startsWith("#"));
  const summary =
    realSummary(page.paragraphs) || nonHeading.find((line) => !isJunkLine(line)) || name;
  const cleanedBody = nonHeading
    .filter((line) => !isJunkLine(line) && line !== summary)
    .join("\n\n");
  // Legacy single-paragraph pages reused the paragraph as the body too —
  // but a page with no paragraphs keeps an empty body.
  const body = cleanedBody || (nonHeading.length > 0 && !isJunkLine(summary) ? summary : "");

  // Structured extras from the H2 sections (CPT-1); absent in legacy input.
  const blocks = page.blocks ?? [];
  const headings = HEADING_PATTERNS[locale];
  const benefits = sectionLines(blocks, headings.benefits).filter(
    (line) => line.length >= 25 && line.length <= 140 && !isJunkLine(line),
  );
  const steps: Array<{
    title: Record<string, string>;
    description: Record<string, string>;
    _key: string;
  }> = [];
  const processStart = blocks.findIndex(
    (block) => block.type === "h2" && headings.process.test(block.text),
  );
  if (processStart !== -1) {
    for (const block of blocks.slice(processStart + 1)) {
      if (block.type === "h2") break;
      if (block.type === "h3") {
        steps.push({
          title: { [locale]: block.text },
          description: { [locale]: "" },
          _key: `step${steps.length}`,
        });
      }
    }
  }

  return {
    _id: docId("treatment", slug),
    _type: "treatment",
    name: { [locale]: name },
    slug: { _type: "slug", current: slug },
    summary: { [locale]: summary },
    body: { [locale]: body },
    ...(benefits.length > 0
      ? { benefits: benefits.map((text, index) => ({ _key: `ben${index}`, [locale]: text })) }
      : {}),
    ...(steps.length > 0 ? { steps } : {}),
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
export function validateDocs(docs: SanityDoc[], locale: MigrateLocale = "tr"): string[] {
  const errors: string[] = [];
  for (const doc of docs) {
    if (!doc._id) errors.push(`${doc._type}: missing _id`);
    if (!doc._type) errors.push(`${doc._id}: missing _type`);
    const slug = doc.slug as { current?: string } | undefined;
    if (!slug?.current) errors.push(`${doc._id}: missing slug.current`);
    // name is a plain string (doctor/branch) or a localized object (treatment);
    // the localized slot checked is the migration locale (INT-10).
    const rawName: unknown = doc.name;
    let nameText = "";
    if (typeof rawName === "string") {
      nameText = rawName.trim();
    } else if (typeof rawName === "object" && rawName !== null && locale in rawName) {
      const value: unknown = (rawName as Record<string, unknown>)[locale];
      nameText = typeof value === "string" ? value.trim() : "";
    }
    if (!nameText) errors.push(`${doc._id}: missing name`);
  }
  return errors;
}
