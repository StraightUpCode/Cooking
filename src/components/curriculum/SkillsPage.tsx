import { SKILLS, SKILL_BY_ID } from "@/data/skills";
import { MODULE_BY_ID, MODULE_ORDER } from "@/data/curriculum";
import { moduleTitle } from "@/content/titles";
import { useLinkHandler } from "@/app/router";
import { makeT } from "@/i18n";
import type { Lang } from "@/types";

/**
 * The curriculum as a skill graph.
 *
 * Module -> skills comes from module metadata, so this view stays correct as
 * modules are added without anything being registered in two places.
 */
function modulesForSkill(skillId: string) {
  return MODULE_ORDER.filter((m) => m.skills.includes(skillId));
}

export function SkillsPage({ lang }: { lang: Lang }) {
  const t = makeT(lang);
  const onLink = useLinkHandler();

  return (
    <div className="wrap">
      <header className="page-head">
        <p className="eyebrow eyebrow--probe">{t("skills")}</p>
        <h1>{t("skills")}</h1>
        <p className="lede">{t("skillsIntro")}</p>
      </header>

      <div className="grid grid--2">
        {SKILLS.map((skill) => {
          const modules = modulesForSkill(skill.id);
          return (
            <a className="card" key={skill.id} href={`/skills/${skill.id}`} onClick={onLink}>
              <h4>{skill.name[lang]}</h4>
              <p>{skill.description[lang]}</p>
              <p style={{ marginTop: 8, fontSize: 12, color: "var(--ink-faint)" }} className="num">
                {modules.length} {modules.length === 1 ? t("module") : t("curriculum")}
              </p>
            </a>
          );
        })}
      </div>
    </div>
  );
}

export function SkillDetail({ id, lang }: { id: string; lang: Lang }) {
  const t = makeT(lang);
  const onLink = useLinkHandler();
  const skill = SKILL_BY_ID.get(id);

  if (!skill) {
    return (
      <div className="wrap">
        <h1>{t("notFound")}</h1>
        <p>
          <a href="/skills" onClick={onLink}>
            {t("skills")}
          </a>
        </p>
      </div>
    );
  }

  const modules = modulesForSkill(skill.id);

  return (
    <div className="wrap">
      <header className="page-head">
        <p className="eyebrow eyebrow--probe">{t("skill")}</p>
        <h1>{skill.name[lang]}</h1>
        <p className="lede">{skill.description[lang]}</p>
      </header>

      <section className="section" style={{ marginTop: 0 }}>
        <div className="section__head">
          <span className="section__idx">→</span>
          <h2>{t("practisedIn")}</h2>
        </div>
        <div className="grid grid--2">
          {modules.map((m) => (
            <a className="card" key={m.id} href={`/module/${m.slug}`} onClick={onLink}>
              <h4>{moduleTitle(m.id, lang)}</h4>
              <p style={{ color: "var(--ink-faint)", fontSize: 14 }}>{m.duration[lang]}</p>
            </a>
          ))}
          {modules.length === 0 && <p className="empty">{t("noResults")}</p>}
        </div>
      </section>

      {skill.modules.length > 0 && (
        <section className="section">
          <div className="section__head">
            <span className="section__idx">·</span>
            <h2>{t("curriculum")}</h2>
          </div>
          <div className="chiprow">
            {skill.modules.map((mid) => {
              const meta = MODULE_BY_ID.get(mid);
              if (!meta) return null;
              return (
                <a className="chip" key={mid} href={`/module/${meta.slug}`} onClick={onLink}>
                  {moduleTitle(mid, lang)}
                </a>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
