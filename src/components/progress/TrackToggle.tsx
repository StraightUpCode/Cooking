import { useState } from "react";
import { setNote, toggleComplete, useProgress } from "@/app/state/store";
import { makeT } from "@/i18n";
import type { Lang } from "@/types";

/**
 * Completion + note controls for any trackable item.
 *
 * Keyed on the content ID, so an item ticked off in Spanish shows as done in
 * English. No streaks, no deadlines — just a record of what you have done.
 */
export function TrackToggle({
  id,
  lang,
  onLog,
}: {
  id: string;
  lang: Lang;
  onLog?: (subject: string) => void;
}) {
  const t = makeT(lang);
  const progress = useProgress();
  const done = progress.completed.includes(id);
  const note = progress.notes[id] ?? "";
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(note);

  return (
    <div className="block__bar">
      <button
        type="button"
        className={done ? "btn btn--done" : "btn"}
        aria-pressed={done}
        onClick={() => toggleComplete(id)}
      >
        {done ? `✓ ${t("done")}` : t("markDone")}
      </button>

      <button
        type="button"
        className="btn btn--ghost"
        aria-expanded={editing}
        onClick={() => {
          setDraft(progress.notes[id] ?? "");
          setEditing((v) => !v);
        }}
      >
        {t("addNote")}
        {note ? " ·" : ""}
      </button>

      {onLog && (
        <button type="button" className="btn btn--ghost" onClick={() => onLog(id)}>
          {t("logFrom")}
        </button>
      )}

      {!editing && note && (
        <p
          style={{
            flexBasis: "100%",
            margin: "8px 0 0",
            fontSize: 15,
            color: "var(--ink-soft)",
            fontStyle: "italic",
          }}
        >
          {note}
        </p>
      )}

      {editing && (
        <div style={{ flexBasis: "100%", marginTop: 8 }}>
          <textarea
            className="input"
            value={draft}
            placeholder={t("notePlaceholder")}
            onChange={(e) => setDraft(e.target.value)}
            aria-label={t("addNote")}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => {
                setNote(id, draft);
                setEditing(false);
              }}
            >
              {t("save")}
            </button>
            <button type="button" className="btn btn--ghost" onClick={() => setEditing(false)}>
              {t("cancel")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
