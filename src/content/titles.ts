import type { Lang, Localized } from "@/types";
import manifest from "./modules/manifest.json";

/**
 * Module titles, eagerly available.
 *
 * Navigation must render before any module body has been fetched, so titles
 * come from the build-time manifest rather than from the lazy content chunks.
 */
type ManifestEntry = { id: string; title: Localized<string> };

export const MODULE_TITLES: Record<string, Localized<string>> = Object.fromEntries(
  (manifest as ManifestEntry[]).map((m) => [m.id, m.title]),
);

/** Hand-authored modules that do not come from the v1 migration. */
MODULE_TITLES["taste"] = {
  en: "Taste & Flavour Calibration",
  es: "Calibración de sabor y gusto",
};

export function moduleTitle(id: string, lang: Lang): string {
  return MODULE_TITLES[id]?.[lang] ?? MODULE_TITLES[id]?.en ?? id;
}
