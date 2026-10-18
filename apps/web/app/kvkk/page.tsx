import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Heading, Section, Text } from "@dentaliva/ui";
import { t } from "../../src/i18n";

import { fetchLegalPageBySlug } from "../../src/content/legal";
import { readClient } from "../../src/sanity";
import { pageMetadata } from "../../src/seo";
import { pageString } from "../../src/page-strings";

export const metadata: Metadata = pageMetadata({
  path: "/kvkk",
  title: pageString("legalTitle"),
  description: pageString("legalDescription"),
});

export default async function KvkkPage() {
  const page = await fetchLegalPageBySlug(readClient, "kvkk");
  if (!page) notFound();

  // DSN-35: hukuki metin tipografisi — çift satır sonlarına göre paragraf
  // bölünür (müşteri onaylı gerçek metin geldiğinde de aynı düzen çalışır).
  const paragraphs = t(page.body)
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <Section>
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className="h-px w-8 bg-gold" />
        <p className="font-sans text-xs uppercase tracking-widest text-gold-deep">Dentaliva</p>
      </div>
      <Heading level="h1" size="lg" className="mt-4">
        {t(page.title) || pageString("legalTitle")}
      </Heading>
      <div className="mt-8 max-w-3xl space-y-4">
        {paragraphs.map((paragraph, index) => (
          <Text key={index} className="leading-relaxed">
            {paragraph}
          </Text>
        ))}
      </div>
    </Section>
  );
}
