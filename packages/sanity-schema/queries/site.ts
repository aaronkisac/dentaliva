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
    "gallery": gallery[]{ "ref": asset._ref, alt, "lqip": asset->metadata.lqip },
    seo
  }`,
);

export const homePageQuery = defineQuery(`*[_type == "homePage"][0]{
  hero { ..., image { ..., alt, "lqip": asset->metadata.lqip } },
  quickServiceLinks[]->{ name, slug, summary, heroImage { "ref": asset._ref, alt, "lqip": asset->metadata.lqip } },
  trustStrip { rating, ratingLabel, items },
  treatmentPaths[]{
    headline,
    subline,
    image { "ref": asset._ref, alt, "lqip": asset->metadata.lqip },
    treatment->{ name, "slug": slug.current }
  },
  reviewForm { steps },
  howItWorks { steps },
  decisionModules[@.hidden != true]{
    eyebrow,
    heading,
    body,
    image { "ref": asset._ref, alt, "lqip": asset->metadata.lqip },
    youtubeId,
    options[]{ title, text, treatment->{ name, "slug": slug.current } },
    ctaTreatment->{ name, "slug": slug.current }
  },
  travelStay { checklist },
  aftercare { normal, urgent, contactNote },
  about { ..., image { ..., alt, "lqip": asset->metadata.lqip } },
  stats,
  gallery[]{ "asset": { "_ref": asset._ref }, "alt": alt, "lqip": asset->metadata.lqip },
  homeGallery[]{ "asset": { "_ref": asset._ref }, "alt": alt, "lqip": asset->metadata.lqip },
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
