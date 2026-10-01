import type { Metadata } from "next";

import { Heading, Section, Text } from "@dentaliva/ui";
import { pickLocalized } from "@dentaliva/sanity-schema/client";

import { fetchHomePageDocument } from "../../src/content/home";
import { readClient } from "../../src/sanity";
import { pageMetadata } from "../../src/seo";

export const metadata: Metadata = pageMetadata({
  path: "/hakkimizda",
  title: "Hakkımızda",
  description: "Dentaliva hakkında",
});

export default async function AboutPage() {
  // PRF-5: yalnızca homePage dokümanı — liste sorguları çekilmez.
  const about = (await fetchHomePageDocument(readClient))?.about ?? null;

  return (
    <Section>
      <Heading level="h1" size="lg">
        Hakkımızda
      </Heading>
      <Text className="mt-6 max-w-3xl whitespace-pre-line">
        {about ? pickLocalized(about.body) : "İçerik hazırlanıyor."}
      </Text>
    </Section>
  );
}
