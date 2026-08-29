import { useEffect, useState } from "react";
import { addLogEntry, deleteLogEntry, useProgress } from "@/app/state/store";
import { hrefForContentId } from "@/components/progress/Dashboard";
import { useLinkHandler } from "@/app/router";
import { makeT } from "@/i18n";
import type { Lang, LogEntry } from "@/types";

const BLANK: Omit<LogEntry, "id" | "date"> = {
  dish: "",
  goal: "",
  expected: "",
  actual: "",
  observations: "",
  hypothesis: "",
  variableChanged: "",
  nextAttempt: "",
  outcome: "",
};

/**
 * The failure/experiment log.
 *
 * The structure is the point: recording the expectation, the result and the one
 * variable you intend to change turns a bad dinner into a data point and the
 * next attempt into an experiment.
 */
export function LogPage({ lang, subject }: { lang: Lang; subject?: string }) {
  const t = makeT(lang);
  const onLink = useLinkHandler();
  const progress = useProgress();
  const [draft, setDraft] = useState<Omit<LogEntry, "id" | "date">>(BLANK);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  // Opening the log from a specific experiment pre-fills its subject.
  useEffect(() => {
    if (!subject) return;
    setDraft({ ...BLANK, dish: subject });
    setOpen(true);
  }, [subject]);

  const field = (
    key: keyof typeof BLANK,
    label: string,
    multiline = false,
  ) => (
    <div className="field" key={key}>
      <label htmlFor={`log-${key}`}>{label}</label>
      {multiline ? (
        <textarea
          id={`log-${key}`}
          className="input"
          value={draft[key]}
          onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
        />
      ) : (
        <input
          id={`log-${key}`}
          className="input"
          value={draft[key]}
          onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
        />
      )}
    </div>
  );

  const save = () => {
    if (!draft.dish.trim()) return;
    addLogEntry({
      ...draft,
      ...(editingId ? { id: editingId } : {}),
      ...(subject && !editingId ? { subject } : {}),
    });
    setDraft(BLANK);
    setEditingId(null);
    setOpen(false);
  };

  const edit = (entry: LogEntry) => {
    const { id, date, subject: _s, ...rest } = entry;
    void date;
    void _s;
    setDraft(rest);
    setEditingId(id);
    setOpen(true);
  };

  return (
    <div className="wrap">
      <header className="page-head">
        <p className="eyebrow">{t("logbook")}</p>
        <h1>{t("logbook")}</h1>
        <p className="lede">{t("logbookIntro")}</p>
      </header>

      {!open && (
        <button type="button" className="btn btn--primary" onClick={() => setOpen(true)}>
          {t("newEntry")}
        </button>
      )}

      {open && (
        <section className="card" style={{ marginBottom: 24 }}>
          {field("dish", t("logDish"))}
          {field("goal", t("logGoal"))}
          {field("expected", t("logExpected"))}
          {field("actual", t("logActual"), true)}
          {field("observations", t("logObservations"), true)}
          {field("hypothesis", t("logHypothesis"), true)}
          {field("variableChanged", t("logVariable"))}
          {field("nextAttempt", t("logNext"), true)}
          {field("outcome", t("logOutcome"), true)}
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button type="button" className="btn btn--primary" onClick={save}>
              {t("save")}
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                setOpen(false);
                setDraft(BLANK);
                setEditingId(null);
              }}
            >
              {t("cancel")}
            </button>
          </div>
        </section>
      )}

      {progress.log.length === 0 && !open && <p className="empty">{t("logEmpty")}</p>}

      {progress.log.map((entry) => (
        <article className="card" key={entry.id} style={{ marginBottom: 16 }}>
          <span className="resource__meta">{entry.date}</span>
          <h3 style={{ marginBottom: 8 }}>{entry.dish}</h3>

          <dl className="deflist">
            {(
              [
                [t("logGoal"), entry.goal],
                [t("logExpected"), entry.expected],
                [t("logActual"), entry.actual],
                [t("logObservations"), entry.observations],
                [t("logHypothesis"), entry.hypothesis],
                [t("logVariable"), entry.variableChanged],
                [t("logNext"), entry.nextAttempt],
                [t("logOutcome"), entry.outcome],
              ] as Array<[string, string]>
            )
              .filter(([, value]) => value.trim())
              .map(([label, value]) => (
                <div key={label} style={{ display: "contents" }}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
          </dl>

          <div className="block__bar">
            {entry.subject && (
              <a className="btn btn--ghost" href={hrefForContentId(entry.subject)} onClick={onLink}>
                {entry.subject}
              </a>
            )}
            <button type="button" className="btn btn--ghost" onClick={() => edit(entry)}>
              {t("addNote")}
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => deleteLogEntry(entry.id)}
            >
              {t("delete")}
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
