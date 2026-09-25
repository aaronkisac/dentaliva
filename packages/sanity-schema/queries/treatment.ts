import { defineQuery } from "groq";

export const treatmentListQuery = defineQuery(
  `*[_type == "treatment"] | order(name.tr asc){
    name,
    "slug": slug.current,
    summary,
    heroImage
  }`,
);

export const treatmentBySlugQuery = defineQuery(
  `*[_type == "treatment" && slug.current == $slug][0]{
    name,
    "slug": slug.current,
    summary,
    body,
    heroImage { ..., alt },
    benefits,
    steps,
    priceNote,
    faqs->{ question, answer },
    doctors->{ name, slug, title, photo },
    seo
  }`,
);
