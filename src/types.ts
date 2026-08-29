/**
 * Content schema for the Kitchen Lab Manual.
 *
 * Design rules that the rest of the app depends on:
 *
 * 1. Every addressable thing has a STABLE ID that is language-independent.
 *    Progress, favourites and notes are keyed on these IDs, so a learner who
 *    switches between English and Spanish keeps the same progress.
 * 2. Language-specific text lives in `Localized<T>` maps keyed by `Lang`.
 *    There is one curriculum, not two.
 * 3. Blocks are a discriminated union. Adding a new block type means adding a
 *    renderer, never editing curriculum-specific branching logic.
 */

export type Lang = "en" | "es";
export const LANGS: readonly Lang[] = ["en", "es"] as const;

/** A value that exists in both languages. */
export type Localized<T> = Record<Lang, T>;

/* ------------------------------------------------------------------ *
 * Blocks
 * ------------------------------------------------------------------ */

/** Free prose. `html` is trusted, build-time-generated markup. */
export interface ProseBlock {
  kind: "prose";
  html: string;
}

export type CalloutVariant = "why" | "heat" | "mistake" | "pro" | "plain";

export interface CalloutBlock {
  kind: "callout";
  variant: CalloutVariant;
  label: string;
  html: string;
}

export interface SpecBlock {
  kind: "spec";
  title: string;
  rows: Array<{ key: string; value: string }>;
}

export interface TableBlock {
  kind: "table";
  head: string[];
  rows: string[][];
}

/** A hand-authored inline SVG diagram plus its caption. */
export interface FigureBlock {
  kind: "figure";
  svg: string;
  caption: string;
}

export interface CardsBlock {
  kind: "cards";
  items: Array<{ title: string; html: string }>;
}

/** A controlled experiment: change exactly one variable. */
export interface ExperimentBlock {
  kind: "experiment";
  id: string;
  title: string;
  fields: Array<{ term: string; detail: string }>;
}

/** A practice drill or a project. Same shape, different intent. */
export interface DrillBlock {
  kind: "drill";
  id: string;
  variant: "drill" | "project";
  eyebrow: string;
  title: string;
  fields: Array<{ term: string; detail: string }>;
}

export interface TroubleshootBlock {
  kind: "troubleshoot";
  id: string;
  problem: string;
  signal: string;
  fields: Array<{ term: string; detail: string }>;
}

export interface KnowledgeCheckBlock {
  kind: "knowledgeCheck";
  id: string;
  questions: string[];
}

export interface ImageSearchBlock {
  kind: "imageSearch";
  query: string;
  look: string;
}

export interface ResourceBlock {
  kind: "resource";
  meta: string;
  title: string;
  why: string;
}

export interface LevelBandBlock {
  kind: "levelBand";
  level: 1 | 2 | 3 | 4;
  label: string;
}

export interface LevelsBlock {
  kind: "levels";
  items: Array<{ level: 1 | 2 | 3 | 4; label: string }>;
}

/** Escape hatch for markup that doesn't match a richer block type. */
export interface RawBlock {
  kind: "raw";
  html: string;
}

export type Block =
  | ProseBlock
  | CalloutBlock
  | SpecBlock
  | TableBlock
  | FigureBlock
  | CardsBlock
  | ExperimentBlock
  | DrillBlock
  | TroubleshootBlock
  | KnowledgeCheckBlock
  | ImageSearchBlock
  | ResourceBlock
  | LevelBandBlock
  | LevelsBlock
  | RawBlock;

/** Blocks a learner can tick off. Keep in sync with `TRACKABLE_KINDS`. */
export type TrackableBlock = ExperimentBlock | DrillBlock;

export const TRACKABLE_KINDS = ["experiment", "drill"] as const;

export function isTrackable(block: Block): block is TrackableBlock {
  return block.kind === "experiment" || block.kind === "drill";
}

/* ------------------------------------------------------------------ *
 * Sections and modules
 * ------------------------------------------------------------------ */

export interface Section {
  /** Stable, language-independent, e.g. "m1.s06". */
  id: string;
  /** Display index as authored, e.g. "06" or "TK". */
  index: string;
  title: string;
  blocks: Block[];
}

/** The per-language body of a module. */
export interface ModuleContent {
  eyebrow: string;
  title: string;
  lede: string;
  tags: string[];
  sections: Section[];
}

export type Phase = 0 | 1 | 2 | 3 | 4;

export type ModuleLevel = "foundation" | "core" | "applied" | "capstone" | "sensory" | "reference";

/**
 * Module metadata. Deliberately language-independent: the UI drives navigation,
 * prerequisites and filtering from these fields rather than from titles, so new
 * modules can be added without touching application logic.
 */
export interface ModuleMeta {
  id: string;
  slug: string;
  /** Organisational grouping, never a deadline. */
  phase: Phase;
  order: number;
  level: ModuleLevel;
  /** Module IDs that this one assumes. Advisory, never a hard lock. */
  prerequisites: string[];
  /** Skill IDs practised here. */
  skills: string[];
  equipment: EquipmentNeeds;
  /** Ingredient IDs that feature prominently. */
  ingredients: string[];
  /** True when meaningful progress is possible without cooking. */
  noCook: boolean;
  /** Estimated commitment, shown as guidance only. */
  duration: Localized<string>;
}

export interface CurriculumModule extends ModuleMeta {
  content: Localized<ModuleContent>;
}

/* ------------------------------------------------------------------ *
 * Skills, equipment, ingredients, references
 * ------------------------------------------------------------------ */

export interface Skill {
  id: string;
  name: Localized<string>;
  description: Localized<string>;
  /** Module IDs where this skill is taught or practised. */
  modules: string[];
}

export interface EquipmentNeeds {
  required: string[];
  recommended: string[];
  optional: string[];
}

export const EMPTY_EQUIPMENT: EquipmentNeeds = { required: [], recommended: [], optional: [] };

export type EquipmentTier = "essential" | "worthwhile" | "luxury";

export interface Equipment {
  id: string;
  name: Localized<string>;
  tier: EquipmentTier;
  note: Localized<string>;
}

/**
 * Sourcing difficulty, defined for Nicaragua specifically.
 * Only assert a level when it is actually known.
 */
export type AvailabilityLevel =
  /** 1 — routinely available locally. */
  | "common"
  /** 2 — specialty or import grocery. */
  | "specialty"
  /** 3 — likely needs importing. */
  | "import"
  /** 4 — highly specialised; expect to substitute or make it. */
  | "exotic"
  /** Not researched. Never guess. */
  | "unknown";

export const AVAILABILITY_ORDER: AvailabilityLevel[] = [
  "common",
  "specialty",
  "import",
  "exotic",
  "unknown",
];

/**
 * A substitution. `functional` distinguishes "this behaves like it" from
 * "this is the same thing", which is the more useful idea in practice.
 */
export interface Substitution {
  /** Ingredient id when known, otherwise free text. */
  ingredient?: string;
  label: Localized<string>;
  /** What the substitute actually reproduces. */
  functional: boolean;
  result: Localized<string>;
}

export interface Ingredient {
  id: string;
  name: Localized<string>;
  category: string;
  /** Flavour axis ids: umami, salty, acidic, sweet, bitter, fat, aromatic, heat. */
  flavorProfile: string[];
  /** Culinary jobs it performs: seasoning, acidity, thickening, marinade... */
  functions: string[];
  availability: {
    region: "Nicaragua";
    level: AvailabilityLevel;
    note: Localized<string>;
  };
  storage: Localized<string>;
  commonUses: Localized<string[]>;
  substitutions: Substitution[];
}

export type RecipeSourcing = AvailabilityLevel;

export interface Recipe {
  id: string;
  name: Localized<string>;
  /** Module this recipe belongs to, when it comes from the curriculum. */
  module?: string;
  skills: string[];
  equipment: EquipmentNeeds;
  ingredients: string[];
  /** Hardest-to-source ingredient governs the recipe's sourcing level. */
  sourcing: RecipeSourcing;
  summary: Localized<string>;
}

export type ReferenceCategory =
  | "temperature"
  | "ratio"
  | "conversion"
  | "glossary"
  | "safety"
  | "method"
  | "troubleshooting";

/** Shared reference material. Lessons link here instead of repeating it. */
export interface ReferenceEntry {
  id: string;
  category: ReferenceCategory;
  term: Localized<string>;
  definition: Localized<string>;
  /** Optional engineering analogy — an aid to understanding, not jargon. */
  analogy?: Localized<string>;
  blocks?: Localized<Block[]>;
  related: string[];
}

/* ------------------------------------------------------------------ *
 * Search
 * ------------------------------------------------------------------ */

export type SearchCategory =
  | "module"
  | "section"
  | "experiment"
  | "drill"
  | "project"
  | "recipe"
  | "ingredient"
  | "skill"
  | "reference";

export interface SearchDoc {
  id: string;
  category: SearchCategory;
  /** Route to navigate to when the result is chosen. */
  href: string;
  title: Localized<string>;
  /** Contextual label, e.g. "Proteins → Lesson". */
  context: Localized<string>;
  /** Lowercased haystack per language. */
  text: Localized<string>;
}

/* ------------------------------------------------------------------ *
 * Learner state (localStorage; IDs only, never translated strings)
 * ------------------------------------------------------------------ */

export interface LogEntry {
  id: string;
  /** ISO date. */
  date: string;
  /** Related content id, when the entry came from an experiment or drill. */
  subject?: string;
  dish: string;
  goal: string;
  expected: string;
  actual: string;
  observations: string;
  hypothesis: string;
  variableChanged: string;
  nextAttempt: string;
  outcome: string;
}

export interface ProgressState {
  /** Content IDs the learner has marked complete. */
  completed: string[];
  favorites: string[];
  notes: Record<string, string>;
  /** Recently viewed module IDs, most recent first. */
  recent: string[];
  lastModule?: string;
  log: LogEntry[];
}

export const EMPTY_PROGRESS: ProgressState = {
  completed: [],
  favorites: [],
  notes: {},
  recent: [],
  log: [],
};
