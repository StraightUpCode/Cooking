# The Kitchen Lab Manual

A home-cooking curriculum built for a learner whose motto is **"engineer first,
craftsman second."** It treats the kitchen the way precision coffee treats
extraction: a small set of variables — heat, moisture, time, salt, and structure —
that you learn to read and tune. Recipes are just coordinates on that surface.

Every lesson follows the same learning loop:

> **mental model → what good looks like → practice → analyse mistakes → iterate**

and organises the skill into four levels: **Functional → Consistent →
Optimisation → Mastery.**

## How to use it

Open **`index.html`** in any browser. It's a single, self-contained page — no
build step, no internet required. Use the left sidebar to move between the
syllabus and the nine modules.

```
index.html   → the whole manual (open this)
build/        → source: shared design system, per-lesson fragments, assembler
```

## Modules

| # | Module | Focus |
|---|--------|-------|
| P0 | Kitchen Foundation | Knife skills & sharpening, mise en place, heat control |
| 01 | Proteins | Chicken mastery (the dry-chicken fix) + advanced eggs |
| 02 | Rice, Beans & Grains | Starch & legumes — the cheap, reliable meal base |
| 03 | Sauces & Flavour | Emulsions, reductions, and flavour balance |
| 04 | Vegetables | Browning, high heat, and quick ferments |
| 05 | Bread & Dough | Gluten, hydration, fermentation — pizza to sourdough |
| 06 | Fermentation | Lacto-ferments, safety as engineering constraints, koji |
| 07 | Meat & Fire | Two-zone fire, reverse sear, resting, low-and-slow |
| 08 | Restaurant Projects | Integration: mise en place, timelines, themed nights |

## Rebuilding

The page is assembled from a shared design system plus one HTML fragment per
lesson. To regenerate `index.html` after editing anything under `build/`:

```bash
python3 build/assemble.py
```

Each lesson is a standalone fragment in `build/lessons/`; the shared styles,
sidebar, hub, and router live in `build/parts/`.
