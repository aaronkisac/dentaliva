import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { pickLocalized } from "@dentaliva/sanity-schema/client";

import { Heading, Section, Text } from "@dentaliva/ui";
import { fetchDoctorBySlug, fetchDoctors } from "../../../src/content/doctors";
import { readClient } from "../../../src/sanity";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const doctors = await fetchDoctors(readClient);
  return doctors
    .filter((doctor): doctor is typeof doctor & { slug: string } => Boolean(doctor.slug))
    .map((doctor) => ({ slug: doctor.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const doctor = await fetchDoctorBySlug(readClient, slug);
  return { title: doctor?.name ?? "Hekim" };
}

export default async function DoctorDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const doctor = await fetchDoctorBySlug(readClient, slug);
  if (!doctor) notFound();

  return (
    <>
      <Section className="bg-navy">
        <Heading level="h1" size="lg" className="text-white">
          {doctor.name}
        </Heading>
        {doctor.title?.tr ? (
          <Text size="lg" tone="white" className="mt-4">
            {pickLocalized(doctor.title)}
          </Text>
        ) : null}
      </Section>
      <Section>
        {doctor.bio?.tr ? (
          <Text className="max-w-3xl whitespace-pre-line">{pickLocalized(doctor.bio)}</Text>
        ) : null}
      </Section>
    </>
  );
}
