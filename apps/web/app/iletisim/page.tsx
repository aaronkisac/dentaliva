import type { Metadata } from "next";

import { Heading, Section, Text } from "@dentaliva/ui";

import { fetchHomeData } from "../../src/content/home";
import { readClient } from "../../src/sanity";

export const metadata: Metadata = {
  title: "İletişim",
  description: "Dentaliva iletişim bilgileri",
};

export default async function ContactPage() {
  const data = await fetchHomeData(readClient);
  const settings = data.siteSettings;
  const phone = settings?.phone ?? "";

  return (
    <Section>
      <Heading level="h1" size="lg">
        İletişim
      </Heading>
      <div className="mt-8 grid gap-10 md:grid-cols-2">
        <div className="space-y-4 font-sans text-ink">
          {phone ? (
            <Text size="lg">
              <a href={`tel:${phone}`} className="font-semibold text-navy hover:text-gold-deep">
                {phone}
              </a>
            </Text>
          ) : null}
          {settings?.email ? <Text>{settings.email}</Text> : null}
          <Text tone="muted">
            Randevu ve danışmak için bize ulaşın. Geri arama formu sonraki sürümde eklenecek.
          </Text>
        </div>
        <div className="border border-[var(--dvn-line-gold)] bg-white p-6">
          <Heading level="h2" size="title">
            Randevu
          </Heading>
          <Text className="mt-3">
            Online randevu sistemi hazırlanıyor. Acil durumlar için telefon hattımızı
            kullanabilirsiniz.
          </Text>
        </div>
      </div>
    </Section>
  );
}
