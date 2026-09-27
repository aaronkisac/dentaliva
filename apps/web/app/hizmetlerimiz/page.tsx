import type { Metadata } from "next";

import { Card, Heading, Section, Text } from "@dentaliva/ui";
import { pickLocalized } from "@dentaliva/sanity-schema/client";

import { Link } from "@dentaliva/ui";
import { fetchTreatments } from "../../src/content/treatments";
import { readClient } from "../../src/sanity";
import { pageMetadata } from "../../src/seo";

export const metadata: Metadata = pageMetadata({
  path: "/hizmetlerimiz",
  title: "Hizmetlerimiz",
  description: "Dentaliva tedavileri",
});

export default async function TreatmentsPage() {
  const treatments = await fetchTreatments(readClient);

  return (
    <Section>
      <Heading level="h1" size="lg">
        Hizmetlerimiz
      </Heading>
      {treatments.length === 0 ? (
        <Text className="mt-6">Tedavi listesi hazırlanıyor.</Text>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {treatments.map((treatment) => (
            <Card key={treatment.slug} hover="lift">
              <Heading level="h3" size="title">
                {pickLocalized(treatment.name)}
              </Heading>
              <Text className="mt-2">{pickLocalized(treatment.summary)}</Text>
              <Link
                href={`/hizmetlerimiz/${treatment.slug}`}
                className="mt-4 inline-block font-sans text-sm font-semibold text-navy hover:text-gold-deep"
              >
                Detay →
              </Link>
            </Card>
          ))}
        </div>
      )}
    </Section>
  );
}
