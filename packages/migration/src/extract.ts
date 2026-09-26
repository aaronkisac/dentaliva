import * as cheerio from "cheerio";

export interface ExtractedPage {
  title: string;
  h1: string;
  paragraphs: string[];
}

function textOf($: cheerio.CheerioAPI, selector: string): string {
  return $(selector).first().text().replace(/\s+/g, " ").trim();
}

/** Extracts main content from a WordPress/Elementor page. */
export function extractPage(html: string): ExtractedPage {
  const $ = cheerio.load(html);
  const paragraphs: string[] = [];

  $("h1, h2, h3, p, li").each((_i, element) => {
    const tag = (element as { tagName: string }).tagName.toLowerCase();
    const text = $(element).text().replace(/\s+/g, " ").trim();
    // Headings are short by nature; body copy must be substantial.
    const minLength = tag === "h2" || tag === "h3" ? 8 : 40;
    if (text.length < minLength) return;
    if (tag === "h2" || tag === "h3") {
      paragraphs.push(`## ${text}`);
    } else {
      paragraphs.push(text);
    }
  });

  return {
    title: $("title").first().text().replace(/\s+/g, " ").trim(),
    h1: textOf($, "h1"),
    paragraphs,
  };
}
