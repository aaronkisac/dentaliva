import type { Metadata } from "next";

import { buildDentistJsonLd } from "@dentaliva/seo";

import { JsonLd } from "../components/json-ld";
import { site } from "../src/config";
import { fetchSiteSettings } from "../src/content/home";
import { fetchSiteCopy } from "../src/content/site-copy";
import { t } from "../src/i18n";
import { readClient } from "../src/sanity";
import { siteUrl } from "../src/seo";
import { fontVariables } from "../src-fonts";
import { Footer } from "@dentaliva/ui";
import { Header } from "@dentaliva/ui";
import type { FooterContact } from "@dentaliva/ui";

import "./globals.css";
import { uiString } from "../src/ui-strings";
import { pageString } from "../src/page-strings";
import { routes } from "../src/routes";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Dentaliva", template: "%s | Dentaliva" },
  description: pageString("metaDescription"),
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // PRF-5: cache'li tekil fetcher — request scope'unda dedupe edilir ve
  // fetchHomeData ile aynı isteği paylaşır; Sanity erişilemezse null (build
  // resilience, içerik webhook yeniden derlemesinde gelir).
  const settings = await fetchSiteSettings(readClient);
  // DSN-44: footer sütun başlıkları siteCopy singleton'dan (sıfır-hardcoded-copy).
  const siteCopy = await fetchSiteCopy(readClient);
  const siteName = settings?.siteName ?? "Dentaliva";
  const contact: FooterContact | undefined = settings
    ? {
        phone: settings.phone ?? "",
        email: settings.email ?? "",
        address: t(settings.address),
        hours: t(settings.hours),
      }
    : undefined;
  // SEO-5: one Dentist entity for the whole site; needs at least the phone,
  // so a fresh clone with empty CMS simply renders without it.
  const orgJsonLd =
    settings?.phone && t(settings.address)
      ? buildDentistJsonLd({
          name: siteName,
          url: siteUrl,
          phone: settings.phone,
          ...(settings.email ? { email: settings.email } : {}),
          streetAddress: t(settings.address),
          city: pageString("jsonLdCity"),
          ...(t(settings.hours) ? { openingHours: t(settings.hours) } : {}),
          sameAs: (settings.social ?? [])
            .filter((s): s is { platform: string; url: string } => Boolean(s.platform && s.url))
            .map((s) => s.url),
        })
      : null;

  return (
    <html lang={site.defaultLocale} className={fontVariables}>
      <body className="bg-ivory text-ink antialiased">
        {/* PRF-3/PRF-5: display: optional yalnızca preload ile çalışır —
            başlık (Cormorant) ve gövde (Montserrat, tr için latin + latin-ext)
            fontları ilk boyamadan önce hazırda bekler. */}
        <link
          rel="preload"
          href="/fonts/cormorant-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/cormorant-latin-ext.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/montserrat-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/montserrat-latin-ext.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {orgJsonLd ? <JsonLd data={orgJsonLd} /> : null}
        {/* PRF-2: keyboard users skip the nav straight to <main id="icerik">. */}
        <a
          href={`#${pageString("skipAnchor")}`}
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-navy focus:px-4 focus:py-2 focus:font-sans focus:text-sm focus:text-white"
        >
          {pageString("skipLabel")}
        </a>
        <Header
          items={site.nav}
          logo={<span className="font-serif text-2xl">{siteName}</span>}
          cta={{ label: uiString("bookCta"), href: routes.contact }}
          labels={{ toggleMenu: pageString("toggleMenu"), closeMenu: pageString("closeMenu") }}
          contact={
            settings?.phone ? { phone: settings.phone, email: settings.email ?? "" } : undefined
          }
        />
        <main id={pageString("skipAnchor")} tabIndex={-1}>
          {children}
        </main>
        <Footer
          columns={site.nav.map((item) => ({ title: item.label, links: [item] }))}
          contact={contact ?? { phone: "", email: "", address: "", hours: "" }}
          social={(settings?.social ?? [])
            .filter((s): s is { platform: string; url: string } => Boolean(s.platform && s.url))
            .map((s) => ({ label: s.platform, href: s.url }))}
          copyright={`© Copyright ${siteName} ${new Date().getFullYear()}`}
          labels={{
            contact: t(siteCopy?.footer?.contactHeading),
            quickLinks: t(siteCopy?.footer?.quickLinksHeading),
            follow: t(siteCopy?.footer?.followHeading),
          }}
        />
      </body>
    </html>
  );
}
