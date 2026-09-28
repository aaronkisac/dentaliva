import type { Metadata } from "next";

import Image from "next/image";

import { pickLocalized } from "@dentaliva/sanity-schema/client";
import { buildBreadcrumbJsonLd } from "@dentaliva/seo";

import { Heading, Section, Text } from "@dentaliva/ui";
import { JsonLd } from "../../../components/json-ld";
import { fetchDoctorBySlug, fetchDoctors } from "../../../src/content/doctors";
import { readClient } from "../../../src/sanity";
import { absoluteUrl, pageMetadata } from "../../../src/seo";
import { SeedPlaceholder } from "../../../components/seed-placeholder";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const doctors = await fetchDoctors(readClient);
  const params = doctors
    .filter((doctor): doctor is typeof doctor & { slug: string } => Boolean(doctor.slug))
    .map((doctor) => ({ slug: doctor.slug }));
  // output: "export" rejects an empty params array — a fresh clone with an
  // empty Sanity project must still build (STR-1 template dry run).
  return params.length > 0 ? params : [{ slug: "_seed" }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const doctor = await fetchDoctorBySlug(readClient, slug);
  if (!doctor) return { title: "Hekim" };
  return pageMetadata({
    path: `/hekimlerimiz/${slug}`,
    title: doctor.name ?? "Hekim",
    description: pickLocalized(doctor.title) || pickLocalized(doctor.bio),
    seo: doctor.seo,
    ogImageRef: doctor.photo?.ref,
    ogImageAlt: doctor.name,
  });
}

export default async function DoctorDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const doctor = await fetchDoctorBySlug(readClient, slug);
  if (!doctor) {
    return <SeedPlaceholder title="Hekim" />;
  }

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Ana Sayfa", url: absoluteUrl("/") },
          { name: "Hekimlerimiz", url: absoluteUrl("/hekimlerimiz") },
          { name: doctor.name ?? "Hekim", url: absoluteUrl(`/hekimlerimiz/${slug}`) },
        ])}
      />
      <Section className="bg-navy">
        <div className="flex flex-col items-start gap-8 md:flex-row md:items-center">
          {doctor.photo?.ref ? (
            <Image
              src={doctor.photo.ref}
              alt={doctor.name ?? ""}
              width={192}
              height={192}
              className="h-48 w-48 shrink-0 rounded-full border-2 border-[var(--dvn-line-gold)] object-cover"
            />
          ) : null}
          <div>
            <Heading level="h1" size="lg" className="text-white">
              {doctor.name}
            </Heading>
            {doctor.title?.tr ? (
              <Text size="lg" tone="white" className="mt-4">
                {pickLocalized(doctor.title)}
              </Text>
            ) : null}
          </div>
        </div>
      </Section>
      <Section>
        {doctor.bio?.tr ? (
          <Text className="max-w-3xl whitespace-pre-line">{pickLocalized(doctor.bio)}</Text>
        ) : null}

        {/* DSN-9: hekimin ilgi alanları (schema: doctor.treatments). */}
        {(doctor.treatments ?? []).length > 0 ? (
          <div className="mt-8 flex flex-wrap gap-3">
            {(doctor.treatments ?? []).map((treatment) => (
              <a
                key={treatment.slug}
                href={`/hizmetlerimiz/${treatment.slug}`}
                className="border border-[var(--dvn-line-gold)] px-4 py-2 font-sans text-sm text-navy transition-colors hover:bg-gold hover:text-navy"
              >
                {pickLocalized(treatment.name)}
              </a>
            ))}
          </div>
        ) : null}
      </Section>
    </>
  );
}
