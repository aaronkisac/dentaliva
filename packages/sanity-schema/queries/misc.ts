import { defineQuery } from "groq";

export const branchListQuery = defineQuery(
  // DSN-81: bayrak şube Başakşehir öne — slug üç sitede de "basaksehir"
  // (com/eu/nl aynı klinik ağı); sıra bir gün CMS alanına taşınırsa burası
  // düşer. name asc kalan sırayı kararlı tutar.
  `*[_type == "branch"] | order(slug.current == "basaksehir" desc, name asc){
    name,
    "slug": slug.current,
    address,
    phone,
    hours,
    mapUrl,
    geo,
    image { "ref": asset._ref, alt, "lqip": asset->metadata.lqip },
    // DSN-73: galeri Klinik Fotoğrafları kütüphanesine referans — []-> ile
    // öğe başına deref: {ref, alt, lqip, category} (BranchItem.gallery).
    "gallery": gallery[]->{ "ref": photo.asset._ref, "alt": photo.alt, "lqip": photo.asset->metadata.lqip, "category": category },
    seo
  }`,
);

export const faqListQuery = defineQuery(
  // DSN-56: hidden != true — alan unset/false olan dokümanlar geçer.
  `*[_type == "faq" && displayOnHome == true && hidden != true] | order(order asc){ question, answer }`,
);

export const testimonialListQuery = defineQuery(
  `*[_type == "testimonial" && rating >= 4 && hidden != true] | order(_createdAt desc){ author, quote, rating, source, youtubeId }`,
);

export const blogListQuery = defineQuery(
  `*[_type == "blogPost"] | order(publishedAt desc){
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    heroImage { "ref": asset._ref, alt, "lqip": asset->metadata.lqip }
  }`,
);

export const blogBySlugQuery = defineQuery(
  `*[_type == "blogPost" && slug.current == $slug][0]{
    title,
    "slug": slug.current,
    body,
    heroImage { ..., alt, "ref": asset._ref, "lqip": asset->metadata.lqip },
    publishedAt,
    author->{ name, slug, title, photo { "ref": asset._ref, alt } },
    seo
  }`,
);
