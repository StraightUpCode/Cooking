import { MODULE_ORDER, PHASES, moduleNumber } from "@/data/curriculum";
import { moduleTitle } from "@/content/titles";
import { setLang, setTheme, useAppState } from "@/app/state/store";
import { useLinkHandler, type Route } from "@/app/router";
import { makeT } from "@/i18n";

/**
 * Primary navigation. A permanent rail from 900px up, a drawer below it.
 * Module labels come from content when it has been loaded and fall back to the
 * manifest, so navigation never blocks on a lazy chunk.
 */
export function Sidebar({
  route,
  open,
  onNavigate,
}: {
  route: Route;
  open: boolean;
  onNavigate: () => void;
}) {
  const { lang, theme } = useAppState();
  const t = makeT(lang);
  const onLink = useLinkHandler();

  const currentSlug = route.name === "module" ? route.slug : null;

  const grouped = PHASES.map((p) => ({
    ...p,
    modules: MODULE_ORDER.filter((m) => m.phase === p.phase),
  })).filter((g) => g.modules.length > 0);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onLink(e);
    onNavigate();
  };

  return (
    <aside className="sidebar" data-open={open} id="sidebar" aria-label={t("menu")}>
      <a className="brand" href="/" onClick={handleClick}>
        <b>
          The Kitchen
          <br />
          Lab Manual
        </b>
        <span>{t("brandTagline")}</span>
      </a>

      <hr className="rule" />

      <ul className="nav">
        <li>
          <a
            className="nav__link"
            href="/"
            onClick={handleClick}
            aria-current={route.name === "dashboard" ? "page" : undefined}
          >
            <span className="nav__n">00</span>
            <span className="nav__t">{t("dashboard")}</span>
          </a>
        </li>
      </ul>

      {grouped.map((group) => (
        <div key={group.phase}>
          <div className="nav__group">{group.label[lang]}</div>
          <ul className="nav">
            {group.modules.map((m) => {
              const label = moduleTitle(m.id, lang);
              return (
                <li key={m.id}>
                  <a
                    className="nav__link"
                    href={`/module/${m.slug}`}
                    onClick={handleClick}
                    aria-current={currentSlug === m.slug ? "page" : undefined}
                  >
                    <span className="nav__n">{moduleNumber(m)}</span>
                    <span className="nav__t">{label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      <div className="nav__group">{t("tools")}</div>
      <ul className="nav">
        <li>
          <a
            className="nav__link"
            href="/ingredients"
            onClick={handleClick}
            aria-current={route.name === "ingredients" ? "page" : undefined}
          >
            <span className="nav__n">IL</span>
            <span className="nav__t">{t("ingredientLab")}</span>
          </a>
        </li>
        <li>
          <a
            className="nav__link"
            href="/skills"
            onClick={handleClick}
            aria-current={route.name === "skills" ? "page" : undefined}
          >
            <span className="nav__n">SK</span>
            <span className="nav__t">{t("skills")}</span>
          </a>
        </li>
        <li>
          <a
            className="nav__link"
            href="/reference"
            onClick={handleClick}
            aria-current={route.name === "reference" ? "page" : undefined}
          >
            <span className="nav__n">RF</span>
            <span className="nav__t">{t("reference")}</span>
          </a>
        </li>
        <li>
          <a
            className="nav__link"
            href="/log"
            onClick={handleClick}
            aria-current={route.name === "log" ? "page" : undefined}
          >
            <span className="nav__n">LG</span>
            <span className="nav__t">{t("logbook")}</span>
          </a>
        </li>
      </ul>

      <p className="side-note">
        <b>{t("howToReadTitle")}</b> {t("howToRead")}
      </p>

      <div className="segmented" role="group" aria-label={t("language")}>
        <button
          type="button"
          className="segbtn"
          aria-pressed={lang === "en"}
          onClick={() => setLang("en")}
        >
          EN
        </button>
        <button
          type="button"
          className="segbtn"
          aria-pressed={lang === "es"}
          onClick={() => setLang("es")}
        >
          ES
        </button>
      </div>

      <div className="segmented" role="group" aria-label={t("theme")}>
        {(["light", "system", "dark"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            className="segbtn"
            aria-pressed={theme === mode}
            onClick={() => setTheme(mode)}
          >
            {mode === "light" ? "☀" : mode === "dark" ? "☾" : "Auto"}
          </button>
        ))}
      </div>
    </aside>
  );
}
