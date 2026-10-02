import type { Metadata } from "next";

import Image from "next/image";

import { Reveal, Card, Heading, Section, Text } from "@dentaliva/ui";
import { PageHero } from "../../components/page-hero";
import { pickLocalized } from "@dentaliva/sanity-schema/client";

import { Link } from "@dentaliva/ui";
import { fetchBranches } from "../../src/content/branches";
import { readClient } from "../../src/sanity";
import { pageMetadata } from "../../src/seo";

export const metadata: Metadata = pageMetadata({
  path: "/subelerimiz",
  title: "Şubelerimiz",
  description: "Dentaliva şubeleri",
});

export default async function BranchesPage() {
  const branches = await fetchBranches(readClient);

  return (
    <>
      <PageHero eyebrow="Dentaliva" title="Şubelerimiz" />
      <Reveal>
        <Section>
          {branches.length === 0 ? (
            <Text className="mt-6">Şube bilgileri hazırlanıyor.</Text>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {branches.map((branch) => (
                <Card key={branch.slug} hover="lift">
                  {branch.image?.ref ? (
                    <Image
                      src={branch.image.ref}
                      alt={branch.name ?? ""}
                      width={600}
                      height={400}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      placeholder={branch.image.lqip ? "blur" : "empty"}
                      blurDataURL={branch.image.lqip}
                      className="h-48 w-full object-cover"
                    />
                  ) : null}
                  <Heading level="h3" size="title">
                    {branch.name}
                  </Heading>
                  <Text className="mt-2">{pickLocalized(branch.address)}</Text>
                  <Link
                    href={`/subelerimiz/${branch.slug}`}
                    className="mt-4 inline-block font-sans text-sm font-semibold text-navy hover:text-gold-deep"
                  >
                    Detay →
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </Section>
      </Reveal>
    </>
  );
}
