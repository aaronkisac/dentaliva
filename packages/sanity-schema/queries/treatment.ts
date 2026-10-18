import { defineQuery } from "groq";

// Sorting is locale-driven and happens in app code (fetchTreatments, JS
// Collator) — a GROQ order() here would hardcode one language.
export const treatmentListQuery = defineQuery(
  `*[_type == "treatment"]{
    name,
    "slug": slug.current,
    summary,
    heroImage { "ref": asset._ref, alt, "lqip": asset->metadata.lqip }
  }`,
);

export const treatmentBySlugQuery = defineQuery(
  `*[_type == "treatment" && slug.current == $slug][0]{
    name,
    "slug": slug.current,
    summary,
    body,
    heroImage { ..., alt, "ref": asset._ref, "lqip": asset->metadata.lqip },
    benefits,
    steps,
    priceNote,
    faqs[]->{ question, answer },
    doctors[]->{ name, slug, title, photo { "ref": asset._ref, alt } },
    seo
  }`,
);
