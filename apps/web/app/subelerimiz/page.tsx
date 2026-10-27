import type { Metadata } from "next";

import Image from "next/image";

import { Heading, Reveal, Section, Text } from "@dentaliva/ui";
import { PageHero } from "../../components/page-hero";
import { t } from "../../src/i18n";

import { fetchBranches } from "../../src/content/branches";
import { fetchSiteCopy } from "../../src/content/site-copy";
import { readClient } from "../../src/sanity";
import { pageMetadata } from "../../src/seo";
import { pageString } from "../../src/page-strings";
import { routes } from "../../src/routes";

export const metadata: Metadata = pageMetadata({
  path: routes.branches,
  title: pageString("branchesTitle"),
  description: "Dentaliva şubeleri",
});

export default async function BranchesPage() {
  // DSN-71: hero lead + detay bağlantı metni siteCopy'den (copy yoksa
  // karşılığı render edilmez).
  const [branches, copy] = await Promise.all([
    fetchBranches(readClient),
    fetchSiteCopy(readClient),
  ]);
  const detailLabel = t(copy?.ui?.branchDetailLink);
  const routeLabel = t(copy?.sectionHeadings?.routeLink);

  return (
    <>
      <PageHero
        eyebrow="Dentaliva"
        title={pageString("branchesTitle")}
        lead={t(copy?.sectionHeadings?.branchesLead)}
      />
      <Reveal>
        <Section>
          {branches.length === 0 ? (
            <Text className="mt-6">Şube bilgileri hazırlanıyor.</Text>
          ) : (
            /* DSN-71: yatay şube satırları — foto + tam iletişim (telefon,
               saatler) + yol tarifi; 3 öğeli sayfada kart grid'i yerine
               editorial dizin ritmi. */
            <div className="mt-12 space-y-14 md:space-y-20">
              {branches.map((branch) => (
                <article
                  key={branch.slug}
                  className="grid items-center gap-8 md:grid-cols-[2fr_3fr] md:gap-12"
                >
                  <a
                    href={routes.branch(branch.slug)}
                    aria-label={branch.name}
                    className="group relative block overflow-hidden rounded-[4px] bg-ivory-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
                  >
                    {branch.image?.ref ? (
                      <Image
                        src={branch.image.ref}
                        alt={t(branch.image.alt) || branch.name || ""}
                        width={790}
                        height={637}
                        sizes="(max-width: 768px) 100vw, 40vw"
                        placeholder={branch.image.lqip ? "blur" : "empty"}
                        blurDataURL={branch.image.lqip}
                        className="aspect-[4/3] h-auto w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:transform-none"
                      />
                    ) : null}
                    {/* Altın hairline — hover'da soldan açılır (vitrin dili). */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gold transition-transform duration-500 ease-out group-hover:scale-x-100 motion-reduce:transition-none"
                    />
                  </a>
                  <div>
                    <Heading level="h2" size="md">
                      {branch.name}
                    </Heading>
                    <p className="mt-3 flex items-start gap-2.5 font-sans text-[15px] leading-relaxed text-ink/90">
                      <span aria-hidden="true" className="mt-2.5 h-px w-4 shrink-0 bg-gold" />
                      {t(branch.address)}
                    </p>
                    {branch.phone ? (
                      <a
                        href={`tel:${branch.phone}`}
                        className="mt-3 inline-block font-sans text-base font-medium text-navy underline-offset-4 hover:text-gold-deep hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                      >
                        {branch.phone}
                      </a>
                    ) : null}
                    {t(branch.hours) ? (
                      <p className="mt-2 whitespace-pre-line font-sans text-sm leading-relaxed text-muted">
                        {t(branch.hours)}
                      </p>
                    ) : null}
                    <div className="mt-5 flex flex-wrap items-center gap-6">
                      {detailLabel ? (
                        <a
                          href={routes.branch(branch.slug)}
                          className="font-sans text-sm font-semibold text-navy underline-offset-4 hover:text-gold-deep hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                        >
                          {detailLabel} →
                        </a>
                      ) : null}
                      {branch.mapUrl && routeLabel ? (
                        <a
                          href={branch.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-sans text-sm font-semibold text-gold-deep underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                        >
                          {routeLabel} ↗
                        </a>
                      ) : null}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Section>
      </Reveal>
    </>
  );
}
