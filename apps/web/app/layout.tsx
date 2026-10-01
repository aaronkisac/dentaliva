import type { Metadata } from "next";

import { buildDentistJsonLd } from "@dentaliva/seo";

import { JsonLd } from "../components/json-ld";
import { site } from "../src/config";
import { fetchSiteSettings } from "../src/content/home";
import { readClient } from "../src/sanity";
import { siteUrl } from "../src/seo";
import { fontVariables } from "../src-fonts";
import { Footer } from "@dentaliva/ui";
import { Header } from "@dentaliva/ui";
import type { FooterContact } from "@dentaliva/ui";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Dentaliva", template: "%s | Dentaliva" },
  description: "Dentaliva Diş Kliniği — İstanbul'da implant, ortodonti ve estetik diş hekimliği",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // PRF-5: cache'li tekil fetcher — request scope'unda dedupe edilir ve
  // fetchHomeData ile aynı isteği paylaşır; Sanity erişilemezse null (build
  // resilience, içerik webhook yeniden derlemesinde gelir).
  const settings = await fetchSiteSettings(readClient);
  const siteName = settings?.siteName ?? "Dentaliva";
  const contact: FooterContact | undefined = settings
    ? {
        phone: settings.phone ?? "",
        email: settings.email ?? "",
        address: settings.address?.tr ?? "",
        hours: settings.hours?.tr ?? "",
      }
    : undefined;
  // SEO-5: one Dentist entity for the whole site; needs at least the phone,
  // so a fresh clone with empty CMS simply renders without it.
  const orgJsonLd =
    settings?.phone && settings.address?.tr
      ? buildDentistJsonLd({
          name: siteName,
          url: siteUrl,
          phone: settings.phone,
          ...(settings.email ? { email: settings.email } : {}),
          streetAddress: settings.address.tr,
          city: "İstanbul",
          ...(settings.hours?.tr ? { openingHours: settings.hours.tr } : {}),
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
          href="#icerik"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-navy focus:px-4 focus:py-2 focus:font-sans focus:text-sm focus:text-white"
        >
          İçeriğe atla
        </a>
        <Header
          items={site.nav}
          logo={<span className="font-serif text-2xl">{siteName}</span>}
          cta={{ label: "Randevu Al", href: "/iletisim" }}
          contact={
            settings?.phone ? { phone: settings.phone, email: settings.email ?? "" } : undefined
          }
        />
        <main id="icerik" tabIndex={-1}>
          {children}
        </main>
        <Footer
          columns={site.nav.map((item) => ({ title: item.label, links: [item] }))}
          contact={contact ?? { phone: "", email: "", address: "", hours: "" }}
          social={(settings?.social ?? [])
            .filter((s): s is { platform: string; url: string } => Boolean(s.platform && s.url))
            .map((s) => ({ label: s.platform, href: s.url }))}
          copyright={`© Copyright ${siteName} ${new Date().getFullYear()}`}
        />
      </body>
    </html>
  );
}
