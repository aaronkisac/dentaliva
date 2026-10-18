import type { Metadata } from "next";

import { Reveal, Card, Heading, Section, Text } from "@dentaliva/ui";
import { PageHero } from "../../components/page-hero";
import { DoctorPortrait } from "../../components/doctor-portrait";
import { t } from "../../src/i18n";

import { Link } from "@dentaliva/ui";
import { fetchDoctors } from "../../src/content/doctors";
import { readClient } from "../../src/sanity";
import { pageMetadata } from "../../src/seo";
import { pageString } from "../../src/page-strings";

export const metadata: Metadata = pageMetadata({
  path: "/hekimlerimiz",
  title: pageString("doctorsTitle"),
  description: "Dentaliva hekim kadrosu",
});

export default async function DoctorsPage() {
  const doctors = await fetchDoctors(readClient);

  return (
    <>
      <PageHero eyebrow="Dentaliva" title={pageString("doctorsTitle")} />
      <Reveal>
        <Section>
          {doctors.length === 0 ? (
            <Text className="mt-6">{pageString("doctorsEmpty")}</Text>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {doctors.map((doctor) => (
                <Card key={doctor.slug} hover="lift">
                  {/* DSN-43: foto yoksa markalı baş harf monogramı. */}
                  <DoctorPortrait
                    name={doctor.name}
                    photo={{ ref: doctor.photo?.ref, lqip: doctor.lqip }}
                    alt={doctor.name ?? ""}
                    frameClassName="h-48 w-full"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <Heading level="h3" size="title">
                    {doctor.name}
                  </Heading>
                  <Text tone="muted" size="small">
                    {t(doctor.title)}
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
      </Reveal>
    </>
  );
}
