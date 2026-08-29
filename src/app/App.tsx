import { useCallback, useEffect, useState } from "react";
import { useRoute, useLinkHandler, navigate } from "./router";
import { applyTheme, useAppState } from "./state/store";
import { Sidebar } from "@/components/navigation/Sidebar";
import { SearchOverlay } from "@/components/navigation/SearchOverlay";
import { Dashboard } from "@/components/progress/Dashboard";
import { ModulePage } from "@/components/curriculum/ModulePage";
import { ReferencePage } from "@/components/curriculum/ReferencePage";
import { SkillsPage, SkillDetail } from "@/components/curriculum/SkillsPage";
import { IngredientLab, IngredientDetail } from "@/components/recipes/IngredientLab";
import { LogPage } from "@/components/experiments/LogPage";
import { moduleTitle } from "@/content/titles";
import { MODULE_BY_SLUG } from "@/data/curriculum";
import { makeT } from "@/i18n";

export function App() {
  const route = useRoute();
  const { lang, theme } = useAppState();
  const t = makeT(lang);
  const onLink = useLinkHandler();

  const [navOpen, setNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [logSubject, setLogSubject] = useState<string | undefined>(undefined);

  useEffect(() => applyTheme(theme), [theme]);

  // Close transient UI on navigation.
  useEffect(() => {
    setNavOpen(false);
    setSearchOpen(false);
  }, [route]);

  useEffect(() => {
    document.title =
      route.name === "module"
        ? `${moduleTitle(MODULE_BY_SLUG.get(route.slug)?.id ?? "", lang)} — The Kitchen Lab Manual`
        : "The Kitchen Lab Manual";
  }, [route, lang]);

  // Cmd/Ctrl-K opens search, "/" as a shortcut when not typing.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing =
        e.target instanceof HTMLElement &&
        ["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName);
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openLog = useCallback((subject: string) => {
    setLogSubject(subject);
    navigate("/log");
  }, []);

  const heading =
    route.name === "module"
      ? moduleTitle(MODULE_BY_SLUG.get(route.slug)?.id ?? "", lang)
      : "The Kitchen Lab Manual";

  return (
    <div className="app">
      <a className="skip-link" href="#main">
        {t("skipToContent")}
      </a>

      <header className="topbar">
        <button
          type="button"
          className="iconbtn"
          aria-label={t("menu")}
          aria-expanded={navOpen}
          aria-controls="sidebar"
          onClick={() => setNavOpen((v) => !v)}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.6" fill="none" />
          </svg>
        </button>
        <span className="topbar__title">{heading}</span>
        <button
          type="button"
          className="iconbtn"
          aria-label={t("search")}
          onClick={() => setSearchOpen(true)}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
            <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.6" fill="none" />
            <path d="M13 13l4 4" stroke="currentColor" strokeWidth="1.6" fill="none" />
          </svg>
        </button>
      </header>

      {navOpen && (
        <button
          type="button"
          className="scrim"
          aria-label={t("close")}
          onClick={() => setNavOpen(false)}
        />
      )}

      <Sidebar route={route} open={navOpen} onNavigate={() => setNavOpen(false)} />

      <main className="stage" id="main">
        <DesktopSearchButton onOpen={() => setSearchOpen(true)} label={t("search")} />

        {route.name === "dashboard" && <Dashboard lang={lang} />}

        {route.name === "module" && (
          <ModulePage
            slug={route.slug}
            {...(route.hash ? { hash: route.hash } : {})}
            lang={lang}
            onLog={openLog}
          />
        )}

        {route.name === "skills" &&
          (route.id ? <SkillDetail id={route.id} lang={lang} /> : <SkillsPage lang={lang} />)}

        {route.name === "ingredients" &&
          (route.id ? (
            <IngredientDetail id={route.id} lang={lang} onLog={openLog} />
          ) : (
            <IngredientLab lang={lang} />
          ))}

        {route.name === "reference" && <ReferencePage lang={lang} />}

        {route.name === "log" && (
          <LogPage lang={lang} {...(logSubject ? { subject: logSubject } : {})} />
        )}

        {route.name === "notFound" && (
          <div className="wrap">
            <p className="eyebrow">404</p>
            <h1>{t("notFound")}</h1>
            <p>
              <a href="/" onClick={onLink}>
                {t("backHome")}
              </a>
            </p>
          </div>
        )}
      </main>

      {searchOpen && <SearchOverlay lang={lang} onClose={() => setSearchOpen(false)} />}
    </div>
  );
}

/** Search affordance for the desk layout, where there is no top bar. */
function DesktopSearchButton({ onOpen, label }: { onOpen: () => void; label: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        padding: "16px 24px 0",
      }}
      className="desktop-only"
    >
      <button type="button" className="btn" onClick={onOpen}>
        {label} <span className="num" style={{ opacity: 0.6 }}>⌘K</span>
      </button>
    </div>
  );
}
