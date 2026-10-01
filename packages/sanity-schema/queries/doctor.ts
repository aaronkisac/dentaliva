import { defineQuery } from "groq";

export const doctorListQuery = defineQuery(
  `*[_type == "doctor"] | order(name asc){
    name,
    "slug": slug.current,
    title,
    photo { "ref": asset._ref, alt },
    "lqip": photo.asset->metadata.lqip
  }`,
);

export const doctorBySlugQuery = defineQuery(
  `*[_type == "doctor" && slug.current == $slug][0]{
    name,
    "slug": slug.current,
    title,
    photo { ..., alt, "ref": asset._ref },
    bio,
    seo,
    "treatments": treatments[]->{ name, slug }
  }`,
);
