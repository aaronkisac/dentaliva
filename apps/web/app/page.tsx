import type { Metadata } from "next";

import { HomeSections } from "../components/sections/compose";
import { fetchHomeData, fetchHomePageDocument } from "../src/content/home";
import { site } from "../src/config";
import { readClient } from "../src/sanity";
import { pageMetadata } from "../src/seo";
import { pageString } from "../src/page-strings";

// DSN-101: ana sayfa artık hero (banner) görseliyle paylaşılıyor. Görsel
// fetchHomePageDocument'ten gelir — cache'li fetcher olduğundan sayfanın
// kendi sorgusuyla dedupe olur (PRF-5); ayrı sorgu maliyeti yok.
export async function generateMetadata(): Promise<Metadata> {
  const homePage = await fetchHomePageDocument(readClient).catch(() => null);
  const ogRef =
    homePage?.hero?.image?.asset?._ref ??
    homePage?.hero?.banners?.find((banner) => banner.image?.asset?._ref)?.image?.asset?._ref;
  return pageMetadata({
    path: "/",
    title: pageString("homeTitle"),
    description: pageString("homeDescription"),
    absoluteTitle: true,
    alternateKey: "home",
    ...(ogRef ? { ogImageRef: ogRef, ogImageAlt: pageString("homeTitle") } : {}),
  });
}

export default async function HomePage() {
  const data = await fetchHomeData(readClient);
  return <HomeSections data={data} order={site.sections.home} />;
}
