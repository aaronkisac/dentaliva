import * as cheerio from "cheerio";

/**
 * CPT-1: content extraction scoped to the page's main container.
 *
 * The original crawler harvested h1-h3/p/li from the whole document, so
 * Elementor's desktop + mobile + footer menus leaked into every body
 * ("Hakkımızda İnsan Kaynakları Fotoğraf Galerisi" became every summary).
 * WordPress/Elementor wraps real page content in <main> (verified against
 * live treatment and blog pages) — scoping to it removes nav, footer,
 * related-post widgets and popup forms in one step.
 */

export interface ContentBlock {
  type: "h2" | "h3" | "p" | "li";
  text: string;
}

export interface ExtractedPage {
  title: string;
  h1: string;
  /** Structured content in document order. */
  blocks: ContentBlock[];
  /**
   * Flat lines with `## `/`### ` heading markers — the shape the transform
   * layer has always consumed.
   */
  paragraphs: string[];
}

/** Minimum text length: headings are short by nature; body copy must be substantial. */
const MIN_LENGTH: Record<ContentBlock["type"], number> = { h2: 8, h3: 8, p: 40, li: 25 };

/** Lines that are pure navigation/footer chrome, even if they leak into main. */
const JUNK_PATTERNS: RegExp[] = [
  /^© /i,
  /tüm hakları saklıdır/i,
  /dentaliva studio/i,
  /tüm günler\s*\|\s*9[.:]00/i,
  /^anasayfa\s*»/,
];

/**
 * A line made up entirely of known navigation tokens (menu items concatenated
 * by Elementor's mobile `<li>` wrappers) is junk even when it is long.
 */
const NAV_TOKENS = [
  "anasayfa",
  "hakkımızda",
  "insan kaynakları",
  "fotoğraf galerisi",
  "hizmetlerimiz",
  "hekimlerimiz",
  "şubelerimiz",
  "avcılar",
  "başakşehir",
  "altunizade",
  "blog",
  "iletişim",
  "kvkk",
];

export function isJunkLine(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return true;
  if (JUNK_PATTERNS.some((pattern) => pattern.test(trimmed))) return true;
  // toLocaleLowerCase("tr"): Turkish İ lowercases to plain i (no combining dot).
  const remainder = trimmed
    .toLocaleLowerCase("tr")
    .replace(/\u0307/g, "")
    .replace(/[»|]/g, " ")
    .replace(/\s+/g, " ");
  let rest = remainder;
  for (const token of NAV_TOKENS) {
    rest = rest.replace(new RegExp(`(^| )${token}( |$)`, "g"), " ");
  }
  return rest.replace(/\s+/g, " ").trim().length === 0;
}

function textOf($: cheerio.CheerioAPI, selector: string): string {
  return $(selector).first().text().replace(/\s+/g, " ").trim();
}

/** Extracts main content from a WordPress/Elementor page. */
export function extractPage(html: string): ExtractedPage {
  const $ = cheerio.load(html);
  const scope = $("main").length > 0 ? "main" : $("article").length > 0 ? "article" : "";
  const selector = scope ? `${scope} h2, ${scope} h3, ${scope} p, ${scope} li` : "h2, h3, p, li";
  const blocks: ContentBlock[] = [];

  $(selector).each((_i, element) => {
    const tag = (element as { tagName: string }).tagName.toLowerCase() as ContentBlock["type"];
    const text = $(element).text().replace(/\s+/g, " ").trim();
    if (text.length < MIN_LENGTH[tag]) return;
    // Nested <li>: keep only the outermost item (children duplicate the parent).
    if (tag === "li" && $(element).parents("li").length > 0) return;
    if (tag === "p" && isJunkLine(text)) return;
    if (tag === "li" && isJunkLine(text)) return;
    blocks.push({ type: tag, text });
  });

  const paragraphs = blocks.map((block) =>
    block.type === "h2"
      ? `## ${block.text}`
      : block.type === "h3"
        ? `### ${block.text}`
        : block.text,
  );

  return {
    title: $("title").first().text().replace(/\s+/g, " ").trim(),
    h1: textOf($, "h1"),
    blocks,
    paragraphs,
  };
}
