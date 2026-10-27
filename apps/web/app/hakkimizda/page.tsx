import type { Metadata } from "next";

import { Heading, Reveal, Section } from "@dentaliva/ui";
import { t } from "../../src/i18n";

import { CtaBand } from "../../components/cta-band";
import { DoctorCard } from "../../components/doctor-card";
import { PageHero } from "../../components/page-hero";
import { AboutSection } from "../../components/sections/about";
import { GallerySection } from "../../components/sections/gallery";
import { fetchDoctors } from "../../src/content/doctors";
import { fetchHomePageDocument, fetchSiteSettings } from "../../src/content/home";
import { fetchSiteCopy } from "../../src/content/site-copy";
import { readClient } from "../../src/sanity";
import { pageMetadata } from "../../src/seo";
import { pageString } from "../../src/page-strings";
import { routes } from "../../src/routes";

export const metadata: Metadata = pageMetadata({
  path: routes.about,
  title: pageString("aboutTitle"),
  description: pageString("aboutDescription"),
});

/**
 * DSN-28: hakkımızda yeniden kurulum — ana sayfanın zengin bileşenleri
 * (AboutSection, GallerySection + istatistik bandı, ekip kartları) bu
 * sayfaya taşındı. Bölümler boş CMS'te null döner; sayfa her koşulda
 * oluşur. Ekip bölümü başlığı şimdilik sayfa katmanında (doctors.tsx ile
 * aynı) — CPT-8 copy sweep'inde homePage şemasına taşınacak.
 */
export default async function AboutPage() {
  const [homePage, doctors, settings, copy] = await Promise.all([
    fetchHomePageDocument(readClient).catch(() => null),
    fetchDoctors(readClient),
    fetchSiteSettings(readClient),
    fetchSiteCopy(readClient),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Dentaliva"
        title={pageString("aboutTitle")}
        lead={t(homePage?.about?.title) || null}
      />
      <Reveal>
        <AboutSection data={homePage?.about ?? null} stats={homePage?.stats ?? []} />
      </Reveal>
      <Reveal>
        <GallerySection images={homePage?.gallery ?? []} />
      </Reveal>
      {doctors.length > 0 ? (
        <Reveal>
          <Section className="bg-white">
            {t(homePage?.teamSection?.heading) ? (
              <>
                <div className="flex items-center gap-3">
                  <span aria-hidden="true" className="h-px w-8 bg-gold" />
                  <p className="font-sans text-xs uppercase tracking-widest text-gold-deep">
                    {t(homePage?.teamSection?.eyebrow)}
                  </p>
                </div>
                <Heading level="h2" size="md" className="mt-4">
                  {t(homePage?.teamSection?.heading)}
                </Heading>
              </>
            ) : null}
            <div className="mt-10 grid gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
              {doctors.map((doctor, index) => (
                /* DSN-69: hekimlerimiz vitrin kartı — 4/5 portre, kart-link. */
                <DoctorCard
                  key={doctor.slug}
                  name={doctor.name}
                  title={t(doctor.title)}
                  slug={doctor.slug ?? ""}
                  photo={{ ref: doctor.photo?.ref, lqip: doctor.lqip }}
                  priority={index < 3}
                />
              ))}
            </div>
          </Section>
        </Reveal>
      ) : null}
      <CtaBand
        title={homePage?.cta?.title ?? null}
        text={homePage?.cta?.text ?? null}
        phone={settings?.phone}
        actionLabel={t(copy?.ui?.appointmentCta)}
      />
    </>
  );
}
