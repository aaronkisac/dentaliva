import type { Metadata } from "next";

import { HomeSections } from "../components/sections/compose";
import { fetchHomeData } from "../src/content/home";
import { site } from "../src/config";
import { readClient } from "../src/sanity";
import { pageMetadata } from "../src/seo";
import { pageString } from "../src/page-strings";

export const metadata: Metadata = pageMetadata({
  path: "/",
  title: pageString("homeTitle"),
  description: pageString("homeDescription"),
  absoluteTitle: true,
});

export default async function HomePage() {
  const data = await fetchHomeData(readClient);
  return <HomeSections data={data} order={site.sections.home} />;
}
