import type { Metadata } from "next";

import Image from "next/image";

import { t, tBlocks } from "../../../src/i18n";
import { buildBreadcrumbJsonLd } from "@dentaliva/seo";

import { Reveal, Heading, Section, Text } from "@dentaliva/ui";
import { JsonLd } from "../../../components/json-ld";
import { CtaBand } from "../../../components/cta-band";
import { GalleryLightbox } from "../../../components/lightbox";
import { PageHero } from "../../../components/page-hero";
import { PortableText } from "../../../components/portable-text";
import { fetchBranchBySlug, fetchBranches } from "../../../src/content/branches";
import { fetchHomePageDocument, fetchSiteSettings } from "../../../src/content/home";
import { fetchSiteCopy } from "../../../src/content/site-copy";
import { readClient } from "../../../src/sanity";
import { absoluteUrl, pageMetadata } from "../../../src/seo";
import { SeedPlaceholder } from "../../../components/seed-placeholder";
import { pageString } from "../../../src/page-strings";
import { routes } from "../../../src/routes";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const branches = await fetchBranches(readClient);
  const params = branches
    .filter((branch): branch is typeof branch & { slug: string } => Boolean(branch.slug))
    .map((branch) => ({ slug: branch.slug }));
  // output: "export" rejects an empty params array — a fresh clone with an
  // empty Sanity project must still build (STR-1 template dry run).
  return params.length > 0 ? params : [{ slug: "_seed" }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const branch = await fetchBranchBySlug(readClient, slug);
  // PRF-5: _seed placeholder sayfaları dizine eklenmesin.
  if (!branch) return { title: "Şube", robots: { index: false, follow: false } };
  return pageMetadata({
    path: routes.branch(slug),
    title: branch.name ?? "Şube",
    description: t(branch.address),
    seo: branch.seo,
  });
}

export default async function BranchDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [branch, copy, settings, homePage] = await Promise.all([
    fetchBranchBySlug(readClient, slug),
    fetchSiteCopy(readClient),
    fetchSiteSettings(readClient),
    // DSN-77: CtaBand verisi — blog detay deseni; homePage yoksa bant düşer.
    fetchHomePageDocument(readClient).catch(() => null),
  ]);
  if (!branch) {
    return <SeedPlaceholder title="Şube" />;
  }
  const lightboxClose = t(copy?.ui?.lightboxClose);
  const blocks = tBlocks(branch.body);

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: pageString("breadcrumbHome"), url: absoluteUrl("/") },
          { name: pageString("branchesTitle"), url: absoluteUrl(routes.branches) },
          { name: branch.name ?? "Şube", url: absoluteUrl(routes.branch(slug)) },
        ])}
      />
      <PageHero
        eyebrow={pageString("branchesTitle")}
        eyebrowHref={routes.branches}
        title={branch.name ?? "Şube"}
        lead={t(branch.address) ? t(branch.address) : null}
      />
      {/* DSN-77: orijinal şube fotoğrafları — DSN-68 mosaic + lightbox dili;
          galeri boşsa tek bina fotoğrafı fallback olarak basılır. */}
      <Reveal>
        <Section>
          {branch.gallery?.some((photo) => photo.ref) ? (
            <GalleryLightbox
              images={branch.gallery
                .filter((photo) => photo.ref)
                .map((photo) => ({
                  asset: { _ref: photo.ref as string },
                  alt: photo.alt,
                  lqip: photo.lqip,
                }))}
              closeLabel={lightboxClose}
            />
          ) : branch.image?.ref ? (
            <Image
              src={branch.image.ref}
              alt={t(branch.image.alt) || branch.name || ""}
              width={1200}
              height={600}
              sizes="(max-width: 900px) 100vw, 1180px"
              className="h-auto w-full rounded-[4px] border border-[var(--dvn-line)] object-cover"
            />
          ) : null}
        </Section>
      </Reveal>
      {blocks.length > 0 ? (
        <Reveal>
          <Section>
            {/* DSN-77: orijinalin H2/H3 + paragraf gövdesi — CMS'ten
                (localeBlockContent), düzeni PortableText çizer. */}
            <PortableText blocks={blocks} />
          </Section>
        </Reveal>
      ) : null}
      <Reveal>
        <Section>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <Heading level="h2" size="title">
                İletişim
              </Heading>
              {branch.phone ? (
                <Text className="mt-3">
                  <a href={`tel:${branch.phone}`} className="hover:text-gold-deep">
                    {branch.phone}
                  </a>
                </Text>
              ) : null}
              {/* SUBE-1: orijinal şube sayfasındaki iletişim kartı Telefon /
                  E-mail / Lokasyon / Çalışma Saatleri sırasını izler. */}
              {settings?.email ? (
                <Text className="mt-3">
                  <a href={`mailto:${settings.email}`} className="hover:text-gold-deep">
                    {settings.email}
                  </a>
                </Text>
              ) : null}
              {t(branch.hours) ? <Text className="mt-2">{t(branch.hours)}</Text> : null}
            </div>
            {/* DSN-77: orijinalin isim-bazlı harita gömmesi; alan boşsa
                koordinat embed'i fallback. */}
            {branch.mapEmbedUrl || branch.geo ? (
              <div className="md:col-span-2">
                <iframe
                  title={`${branch.name ?? "Şube"} konum haritası`}
                  src={
                    branch.mapEmbedUrl ??
                    `https://maps.google.com/maps?q=${branch.geo?.lat},${branch.geo?.lng}&z=15&output=embed`
                  }
                  loading="lazy"
                  className="aspect-video w-full rounded-[4px] border border-[var(--dvn-line)]"
                />
              </div>
            ) : null}
            {branch.mapUrl ? (
              <div>
                {t(copy?.sectionHeadings?.routeLink) ? (
                  <Heading level="h2" size="title">
                    {t(copy?.sectionHeadings?.routeLink)}
                  </Heading>
                ) : null}
                <Text className="mt-3">
                  <a
                    href={branch.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Google Maps&apos;te aç →
                  </a>
                </Text>
              </div>
            ) : null}
          </div>
        </Section>
      </Reveal>
      {/* DSN-77: orijinal sayfa sonundaki Randevu bölümünün karşılığı. */}
      <CtaBand
        title={homePage?.cta?.title ?? null}
        text={homePage?.cta?.text ?? null}
        phone={settings?.phone}
        actionLabel={t(copy?.ui?.appointmentCta)}
      />
    </>
  );
}
