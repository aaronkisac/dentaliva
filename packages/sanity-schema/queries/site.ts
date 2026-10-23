import { defineQuery } from "groq";

/** Singleton dokümanlar ve site çapında veriler. */
export const siteSettingsQuery = defineQuery(`*[_type == "siteSettings"][0]`);

export const siteCopyQuery = defineQuery(`*[_type == "siteCopy"][0]{
  footer,
  sectionHeadings,
  faq,
  heroTrust,
  ui,
  navMenu[]{
    heading,
    headingPage->{ name, "slug": slug.current },
    treatments[]->{ name, "slug": slug.current }
  }
}`);

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
  quickServiceLinks[]->{ name, slug, summary, heroImage { "ref": asset._ref, alt, "lqip": asset->metadata.lqip } },
  about { ..., image { ..., alt, "lqip": asset->metadata.lqip } },
  stats,
  gallery[]{ "asset": { "_ref": asset._ref }, "alt": alt, "lqip": asset->metadata.lqip },
  onceSonraGallery[]{ "asset": { "_ref": asset._ref }, "alt": alt, "lqip": asset->metadata.lqip },
  // DSN-56: [@.hidden != true] — dizi öğesinde hidden unset/false ise geçer.
  onceSonraCases[@.hidden != true]{
    before { "ref": asset._ref, alt, "lqip": asset->metadata.lqip },
    after { "ref": asset._ref, alt, "lqip": asset->metadata.lqip },
    title,
    text,
    treatment->{ name, "slug": slug.current }
  },
  teamSection,
  cta,
  hiddenSections
}`);
