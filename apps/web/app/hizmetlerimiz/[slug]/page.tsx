import type { Metadata } from "next";

import Image from "next/image";

import { t } from "../../../src/i18n";
import { urlForImage } from "@dentaliva/sanity-schema/image-url";
import { buildBreadcrumbJsonLd, buildFaqJsonLd } from "@dentaliva/seo";

import { Reveal, Accordion, Card, Heading, Link, Section, Text } from "@dentaliva/ui";
import { JsonLd } from "../../../components/json-ld";
import { CtaBand } from "../../../components/cta-band";
import { PageHero } from "../../../components/page-hero";
import { fetchTreatmentBySlug, fetchTreatments } from "../../../src/content/treatments";
import { fetchHomePageDocument, fetchSiteSettings } from "../../../src/content/home";
import { fetchSiteCopy } from "../../../src/content/site-copy";
import { site } from "../../../src/config";
import { readClient } from "../../../src/sanity";
import { absoluteUrl, pageMetadata } from "../../../src/seo";
import { SeedPlaceholder } from "../../../components/seed-placeholder";
import { pageString } from "../../../src/page-strings";
import { routes } from "../../../src/routes";

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
    path: routes.treatment(slug),
    title: t(treatment.name) || "Tedavi",
    description: t(treatment.summary),
    seo: treatment.seo,
    ogImageRef: treatment.heroImage?.ref,
    ogImageAlt: t(treatment.heroImage?.alt),
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
  const name = t(treatment.name);
  // DSN-24: sayfa sonu bandının CMS içeriği (cache'li fetcher'lar). Bant
  // fetch hatasında sessizce düşer — detay sayfası içeriğini bloklamaz.
  const [homePage, settings, copy] = await Promise.all([
    fetchHomePageDocument(readClient).catch(() => null),
    fetchSiteSettings(readClient),
    fetchSiteCopy(readClient),
  ]);
  const headings = copy?.sectionHeadings;
  const faqs = (treatment.faqs ?? []).filter((f) => t(f.question) && t(f.answer));
  // SEO-5: breadcrumb trail + FAQ answers as structured data.
  const jsonLd = [
    buildBreadcrumbJsonLd([
      { name: pageString("breadcrumbHome"), url: absoluteUrl("/") },
      { name: pageString("servicesTitle"), url: absoluteUrl(routes.treatments) },
      { name, url: absoluteUrl(routes.treatment(slug)) },
    ]),
    ...(faqs.length > 0
      ? [
          buildFaqJsonLd(
            faqs.map((f) => ({
              question: t(f.question),
              answer: t(f.answer),
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
      <PageHero
        eyebrow={pageString("servicesTitle")}
        eyebrowHref={routes.treatments}
        title={name}
        lead={t(treatment.summary) ? t(treatment.summary) : null}
      >
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
              alt={t(treatment.heroImage.alt)}
              width={1200}
              height={800}
              priority
              sizes="(max-width: 900px) 100vw, 1180px"
              className="h-auto w-full object-cover"
            />
          </div>
        ) : null}
      </PageHero>

      <Reveal>
        <Section>
          {t(treatment.body) ? (
            <Text className="max-w-3xl whitespace-pre-line">{t(treatment.body)}</Text>
          ) : null}

          {/* CPT-6: H2 "farklar/avantajlar" bölümlerinden gelen faydalar. */}
          {(treatment.benefits ?? []).length > 0 ? (
            <div className="mt-10">
              {t(headings?.keyBenefits) ? (
                <Heading level="h2" size="md">
                  {t(headings?.keyBenefits)}
                </Heading>
              ) : null}
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {(treatment.benefits ?? []).map((benefit, index) => (
                  <Card key={index}>
                    <Text>{t(benefit)}</Text>
                  </Card>
                ))}
              </div>
            </div>
          ) : null}

          {/* DSN-31: adımlar numaralı ve başlıklı (eyebrow motif, copy sweep borçlu). */}
          {steps.length > 0 ? (
            <div className="mt-12">
              {t(headings?.treatmentProcessEyebrow) ? (
                <div className="flex items-center gap-3">
                  <span aria-hidden="true" className="h-px w-8 bg-gold" />
                  <p className="font-sans text-xs uppercase tracking-widest text-gold-deep">
                    {t(headings?.treatmentProcessEyebrow)}
                  </p>
                </div>
              ) : null}
              {t(headings?.treatmentProcess) ? (
                <Heading level="h2" size="md" className="mt-4">
                  {t(headings?.treatmentProcess)}
                </Heading>
              ) : null}
              <div className="mt-6 grid gap-6 md:grid-cols-3">
                {steps.map((step, index) => (
                  <Card key={index} hover="lift">
                    <p aria-hidden="true" className="font-serif text-3xl text-gold">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <Heading level="h3" size="title" className="mt-3">
                      {t(step.title) || `Adım ${index + 1}`}
                    </Heading>
                    <Text className="mt-2">{t(step.description)}</Text>
                  </Card>
                ))}
              </div>
            </div>
          ) : null}

          {t(treatment.priceNote) ? (
            <div className="mt-12 max-w-3xl border border-[var(--dvn-line-gold)] bg-white p-8 shadow-[var(--dvn-shadow-soft)]">
              <Text>{t(treatment.priceNote)}</Text>
            </div>
          ) : null}
        </Section>
      </Reveal>

      {/* DSN-9: tedavinin ilgili hekimleri (schema: treatment.doctors). */}
      {(treatment.doctors ?? []).length > 0 ? (
        <Reveal>
          <Section className="bg-white">
            {t(headings?.relatedDoctors) ? (
              <Heading level="h2" size="md">
                {t(headings?.relatedDoctors)}
              </Heading>
            ) : null}
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
                  {t(doctor.title) ? <Text className="mt-1">{t(doctor.title)}</Text> : null}
                  <Text tone="muted" size="small" className="mt-3 underline">
                    <Link href={routes.doctor(doctor.slug)}>{t(headings?.doctorProfileLink)}</Link>
                  </Text>
                </Card>
              ))}
            </div>
          </Section>
        </Reveal>
      ) : null}

      {(treatment.faqs ?? []).length > 0 ? (
        <Reveal>
          <Section className="bg-white">
            {t(headings?.faq) ? (
              <Heading level="h2" size="md">
                {t(headings?.faq)}
              </Heading>
            ) : null}
            <div className="mt-8 max-w-3xl">
              <Accordion
                items={(treatment.faqs ?? [])
                  .filter((f) => t(f.question) && t(f.answer))
                  .map((f) => ({
                    id: t(f.question),
                    question: t(f.question),
                    answer: t(f.answer),
                  }))}
              />
            </div>
          </Section>
        </Reveal>
      ) : null}

      {/* DSN-24: sayfa sonu dönüşüm bandı. */}
      <CtaBand
        title={homePage?.cta?.title ?? null}
        text={homePage?.cta?.text ?? null}
        phone={settings?.phone}
      />
    </>
  );
}
