import type { Metadata } from "next";

import Image from "next/image";

import { Card, Heading, Section, Text } from "@dentaliva/ui";
import { PageHero } from "../../components/page-hero";
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
    <>
      <PageHero eyebrow="Dentaliva" title="Hekimlerimiz" />
      <Section>
        {doctors.length === 0 ? (
          <Text className="mt-6">Hekim kadromuz hazırlanıyor.</Text>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {doctors.map((doctor) => (
              <Card key={doctor.slug} hover="lift">
                {doctor.photo?.ref ? (
                  <Image
                    src={doctor.photo.ref}
                    alt={doctor.name ?? ""}
                    width={600}
                    height={400}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    placeholder={doctor.lqip ? "blur" : "empty"}
                    blurDataURL={doctor.lqip}
                    className="h-48 w-full object-cover"
                  />
                ) : null}
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
    </>
  );
}
