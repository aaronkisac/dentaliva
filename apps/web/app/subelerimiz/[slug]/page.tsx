import type { Metadata } from "next";

import Image from "next/image";

import { t } from "../../../src/i18n";
import { buildBreadcrumbJsonLd } from "@dentaliva/seo";

import { Reveal, Heading, Section, Text } from "@dentaliva/ui";
import { JsonLd } from "../../../components/json-ld";
import { PageHero } from "../../../components/page-hero";
import { fetchBranchBySlug, fetchBranches } from "../../../src/content/branches";
import { fetchSiteCopy } from "../../../src/content/site-copy";
import { readClient } from "../../../src/sanity";
import { absoluteUrl, pageMetadata } from "../../../src/seo";
import { SeedPlaceholder } from "../../../components/seed-placeholder";
import { uiString } from "../../../src/ui-strings";

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
    path: `/subelerimiz/${slug}`,
    title: branch.name ?? "Şube",
    description: t(branch.address),
    seo: branch.seo,
  });
}

export default async function BranchDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [branch, copy] = await Promise.all([
    fetchBranchBySlug(readClient, slug),
    fetchSiteCopy(readClient),
  ]);
  if (!branch) {
    return <SeedPlaceholder title="Şube" />;
  }

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: uiString("breadcrumbHome"), url: absoluteUrl("/") },
          { name: uiString("branchesTitle"), url: absoluteUrl("/subelerimiz") },
          { name: branch.name ?? "Şube", url: absoluteUrl(`/subelerimiz/${slug}`) },
        ])}
      />
      <PageHero
        eyebrow={uiString("branchesTitle")}
        eyebrowHref="/subelerimiz"
        title={branch.name ?? "Şube"}
        lead={t(branch.address) ? t(branch.address) : null}
      />
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
              {t(branch.hours) ? <Text className="mt-2">{t(branch.hours)}</Text> : null}
            </div>
            {branch.geo ? (
              <div className="md:col-span-2">
                <iframe
                  title={`${branch.name ?? "Şube"} konum haritası`}
                  src={`https://maps.google.com/maps?q=${branch.geo.lat},${branch.geo.lng}&z=15&output=embed`}
                  loading="lazy"
                  className="aspect-video w-full border border-[var(--dvn-line)]"
                />
              </div>
            ) : null}
            {branch.image?.ref ? (
              <div className="md:col-span-2">
                <Image
                  src={branch.image.ref}
                  alt={branch.name ?? ""}
                  width={1200}
                  height={600}
                  sizes="(max-width: 900px) 100vw, 1180px"
                  className="h-auto w-full border border-[var(--dvn-line)] object-cover"
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
    </>
  );
}
