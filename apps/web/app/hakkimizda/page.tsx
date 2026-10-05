import type { Metadata } from "next";

import Image from "next/image";

import { Card, Heading, Link, Reveal, Section, Text } from "@dentaliva/ui";
import { pickLocalized } from "@dentaliva/sanity-schema/client";

import { CtaBand } from "../../components/cta-band";
import { PageHero } from "../../components/page-hero";
import { AboutSection } from "../../components/sections/about";
import { GallerySection } from "../../components/sections/gallery";
import { fetchDoctors } from "../../src/content/doctors";
import { fetchHomePageDocument, fetchSiteSettings } from "../../src/content/home";
import { readClient } from "../../src/sanity";
import { pageMetadata } from "../../src/seo";

export const metadata: Metadata = pageMetadata({
  path: "/hakkimizda",
  title: "Hakkımızda",
  description: "Dentaliva hakkında",
});

/**
 * DSN-28: hakkımızda yeniden kurulum — ana sayfanın zengin bileşenleri
 * (AboutSection, GallerySection + istatistik bandı, ekip kartları) bu
 * sayfaya taşındı. Bölümler boş CMS'te null döner; sayfa her koşulda
 * oluşur. Ekip bölümü başlığı şimdilik sayfa katmanında (doctors.tsx ile
 * aynı) — CPT-8 copy sweep'inde homePage şemasına taşınacak.
 */
export default async function AboutPage() {
  const [homePage, doctors, settings] = await Promise.all([
    fetchHomePageDocument(readClient).catch(() => null),
    fetchDoctors(readClient),
    fetchSiteSettings(readClient),
  ]);

  return (
    <>
      <PageHero eyebrow="Dentaliva" title="Hakkımızda" lead={homePage?.about?.title?.tr ?? null} />
      <Reveal>
        <AboutSection data={homePage?.about ?? null} />
      </Reveal>
      <Reveal>
        <GallerySection images={homePage?.gallery ?? []} stats={homePage?.stats ?? []} />
      </Reveal>
      {doctors.length > 0 ? (
        <Reveal>
          <Section className="bg-white">
            {pickLocalized(homePage?.teamSection?.heading) ? (
              <>
                <div className="flex items-center gap-3">
                  <span aria-hidden="true" className="h-px w-8 bg-gold" />
                  <p className="font-sans text-xs uppercase tracking-widest text-gold-deep">
                    {pickLocalized(homePage?.teamSection?.eyebrow)}
                  </p>
                </div>
                <Heading level="h2" size="md" className="mt-4">
                  {pickLocalized(homePage?.teamSection?.heading)}
                </Heading>
              </>
            ) : null}
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {doctors.map((doctor) => (
                <Card key={doctor.slug} hover="lift">
                  {doctor.photo?.ref ? (
                    <Image
                      src={doctor.photo.ref}
                      alt={doctor.name ?? ""}
                      width={600}
                      height={400}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      placeholder={doctor.lqip ? "blur" : "empty"}
                      blurDataURL={doctor.lqip}
                      className="h-48 w-full object-cover"
                    />
                  ) : null}
                  <Heading level="h3" size="title" className="mt-4">
                    {doctor.name}
                  </Heading>
                  <Text tone="muted" size="small">
                    {pickLocalized(doctor.title)}
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
          </Section>
        </Reveal>
      ) : null}
      <CtaBand
        title={homePage?.cta?.title ?? null}
        text={homePage?.cta?.text ?? null}
        phone={settings?.phone}
      />
    </>
  );
}
