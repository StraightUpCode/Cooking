import { useState } from "react";
import { INGREDIENTS, INGREDIENT_BY_ID, INGREDIENT_CATEGORIES } from "@/data/ingredients";
import { useLinkHandler } from "@/app/router";
import { makeT } from "@/i18n";
import { AVAILABILITY_ORDER, type AvailabilityLevel, type Lang } from "@/types";

const AVAIL_LABEL: Record<AvailabilityLevel, "availCommon" | "availSpecialty" | "availImport" | "availExotic" | "availUnknown"> = {
  common: "availCommon",
  specialty: "availSpecialty",
  import: "availImport",
  exotic: "availExotic",
  unknown: "availUnknown",
};

/**
 * Ingredient Lab index — filterable by sourcing difficulty so the learner can
 * prioritise what is actually gettable without hiding what is not.
 */
export function IngredientLab({ lang }: { lang: Lang }) {
  const t = makeT(lang);
  const onLink = useLinkHandler();
  const [level, setLevel] = useState<AvailabilityLevel | "all">("all");
  const [category, setCategory] = useState<string | "all">("all");

  const list = INGREDIENTS.filter(
    (i) =>
      (level === "all" || i.availability.level === level) &&
      (category === "all" || i.category === category),
  ).sort((a, b) => a.name[lang].localeCompare(b.name[lang]));

  return (
    <div className="wrap">
      <header className="page-head">
        <p className="eyebrow eyebrow--probe">{t("ingredientLab")}</p>
        <h1>{t("ingredientLab")}</h1>
        <p className="lede">{t("ingredientLabIntro")}</p>
      </header>

      <div className="chiprow" role="group" aria-label={t("availability")}>
        <button
          type="button"
          className="chip"
          aria-pressed={level === "all"}
          onClick={() => setLevel("all")}
        >
          {t("allLevels")}
        </button>
        {AVAILABILITY_ORDER.map((l) => (
          <button
            key={l}
            type="button"
            className="chip"
            aria-pressed={level === l}
            onClick={() => setLevel(l)}
          >
            {t(AVAIL_LABEL[l])}
          </button>
        ))}
      </div>

      <div className="chiprow">
        <button
          type="button"
          className="chip"
          aria-pressed={category === "all"}
          onClick={() => setCategory("all")}
        >
          {t("allLevels")}
        </button>
        {INGREDIENT_CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            className="chip"
            aria-pressed={category === c}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid--2">
        {list.map((i) => (
          <a className="card" key={i.id} href={`/ingredients/${i.id}`} onClick={onLink}>
            <h4>{i.name[lang]}</h4>
            <span className={`avail avail--${i.availability.level}`}>
              {t(AVAIL_LABEL[i.availability.level])}
            </span>
            <p style={{ marginTop: 8, color: "var(--ink-soft)", fontSize: 14 }}>
              {i.functions.join(" · ")}
            </p>
          </a>
        ))}
      </div>

      {list.length === 0 && <p className="empty">{t("noResults")}</p>}
    </div>
  );
}

export function IngredientDetail({
  id,
  lang,
  onLog,
}: {
  id: string;
  lang: Lang;
  onLog: (subject: string) => void;
}) {
  const t = makeT(lang);
  const onLink = useLinkHandler();
  const ing = INGREDIENT_BY_ID.get(id);

  if (!ing) {
    return (
      <div className="wrap">
        <h1>{t("notFound")}</h1>
        <p>
          <a href="/ingredients" onClick={onLink}>
            {t("ingredientLab")}
          </a>
        </p>
      </div>
    );
  }

  return (
    <article className="wrap">
      <header className="page-head">
        <p className="eyebrow eyebrow--probe">{t("ingredient")}</p>
        <h1>{ing.name[lang]}</h1>
        <div className="kicker-row">
          <span className="tag">{ing.category}</span>
          <span className={`tag avail avail--${ing.availability.level}`}>
            {t(AVAIL_LABEL[ing.availability.level])}
          </span>
        </div>
      </header>

      <section className="spec">
        <div className="spec__head">{t("availability")}</div>
        <div className="spec__row">
          <span className="spec__key">{t(AVAIL_LABEL[ing.availability.level])}</span>
          <span className="spec__val">{ing.availability.note[lang]}</span>
        </div>
        <div className="spec__row">
          <span className="spec__key">{t("flavorProfile")}</span>
          <span className="spec__val">{ing.flavorProfile.join(" · ")}</span>
        </div>
        <div className="spec__row">
          <span className="spec__key">{t("functions")}</span>
          <span className="spec__val">{ing.functions.join(" · ")}</span>
        </div>
        <div className="spec__row">
          <span className="spec__key">{t("storage")}</span>
          <span className="spec__val">{ing.storage[lang]}</span>
        </div>
        <div className="spec__row">
          <span className="spec__key">{t("commonUses")}</span>
          <span className="spec__val">{ing.commonUses[lang].join(" · ")}</span>
        </div>
      </section>

      {ing.substitutions.length > 0 && (
        <section className="section">
          <div className="section__head">
            <span className="section__idx">↔</span>
            <h2>{t("substitutions")}</h2>
          </div>
          {ing.substitutions.map((sub, i) => (
            <div className="card" key={i} style={{ marginBottom: 12 }}>
              <h4>{sub.label[lang]}</h4>
              <span className={`tag ${sub.functional ? "tag--probe" : "tag--warn"}`}>
                {sub.functional ? t("functionalSub") : t("directSub")}
              </span>
              <p style={{ marginTop: 10 }}>{sub.result[lang]}</p>
              {sub.ingredient && INGREDIENT_BY_ID.has(sub.ingredient) && (
                <a
                  className="btn btn--ghost"
                  href={`/ingredients/${sub.ingredient}`}
                  onClick={onLink}
                >
                  {INGREDIENT_BY_ID.get(sub.ingredient)!.name[lang]}
                </a>
              )}
            </div>
          ))}
        </section>
      )}

      <section className="section">
        <div className="section__head">
          <span className="section__idx">◇</span>
          <h2>{lang === "en" ? "Explore this ingredient" : "Explorá este ingrediente"}</h2>
        </div>
        <div className="block block--project">
          <div className="block__eyebrow">
            {lang === "en" ? "Repeatable project" : "Proyecto repetible"}
          </div>
          <h4 style={{ margin: "2px 0 4px", fontSize: 19 }}>
            {lang === "en" ? "Taste an unfamiliar ingredient" : "Probar un ingrediente desconocido"}
          </h4>
          <ol className="prose" style={{ marginTop: 12 }}>
            {(lang === "en"
              ? [
                  "Taste it alone. Note the first impression before you rationalise it.",
                  "Smell it separately — aroma and taste are different channels.",
                  "Describe the flavour in your own words, then check them against the profile above.",
                  "Work out its culinary function: what job does it do in a dish?",
                  "Identify cuisines that lean on it, and why they do.",
                  "Use it in one simple preparation where it is the only variable.",
                  "Use it again in a second, different preparation.",
                  "Repeat that second preparation with a substitute from the list above.",
                  "Record what changed. That difference is the ingredient's actual contribution.",
                ]
              : [
                  "Probalo solo. Anotá la primera impresión antes de racionalizarla.",
                  "Olelo por separado — aroma y sabor son canales distintos.",
                  "Describí el sabor con tus palabras y compará con el perfil de arriba.",
                  "Deducí su función culinaria: ¿qué trabajo hace en un plato?",
                  "Identificá qué cocinas se apoyan en él, y por qué.",
                  "Usalo en una preparación simple donde sea la única variable.",
                  "Usalo otra vez en una segunda preparación distinta.",
                  "Repetí esa segunda preparación con un sustituto de la lista de arriba.",
                  "Registrá qué cambió. Esa diferencia es el aporte real del ingrediente.",
                ]
            ).map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
          <div className="block__bar">
            <button type="button" className="btn" onClick={() => onLog(ing.id)}>
              {t("logFrom")}
            </button>
          </div>
        </div>
      </section>
    </article>
  );
}
