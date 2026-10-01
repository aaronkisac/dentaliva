import { defineQuery } from "groq";

export const branchListQuery = defineQuery(
  `*[_type == "branch"] | order(name asc){
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

export const faqListQuery = defineQuery(
  `*[_type == "faq" && displayOnHome == true] | order(order asc){ question, answer }`,
);

export const testimonialListQuery = defineQuery(
  `*[_type == "testimonial" && rating >= 4] | order(_createdAt desc){ author, quote, rating, source, youtubeId }`,
);

export const blogListQuery = defineQuery(
  `*[_type == "blogPost"] | order(publishedAt desc){
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    heroImage
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
