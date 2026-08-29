import type { Lang } from "@/types";

/**
 * UI chrome strings. Curriculum content lives in the content layer; this is
 * only the shell — labels, buttons, empty states.
 */
const STRINGS = {
  brandTagline: { en: "Home cooking · engineered", es: "Cocina casera · con ingeniería" },
  howToRead: {
    en: "System first, then reps. Every page: mental model → what good looks like → practice → analyse mistakes → iterate.",
    es: "Primero el sistema, luego las repeticiones. Cada página: modelo mental → cómo se ve lo bueno → práctica → analizar errores → iterar.",
  },
  howToReadTitle: { en: "How to read this.", es: "Cómo leer esto." },

  // Navigation
  dashboard: { en: "Dashboard", es: "Panel" },
  curriculum: { en: "Curriculum", es: "Currículo" },
  tools: { en: "Tools", es: "Herramientas" },
  ingredientLab: { en: "Ingredient Lab", es: "Laboratorio de ingredientes" },
  reference: { en: "Reference", es: "Referencia" },
  logbook: { en: "Logbook", es: "Bitácora" },
  skills: { en: "Skills", es: "Habilidades" },
  menu: { en: "Menu", es: "Menú" },
  close: { en: "Close", es: "Cerrar" },
  search: { en: "Search", es: "Buscar" },
  searchPlaceholder: {
    en: "Search modules, recipes, ingredients, skills…",
    es: "Buscar módulos, recetas, ingredientes, habilidades…",
  },
  noResults: { en: "No matches.", es: "Sin resultados." },
  theme: { en: "Theme", es: "Tema" },
  language: { en: "Language", es: "Idioma" },
  skipToContent: { en: "Skip to content", es: "Saltar al contenido" },

  // Progress
  markDone: { en: "Mark done", es: "Marcar hecho" },
  done: { en: "Done", es: "Hecho" },
  save: { en: "Save", es: "Guardar" },
  saved: { en: "Saved", es: "Guardado" },
  favorite: { en: "Save", es: "Guardar" },
  favorited: { en: "Saved", es: "Guardado" },
  addNote: { en: "Note", es: "Nota" },
  notePlaceholder: { en: "What happened? What would you change?", es: "¿Qué pasó? ¿Qué cambiarías?" },
  progress: { en: "Progress", es: "Progreso" },
  completed: { en: "Completed", es: "Completado" },
  inProgress: { en: "In progress", es: "En curso" },
  notStarted: { en: "Not started", es: "Sin empezar" },
  resume: { en: "Resume", es: "Continuar" },
  recentlyViewed: { en: "Recently viewed", es: "Vistos recientemente" },
  suggestedNext: { en: "Suggested next", es: "Siguiente sugerido" },
  yourNotes: { en: "Your notes", es: "Tus notas" },
  favorites: { en: "Saved", es: "Guardados" },

  // Categories
  module: { en: "Module", es: "Módulo" },
  section: { en: "Section", es: "Sección" },
  experiment: { en: "Experiment", es: "Experimento" },
  experiments: { en: "Experiments", es: "Experimentos" },
  drill: { en: "Drill", es: "Práctica" },
  drills: { en: "Drills", es: "Prácticas" },
  project: { en: "Project", es: "Proyecto" },
  projects: { en: "Projects", es: "Proyectos" },
  recipe: { en: "Recipe", es: "Receta" },
  ingredient: { en: "Ingredient", es: "Ingrediente" },
  skill: { en: "Skill", es: "Habilidad" },

  // Module page
  prerequisites: { en: "Assumes", es: "Supone" },
  skillsPractised: { en: "Skills practised", es: "Habilidades practicadas" },
  equipment: { en: "Equipment", es: "Equipo" },
  required: { en: "Required", es: "Necesario" },
  recommended: { en: "Recommended", es: "Recomendado" },
  optional: { en: "Optional", es: "Opcional" },
  noCookFriendly: { en: "Can start without cooking", es: "Se puede empezar sin cocinar" },
  noCookExplain: {
    en: "Meaningful progress is possible here by reading, analysing and planning before you cook anything.",
    es: "Acá podés avanzar de verdad leyendo, analizando y planificando antes de cocinar nada.",
  },
  contents: { en: "Contents", es: "Contenido" },
  previous: { en: "Previous", es: "Anterior" },
  next: { en: "Next", es: "Siguiente" },
  searchImage: { en: "Search image", es: "Buscar imagen" },
  lookFor: { en: "Look for", es: "Observá" },

  // Logbook
  logbookIntro: {
    en: "Treat every failure as data. One variable at a time, written down, so the next attempt is an experiment rather than a guess.",
    es: "Tratá cada error como un dato. Una variable a la vez, anotada, para que el próximo intento sea un experimento y no una adivinanza.",
  },
  newEntry: { en: "New entry", es: "Nueva entrada" },
  logDish: { en: "Dish or experiment", es: "Plato o experimento" },
  logGoal: { en: "Goal", es: "Objetivo" },
  logExpected: { en: "Expected result", es: "Resultado esperado" },
  logActual: { en: "Actual result", es: "Resultado real" },
  logObservations: { en: "Observations", es: "Observaciones" },
  logHypothesis: { en: "Suspected cause", es: "Causa sospechada" },
  logVariable: { en: "Variable to change", es: "Variable a cambiar" },
  logNext: { en: "Next attempt", es: "Próximo intento" },
  logOutcome: { en: "Result of next attempt", es: "Resultado del próximo intento" },
  logEmpty: {
    en: "Nothing logged yet. The first entry is usually a failure worth understanding.",
    es: "Todavía no hay entradas. La primera suele ser un error que vale la pena entender.",
  },
  delete: { en: "Delete", es: "Eliminar" },
  cancel: { en: "Cancel", es: "Cancelar" },
  logFrom: { en: "Log a result", es: "Registrar un resultado" },

  // Ingredient lab
  ingredientLabIntro: {
    en: "What an ingredient does, what it tastes of, how hard it is to get here, and what can stand in for it.",
    es: "Qué hace un ingrediente, a qué sabe, qué tan difícil es conseguirlo acá, y qué puede reemplazarlo.",
  },
  availability: { en: "Availability in Nicaragua", es: "Disponibilidad en Nicaragua" },
  availCommon: { en: "Common locally", es: "Común localmente" },
  availSpecialty: { en: "Specialty / import store", es: "Tienda especializada / importados" },
  availImport: { en: "Likely requires importing", es: "Probablemente hay que importarlo" },
  availExotic: { en: "Highly specialised", es: "Muy especializado" },
  availUnknown: { en: "Not researched", es: "Sin investigar" },
  flavorProfile: { en: "Flavour profile", es: "Perfil de sabor" },
  functions: { en: "Functions", es: "Funciones" },
  storage: { en: "Storage", es: "Almacenamiento" },
  commonUses: { en: "Common uses", es: "Usos comunes" },
  substitutions: { en: "Substitutions", es: "Sustituciones" },
  functionalSub: { en: "Functional substitute", es: "Sustituto funcional" },
  directSub: { en: "Close substitute", es: "Sustituto cercano" },
  allLevels: { en: "All", es: "Todos" },

  // Reference
  referenceIntro: {
    en: "Shared reference material. Lessons link here instead of repeating the same tables everywhere.",
    es: "Material de referencia compartido. Las lecciones enlazan acá en vez de repetir las mismas tablas por todos lados.",
  },

  // Skills
  skillsIntro: {
    en: "The curriculum as a skill graph rather than a sequence of chapters. Pick a skill to see where it is taught and practised.",
    es: "El currículo como un grafo de habilidades en vez de una secuencia de capítulos. Elegí una habilidad para ver dónde se enseña y se practica.",
  },
  practisedIn: { en: "Practised in", es: "Se practica en" },
  notFound: { en: "Not found", es: "No encontrado" },
  backHome: { en: "Back to the dashboard", es: "Volver al panel" },
  loading: { en: "Loading…", es: "Cargando…" },
} as const;

export type StringKey = keyof typeof STRINGS;

export function t(key: StringKey, lang: Lang): string {
  return STRINGS[key][lang];
}

/** Convenience for components that already hold the language. */
export function makeT(lang: Lang) {
  return (key: StringKey) => STRINGS[key][lang];
}
