import type { Metadata } from "next";

import { Heading, Section, Text } from "@dentaliva/ui";
import { pickLocalized } from "@dentaliva/sanity-schema/client";

import { fetchHomeData } from "../../src/content/home";
import { readClient } from "../../src/sanity";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "Dentaliva hakkında",
};

export default async function AboutPage() {
  const data = await fetchHomeData(readClient);
  const about = data.homePage?.about ?? null;

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
