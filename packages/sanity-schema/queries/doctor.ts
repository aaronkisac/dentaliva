import { defineQuery } from "groq";

export const doctorListQuery = defineQuery(
  `*[_type == "doctor"] | order(name asc){
    name,
    "slug": slug.current,
    title,
    photo
  }`,
);

export const doctorBySlugQuery = defineQuery(
  `*[_type == "doctor" && slug.current == $slug][0]{
    name,
    "slug": slug.current,
    title,
    photo { ..., alt },
    bio,
    "treatments": treatments->{ name, slug }
  }`,
);
