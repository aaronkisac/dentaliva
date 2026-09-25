import type { Metadata } from "next";

import { Card, Heading, Section, Text } from "@dentaliva/ui";
import { pickLocalized } from "@dentaliva/sanity-schema/client";

import { Link } from "@dentaliva/ui";
import { fetchBranches } from "../../src/content/branches";
import { readClient } from "../../src/sanity";

export const metadata: Metadata = {
  title: "Şubelerimiz",
  description: "Dentaliva şubeleri",
};

export default async function BranchesPage() {
  const branches = await fetchBranches(readClient);

  return (
    <Section>
      <Heading level="h1" size="lg">
        Şubelerimiz
      </Heading>
      {branches.length === 0 ? (
        <Text className="mt-6">Şube bilgileri hazırlanıyor.</Text>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {branches.map((branch) => (
            <Card key={branch.slug} hover="lift">
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
  );
}
