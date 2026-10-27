import { schemaObjects } from "@dentaliva/sanity-schema";

import { blogPost } from "./documents/blog-post";
import { branch } from "./documents/branch";
import { clinicPhoto } from "./documents/clinic-photo";
import { doctor } from "./documents/doctor";
import { faq } from "./documents/faq";
import { homePage } from "./documents/home-page";
import { legalPage } from "./documents/legal-page";
import { redirect } from "./documents/redirect";
import { siteCopy } from "./documents/site-copy";
import { siteSettings } from "./documents/site-settings";
import { testimonial } from "./documents/testimonial";
import { treatment } from "./documents/treatment";
import { localeBlockContent } from "./objects/locale-block-content";

/** Singletons: fixed documents, not creatable from the Studio "new" menu. */
export const singletonTypes = ["siteCopy", "siteSettings", "homePage"];

/**
 * Full schema for a clinic site: kernel objects + clinic documents.
 * Studio (apps/studio) consumes this; per-domain behavior comes from
 * env-driven project/dataset config, never from schema changes.
 */
export const schemaTypes = [
  ...schemaObjects,
  localeBlockContent,
  treatment,
  doctor,
  branch,
  clinicPhoto,
  faq,
  testimonial,
  legalPage,
  blogPost,
  redirect,
  homePage,
  siteSettings,
  siteCopy,
];
