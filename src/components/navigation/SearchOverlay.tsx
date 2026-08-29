import { useEffect, useMemo, useRef, useState } from "react";
import { navigate } from "@/app/router";
import { makeT } from "@/i18n";
import { SKILLS } from "@/data/skills";
import { INGREDIENTS } from "@/data/ingredients";
import { REFERENCE } from "@/data/reference";
import type { Lang, SearchCategory, SearchDoc } from "@/types";

/**
 * Global search across the whole system.
 *
 * The curriculum index is sizeable, so it is fetched the first time search is
 * opened rather than shipped in the initial bundle. Skills, ingredients and
 * reference entries are small and already in memory.
 */
let curriculumDocs: SearchDoc[] | null = null;

async function loadCurriculumDocs(): Promise<SearchDoc[]> {
  if (curriculumDocs) return curriculumDocs;
  const mod = await import("@/content/search-curriculum.json");
  curriculumDocs = mod.default as SearchDoc[];
  return curriculumDocs;
}

function staticDocs(): SearchDoc[] {
  const docs: SearchDoc[] = [];

  for (const s of SKILLS) {
    docs.push({
      id: s.id,
      category: "skill",
      href: `/skills/${s.id}`,
      title: s.name,
      context: { en: "Skill", es: "Habilidad" },
      text: {
        en: `${s.name.en} ${s.description.en}`.toLowerCase(),
        es: `${s.name.es} ${s.description.es}`.toLowerCase(),
      },
    });
  }

  for (const i of INGREDIENTS) {
    docs.push({
      id: i.id,
      category: "ingredient",
      href: `/ingredients/${i.id}`,
      title: i.name,
      context: { en: "Ingredient Lab", es: "Laboratorio de ingredientes" },
      text: {
        en: `${i.name.en} ${i.category} ${i.flavorProfile.join(" ")} ${i.functions.join(" ")} ${i.commonUses.en.join(" ")}`.toLowerCase(),
        es: `${i.name.es} ${i.category} ${i.flavorProfile.join(" ")} ${i.functions.join(" ")} ${i.commonUses.es.join(" ")}`.toLowerCase(),
      },
    });
  }

  for (const r of REFERENCE) {
    docs.push({
      id: r.id,
      category: "reference",
      href: `/reference#${r.id}`,
      title: r.term,
      context: { en: "Reference", es: "Referencia" },
      text: {
        en: `${r.term.en} ${r.definition.en} ${r.analogy?.en ?? ""}`.toLowerCase(),
        es: `${r.term.es} ${r.definition.es} ${r.analogy?.es ?? ""}`.toLowerCase(),
      },
    });
  }

  return docs;
}

const CATEGORY_LABEL: Record<SearchCategory, { en: string; es: string }> = {
  module: { en: "Module", es: "Módulo" },
  section: { en: "Lesson", es: "Lección" },
  experiment: { en: "Experiment", es: "Experimento" },
  drill: { en: "Drill", es: "Práctica" },
  project: { en: "Project", es: "Proyecto" },
  recipe: { en: "Recipe", es: "Receta" },
  ingredient: { en: "Ingredient", es: "Ingrediente" },
  skill: { en: "Skill", es: "Habilidad" },
  reference: { en: "Reference", es: "Referencia" },
};

/**
 * "Proteins → Experiment". For standalone entries the context already names the
 * category, so avoid printing it twice ("Skill · Skill").
 */
function describe(doc: SearchDoc, lang: Lang): string {
  const context = doc.context[lang] || doc.context.en;
  const category = CATEGORY_LABEL[doc.category][lang];
  return context.toLowerCase() === category.toLowerCase() ? category : `${context} · ${category}`;
}

export function SearchOverlay({ lang, onClose }: { lang: Lang; onClose: () => void }) {
  const t = makeT(lang);
  const [query, setQuery] = useState("");
  const [docs, setDocs] = useState<SearchDoc[]>(() => staticDocs());
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    loadCurriculumDocs().then((curriculum) => setDocs([...curriculum, ...staticDocs()]));
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    const terms = q.split(/\s+/);
    const scored: Array<{ doc: SearchDoc; score: number }> = [];

    for (const doc of docs) {
      const title = doc.title[lang].toLowerCase();
      const text = doc.text[lang] || doc.text.en;
      let score = 0;
      let matchedAll = true;
      for (const term of terms) {
        const inTitle = title.includes(term);
        const inText = text.includes(term);
        if (!inTitle && !inText) {
          matchedAll = false;
          break;
        }
        if (inTitle) score += title.startsWith(term) ? 12 : 6;
        if (inText) score += 1;
      }
      if (!matchedAll) continue;
      // Prefer bigger units so a search lands on the lesson, not a fragment.
      if (doc.category === "module") score += 4;
      if (doc.category === "section") score += 2;
      scored.push({ doc, score });
    }

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 40).map((s) => s.doc);
  }, [query, docs, lang]);

  useEffect(() => setActive(0), [query]);

  const go = (doc: SearchDoc) => {
    navigate(doc.href);
    onClose();
  };

  return (
    <div
      className="search"
      role="dialog"
      aria-modal="true"
      aria-label={t("search")}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setActive((i) => Math.min(i + 1, results.length - 1));
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setActive((i) => Math.max(i - 1, 0));
        }
        if (e.key === "Enter") {
          const hit = results[active];
          if (hit) go(hit);
        }
      }}
    >
      <div className="search__box">
        <input
          ref={inputRef}
          className="search__input"
          type="search"
          value={query}
          placeholder={t("searchPlaceholder")}
          aria-label={t("search")}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="button" className="btn" onClick={onClose}>
          {t("close")}
        </button>
      </div>

      <ul className="search__results">
        {query.trim().length >= 2 && results.length === 0 && (
          <li className="empty">{t("noResults")}</li>
        )}
        {results.map((doc, i) => (
          <li key={`${doc.category}-${doc.id}`}>
            <a
              className="search__hit"
              href={doc.href}
              data-active={i === active}
              onMouseEnter={() => setActive(i)}
              onClick={(e) => {
                e.preventDefault();
                go(doc);
              }}
            >
              <strong>{doc.title[lang] || doc.title.en}</strong>
              <span className="search__cat">{describe(doc, lang)}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
