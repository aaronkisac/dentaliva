import type { Metadata } from "next";

import Image from "next/image";

import { t } from "../../../src/i18n";
import { buildBreadcrumbJsonLd, buildFaqJsonLd } from "@dentaliva/seo";

import { Reveal, Accordion, Card, Heading, Section, Text } from "@dentaliva/ui";
import { JsonLd } from "../../../components/json-ld";
import { CtaBand } from "../../../components/cta-band";
import { DoctorCard } from "../../../components/doctor-card";
import { PageHero } from "../../../components/page-hero";
import { ReadingCta } from "../../../components/reading-cta";
import { fetchTreatmentBySlug, fetchTreatments } from "../../../src/content/treatments";
import { bodyBreakIndex, splitBodyParagraphs } from "../../../src/content/treatment-body";
import { fetchHomePageDocument, fetchSiteSettings } from "../../../src/content/home";
import { fetchSiteCopy } from "../../../src/content/site-copy";
import { readClient } from "../../../src/sanity";
import { absoluteUrl, pageMetadata } from "../../../src/seo";
import { SeedPlaceholder } from "../../../components/seed-placeholder";
import { TreatmentSections } from "../../../components/treatment-sections";
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
  // DSN-83: yapılandırılmış gövde varsa düz metin kolonu basılmaz; başlıksız
  // bölümler (yarım CMS girişi) akışa girmez.
  const sections = (treatment.sections ?? []).filter((section) => t(section.heading));
  const showLegacyBody = sections.length === 0;
  const hasExtras =
    (treatment.benefits ?? []).length > 0 || steps.length > 0 || Boolean(t(treatment.priceNote));
  // DSN-70: legacy düz metin gövde paragraflara bölünür; görsel ve dönüşüm
  // molası akışın ortasına yerleşir (hero'daki dev görsel bandı kalktı).
  const paragraphs = treatment.body ? splitBodyParagraphs(t(treatment.body)) : [];
  const imageAfter = treatment.heroImage?.ref ? bodyBreakIndex(paragraphs.length, 0.3) : null;
  // DSN-24: sayfa sonu bandının CMS içeriği (cache'li fetcher'lar). Bant
  // fetch hatasında sessizce düşer — detay sayfası içeriğini bloklamaz.
  const [homePage, settings, copy] = await Promise.all([
    fetchHomePageDocument(readClient).catch(() => null),
    fetchSiteSettings(readClient),
    fetchSiteCopy(readClient),
  ]);
  const headings = copy?.sectionHeadings;
  const midCtaText = t(copy?.ui?.treatmentMidCta);
  const midCtaAfter =
    midCtaText || t(copy?.ui?.appointmentCta) ? bodyBreakIndex(paragraphs.length, 0.65) : null;
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
  return (
    <>
      {jsonLd.map((data, index) => (
        <JsonLd key={index} data={data} />
      ))}
      <PageHero
        eyebrow={pageString("servicesTitle")}
        eyebrowHref={routes.treatments}
        title={name}
        lead={t(treatment.summary) ? t(treatment.summary) : null}
      />

      {/* DSN-83: yapılandırılmış bölüm akışı — doluysa düz metin kolonu ve
          ortadaki görsel/CTA molaları devre dışı (içerik bölümlere taşındı);
          dönüşüm molası akışın sonunda tek kart olarak kalır. */}
      {sections.length > 0 ? (
        <>
          <TreatmentSections sections={sections} />
          {midCtaText || t(copy?.ui?.appointmentCta) ? (
            <Section>
              <ReadingCta
                text={midCtaText}
                phone={settings?.phone}
                actionLabel={t(copy?.ui?.appointmentCta)}
              />
            </Section>
          ) : null}
        </>
      ) : null}

      {/* Sections'lu tedavide gövde kolonu basılmaz; fayda/adım/fiyat blokları
          her iki modda da (veri-gated) kalır — sections'suz sayfalar için
          çıktı DSN-70 düzeninden birebir aynıdır. */}
      {showLegacyBody || hasExtras ? (
        <Reveal>
          <Section>
            {/* DSN-70: okuma kolonu — ilk paragraf lead stili; görsel ve dönüşüm
              molası paragraf akışının içine yerleşir (hero'daki 1180px dev
              görsel bandı kalktı; LCP artık metin, preload gerekmez). */}
            {showLegacyBody && paragraphs.length > 0 ? (
              <div className="max-w-[680px]">
                {paragraphs.map((paragraph, index) => (
                  <div key={index}>
                    {imageAfter !== null && index === imageAfter && treatment.heroImage?.ref ? (
                      <figure className="my-10 border border-[var(--dvn-line-gold)] bg-ivory-2">
                        <Image
                          src={treatment.heroImage.ref}
                          alt={t(treatment.heroImage.alt)}
                          width={1200}
                          height={800}
                          sizes="(max-width: 768px) 100vw, 680px"
                          placeholder={treatment.heroImage.lqip ? "blur" : "empty"}
                          blurDataURL={treatment.heroImage.lqip}
                          className="h-auto w-full object-cover"
                        />
                      </figure>
                    ) : null}
                    {midCtaAfter !== null && index === midCtaAfter ? (
                      <ReadingCta
                        text={midCtaText}
                        phone={settings?.phone}
                        actionLabel={t(copy?.ui?.appointmentCta)}
                      />
                    ) : null}
                    <p
                      className={
                        index === 0
                          ? "font-sans text-lg leading-relaxed text-ink"
                          : "mt-5 font-sans text-[15px] leading-relaxed text-ink/90"
                      }
                    >
                      {paragraph}
                    </p>
                  </div>
                ))}
                {/* Kısa gövdelerde molasız kalan görsel/CTA sonda basılır. */}
                {imageAfter === null && treatment.heroImage?.ref ? (
                  <figure className="mt-10 border border-[var(--dvn-line-gold)] bg-ivory-2">
                    <Image
                      src={treatment.heroImage.ref}
                      alt={t(treatment.heroImage.alt)}
                      width={1200}
                      height={800}
                      sizes="(max-width: 768px) 100vw, 680px"
                      placeholder={treatment.heroImage.lqip ? "blur" : "empty"}
                      blurDataURL={treatment.heroImage.lqip}
                      className="h-auto w-full object-cover"
                    />
                  </figure>
                ) : null}
                {midCtaAfter === null ? (
                  <ReadingCta
                    text={midCtaText}
                    phone={settings?.phone}
                    actionLabel={t(copy?.ui?.appointmentCta)}
                  />
                ) : null}
              </div>
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
      ) : null}

      {/* DSN-9: tedavinin ilgili hekimleri (schema: treatment.doctors). */}
      {(treatment.doctors ?? []).length > 0 ? (
        <Reveal>
          <Section className="bg-white">
            {t(headings?.relatedDoctors) ? (
              <Heading level="h2" size="md">
                {t(headings?.relatedDoctors)}
              </Heading>
            ) : null}
            <div className="mt-10 grid gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
              {/* DSN-69/70: vitrin kartı — eski h-48 kırpımı yüzleri kesiyordu. */}
              {(treatment.doctors ?? []).map((doctor) => (
                <DoctorCard
                  key={doctor.slug}
                  name={doctor.name}
                  title={t(doctor.title)}
                  slug={doctor.slug ?? ""}
                  photo={doctor.photo}
                />
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
        actionLabel={t(copy?.ui?.appointmentCta)}
      />
    </>
  );
}
