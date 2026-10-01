import type { Metadata } from "next";

import Image from "next/image";

import { pickLocalized } from "@dentaliva/sanity-schema/client";
import { urlForImage } from "@dentaliva/sanity-schema/image-url";
import { buildBreadcrumbJsonLd, buildFaqJsonLd } from "@dentaliva/seo";

import { Accordion, Card, Heading, Section, Text } from "@dentaliva/ui";
import { JsonLd } from "../../../components/json-ld";
import { fetchTreatmentBySlug, fetchTreatments } from "../../../src/content/treatments";
import { site } from "../../../src/config";
import { readClient } from "../../../src/sanity";
import { absoluteUrl, pageMetadata } from "../../../src/seo";
import { SeedPlaceholder } from "../../../components/seed-placeholder";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const treatments = await fetchTreatments(readClient);
  const params = treatments
    .filter((treatment): treatment is typeof treatment & { slug: string } =>
      Boolean(treatment.slug),
    )
    .map((treatment) => ({ slug: treatment.slug }));
  // output: "export" rejects an empty params array — a fresh clone with an
  // empty Sanity project must still build (STR-1 template dry run).
  return params.length > 0 ? params : [{ slug: "_seed" }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const treatment = await fetchTreatmentBySlug(readClient, slug);
  // PRF-5: _seed placeholder sayfaları dizine eklenmesin.
  if (!treatment) return { title: "Tedavi", robots: { index: false, follow: false } };
  return pageMetadata({
    path: `/hizmetlerimiz/${slug}`,
    title: pickLocalized(treatment.name) || "Tedavi",
    description: pickLocalized(treatment.summary),
    seo: treatment.seo,
    ogImageRef: treatment.heroImage?.ref,
    ogImageAlt: treatment.heroImage?.alt?.tr,
  });
}

export default async function TreatmentDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const treatment = await fetchTreatmentBySlug(readClient, slug);
  if (!treatment) {
    // Only reachable when the CMS has no documents for this slug (fresh
    // template clone rendering the _seed path) — real content never 404s here.
    return <SeedPlaceholder title="Tedavi" />;
  }

  const steps = treatment.steps ?? [];
  const name = pickLocalized(treatment.name);
  const faqs = (treatment.faqs ?? []).filter((f) => f.question?.tr && f.answer?.tr);
  // SEO-5: breadcrumb trail + FAQ answers as structured data.
  const jsonLd = [
    buildBreadcrumbJsonLd([
      { name: "Ana Sayfa", url: absoluteUrl("/") },
      { name: "Hizmetlerimiz", url: absoluteUrl("/hizmetlerimiz") },
      { name, url: absoluteUrl(`/hizmetlerimiz/${slug}`) },
    ]),
    ...(faqs.length > 0
      ? [
          buildFaqJsonLd(
            faqs.map((f) => ({
              question: f.question?.tr ?? "",
              answer: f.answer?.tr ?? "",
            })),
          ),
        ]
      : []),
  ];
  // React hoists this into <head>: the LCP image fetch starts at head-parse,
  // in parallel with CSS, instead of after discovery (PRF-3).
  const heroPreload = treatment.heroImage?.ref
    ? urlForImage(
        treatment.heroImage.ref,
        { width: 1200, quality: 75 },
        {
          projectId: process.env.SANITY_PROJECT_ID ?? site.sanity.projectId,
          dataset: process.env.SANITY_DATASET ?? site.sanity.dataset,
        },
      )
    : null;

  return (
    <>
      {jsonLd.map((data, index) => (
        <JsonLd key={index} data={data} />
      ))}
      {heroPreload ? (
        <link rel="preload" as="image" href={heroPreload} fetchPriority="high" />
      ) : null}
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

        {/* CPT-6: H2 "farklar/avantajlar" bölümlerinden gelen faydalar. */}
        {(treatment.benefits ?? []).length > 0 ? (
          <div className="mt-10">
            <Heading level="h2" size="md">
              Öne Çıkan Faydalar
            </Heading>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {(treatment.benefits ?? []).map((benefit, index) => (
                <Card key={index}>
                  <Text>{benefit.tr}</Text>
                </Card>
              ))}
            </div>
          </div>
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

      {/* DSN-9: tedavinin ilgili hekimleri (schema: treatment.doctors). */}
      {(treatment.doctors ?? []).length > 0 ? (
        <Section className="bg-white">
          <Heading level="h2" size="md">
            İlgili Hekimlerimiz
          </Heading>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {(treatment.doctors ?? []).map((doctor) => (
              <Card key={doctor.slug} hover="lift">
                {doctor.photo?.ref ? (
                  <Image
                    src={doctor.photo.ref}
                    alt={doctor.name ?? ""}
                    width={400}
                    height={400}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="h-48 w-full object-cover"
                  />
                ) : null}
                <Heading level="h3" size="title" className="mt-4">
                  {doctor.name}
                </Heading>
                {doctor.title?.tr ? (
                  <Text className="mt-1">{pickLocalized(doctor.title)}</Text>
                ) : null}
                <Text tone="muted" size="small" className="mt-3 underline">
                  <a href={`/hekimlerimiz/${doctor.slug}`}>Profile göz atın →</a>
                </Text>
              </Card>
            ))}
          </div>
        </Section>
      ) : null}

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
