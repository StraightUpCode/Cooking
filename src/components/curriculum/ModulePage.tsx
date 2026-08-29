import { useEffect, useMemo, useState } from "react";
import { BlockView } from "./BlockView";
import { loadModule } from "@/content";
import { moduleTitle } from "@/content/titles";
import { MODULE_BY_SLUG, MODULE_ORDER, moduleNumber } from "@/data/curriculum";
import { EQUIPMENT_BY_ID } from "@/data/equipment";
import { SKILL_BY_ID } from "@/data/skills";
import { visitModule, useProgress } from "@/app/state/store";
import { useHashScroll, useLinkHandler } from "@/app/router";
import { makeT } from "@/i18n";
import { isTrackable, type Lang, type ModuleContent } from "@/types";

export function ModulePage({
  slug,
  hash,
  lang,
  onLog,
}: {
  slug: string;
  hash?: string;
  lang: Lang;
  onLog: (subject: string) => void;
}) {
  const t = makeT(lang);
  const onLink = useLinkHandler();
  const meta = MODULE_BY_SLUG.get(slug);
  const [content, setContent] = useState<ModuleContent | null>(null);
  const [loading, setLoading] = useState(true);
  const progress = useProgress();

  useEffect(() => {
    let alive = true;
    setLoading(true);
    if (!meta) {
      setLoading(false);
      return;
    }
    visitModule(meta.id);
    loadModule(meta.id, lang).then((c) => {
      if (!alive) return;
      setContent(c);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [meta, lang]);

  const trackableIds = useMemo(() => {
    if (!content) return [];
    return content.sections.flatMap((s) => s.blocks.filter(isTrackable).map((b) => b.id));
  }, [content]);

  useHashScroll(hash, !loading && !!content);

  if (!meta) {
    return (
      <div className="wrap">
        <h1>{t("notFound")}</h1>
        <p>
          <a href="/" onClick={onLink}>
            {t("backHome")}
          </a>
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="wrap">
        <p className="eyebrow">{moduleNumber(meta)}</p>
        <h1>{moduleTitle(meta.id, lang)}</h1>
        <p style={{ color: "var(--ink-faint)" }}>{t("loading")}</p>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="wrap">
        <h1>{t("notFound")}</h1>
      </div>
    );
  }

  const done = trackableIds.filter((id) => progress.completed.includes(id)).length;
  const index = MODULE_ORDER.findIndex((m) => m.id === meta.id);
  const prev = index > 0 ? MODULE_ORDER[index - 1] : undefined;
  const next = index >= 0 && index < MODULE_ORDER.length - 1 ? MODULE_ORDER[index + 1] : undefined;

  return (
    <article className="wrap">
      <header className="page-head">
        <p className="eyebrow">{content.eyebrow}</p>
        <h1>{content.title}</h1>
        {content.lede && <p className="lede">{content.lede}</p>}

        <div className="kicker-row">
          {content.tags.map((tag, i) => (
            <span className="tag" key={i}>
              {tag}
            </span>
          ))}
          {meta.noCook && <span className="tag tag--good">{t("noCookFriendly")}</span>}
        </div>

        {trackableIds.length > 0 && (
          <div style={{ marginTop: 20, maxWidth: 320 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontFamily: "var(--f-mono)",
                fontSize: 11,
                letterSpacing: ".1em",
                textTransform: "uppercase",
                color: "var(--ink-faint)",
                marginBottom: 6,
              }}
            >
              <span>{t("progress")}</span>
              <span className="num">
                {done}/{trackableIds.length}
              </span>
            </div>
            <div className="meter">
              <span
                style={{ width: `${trackableIds.length ? (done / trackableIds.length) * 100 : 0}%` }}
              />
            </div>
          </div>
        )}
      </header>

      <ModuleMetaPanel meta={meta} lang={lang} />

      {content.sections.map((section) => (
        <section className="section" id={section.id} key={section.id}>
          <div className="section__head">
            {section.index && <span className="section__idx">{section.index}</span>}
            <h2>{section.title}</h2>
          </div>
          {section.blocks.map((block, i) => (
            <BlockView key={i} block={block} lang={lang} onLog={onLog} />
          ))}
        </section>
      ))}

      <nav className="pager">
        {prev && (
          <a className="prev" href={`/module/${prev.slug}`} onClick={onLink}>
            <span className="d">{t("previous")}</span>
            {moduleTitle(prev.id, lang)}
          </a>
        )}
        {next && (
          <a className="next" href={`/module/${next.slug}`} onClick={onLink}>
            <span className="d">{t("next")}</span>
            {moduleTitle(next.id, lang)}
          </a>
        )}
      </nav>
    </article>
  );
}

/**
 * Skills, prerequisites and equipment for the module — rendered generically
 * from metadata, so a new module needs no code.
 */
function ModuleMetaPanel({
  meta,
  lang,
}: {
  meta: NonNullable<ReturnType<typeof MODULE_BY_SLUG.get>>;
  lang: Lang;
}) {
  const t = makeT(lang);
  const onLink = useLinkHandler();

  const groups: Array<[string, string[]]> = [
    [t("required"), meta.equipment.required],
    [t("recommended"), meta.equipment.recommended],
    [t("optional"), meta.equipment.optional],
  ];
  const hasEquipment = groups.some(([, ids]) => ids.length > 0);

  if (meta.skills.length === 0 && !hasEquipment && meta.prerequisites.length === 0) return null;

  return (
    <section className="spec" aria-label={t("contents")}>
      {meta.prerequisites.length > 0 && (
        <div className="spec__row">
          <span className="spec__key">{t("prerequisites")}</span>
          <span className="spec__val">
            {meta.prerequisites.map((id, i) => (
              <span key={id}>
                {i > 0 && ", "}
                <a href={`/module/${id}`} onClick={onLink}>
                  {moduleTitle(id, lang)}
                </a>
              </span>
            ))}
          </span>
        </div>
      )}

      {meta.skills.length > 0 && (
        <div className="spec__row">
          <span className="spec__key">{t("skillsPractised")}</span>
          <span className="spec__val">
            <span className="chiprow" style={{ margin: 0 }}>
              {meta.skills.map((id) => {
                const skill = SKILL_BY_ID.get(id);
                return (
                  <a className="chip" key={id} href={`/skills/${id}`} onClick={onLink}>
                    {skill ? skill.name[lang] : id}
                  </a>
                );
              })}
            </span>
          </span>
        </div>
      )}

      {hasEquipment &&
        groups.map(([label, ids]) =>
          ids.length === 0 ? null : (
            <div className="spec__row" key={label}>
              <span className="spec__key">{label}</span>
              <span className="spec__val">
                {ids
                  .map((id) => EQUIPMENT_BY_ID.get(id)?.name[lang] ?? id)
                  .join(" · ")}
              </span>
            </div>
          ),
        )}

      {meta.noCook && (
        <div className="spec__row">
          <span className="spec__key">{t("noCookFriendly")}</span>
          <span className="spec__val">{t("noCookExplain")}</span>
        </div>
      )}
    </section>
  );
}
