import type { Lang, ModuleContent } from "@/types";

/**
 * Lazy content loading.
 *
 * Module bodies are large, so they are code-split per module per language and
 * fetched on demand. The shell, navigation and dashboard render from metadata
 * alone, which keeps the first paint small on a phone.
 */
// Matches "<id>.<lang>.json" only — manifest.json is eagerly imported elsewhere
// and must not be pulled into the lazy content chunks.
const loaders = import.meta.glob<{ default: ModuleContent }>("./modules/*.*.json");

const cache = new Map<string, ModuleContent>();

function key(id: string, lang: Lang) {
  return `${id}.${lang}`;
}

export function getCached(id: string, lang: Lang): ModuleContent | undefined {
  return cache.get(key(id, lang));
}

/**
 * Load one module in one language. Falls back to English when a translation is
 * not present, so a partially translated module is still readable.
 */
export async function loadModule(id: string, lang: Lang): Promise<ModuleContent | null> {
  const cached = cache.get(key(id, lang));
  if (cached) return cached;

  const path = `./modules/${id}.${lang}.json`;
  const loader = loaders[path];
  if (loader) {
    const mod = await loader();
    cache.set(key(id, lang), mod.default);
    return mod.default;
  }

  if (lang !== "en") return loadModule(id, "en");
  return null;
}

/** True when a module has content authored in the given language. */
export function hasTranslation(id: string, lang: Lang): boolean {
  return `./modules/${id}.${lang}.json` in loaders;
}
