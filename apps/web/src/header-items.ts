import type { NavLink } from "@dentaliva/ui";

import type { SiteConfig } from "./config-types";
import type { LocalizedPair } from "./content/home";
import type { SiteCopy } from "./content/site-copy";
import { t } from "./i18n";
import { routes } from "./routes";

/**
 * Header nav'ını CMS mega menü verisiyle birleştirir: siteCopy.navMenu
 * grupları (sıfır-hardcoded-copy) yalnızca Tedaviler bağlantısına eklenir.
 * Menü boşsa bağlantı düz kalır — açılır menü render edilmez. Referansı
 * slugsuz tedaviler ve tamamen boş gruplar (başlıksız + linksiz) sessizce düşer.
 */
export function buildHeaderItems(site: SiteConfig, siteCopy: SiteCopy | null): NavLink[] {
  const groups = (siteCopy?.navMenu ?? [])
    .map((group) => ({
      heading: t(group.heading) || undefined,
      headingHref: group.headingPage?.slug ? routes.treatment(group.headingPage.slug) : undefined,
      links: (group.treatments ?? [])
        .filter((treatment): treatment is { name?: LocalizedPair; slug: string } =>
          Boolean(treatment?.slug),
        )
        .map((treatment) => ({
          label: t(treatment.name),
          href: routes.treatment(treatment.slug),
        })),
    }))
    .filter((group) => group.links.length > 0 || Boolean(group.heading));

  const menuAllLink = t(siteCopy?.ui?.menuAllLink);

  return site.nav.map((item) => {
    if (item.href !== site.routes.treatments || groups.length === 0) return item;
    return {
      ...item,
      menu: {
        groups,
        ...(menuAllLink ? { all: { label: menuAllLink, href: routes.treatments } } : {}),
      },
    };
  });
}
