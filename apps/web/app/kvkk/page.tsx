import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Heading, Section, Text } from "@dentaliva/ui";
import { pickLocalized } from "@dentaliva/sanity-schema/client";

import { fetchLegalPageBySlug } from "../../src/content/legal";
import { readClient } from "../../src/sanity";
import { pageMetadata } from "../../src/seo";

export const metadata: Metadata = pageMetadata({
  path: "/kvkk",
  title: "KVKK Aydınlatma Metni",
  description: "Kişisel verilerin korunması aydınlatma metni",
});

export default async function KvkkPage() {
  const page = await fetchLegalPageBySlug(readClient, "kvkk");
  if (!page) notFound();

  return (
    <Section>
      <Heading level="h1" size="lg">
        {pickLocalized(page.title) || "KVKK Aydınlatma Metni"}
      </Heading>
      <Text className="mt-6 max-w-3xl whitespace-pre-line">{pickLocalized(page.body)}</Text>
    </Section>
  );
}
