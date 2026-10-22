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
    // DSN-56: hidden FAQ'lar tedavi sayfasından da düşer. Referans hedefindeki
    // alan için filtre deref sonrası uygulanır; GROQ'un proj-filtre birleşimi
    // (koseli + ok + koseli, parantezsiz) filtreyi deref içine alıp tüm
    // öğeleri null yapıyor — bileşik parantezli form doğru (canlı API doğrulu).
    "faqs": (faqs[]->{ question, answer, hidden })[@.hidden != true]{ question, answer },
    doctors[]->{ name, slug, title, photo { "ref": asset._ref, alt } },
    seo
  }`,
);
