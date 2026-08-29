import type { ModuleMeta, Phase } from "@/types";

/**
 * Module metadata — language-independent and UI-agnostic.
 *
 * Navigation, prerequisites, filtering and the dashboard all read these fields.
 * Adding a module means adding a record here plus its content file; no
 * application logic changes.
 *
 * Phases are an organisational grouping, never a deadline and never a lock:
 * every module stays reachable at all times, including the capstone.
 */
export const MODULES: ModuleMeta[] = [
  {
    id: "p0",
    slug: "kitchen-foundation",
    phase: 0,
    order: 0,
    level: "foundation",
    prerequisites: [],
    skills: ["knife-safety", "cutting", "sharpening", "mise-en-place", "heat-control"],
    equipment: {
      required: ["chef-knife", "cutting-board"],
      recommended: ["whetstone", "scale", "thermometer"],
      optional: ["wire-rack"],
    },
    ingredients: [],
    noCook: true,
    duration: { en: "~2 weeks", es: "~2 semanas" },
  },
  {
    id: "m1",
    slug: "proteins",
    phase: 1,
    order: 1,
    level: "core",
    prerequisites: ["p0"],
    skills: [
      "temperature-control",
      "carryover",
      "brining",
      "searing",
      "resting-meat",
      "pan-sauce",
      "emulsion",
      "food-safety",
    ],
    equipment: {
      required: ["thermometer", "skillet"],
      recommended: ["scale", "wire-rack", "nonstick"],
      optional: ["sous-vide"],
    },
    ingredients: [],
    noCook: false,
    duration: { en: "Month 1", es: "Mes 1" },
  },
  {
    id: "m2",
    slug: "rice-beans-grains",
    phase: 1,
    order: 2,
    level: "core",
    prerequisites: ["p0"],
    skills: ["starch-management", "heat-control", "seasoning-balance"],
    equipment: {
      required: ["pot"],
      recommended: ["scale", "sieve"],
      optional: [],
    },
    ingredients: ["rice", "beans"],
    noCook: false,
    duration: { en: "Month 2", es: "Mes 2" },
  },
  {
    id: "m3",
    slug: "sauces-flavour",
    phase: 2,
    order: 3,
    level: "core",
    prerequisites: ["m1"],
    skills: ["emulsion", "reduction", "pan-sauce", "seasoning-balance", "ingredient-analysis"],
    equipment: {
      required: ["skillet"],
      recommended: ["blender", "scale"],
      optional: ["sieve"],
    },
    ingredients: ["soy-sauce", "fish-sauce", "rice-vinegar", "parmesan"],
    noCook: false,
    duration: { en: "Month 3", es: "Mes 3" },
  },
  {
    id: "m4",
    slug: "vegetables",
    phase: 2,
    order: 4,
    level: "core",
    prerequisites: ["p0"],
    skills: ["browning", "heat-control", "cutting", "seasoning-balance"],
    equipment: {
      required: ["sheet-tray"],
      recommended: ["skillet"],
      optional: ["wire-rack"],
    },
    ingredients: [],
    noCook: false,
    duration: { en: "Month 4", es: "Mes 4" },
  },
  {
    id: "m5",
    slug: "bread-dough",
    phase: 3,
    order: 5,
    level: "applied",
    prerequisites: ["p0"],
    skills: ["gluten-development", "hydration", "fermentation-timing", "shaping"],
    equipment: {
      required: ["scale"],
      recommended: ["dutch-oven", "sheet-tray"],
      optional: ["baking-steel"],
    },
    ingredients: [],
    noCook: false,
    duration: { en: "Months 5–6", es: "Meses 5–6" },
  },
  {
    id: "m6",
    slug: "fermentation",
    phase: 3,
    order: 6,
    level: "applied",
    prerequisites: [],
    skills: ["lacto-fermentation", "food-safety", "fermentation-timing", "sensory-analysis"],
    equipment: {
      required: ["fermentation-jar", "scale"],
      recommended: ["fermentation-weight", "ph-strips"],
      optional: [],
    },
    ingredients: ["miso", "gochujang", "fish-sauce"],
    noCook: true,
    duration: { en: "Months 6–7", es: "Meses 6–7" },
  },
  {
    id: "m7",
    slug: "meat-fire",
    phase: 4,
    order: 7,
    level: "applied",
    prerequisites: ["m1"],
    skills: [
      "fire-management",
      "temperature-control",
      "carryover",
      "resting-meat",
      "searing",
      "brining",
      "food-safety",
    ],
    equipment: {
      required: ["grill", "thermometer"],
      recommended: ["wire-rack"],
      optional: [],
    },
    ingredients: [],
    noCook: false,
    duration: { en: "Months 7–9", es: "Meses 7–9" },
  },
  {
    id: "m8",
    slug: "restaurant-projects",
    phase: 4,
    order: 8,
    level: "capstone",
    prerequisites: [],
    skills: ["orchestration", "mise-en-place", "seasoning-balance"],
    equipment: {
      required: [],
      recommended: ["scale", "skillet", "sheet-tray"],
      optional: ["baking-steel"],
    },
    ingredients: [],
    noCook: true,
    duration: { en: "Months 9–12", es: "Meses 9–12" },
  },
  {
    id: "taste",
    slug: "taste-calibration",
    phase: 0,
    order: 9,
    level: "sensory",
    prerequisites: [],
    skills: ["sensory-analysis", "seasoning-balance", "ingredient-analysis"],
    equipment: {
      required: ["scale", "tasting-glasses"],
      recommended: [],
      optional: [],
    },
    ingredients: ["soy-sauce", "fish-sauce", "miso", "parmesan", "rice-vinegar"],
    noCook: true,
    duration: { en: "Runs alongside everything", es: "Corre junto a todo lo demás" },
  },
];

export const MODULE_BY_ID = new Map(MODULES.map((m) => [m.id, m]));
export const MODULE_BY_SLUG = new Map(MODULES.map((m) => [m.slug, m]));

/** Curriculum order for prev/next navigation. */
export const MODULE_ORDER = [...MODULES].sort((a, b) => a.order - b.order);

export const PHASES: Array<{ phase: Phase; label: { en: string; es: string } }> = [
  { phase: 0, label: { en: "Foundation", es: "Fundamentos" } },
  { phase: 1, label: { en: "Phase 1 · Staples", es: "Fase 1 · Básicos" } },
  { phase: 2, label: { en: "Phase 2 · Flavour", es: "Fase 2 · Sabor" } },
  { phase: 3, label: { en: "Phase 3 · Transformation", es: "Fase 3 · Transformación" } },
  { phase: 4, label: { en: "Phase 4 · Applied", es: "Fase 4 · Aplicado" } },
];

/** Sidebar numbering: "P0", "01"… kept stable and language-independent. */
export function moduleNumber(meta: ModuleMeta): string {
  if (meta.id === "p0") return "P0";
  if (meta.id === "taste") return "TC";
  return String(meta.order).padStart(2, "0");
}
