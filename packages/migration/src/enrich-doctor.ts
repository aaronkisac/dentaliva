/**
 * CPT-2: parses the structured CV off a live doctor page (ünvan, eğitim,
 * deneyim, diller, sertifikalar, kurslar). Doctor pages have no <main>;
 * the CV lives in a labelled paragraph/list stack inside a text-area div.
 */
import * as cheerio from "cheerio";

const CV_LABELS = ["Ünvan", "Eğitim", "Deneyim", "Diller", "Sertifikalar", "Kurslar"] as const;

export interface DoctorCv {
  /** Ünvan value, e.g. "Diş Hekimi". */
  title: string;
  /** Formatted CV text: "Ünvan: …\n\nEğitim:\n- …" — ready for bio (localeText). */
  bioText: string;
  sections: Record<string, string[]>;
}

export function parseDoctorCv(html: string): DoctorCv {
  const $ = cheerio.load(html);
  const anchor = $("strong")
    .filter((_i, el) => /ünvan/i.test($(el).text()))
    .first();
  const container = anchor.length > 0 ? anchor.closest("div") : $("body");

  const sections: Record<string, string[]> = {};
  let current: string | null = null;
  container.find("p, li").each((_i, element) => {
    const tag = (element as { tagName: string }).tagName.toLowerCase();
    // CV lists are pasted as <li><p>text</p></li> — keep only the outermost.
    if (tag === "p" && $(element).parents("li").length > 0) return;
    const text = $(element).text().replace(/\s+/g, " ").trim();
    if (!text || text.length < 3) return;
    const strongText = $(element).children("strong").first().text().replace(/\s+/g, " ").trim();
    const label = CV_LABELS.find(
      (candidate) =>
        strongText.toLowerCase().startsWith(candidate.toLowerCase()) ||
        (tag === "p" && text.toLowerCase().startsWith(candidate.toLowerCase() + ":")),
    );
    if (label) {
      current = label;
      sections[current] = sections[current] ?? [];
      const value = text
        .replace(strongText, "")
        .replace(new RegExp(`^${label}\\s*:`, "i"), "")
        .trim();
      if (value.length > 2) sections[current]?.push(value);
      return;
    }
    if (current && tag === "li" && text.length > 3) sections[current]?.push(text);
    // Plain paragraphs under a section that are not list items (course lines
    // are sometimes <p>) — keep them too.
    else if (current && tag === "p" && text.length > 3) sections[current]?.push(text);
  });

  const title = (sections["Ünvan"]?.[0] ?? "").replace(/^:\s*/, "").trim();
  const body = CV_LABELS.filter((label) => (sections[label]?.length ?? 0) > 0)
    .map((label) =>
      label === "Ünvan"
        ? `Ünvan: ${title}`
        : `${label}:\n${(sections[label] ?? []).map((line) => `- ${line}`).join("\n")}`,
    )
    .join("\n\n");

  return { title, bioText: body, sections };
}
