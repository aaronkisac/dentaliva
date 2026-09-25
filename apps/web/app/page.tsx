import { HomeSections } from "../components/sections/compose";
import { fetchHomeData } from "../src/content/home";
import { site } from "../src/config";
import { readClient } from "../src/sanity";

export default async function HomePage() {
  const data = await fetchHomeData(readClient);
  return <HomeSections data={data} order={site.sections.home} />;
}
