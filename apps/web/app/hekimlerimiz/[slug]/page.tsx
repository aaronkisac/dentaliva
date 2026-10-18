import type { Metadata } from "next";

import { t } from "../../../src/i18n";
import { buildBreadcrumbJsonLd } from "@dentaliva/seo";

import { Reveal, Section, Text } from "@dentaliva/ui";
import { JsonLd } from "../../../components/json-ld";
import { CtaBand } from "../../../components/cta-band";
import { DoctorPortrait } from "../../../components/doctor-portrait";
import { PageHero } from "../../../components/page-hero";
import { fetchDoctorBySlug, fetchDoctors } from "../../../src/content/doctors";
import { fetchHomePageDocument, fetchSiteSettings } from "../../../src/content/home";
import { readClient } from "../../../src/sanity";
import { absoluteUrl, pageMetadata } from "../../../src/seo";
import { SeedPlaceholder } from "../../../components/seed-placeholder";
import { uiString } from "../../../src/ui-strings";

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
    description: t(doctor.title) || t(doctor.bio),
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
          { name: uiString("breadcrumbHome"), url: absoluteUrl("/") },
          { name: uiString("doctorsTitle"), url: absoluteUrl("/hekimlerimiz") },
          { name: doctor.name ?? "Hekim", url: absoluteUrl(`/hekimlerimiz/${slug}`) },
        ])}
      />
      {/* DSN-32: kare portre (carousel'la aynı dil, rounded-[4px]) + PageHero.
            DSN-43: foto yoksa markalı baş harf monogramı — boş hero değil. */}
      <PageHero
        eyebrow={uiString("doctorsTitle")}
        eyebrowHref="/hekimlerimiz"
        title={doctor.name ?? "Hekim"}
        lead={t(doctor.title) ? t(doctor.title) : null}
      >
        <DoctorPortrait
          name={doctor.name}
          photo={{ ref: doctor.photo?.ref, lqip: doctor.photo?.lqip }}
          alt={doctor.name ?? ""}
          frameClassName="mt-8 h-56 w-56 rounded-[4px] border border-[var(--dvn-line-gold)] md:h-64 md:w-64"
          width={256}
          height={256}
          sizes="256px"
          priority
          initialsClassName="text-[length:var(--dvn-text-display-lg-size)]"
        />
      </PageHero>
      <Reveal>
        <Section>
          {t(doctor.bio) ? (
            <Text className="max-w-3xl whitespace-pre-line">{t(doctor.bio)}</Text>
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
                  {t(treatment.name)}
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
