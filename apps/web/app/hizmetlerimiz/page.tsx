import type { Metadata } from "next";

import Image from "next/image";

import { Reveal, Card, Heading, Section, Text } from "@dentaliva/ui";
import { PageHero } from "../../components/page-hero";
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
    <>
      <PageHero eyebrow="Dentaliva" title="Hizmetlerimiz" />
      <Reveal>
        <Section>
          {treatments.length === 0 ? (
            <Text className="mt-6">Tedavi listesi hazırlanıyor.</Text>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {treatments.map((treatment) => (
                <Card key={treatment.slug} hover="lift">
                  {treatment.heroImage?.ref ? (
                    <Image
                      src={treatment.heroImage.ref}
                      alt={treatment.heroImage.alt?.tr ?? ""}
                      width={600}
                      height={400}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      placeholder={treatment.heroImage.lqip ? "blur" : "empty"}
                      blurDataURL={treatment.heroImage.lqip}
                      className="h-48 w-full object-cover"
                    />
                  ) : null}
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
      </Reveal>
    </>
  );
}
