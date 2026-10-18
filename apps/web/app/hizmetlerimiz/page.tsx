import type { Metadata } from "next";

import { Reveal, Section, Text } from "@dentaliva/ui";
import { PageHero } from "../../components/page-hero";
import { TreatmentCard } from "../../components/treatment-card";

import { fetchTreatments } from "../../src/content/treatments";
import { readClient } from "../../src/sanity";
import { pageMetadata } from "../../src/seo";
import { pageString } from "../../src/page-strings";
import { routes } from "../../src/routes";

export const metadata: Metadata = pageMetadata({
  path: routes.treatments,
  title: pageString("servicesTitle"),
  description: "Dentaliva tedavileri",
});

export default async function TreatmentsPage() {
  const treatments = await fetchTreatments(readClient);

  return (
    <>
      <PageHero eyebrow="Dentaliva" title={pageString("servicesTitle")} />
      <Reveal>
        <Section>
          {treatments.length === 0 ? (
            <Text className="mt-6">Tedavi listesi hazırlanıyor.</Text>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {treatments.map((treatment) => (
                <TreatmentCard key={treatment.slug} item={treatment} />
              ))}
            </div>
          )}
        </Section>
      </Reveal>
    </>
  );
}
