/**
 * dentaliva.eu segment (INT-6): re-exports the treatments listing. The
 * implementation lives in the Turkish directory and resolves site-specific
 * routes, locale and content at build time (ADR-004); prune-routes.mjs
 * removes inactive segments from the export output after the build.
 */
export { default, metadata } from "../hizmetlerimiz/page";
