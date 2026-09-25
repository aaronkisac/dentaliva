import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { pickLocalized } from "@dentaliva/sanity-schema/client";

import { Heading, Section, Text } from "@dentaliva/ui";
import { fetchBranchBySlug, fetchBranches } from "../../../src/content/branches";
import { readClient } from "../../../src/sanity";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const branches = await fetchBranches(readClient);
  return branches
    .filter((branch): branch is typeof branch & { slug: string } => Boolean(branch.slug))
    .map((branch) => ({ slug: branch.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const branch = await fetchBranchBySlug(readClient, slug);
  return { title: branch?.name ?? "Şube" };
}

export default async function BranchDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const branch = await fetchBranchBySlug(readClient, slug);
  if (!branch) notFound();

  return (
    <>
      <Section className="bg-navy">
        <Heading level="h1" size="lg" className="text-white">
          {branch.name}
        </Heading>
        <Text size="lg" tone="white" className="mt-4">
          {pickLocalized(branch.address)}
        </Text>
      </Section>
      <Section>
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <Heading level="h2" size="title">
              İletişim
            </Heading>
            <Text className="mt-3">
              <a href={`tel:${branch.phone}`} className="hover:text-gold-deep">
                {branch.phone}
              </a>
            </Text>
            {branch.hours?.tr ? <Text className="mt-2">{pickLocalized(branch.hours)}</Text> : null}
          </div>
          {branch.mapUrl ? (
            <div>
              <Heading level="h2" size="title">
                Yol Tarifi
              </Heading>
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
    </>
  );
}
