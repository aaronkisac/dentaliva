import type { Metadata } from "next";

import { site } from "../src/config";
import { readClient } from "../src/sanity";
import { fontVariables } from "../src-fonts";
import { Footer } from "@dentaliva/ui";
import { Header } from "@dentaliva/ui";
import type { FooterContact } from "@dentaliva/ui";

import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Dentaliva", template: "%s | Dentaliva" },
  description: "Dental clinic in Istanbul",
};

interface SiteSettingsFetch {
  siteName?: string;
  phone?: string;
  email?: string;
  hours?: { tr?: string };
  address?: { tr?: string };
  social?: Array<{ platform?: string; url?: string }>;
}

async function fetchSiteSettings(): Promise<SiteSettingsFetch | null> {
  try {
    const data: SiteSettingsFetch | null = await readClient.fetch(`*[_type == "siteSettings"][0]`);
    return data;
  } catch {
    // Build resilience: a unreachable Sanity must not break the export;
    // content lands on the next rebuild after the webhook fires.
    return null;
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await fetchSiteSettings();
  const siteName = settings?.siteName ?? "Dentaliva";
  const contact: FooterContact | undefined = settings
    ? {
        phone: settings.phone ?? "",
        email: settings.email ?? "",
        address: settings.address?.tr ?? "",
        hours: settings.hours?.tr ?? "",
      }
    : undefined;

  return (
    <html lang={site.defaultLocale} className={fontVariables}>
      <body className="bg-ivory text-ink antialiased">
        <Header
          items={site.nav}
          logo={<span className="font-serif text-2xl text-navy">{siteName}</span>}
          contact={
            settings?.phone ? { phone: settings.phone, email: settings.email ?? "" } : undefined
          }
        />
        {children}
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
