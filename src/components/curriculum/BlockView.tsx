import { Html } from "@/components/common/Html";
import { TrackToggle } from "@/components/progress/TrackToggle";
import { useProgress } from "@/app/state/store";
import { makeT } from "@/i18n";
import type { Block, Lang } from "@/types";

/**
 * Renders one content block.
 *
 * This switch is the only place that knows how a block looks. Adding a new
 * block type means adding a case here plus a type in the schema — no
 * curriculum-specific conditionals anywhere else in the app.
 */
export function BlockView({
  block,
  lang,
  onLog,
}: {
  block: Block;
  lang: Lang;
  onLog?: (subject: string) => void;
}) {
  const t = makeT(lang);

  switch (block.kind) {
    case "prose":
      return <Html className="prose" html={block.html} />;

    case "raw":
      return <Html className="prose" html={block.html} />;

    case "callout":
      return (
        <aside className={`callout callout--${block.variant}`}>
          {block.label && <span className="callout__label">{block.label}</span>}
          <Html html={block.html} />
        </aside>
      );

    case "spec":
      return (
        <section className="spec">
          {block.title && <div className="spec__head">{block.title}</div>}
          {block.rows.map((row, i) => (
            <div className="spec__row" key={i}>
              <span className="spec__key">{row.key}</span>
              <Html className="spec__val" as="span" html={row.value} />
            </div>
          ))}
        </section>
      );

    case "table":
      return (
        <div className="table-wrap">
          <table>
            {block.head.length > 0 && (
              <thead>
                <tr>
                  {block.head.map((h, i) => (
                    <Html as="th" key={i} html={h} />
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <Html as="td" key={j} html={cell} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "figure":
      return (
        <figure>
          <div className="figure-scroll">
            <Html html={block.svg} />
          </div>
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      );

    case "cards":
      return (
        <div className={`grid grid--${block.items.length >= 3 ? "3" : "2"}`}>
          {block.items.map((item, i) => (
            <article className="card" key={i}>
              {item.title && <h4>{item.title}</h4>}
              <Html html={item.html} />
            </article>
          ))}
        </div>
      );

    case "experiment":
      return (
        <TrackableBlock id={block.id} variant="experiment" lang={lang} onLog={onLog}>
          <div className="block__eyebrow">{block.title || t("experiment")}</div>
          <FieldList fields={block.fields} />
        </TrackableBlock>
      );

    case "drill":
      return (
        <TrackableBlock id={block.id} variant={block.variant} lang={lang} onLog={onLog}>
          {block.eyebrow && <div className="block__eyebrow">{block.eyebrow}</div>}
          {block.title && <h4 style={{ margin: "2px 0 4px", fontSize: 19 }}>{block.title}</h4>}
          <FieldList fields={block.fields} />
        </TrackableBlock>
      );

    case "troubleshoot":
      return (
        <details className="trouble" id={block.id}>
          <summary>
            {block.problem}
            {block.signal && <span className="trouble__sig">{block.signal}</span>}
          </summary>
          <div className="trouble__body">
            <FieldList fields={block.fields} />
          </div>
        </details>
      );

    case "knowledgeCheck":
      return (
        <div className="check" id={block.id}>
          {block.questions.map((q, i) => (
            <div className="check__q" key={i}>
              <Html as="p" html={q} />
            </div>
          ))}
        </div>
      );

    case "imageSearch":
      return (
        <div className="imgsearch">
          <span className="imgsearch__label">{t("searchImage")}</span>
          <div>
            <code>{block.query}</code>
            {block.look && (
              <p style={{ margin: ".4em 0 0" }}>
                <span className="imgsearch__label" style={{ marginRight: 6 }}>
                  {t("lookFor")}
                </span>
                {block.look}
              </p>
            )}
          </div>
        </div>
      );

    case "resource":
      return (
        <div className="resource">
          {block.meta && <span className="resource__meta">{block.meta}</span>}
          {block.title && <span className="resource__title">{block.title}</span>}
          {block.why && <p>{block.why}</p>}
        </div>
      );

    case "levelBand":
      return (
        <div className="level-band">
          <span className={`level level--${block.level}`}>{block.label}</span>
          <span className="level-band__line" />
        </div>
      );

    case "levels":
      return (
        <div className="levels">
          {block.items.map((item, i) => (
            <span className={`level level--${item.level}`} key={i}>
              {item.label}
            </span>
          ))}
        </div>
      );

    default: {
      // Exhaustiveness guard: a new block kind must be handled above.
      const _never: never = block;
      return _never;
    }
  }
}

function FieldList({ fields }: { fields: Array<{ term: string; detail: string }> }) {
  if (fields.length === 0) return null;
  return (
    <dl className="deflist">
      {fields.map((f, i) => (
        <div key={i} style={{ display: "contents" }}>
          <dt>{f.term}</dt>
          <Html as="dd" html={f.detail} />
        </div>
      ))}
    </dl>
  );
}

function TrackableBlock({
  id,
  variant,
  lang,
  onLog,
  children,
}: {
  id: string;
  variant: "experiment" | "drill" | "project";
  lang: Lang;
  onLog?: (subject: string) => void;
  children: React.ReactNode;
}) {
  const progress = useProgress();
  const done = progress.completed.includes(id);
  return (
    <section
      id={id}
      className={`block block--${variant}${done ? " block--done" : ""}`}
      aria-label={id}
    >
      {children}
      <TrackToggle id={id} lang={lang} onLog={onLog} />
    </section>
  );
}
