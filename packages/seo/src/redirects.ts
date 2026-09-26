/** Cloudflare-style _redirects file builder (SEO-4). */

export interface RedirectEntry {
  from: string;
  to: string;
  permanent?: boolean;
}

export function buildRedirects(entries: RedirectEntry[]): string {
  return entries
    .map((entry) => {
      const code = entry.permanent === false ? "302" : "301";
      return `${entry.from}  ${entry.to}  ${code}`;
    })
    .join("\n")
    .concat(entries.length > 0 ? "\n" : "");
}
