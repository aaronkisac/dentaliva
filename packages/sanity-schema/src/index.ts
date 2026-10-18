import { imageWithAlt } from "./objects/image-with-alt";
import { localeString, localeText } from "./objects/locale-text";
import { seo } from "./objects/seo";

export { requireNonEmpty, requireTr, validRedirectTarget, validTrPhone } from "./validation";
export { imageWithAlt } from "./objects/image-with-alt";
export { localeString, localeText, studioLocale } from "./objects/locale-text";
export { seo } from "./objects/seo";

/** Kernel objects every site shares. Documents assemble this in @dentaliva/clinic. */
export const schemaObjects = [localeString, localeText, seo, imageWithAlt];
