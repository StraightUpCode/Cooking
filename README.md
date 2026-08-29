# The Kitchen Lab Manual

A bilingual (EN/ES) home-cooking curriculum that treats the kitchen as a control
system: a small set of variables — heat, moisture, time, salt, structure — that
you learn to read and tune. Recipes are coordinates, not instructions.

Built with **Vite + React + TypeScript**, deployed on **Cloudflare Workers**
using **Workers Static Assets**.

---

## Quick start

```bash
npm install
npm run content     # regenerate content from build/lessons (only after editing v1 sources)
npm run dev         # http://localhost:5173
npm run build       # typecheck + vite build -> dist/
npm run preview     # build, then serve through the real Worker (wrangler dev)
npm run deploy      # build, then wrangler deploy
```

## Architecture

```
Browser
   ↓
Cloudflare Worker            worker/index.ts — thin; reserves /api/* for later
   ↓
Static assets (dist/)        served from the edge before the Worker runs
```

There is no backend. Progress lives in `localStorage`, so the app works offline
and owns no user data. The Worker exists as the deployment target and as the
seam where server-side functionality (e.g. progress sync) would go without
changing the deployment architecture.

| File | Purpose |
| --- | --- |
| `wrangler.jsonc` | Workers Static Assets config (`assets.directory: ./dist`, SPA fallback) |
| `vite.config.ts` | Build; per-module code splitting |
| `worker/index.ts` | Worker entry — serves assets, 501s unimplemented `/api/*` |
| `scripts/migrate.mjs` | v1 HTML → structured content, with an integrity check |
| `scripts/e2e.mjs` | Playwright checks (nav, i18n, progress, search, mobile) |

## Repository layout

```
src/
  app/          App shell, router, localStorage store
  components/   layout · navigation · curriculum · recipes · experiments · progress · common
  content/      Generated module JSON (per module, per language) + search index
  data/         curriculum · skills · equipment · ingredients · reference
  i18n/         UI chrome strings
  styles/       Design tokens + app stylesheet
  types.ts      The content schema — start here
worker/         Cloudflare Worker entry
legacy/         The v1 single-file manual, kept until the rewrite is fully verified
build/          v1 sources; still the authoring input for migrate.mjs
```

## How content works

Curriculum content is **data, not components**. Each module is a metadata record
in `src/data/curriculum.ts` plus one JSON file per language in
`src/content/modules/`. A module's body is a list of typed blocks — `prose`,
`callout`, `spec`, `table`, `figure`, `cards`, `experiment`, `drill`,
`troubleshoot`, `knowledgeCheck`, `imageSearch`, `resource`, `levels`.

`BlockView.tsx` is the only place that knows how a block looks. Adding a block
type means adding a case there and a variant in `src/types.ts` — nothing else.
There is no curriculum-specific branching anywhere in the UI; navigation,
prerequisites, equipment and skill mapping are all driven from metadata.

### Adding a module

1. Add a record to `MODULES` in `src/data/curriculum.ts` (id, slug, phase,
   skills, equipment, `noCook`, duration).
2. Add `src/content/modules/<id>.en.json` and `<id>.es.json`.
3. Add its title to `src/content/titles.ts` if it is not produced by the
   migration manifest.

Navigation, search, progress and the dashboard pick it up automatically.

### Languages

English and Spanish are one curriculum with shared IDs, not two curricula.
Progress is keyed on content IDs (`m1.e01`), never on translated titles, so
switching language preserves everything. A module missing a translation falls
back to English rather than breaking.

### Content integrity

`npm run content` re-derives all module JSON from `build/lessons*` and **fails
the build if any source token goes missing** in either language, or if the two
languages disagree on section count, block count or block types. This is what
guarantees the migration did not quietly drop curriculum material.

## Progress model

Stored under `klm.progress.v1`:

```jsonc
{
  "completed": ["m1.e01", "p0.d02"],   // experiments, drills, projects
  "favorites": [],
  "notes":     { "m1.e01": "Repeat this — pan was too crowded." },
  "recent":    ["m1"],
  "log":       [ /* structured failure/experiment entries */ ]
}
```

Plain, serialisable and ID-keyed, so cloud sync could be added later without
reshaping the data.

## Deploying

```bash
npx wrangler login
npm run deploy
```

`npm run deploy` runs a typecheck, builds to `dist/`, and uploads the Worker
plus assets. Verify the config at any time without deploying:

```bash
npx wrangler deploy --dry-run
```

## Testing

```bash
npm run build
npx vite preview --port 4173 &
NODE_PATH=$(npm root -g) node scripts/e2e.mjs
```

Covers: routing, module loading, EN/ES switching, progress persistence across
reloads and languages, search, ingredient substitutions, legacy `#hash`
redirects, mobile layout at 390px, and touch-target sizes.

## Design notes

- **Phases are organisation, not deadlines.** Every module, including the
  capstone, is reachable at all times. No streaks, no timers, no pressure.
- **Mobile first.** Phone layout is the base; the sidebar becomes a permanent
  rail at 900px.
- **Engineering analogies are aids, not replacements.** The culinary explanation
  always comes first; the analogy sits beside it.
- **Availability data is scoped to Nicaragua and honest.** Anything unverified is
  marked as such rather than guessed at.
