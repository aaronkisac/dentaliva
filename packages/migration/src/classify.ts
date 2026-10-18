/** URL → content-type classification for dentaliva.com. */

export type ContentType = "treatment" | "doctor" | "branch" | "legal" | "core" | "blog" | "ignored";

const KNOWN_BRANCHES = ["avcilar", "basaksehir", "altunizade"];
const KNOWN_CORE: Record<"com" | "eu", string[]> = {
  com: [
    "hakkimizda",
    "iletisim",
    "fotograf-galerisi",
    "insan-kaynaklari",
    "hekimlerimiz",
    "hizmetlerimiz",
    "subelerimiz",
    "blog",
  ],
  eu: [
    "about-us",
    "contact",
    "image-gallery",
    "human-resources",
    "our-experts",
    "our-services",
    "branches",
    "blog",
  ],
};
const KNOWN_LEGAL = ["kvkk", "gizlilik-politikasi", "cerez-politikasi", "kvkk-aydinlatma-metni"];
const DOCTOR_PREFIX = /^(dr-dt|dr|dt)-/;

/** URL → content-type for a site's slug language (INT-10: com tr, eu en). */
export function classifyUrl(pathname: string, site: "com" | "eu" = "com"): ContentType {
  const segments = pathname.split("/").filter(Boolean);
  const last = segments[segments.length - 1];
  if (last === undefined) return "core"; // homepage

  if (segments[0] === "blog") {
    // /blog hub itself and hub pages are ignored; author/category too.
    if (segments.length === 1) return "ignored";
    if (segments[1] === "category" || segments[1] === "author") return "ignored";
    return "blog";
  }
  if (KNOWN_BRANCHES.includes(last)) return "branch";
  if (last.includes("kvkk") || KNOWN_LEGAL.includes(last)) return "legal";
  if (KNOWN_CORE[site].includes(last)) return "core";
  if (segments.length === 1) {
    return DOCTOR_PREFIX.test(last) ? "doctor" : "treatment";
  }
  return "ignored";
}
