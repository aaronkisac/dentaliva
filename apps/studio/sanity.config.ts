import { schemaTypes, singletonTypes } from "@dentaliva/clinic";
import { studioLocale } from "@dentaliva/sanity-schema";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

// One Studio codebase, deployed per domain via env (ADR-002/ARCHITECTURE §4).
// Fallbacks keep `sanity build` green in CI before real projects exist (SAN-6).
const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? "dentaliva";
const dataset = process.env.SANITY_STUDIO_DATASET ?? "production";

// The locale tag distinguishes the three deployments in sanity.io/manage's
// "Studios & Apps" list, which would otherwise show three identical names.
const localeTag = { tr: "TR", en: "EN", nl: "NL" } as const;

export default defineConfig({
  name: "dentaliva",
  title: `Dentaliva Studio (${localeTag[studioLocale]})`,
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Dentaliva")
          .items([
            S.listItem()
              .title("Site Ayarları")
              .id("siteSettings")
              .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
            S.listItem()
              .title("Ana Sayfa")
              .id("homePage")
              .child(S.document().schemaType("homePage").documentId("homePage")),
            // DSN-95: Site Metinleri singleton'ı listede yoktu — Aaron site
            // copy'lerini Studio'dan düzenleyemiyordu (yalnız global aramayla
            // bulunuyordu). Ana sayfa ile aynı singleton desenine alındı.
            S.listItem()
              .title("Site Metinleri")
              .id("siteCopy")
              .child(S.document().schemaType("siteCopy").documentId("siteCopy")),
            S.divider(),
            S.documentTypeListItem("treatment").title("Tedaviler"),
            S.documentTypeListItem("doctor").title("Hekimler"),
            S.documentTypeListItem("branch").title("Şubeler"),
            S.documentTypeListItem("clinicPhoto").title("Klinik Fotoğrafları"),
            S.documentTypeListItem("faq").title("SSS"),
            S.documentTypeListItem("testimonial").title("Hasta Yorumları"),
            S.documentTypeListItem("blogPost").title("Blog"),
            S.documentTypeListItem("legalPage").title("Yasal Sayfalar"),
            S.documentTypeListItem("redirect").title("Yönlendirmeler"),
          ]),
    }),
  ],
  schema: { types: schemaTypes },
  document: {
    // Singletons are reachable from the desk; hide them from "create new".
    newDocumentOptions: (prev) =>
      prev.filter((item) => !(singletonTypes as readonly string[]).includes(item.templateId)),
  },
});
