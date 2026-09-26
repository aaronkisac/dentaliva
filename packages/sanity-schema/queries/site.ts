import { defineQuery } from "groq";

/** Singleton dokümanlar ve site çapında veriler. */
export const siteSettingsQuery = defineQuery(`*[_type == "siteSettings"][0]`);

export const homePageQuery = defineQuery(`*[_type == "homePage"][0]{
  hero { ..., image { ..., alt } },
  quickServiceLinks->{ name, slug, summary },
  about { ..., image { ..., alt } },
  stats,
  gallery[]{ "asset": { "_ref": asset._ref }, "alt": alt },
  cta
}`);
