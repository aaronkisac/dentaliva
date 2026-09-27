import type { Metadata } from "next";

import { Card, Heading, Section, Text } from "@dentaliva/ui";
import { pickLocalized } from "@dentaliva/sanity-schema/client";

import { Link } from "@dentaliva/ui";
import { fetchDoctors } from "../../src/content/doctors";
import { readClient } from "../../src/sanity";
import { pageMetadata } from "../../src/seo";

export const metadata: Metadata = pageMetadata({
  path: "/hekimlerimiz",
  title: "Hekimlerimiz",
  description: "Dentaliva hekim kadrosu",
});

export default async function DoctorsPage() {
  const doctors = await fetchDoctors(readClient);

  return (
    <Section>
      <Heading level="h1" size="lg">
        Hekimlerimiz
      </Heading>
      {doctors.length === 0 ? (
        <Text className="mt-6">Hekim kadromuz hazırlanıyor.</Text>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {doctors.map((doctor) => (
            <Card key={doctor.slug} hover="lift">
              <Heading level="h3" size="title">
                {doctor.name}
              </Heading>
              <Text tone="muted" size="small">
                {pickLocalized(doctor.title)}
              </Text>
              <Link
                href={`/hekimlerimiz/${doctor.slug}`}
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
