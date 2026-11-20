import type { Metadata } from "next";

import Image from "next/image";

import { t, tBlocks } from "../../../src/i18n";
import { buildBreadcrumbJsonLd, buildDentistJsonLd } from "@dentaliva/seo";

import { Reveal, Section } from "@dentaliva/ui";
import { JsonLd } from "../../../components/json-ld";
import { CtaBand } from "../../../components/cta-band";
import { GalleryLightbox } from "../../../components/lightbox";
import { PageHero } from "../../../components/page-hero";
import { PortableTextSections } from "../../../components/portable-text-sections";
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

/** DSN-38 ikon dili — iletişim kartı satırlarında küçük stroke ikonlar. */
function CardIcon({ kind }: { kind: "pin" | "phone" | "mail" | "clock" }) {
  const paths: Record<typeof kind, string> = {
    pin: "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
    phone:
      "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z",
    mail: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 2 8 6 8-6",
    clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M12 6v6l4 2",
  };
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-1 h-4 w-4 shrink-0 text-gold-deep"
    >
      <path d={paths[kind]} />
    </svg>
  );
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
    alternateKey: "branches",
    // DSN-101: şube sayfası kendi fotoğrafıyla paylaşılır (WhatsApp kartı).
    ...(branch.image?.ref
      ? { ogImageRef: branch.image.ref, ogImageAlt: branch.name ?? t(branch.address) }
      : {}),
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
  // DSN-101: şube-başına LocalBusiness (Dentist) varlığı — local pack sinyali.
  // NAP/geo verisi zaten branch dokümanında; eksikse varlık basılmaz.
  const branchJsonLd =
    branch.phone && t(branch.address)
      ? buildDentistJsonLd({
          name: branch.name ?? "",
          url: absoluteUrl(routes.branch(branch.slug)),
          phone: branch.phone,
          streetAddress: t(branch.address),
          city: pageString("jsonLdCity"),
          ...(t(branch.hours) ? { openingHours: t(branch.hours) } : {}),
          ...(branch.geo?.lat !== undefined && branch.geo?.lng !== undefined
            ? { geo: { lat: branch.geo.lat, lng: branch.geo.lng } }
            : {}),
        })
      : null;

  return (
    <>
      {branchJsonLd ? <JsonLd data={branchJsonLd} /> : null}
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
          {/* DSN-93: orijinalin gövdesi editoryal bantlarda — veri bulgusu:
              üç şubede de 1 h2 (SEO satırı) + h3 bölümler; splitAt="h3"
              h3'lerde böler, h2 + öncesi intro olur. */}
          <PortableTextSections blocks={blocks} splitAt="h3" />
        </Reveal>
      ) : null}
      <Reveal>
        <Section>
          {/* DSN-82: alıcı-göz turu — iletişim artık kart + eylemler +
              orijinal gibi tam genişlikte harita; başlık siteCopy'den
              (branchContact), copy yoksa yalnız başlık render edilmez. */}
          {t(copy?.sectionHeadings?.branchContact) ? (
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-gold" />
              <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-gold">
                {t(copy?.sectionHeadings?.branchContact)}
              </h2>
            </div>
          ) : null}
          <div className="grid gap-8 pt-6 md:grid-cols-[3fr_2fr] md:items-center">
            <div className="rounded-[4px] border border-[var(--dvn-line)] bg-white p-6 md:p-8">
              {/* SUBE-1 sırası (Telefon / E-mail / Lokasyon / Çalışma
                  Saatleri) DSN-38 ikonlu satır dilinde. */}
              <ul className="space-y-4">
                {branch.phone ? (
                  <li className="flex items-start gap-2.5">
                    <CardIcon kind="phone" />
                    <a
                      href={`tel:${branch.phone}`}
                      className="font-sans text-lg font-semibold text-navy underline-offset-4 hover:text-gold-deep hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                    >
                      {branch.phone}
                    </a>
                  </li>
                ) : null}
                {settings?.email ? (
                  <li className="flex items-start gap-2.5">
                    <CardIcon kind="mail" />
                    <a
                      href={`mailto:${settings.email}`}
                      className="font-sans text-base text-ink underline-offset-4 hover:text-gold-deep hover:underline"
                    >
                      {settings.email}
                    </a>
                  </li>
                ) : null}
                {t(branch.address) ? (
                  <li className="flex items-start gap-2.5">
                    <CardIcon kind="pin" />
                    <span className="font-sans text-sm leading-relaxed text-ink/80">
                      {t(branch.address)}
                    </span>
                  </li>
                ) : null}
                {t(branch.hours) ? (
                  <li className="flex items-start gap-2.5">
                    <CardIcon kind="clock" />
                    <span className="font-sans text-sm leading-relaxed text-muted">
                      {t(branch.hours)}
                    </span>
                  </li>
                ) : null}
              </ul>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              {t(copy?.ui?.appointmentCta) ? (
                <a
                  href={routes.contact}
                  className="inline-flex items-center justify-center bg-gold px-6 py-3 font-sans text-sm font-semibold uppercase tracking-widest text-navy transition-colors duration-300 hover:bg-gold-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                >
                  {t(copy?.ui?.appointmentCta)}
                </a>
              ) : null}
              {branch.mapUrl && t(copy?.sectionHeadings?.routeLink) ? (
                <a
                  href={branch.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center border border-[var(--dvn-line-gold)] px-6 py-3 font-sans text-sm font-semibold uppercase tracking-widest text-navy transition-colors duration-300 hover:bg-navy hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                >
                  {t(copy?.sectionHeadings?.routeLink)} ↗
                </a>
              ) : null}
            </div>
          </div>
          {/* DSN-77/82: orijinalin isim-bazlı harita gömmesi; alan boşsa
              koordinat embed'i fallback. Orijinaldeki gibi tam genişlik +
              sabit yükseklik. */}
          {branch.mapEmbedUrl || branch.geo ? (
            <div className="mt-8">
              <iframe
                title={branch.name ?? "Şube"}
                src={
                  branch.mapEmbedUrl ??
                  `https://maps.google.com/maps?q=${branch.geo?.lat},${branch.geo?.lng}&z=15&output=embed`
                }
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[380px] w-full rounded-[4px] border border-[var(--dvn-line)] md:h-[500px]"
              />
            </div>
          ) : null}
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
