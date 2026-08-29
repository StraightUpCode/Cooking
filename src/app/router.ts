import { useCallback, useEffect, useSyncExternalStore } from "react";
import { MODULE_BY_ID } from "@/data/curriculum";

/**
 * A tiny History-API router. The app has a handful of routes and no data
 * loading requirements, so a router library would be more machinery than the
 * problem needs.
 */

export type Route =
  | { name: "dashboard" }
  | { name: "module"; slug: string; hash?: string }
  | { name: "skills"; id?: string }
  | { name: "ingredients"; id?: string }
  | { name: "reference" }
  | { name: "log" }
  | { name: "notFound"; path: string };

const listeners = new Set<() => void>();
let current = parse(location.pathname + location.hash);

function emit() {
  current = parse(location.pathname + location.hash);
  for (const l of listeners) l();
}

/**
 * v1 of the manual was a single page using hash links (#m1, #tools).
 * Those links exist in the wild, so translate them rather than 404.
 */
function legacyHashRedirect(): string | null {
  const hash = location.hash.replace(/^#/, "");
  if (!hash) return null;
  if (hash === "home") return "/";
  if (hash === "tools") return "/reference";
  const meta = MODULE_BY_ID.get(hash);
  if (meta) return `/module/${meta.slug}`;
  return null;
}

export function parse(full: string): Route {
  const [pathPart, hashPart] = full.split("#");
  const path = (pathPart || "/").replace(/\/+$/, "") || "/";
  const segments = path.split("/").filter(Boolean);

  if (segments.length === 0) return { name: "dashboard" };

  const [head, second] = segments;
  switch (head) {
    case "module":
      return second
        ? { name: "module", slug: second, ...(hashPart ? { hash: hashPart } : {}) }
        : { name: "notFound", path };
    case "skills":
      return second ? { name: "skills", id: second } : { name: "skills" };
    case "ingredients":
      return second ? { name: "ingredients", id: second } : { name: "ingredients" };
    case "reference":
      return { name: "reference" };
    case "log":
      return { name: "log" };
    default:
      return { name: "notFound", path };
  }
}

export function navigate(to: string, opts: { replace?: boolean } = {}) {
  const url = new URL(to, location.origin);
  if (url.pathname + url.hash === location.pathname + location.hash) return;
  if (opts.replace) history.replaceState(null, "", url);
  else history.pushState(null, "", url);
  emit();
}

export function initRouter() {
  const redirect = legacyHashRedirect();
  if (redirect) history.replaceState(null, "", redirect);
  window.addEventListener("popstate", emit);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useRoute(): Route {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => current,
  );
}

/**
 * Intercepts clicks on internal links so they route client-side while staying
 * real anchors — middle-click, "open in new tab" and keyboard access all keep
 * working, which they would not with a button.
 */
export function useLinkHandler() {
  return useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    const href = event.currentTarget.getAttribute("href");
    if (!href || !href.startsWith("/")) return;
    event.preventDefault();
    navigate(href);
  }, []);
}

/** Scroll to a hash target once content for the route has rendered. */
export function useHashScroll(hash: string | undefined, ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    const el = document.getElementById(hash);
    if (el) el.scrollIntoView({ block: "start" });
    else window.scrollTo(0, 0);
  }, [hash, ready]);
}
