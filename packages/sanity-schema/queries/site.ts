import { defineQuery } from "groq";

/** Singleton dokümanlar ve site çapında veriler. */
export const siteSettingsQuery = defineQuery(`*[_type == "siteSettings"][0]`);

export const branchBySlugQuery = defineQuery(
  `*[_type == "branch" && slug.current == $slug][0]{
    name,
    "slug": slug.current,
    address,
    phone,
    hours,
    mapUrl,
    geo,
    image { "ref": asset._ref, alt },
    seo
  }`,
);

export const homePageQuery = defineQuery(`*[_type == "homePage"][0]{
  hero { ..., image { ..., alt, "lqip": asset->metadata.lqip } },
  quickServiceLinks[]->{ name, slug, summary },
  about { ..., image { ..., alt, "lqip": asset->metadata.lqip } },
  stats,
  gallery[]{ "asset": { "_ref": asset._ref }, "alt": alt, "lqip": asset->metadata.lqip },
  onceSonraGallery[]{ "asset": { "_ref": asset._ref }, "alt": alt, "lqip": asset->metadata.lqip },
  teamSection,
  cta
}`);
