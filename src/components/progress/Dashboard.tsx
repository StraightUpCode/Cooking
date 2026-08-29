import { moduleTitle } from "@/content/titles";
import { MODULE_BY_ID, MODULE_ORDER, moduleNumber } from "@/data/curriculum";
import { useProgress } from "@/app/state/store";
import { useLinkHandler } from "@/app/router";
import { makeT } from "@/i18n";
import manifest from "@/content/modules/manifest.json";
import type { Lang } from "@/types";

type ManifestEntry = { id: string; blocks: number; counts: Record<string, number> };

/** Trackable item counts per module, from the build-time manifest. */
const TRACKABLE_TOTALS: Record<string, number> = Object.fromEntries(
  (manifest as ManifestEntry[]).map((m) => [
    m.id,
    (m.counts.experiment ?? 0) + (m.counts.drill ?? 0),
  ]),
);

/**
 * The home screen: orientation and memory, not gamification.
 * No streaks, no deadlines, no pressure — where you were, what is in flight,
 * and a reasonable suggestion for what to pick up next.
 */
export function Dashboard({ lang }: { lang: Lang }) {
  const t = makeT(lang);
  const onLink = useLinkHandler();
  const progress = useProgress();

  const perModule = MODULE_ORDER.map((m) => {
    const total = TRACKABLE_TOTALS[m.id] ?? 0;
    const done = progress.completed.filter((id) => id.startsWith(`${m.id}.`)).length;
    return { meta: m, total, done, pct: total ? Math.round((done / total) * 100) : 0 };
  });

  const inProgress = perModule.filter((x) => x.done > 0 && x.done < x.total);
  const completedModules = perModule.filter((x) => x.total > 0 && x.done >= x.total);
  const totalDone = progress.completed.length;

  // Suggestion: continue the furthest in-flight module, else the first module
  // whose prerequisites are satisfied and which has no progress yet.
  const suggestion =
    inProgress[0]?.meta ??
    perModule.find(
      (x) =>
        x.done === 0 &&
        x.meta.prerequisites.every((p) => {
          const pre = perModule.find((y) => y.meta.id === p);
          return !pre || pre.done > 0;
        }),
    )?.meta;

  const noteIds = Object.keys(progress.notes);

  return (
    <div className="wrap">
      <header className="page-head">
        <p className="eyebrow">{t("dashboard")}</p>
        <h1>The Kitchen Lab Manual</h1>
        <p className="lede">{t("howToRead")}</p>
      </header>

      <section className="grid grid--3" style={{ marginTop: 0 }}>
        <div className="card">
          <div className="stat">
            <span className="stat__n">{totalDone}</span>
            <span className="stat__l">{t("completed")}</span>
          </div>
        </div>
        <div className="card">
          <div className="stat">
            <span className="stat__n">{inProgress.length}</span>
            <span className="stat__l">{t("inProgress")}</span>
          </div>
        </div>
        <div className="card">
          <div className="stat">
            <span className="stat__n">{progress.log.length}</span>
            <span className="stat__l">{t("logbook")}</span>
          </div>
        </div>
      </section>

      {suggestion && (
        <section className="section">
          <div className="section__head">
            <span className="section__idx">→</span>
            <h2>{t("suggestedNext")}</h2>
          </div>
          <a className="card" href={`/module/${suggestion.slug}`} onClick={onLink}>
            <h4 style={{ color: "var(--ember)" }}>
              {moduleNumber(suggestion)} · {moduleTitle(suggestion.id, lang)}
            </h4>
            <p>{suggestion.duration[lang]}</p>
          </a>
        </section>
      )}

      {progress.recent.length > 0 && (
        <section className="section">
          <div className="section__head">
            <span className="section__idx">◷</span>
            <h2>{t("recentlyViewed")}</h2>
          </div>
          <div className="chiprow">
            {progress.recent.map((id) => {
              const meta = MODULE_BY_ID.get(id);
              if (!meta) return null;
              return (
                <a className="chip" key={id} href={`/module/${meta.slug}`} onClick={onLink}>
                  {moduleTitle(id, lang)}
                </a>
              );
            })}
          </div>
        </section>
      )}

      <section className="section">
        <div className="section__head">
          <span className="section__idx">≡</span>
          <h2>{t("curriculum")}</h2>
        </div>
        <div className="grid grid--2">
          {perModule.map(({ meta, done, total, pct }) => (
            <a className="card" key={meta.id} href={`/module/${meta.slug}`} onClick={onLink}>
              <h4>
                <span style={{ fontFamily: "var(--f-mono)", fontSize: 12, color: "var(--ember)" }}>
                  {moduleNumber(meta)}
                </span>{" "}
                {moduleTitle(meta.id, lang)}
              </h4>
              <p style={{ color: "var(--ink-faint)", fontSize: 14 }}>{meta.duration[lang]}</p>
              {total > 0 && (
                <>
                  <div className="meter" style={{ marginTop: 10 }}>
                    <span style={{ width: `${pct}%` }} />
                  </div>
                  <p className="num" style={{ fontSize: 11, color: "var(--ink-faint)", marginTop: 6 }}>
                    {done}/{total}
                  </p>
                </>
              )}
            </a>
          ))}
        </div>
      </section>

      {completedModules.length > 0 && (
        <section className="section">
          <div className="section__head">
            <span className="section__idx">✓</span>
            <h2>{t("completed")}</h2>
          </div>
          <div className="chiprow">
            {completedModules.map(({ meta }) => (
              <a className="chip" key={meta.id} href={`/module/${meta.slug}`} onClick={onLink}>
                {moduleTitle(meta.id, lang)}
              </a>
            ))}
          </div>
        </section>
      )}

      {progress.favorites.length > 0 && (
        <section className="section">
          <div className="section__head">
            <span className="section__idx">★</span>
            <h2>{t("favorites")}</h2>
          </div>
          <div className="chiprow">
            {progress.favorites.map((id) => (
              <a className="chip" key={id} href={hrefForContentId(id)} onClick={onLink}>
                {id}
              </a>
            ))}
          </div>
        </section>
      )}

      {noteIds.length > 0 && (
        <section className="section">
          <div className="section__head">
            <span className="section__idx">✎</span>
            <h2>{t("yourNotes")}</h2>
          </div>
          {noteIds.map((id) => (
            <div className="card" key={id} style={{ marginBottom: 12 }}>
              <a
                className="resource__meta"
                href={hrefForContentId(id)}
                onClick={onLink}
                style={{ textDecoration: "none" }}
              >
                {id}
              </a>
              <p style={{ marginTop: 6 }}>{progress.notes[id]}</p>
            </div>
          ))}
        </section>
      )}

      {progress.log.length > 0 && (
        <section className="section">
          <div className="section__head">
            <span className="section__idx">⌗</span>
            <h2>{t("logbook")}</h2>
          </div>
          {progress.log.slice(0, 3).map((entry) => (
            <div className="card" key={entry.id} style={{ marginBottom: 12 }}>
              <span className="resource__meta">{entry.date}</span>
              <h4>{entry.dish}</h4>
              {entry.actual && <p>{entry.actual}</p>}
            </div>
          ))}
          <a className="btn" href="/log" onClick={onLink}>
            {t("logbook")}
          </a>
        </section>
      )}
    </div>
  );
}

/** Content IDs are "<module>.<kind><n>", so the module prefix gives the route. */
export function hrefForContentId(id: string): string {
  const moduleId = id.split(".")[0] ?? "";
  const meta = MODULE_BY_ID.get(moduleId);
  return meta ? `/module/${meta.slug}#${id}` : "/";
}
