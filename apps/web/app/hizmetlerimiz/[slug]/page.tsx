import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Image from "next/image";

import { pickLocalized } from "@dentaliva/sanity-schema/client";

import { Accordion, Card, Heading, Section, Text } from "@dentaliva/ui";
import { fetchTreatmentBySlug, fetchTreatments } from "../../../src/content/treatments";
import { readClient } from "../../../src/sanity";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const treatments = await fetchTreatments(readClient);
  return treatments
    .filter((treatment): treatment is typeof treatment & { slug: string } =>
      Boolean(treatment.slug),
    )
    .map((treatment) => ({ slug: treatment.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const treatment = await fetchTreatmentBySlug(readClient, slug);
  return {
    title: treatment ? pickLocalized(treatment.name) : "Tedavi",
  };
}

export default async function TreatmentDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const treatment = await fetchTreatmentBySlug(readClient, slug);
  if (!treatment) notFound();

  const steps = treatment.steps ?? [];

  return (
    <>
      <Section className="bg-navy">
        <Heading level="h1" size="lg" className="text-white">
          {pickLocalized(treatment.name)}
        </Heading>
        {treatment.heroImage?.ref ? (
          <div
            className="mt-8 border border-[var(--dvn-line-gold)]"
            style={
              treatment.heroImage.lqip
                ? { backgroundImage: `url(${treatment.heroImage.lqip})`, backgroundSize: "cover" }
                : undefined
            }
          >
            <Image
              src={treatment.heroImage.ref}
              alt={treatment.heroImage.alt?.tr ?? ""}
              width={1200}
              height={800}
              priority
              sizes="(max-width: 900px) 100vw, 1180px"
              className="h-auto w-full object-cover"
            />
          </div>
        ) : null}
        {treatment.summary?.tr ? (
          <Text size="lg" tone="white" className="mt-6 max-w-3xl">
            {pickLocalized(treatment.summary)}
          </Text>
        ) : null}
      </Section>

      <Section>
        {treatment.body?.tr ? (
          <Text className="max-w-3xl whitespace-pre-line">{pickLocalized(treatment.body)}</Text>
        ) : null}

        {steps.length > 0 ? (
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <Card key={index}>
                <Heading level="h3" size="title">
                  {pickLocalized(step.title) || `Adım ${index + 1}`}
                </Heading>
                <Text className="mt-2">{pickLocalized(step.description)}</Text>
              </Card>
            ))}
          </div>
        ) : null}

        {treatment.priceNote?.tr ? (
          <div className="mt-12 border border-[var(--dvn-line-gold)] bg-ivory p-6">
            <Text>{pickLocalized(treatment.priceNote)}</Text>
          </div>
        ) : null}
      </Section>

      {(treatment.faqs ?? []).length > 0 ? (
        <Section className="bg-white">
          <Heading level="h2" size="md">
            Sıkça Sorulan Sorular
          </Heading>
          <div className="mt-8 max-w-3xl">
            <Accordion
              items={(treatment.faqs ?? [])
                .filter((f) => f.question?.tr && f.answer?.tr)
                .map((f) => ({
                  id: f.question?.tr ?? "",
                  question: f.question?.tr ?? "",
                  answer: f.answer?.tr ?? "",
                }))}
            />
          </div>
        </Section>
      ) : null}
    </>
  );
}
