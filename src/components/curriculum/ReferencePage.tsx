import { REFERENCE, REFERENCE_BY_ID, REFERENCE_CATEGORIES } from "@/data/reference";
import { BlockView } from "./BlockView";
import { useLinkHandler } from "@/app/router";
import { makeT } from "@/i18n";
import type { Lang, ReferenceCategory } from "@/types";

const CATEGORY_LABEL: Record<ReferenceCategory, { en: string; es: string }> = {
  temperature: { en: "Temperature", es: "Temperatura" },
  ratio: { en: "Ratios", es: "Proporciones" },
  conversion: { en: "Conversions", es: "Conversiones" },
  glossary: { en: "Glossary", es: "Glosario" },
  safety: { en: "Safety", es: "Seguridad" },
  method: { en: "Methods", es: "Métodos" },
  troubleshooting: { en: "Troubleshooting", es: "Diagnóstico" },
};

/**
 * The reference layer: shared tables, definitions and thresholds that lessons
 * link to instead of repeating.
 */
export function ReferencePage({ lang }: { lang: Lang }) {
  const t = makeT(lang);
  const onLink = useLinkHandler();

  return (
    <div className="wrap">
      <header className="page-head">
        <p className="eyebrow eyebrow--probe">{t("reference")}</p>
        <h1>{t("reference")}</h1>
        <p className="lede">{t("referenceIntro")}</p>
      </header>

      {REFERENCE_CATEGORIES.map((category) => {
        const entries = REFERENCE.filter((r) => r.category === category);
        if (entries.length === 0) return null;
        return (
          <section className="section" key={category}>
            <div className="section__head">
              <span className="section__idx">·</span>
              <h2>{CATEGORY_LABEL[category][lang]}</h2>
            </div>

            {entries.map((entry) => (
              <article
                key={entry.id}
                id={entry.id}
                style={{ scrollMarginTop: "calc(var(--topbar-h) + 12px)", marginBottom: 28 }}
              >
                <h3>{entry.term[lang]}</h3>
                <p className="prose">{entry.definition[lang]}</p>

                {entry.analogy && (
                  <aside className="callout callout--heat">
                    <span className="callout__label">
                      {lang === "en" ? "Engineering analogy" : "Analogía de ingeniería"}
                    </span>
                    <p>{entry.analogy[lang]}</p>
                  </aside>
                )}

                {entry.blocks?.[lang]?.map((block, i) => (
                  <BlockView key={i} block={block} lang={lang} />
                ))}

                {entry.related.length > 0 && (
                  <div className="chiprow">
                    {entry.related.map((id) => {
                      const rel = REFERENCE_BY_ID.get(id);
                      if (!rel) return null;
                      return (
                        <a className="chip" key={id} href={`/reference#${id}`} onClick={onLink}>
                          {rel.term[lang]}
                        </a>
                      );
                    })}
                  </div>
                )}
              </article>
            ))}
          </section>
        );
      })}
    </div>
  );
}
