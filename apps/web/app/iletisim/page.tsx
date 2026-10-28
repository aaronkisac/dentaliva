import type { Metadata } from "next";

import { CallbackForm } from "../../components/CallbackForm";
import { PageHero } from "../../components/page-hero";
import { Heading, Section, Text } from "@dentaliva/ui";
import { t } from "../../src/i18n";

import { fetchBranches } from "../../src/content/branches";
import { fetchSiteSettings } from "../../src/content/home";
import { fetchSiteCopy } from "../../src/content/site-copy";
import { readClient } from "../../src/sanity";
import { pageMetadata } from "../../src/seo";
import { pageString } from "../../src/page-strings";
import { routes } from "../../src/routes";

export const metadata: Metadata = pageMetadata({
  path: routes.contact,
  title: pageString("contactTitle"),
  description: "Dentaliva iletişim bilgileri",
});

export default async function ContactPage() {
  // PRF-5: sayfa yalnızca site ayarlarını + şube NAP verisini kullanır —
  // 6 sorguluk fetchHomeData yerine tekil (cache'li) fetch'ler.
  const [settings, branches, copy] = await Promise.all([
    fetchSiteSettings(readClient),
    fetchBranches(readClient),
    fetchSiteCopy(readClient),
  ]);
  const phone = settings?.phone ?? "";

  return (
    <>
      {/* DSN-41: tüm sayfalarla aynı hero kalıbı (çıplak H1 değil) + sol
          kolondaki ölü alan şube NAP verileriyle kapanıyor. Harita facade'ı
          ayrı iş. */}
      <PageHero eyebrow="Dentaliva" title={pageString("contactTitle")} />
      <Section>
        <div className="grid gap-10 md:grid-cols-2">
          <div className="space-y-8">
            <div className="space-y-4 font-sans text-ink">
              {phone ? (
                <Text size="lg">
                  <a href={`tel:${phone}`} className="font-semibold text-navy hover:text-gold-deep">
                    {phone}
                  </a>
                </Text>
              ) : null}
              {settings?.email ? <Text>{settings.email}</Text> : null}
              {t(settings?.hours) ? <Text tone="muted">{t(settings?.hours)}</Text> : null}
            </div>
            {branches.length > 0 ? (
              <div className="space-y-5">
                {branches.map((branch) => (
                  <div key={branch.slug}>
                    <Heading level="h2" size="title">
                      {branch.name}
                    </Heading>
                    <Text tone="muted" className="mt-1">
                      {t(branch.address)}
                    </Text>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          <div className="border border-[var(--dvn-line-gold)] bg-white p-6">
            {t(copy?.sectionHeadings?.callbackForm) ? (
              <Heading level="h2" size="title">
                {t(copy?.sectionHeadings?.callbackForm)}
              </Heading>
            ) : null}
            <div className="mt-4">
              <CallbackForm privacyHref={routes.legal} />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
