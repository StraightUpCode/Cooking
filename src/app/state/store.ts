import { useCallback, useSyncExternalStore } from "react";
import type { Lang, LogEntry, ProgressState } from "@/types";
import { EMPTY_PROGRESS } from "@/types";

/**
 * Learner state.
 *
 * Deliberately a tiny hand-rolled store over localStorage rather than a
 * database: progress is personal, offline-friendly and small. Everything is
 * keyed on stable content IDs, never on translated strings, so switching
 * language never disturbs progress.
 *
 * The shape is a plain serialisable object so it could be synced to a backend
 * later without redesigning anything.
 */

const KEY = "klm.progress.v1";
const LANG_KEY = "klm.lang";
const THEME_KEY = "klm.theme";

export type Theme = "light" | "dark" | "system";

interface AppState {
  progress: ProgressState;
  lang: Lang;
  theme: Theme;
}

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return { ...fallback, ...(JSON.parse(raw) as T) };
  } catch {
    return fallback;
  }
}

function detectLang(): Lang {
  try {
    const stored = localStorage.getItem(LANG_KEY);
    if (stored === "en" || stored === "es") return stored;
  } catch {
    /* ignore */
  }
  if (typeof navigator !== "undefined" && navigator.language?.toLowerCase().startsWith("es")) {
    return "es";
  }
  return "en";
}

function detectTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* ignore */
  }
  return "system";
}

let state: AppState = {
  progress: readJSON(KEY, EMPTY_PROGRESS),
  lang: detectLang(),
  theme: detectTheme(),
};

const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function persistProgress() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state.progress));
  } catch {
    /* storage can be unavailable (private mode, blocked cookies) — state still
       works for this session, it just will not survive a reload. */
  }
}

function setProgress(next: ProgressState) {
  state = { ...state, progress: next };
  persistProgress();
  emit();
}

/* ------------------------------------------------------------------ *
 * Actions
 * ------------------------------------------------------------------ */

export function toggleComplete(id: string) {
  const done = state.progress.completed.includes(id);
  setProgress({
    ...state.progress,
    completed: done
      ? state.progress.completed.filter((x) => x !== id)
      : [...state.progress.completed, id],
  });
}

export function toggleFavorite(id: string) {
  const fav = state.progress.favorites.includes(id);
  setProgress({
    ...state.progress,
    favorites: fav
      ? state.progress.favorites.filter((x) => x !== id)
      : [...state.progress.favorites, id],
  });
}

export function setNote(id: string, text: string) {
  const notes = { ...state.progress.notes };
  if (text.trim()) notes[id] = text;
  else delete notes[id];
  setProgress({ ...state.progress, notes });
}

export function visitModule(id: string) {
  const recent = [id, ...state.progress.recent.filter((x) => x !== id)].slice(0, 8);
  if (state.progress.lastModule === id && state.progress.recent[0] === id) return;
  setProgress({ ...state.progress, recent, lastModule: id });
}

export function addLogEntry(entry: Omit<LogEntry, "id" | "date"> & Partial<Pick<LogEntry, "id" | "date">>) {
  const full: LogEntry = {
    id: entry.id ?? `log-${Date.now().toString(36)}`,
    date: entry.date ?? new Date().toISOString().slice(0, 10),
    dish: entry.dish ?? "",
    goal: entry.goal ?? "",
    expected: entry.expected ?? "",
    actual: entry.actual ?? "",
    observations: entry.observations ?? "",
    hypothesis: entry.hypothesis ?? "",
    variableChanged: entry.variableChanged ?? "",
    nextAttempt: entry.nextAttempt ?? "",
    outcome: entry.outcome ?? "",
    ...(entry.subject ? { subject: entry.subject } : {}),
  };
  const existing = state.progress.log.findIndex((l) => l.id === full.id);
  const log =
    existing >= 0
      ? state.progress.log.map((l, i) => (i === existing ? full : l))
      : [full, ...state.progress.log];
  setProgress({ ...state.progress, log });
  return full.id;
}

export function deleteLogEntry(id: string) {
  setProgress({ ...state.progress, log: state.progress.log.filter((l) => l.id !== id) });
}

export function setLang(lang: Lang) {
  state = { ...state, lang };
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {
    /* ignore */
  }
  document.documentElement.setAttribute("lang", lang);
  emit();
}

export function setTheme(theme: Theme) {
  state = { ...state, theme };
  try {
    if (theme === "system") localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* ignore */
  }
  applyTheme(theme);
  emit();
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", theme);
}

/** Wipe local state. Exposed for the settings area. */
export function resetProgress() {
  setProgress({ ...EMPTY_PROGRESS });
}

/* ------------------------------------------------------------------ *
 * Hooks
 * ------------------------------------------------------------------ */

function getState() {
  return state;
}

export function useAppState(): AppState {
  return useSyncExternalStore(subscribe, getState, getState);
}

export function useLang(): Lang {
  return useSyncExternalStore(
    subscribe,
    () => state.lang,
    () => state.lang,
  );
}

export function useProgress(): ProgressState {
  return useSyncExternalStore(
    subscribe,
    () => state.progress,
    () => state.progress,
  );
}

export function useIsComplete(id: string): boolean {
  const complete = useSyncExternalStore(
    subscribe,
    () => state.progress.completed.includes(id),
    () => false,
  );
  return complete;
}

export function useCompletion(ids: string[]): { done: number; total: number; pct: number } {
  const progress = useProgress();
  const total = ids.length;
  const done = useCallback(
    () => ids.reduce((n, id) => n + (progress.completed.includes(id) ? 1 : 0), 0),
    [ids, progress],
  )();
  return { done, total, pct: total === 0 ? 0 : Math.round((done / total) * 100) };
}
