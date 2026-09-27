/**
 * CPT-2: parses NAP + map signals off a live branch page. Branch pages are
 * free-form Elementor layouts without <main>; extraction targets concrete
 * signals: tel: hrefs, Google Maps place links (coordinates are embedded in
 * the place path), the "Çalışma Günleri & Saatleri" block, and a
 * "Mahallesi … İstanbul" address sentence.
 */
import * as cheerio from "cheerio";

export interface BranchNap {
  /** Every tel: number found, e.g. ["+902125555482", "+905308405482"]. */
  phones: string[];
  /** Canonical site phone when present, else the first number found. */
  phone: string;
  hours: string;
  address: string;
  mapUrl: string;
  geo?: { lat: number; lng: number };
}

const CANONICAL_DIGITS = "902125555482";

export function parseBranchNap(html: string, hint?: string): BranchNap {
  const $ = cheerio.load(html);
  const bodyText = $("body").text().replace(/\s+/g, " ");

  const phones = [
    ...new Set(
      $("a[href^='tel:']")
        .map((_i, el) => $(el).attr("href")?.replace(/^tel:/, "") ?? "")
        .get()
        .filter((value) => value.length >= 10),
    ),
  ];
  const canonical = phones.find((phone) => phone.replace(/\D/g, "") === CANONICAL_DIGITS);

  // The original site embeds the Başakşehir map on EVERY branch page — only
  // trust a maps link whose place name matches this branch's hint. Both sides
  // are ASCII-folded so "Avcılar" matches "Avcilar".
  const fold = (value: string) =>
    value
      .toLocaleLowerCase("tr")
      .replaceAll(
        /[çığöşü]/g,
        (char) => ({ ç: "c", ı: "i", ğ: "g", ö: "o", ş: "s", ü: "u" })[char] ?? char,
      );
  const placeOf = (href: string) =>
    fold(decodeURIComponent((href.match(/place\/([^/@]+)/)?.[1] ?? "").replace(/\+/g, " ")));
  const mapUrl = hint
    ? ($("a[href*='google.com/maps']")
        .toArray()
        .map((el) => $(el).attr("href") ?? "")
        .find((href) => placeOf(href).includes(fold(hint))) ?? "")
    : "";
  const coords = mapUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  const geo = coords ? { lat: Number(coords[1]), lng: Number(coords[2]) } : undefined;

  const hoursMatch = bodyText.match(/Çalışma Günleri & Saatleri\s*(.{5,90})/);
  const hours = ((hoursMatch?.[1] ?? "").split(/\(\d{3,4}\)|info@/)[0] ?? "")
    .replace(/\s+/g, " ")
    .trim();

  const addressMatch =
    bodyText.match(/[A-ZÇĞİÖŞÜ][a-zçğıöşü]+ Mahallesi[^<>]{5,140}?İstanbul/) ??
    bodyText.match(/(?:Lokasyon|Adres)\s+[^<>]{2,60}?([A-ZÇĞİÖŞÜ][^<>]{10,140}?İstanbul)/);
  const address = (addressMatch?.[1] ?? addressMatch?.[0] ?? "")
    .replace(/(\d)([A-ZÇĞİÖŞÜ])/g, "$1 $2")
    .trim();

  return {
    phones,
    phone: canonical ?? phones[0] ?? "",
    hours,
    address,
    mapUrl,
    ...(geo ? { geo } : {}),
  };
}
