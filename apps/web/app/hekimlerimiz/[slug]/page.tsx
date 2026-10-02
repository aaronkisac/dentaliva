import type { Metadata } from "next";

import Image from "next/image";

import { pickLocalized } from "@dentaliva/sanity-schema/client";
import { buildBreadcrumbJsonLd } from "@dentaliva/seo";

import { Reveal, Heading, Section, Text } from "@dentaliva/ui";
import { JsonLd } from "../../../components/json-ld";
import { CtaBand } from "../../../components/cta-band";
import { fetchDoctorBySlug, fetchDoctors } from "../../../src/content/doctors";
import { fetchHomePageDocument, fetchSiteSettings } from "../../../src/content/home";
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
  // PRF-5: _seed placeholder sayfaları dizine eklenmesin.
  if (!doctor) return { title: "Hekim", robots: { index: false, follow: false } };
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

  // DSN-24: sayfa sonu bandının CMS içeriği; fetch hatasında sessizce düşer.
  const [homePage, settings] = await Promise.all([
    fetchHomePageDocument(readClient).catch(() => null),
    fetchSiteSettings(readClient),
  ]);

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
              // PRF-5: sabit 192px kutu — sizes olmadan tarayıcı 100vw'e
              // göre ~1920px kaynak seçiyordu; lqip varsa inline blur.
              sizes="192px"
              priority
              placeholder={doctor.photo.lqip ? "blur" : "empty"}
              blurDataURL={doctor.photo.lqip}
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
      <Reveal>
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
      </Reveal>

      {/* DSN-24: sayfa sonu dönüşüm bandı. */}
      <CtaBand
        title={homePage?.cta?.title ?? null}
        text={homePage?.cta?.text ?? null}
        phone={settings?.phone}
      />
    </>
  );
}
