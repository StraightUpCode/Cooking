import type { Skill } from "@/types";

/**
 * The skill graph. Recipes, drills and modules reference these IDs, which lets
 * the UI answer both "what does this practise?" and "what can I use to practise
 * X?" without any curriculum-specific branching.
 */
export const SKILLS: Skill[] = [
  {
    id: "knife-safety",
    name: { en: "Knife safety", es: "Seguridad con el cuchillo" },
    description: {
      en: "Claw grip, pinch grip, a stable board, and why a sharp knife is the safer one.",
      es: "Agarre de garra, agarre de pinza, tabla estable, y por qué un cuchillo afilado es el más seguro.",
    },
    modules: ["p0"],
  },
  {
    id: "cutting",
    name: { en: "Uniform cutting", es: "Corte uniforme" },
    description: {
      en: "Slicing rather than pressing, and cutting to a consistent size so pieces cook evenly.",
      es: "Rebanar en vez de presionar, y cortar a un tamaño consistente para que todo se cocine parejo.",
    },
    modules: ["p0", "m4"],
  },
  {
    id: "sharpening",
    name: { en: "Sharpening", es: "Afilado" },
    description: {
      en: "Bevel geometry, raising and removing a burr, and working through grits.",
      es: "Geometría del bisel, levantar y quitar la rebaba, y avanzar por granos.",
    },
    modules: ["p0"],
  },
  {
    id: "mise-en-place",
    name: { en: "Mise en place", es: "Mise en place" },
    description: {
      en: "Prepping and staging everything before heat is applied.",
      es: "Preparar y ordenar todo antes de aplicar calor.",
    },
    modules: ["p0", "m8"],
  },
  {
    id: "heat-control",
    name: { en: "Heat control", es: "Control del calor" },
    description: {
      en: "Reading pan temperature, preheating, and matching heat level to the goal.",
      es: "Leer la temperatura de la sartén, precalentar, y ajustar el nivel de calor al objetivo.",
    },
    modules: ["p0", "m1", "m4", "m7"],
  },
  {
    id: "temperature-control",
    name: { en: "Internal temperature control", es: "Control de temperatura interna" },
    description: {
      en: "Cooking to a target internal temperature instead of to the clock.",
      es: "Cocinar a una temperatura interna objetivo en vez de al reloj.",
    },
    modules: ["m1", "m7"],
  },
  {
    id: "carryover",
    name: { en: "Carryover management", es: "Manejo de la cocción residual" },
    description: {
      en: "Pulling early so residual heat lands the centre on target during the rest.",
      es: "Retirar antes para que el calor residual lleve el centro al objetivo durante el reposo.",
    },
    modules: ["m1", "m7"],
  },
  {
    id: "searing",
    name: { en: "Searing", es: "Sellado" },
    description: {
      en: "A dry surface and real heat to build a Maillard crust without overshooting the core.",
      es: "Superficie seca y calor real para crear costra de Maillard sin pasarse del centro.",
    },
    modules: ["m1", "m7"],
  },
  {
    id: "brining",
    name: { en: "Brining", es: "Salmuera" },
    description: {
      en: "Salt to season throughout and help muscle hold water; wet versus dry.",
      es: "Sal para sazonar en profundidad y ayudar al músculo a retener agua; húmeda o seca.",
    },
    modules: ["m1", "m7"],
  },
  {
    id: "pan-sauce",
    name: { en: "Pan sauce", es: "Salsa de sartén" },
    description: {
      en: "Deglaze the fond, reduce, and mount with fat for body and gloss.",
      es: "Desglasar el fond, reducir, y montar con grasa para cuerpo y brillo.",
    },
    modules: ["m1", "m3"],
  },
  {
    id: "emulsion",
    name: { en: "Emulsification", es: "Emulsión" },
    description: {
      en: "Suspending fat in water with an emulsifier, and rescuing it when it breaks.",
      es: "Suspender grasa en agua con un emulsionante, y rescatarla cuando se corta.",
    },
    modules: ["m1", "m3"],
  },
  {
    id: "reduction",
    name: { en: "Reduction", es: "Reducción" },
    description: {
      en: "Driving off water to concentrate flavour and build body.",
      es: "Evaporar agua para concentrar sabor y ganar cuerpo.",
    },
    modules: ["m3"],
  },
  {
    id: "seasoning-balance",
    name: { en: "Seasoning & balance", es: "Sazón y equilibrio" },
    description: {
      en: "Tasting and adjusting salt, acid, fat, sweetness and umami until it lands.",
      es: "Probar y ajustar sal, acidez, grasa, dulzor y umami hasta que quede.",
    },
    modules: ["m3", "taste"],
  },
  {
    id: "starch-management",
    name: { en: "Starch management", es: "Manejo del almidón" },
    description: {
      en: "Gelatinisation, rinsing, and choosing a water ratio for the texture you want.",
      es: "Gelatinización, enjuague, y elegir la proporción de agua para la textura que buscás.",
    },
    modules: ["m2"],
  },
  {
    id: "browning",
    name: { en: "Browning", es: "Dorado" },
    description: {
      en: "Dry surfaces, uncrowded pans, and enough heat for Maillard and caramelisation.",
      es: "Superficies secas, sartenes sin amontonar, y calor suficiente para Maillard y caramelización.",
    },
    modules: ["m4", "m7"],
  },
  {
    id: "gluten-development",
    name: { en: "Gluten development", es: "Desarrollo del gluten" },
    description: {
      en: "Building the protein network by kneading, folding, autolyse or time.",
      es: "Construir la red proteica amasando, plegando, con autólisis o con tiempo.",
    },
    modules: ["m5"],
  },
  {
    id: "fermentation-timing",
    name: { en: "Fermentation timing", es: "Tiempos de fermentación" },
    description: {
      en: "Trading time against temperature to control rise and flavour.",
      es: "Cambiar tiempo por temperatura para controlar el leudado y el sabor.",
    },
    modules: ["m5", "m6"],
  },
  {
    id: "hydration",
    name: { en: "Dough hydration", es: "Hidratación de la masa" },
    description: {
      en: "Water as a percentage of flour, and what it does to handling and crumb.",
      es: "El agua como porcentaje de la harina, y su efecto en el manejo y la miga.",
    },
    modules: ["m5"],
  },
  {
    id: "shaping",
    name: { en: "Shaping", es: "Formado" },
    description: {
      en: "Building surface tension so the loaf holds structure and springs in the oven.",
      es: "Crear tensión superficial para que el pan mantenga estructura y salte en el horno.",
    },
    modules: ["m5"],
  },
  {
    id: "lacto-fermentation",
    name: { en: "Lacto-fermentation", es: "Fermentación láctica" },
    description: {
      en: "Salt to select for lactic bacteria, anaerobic conditions, and pH as the safety barrier.",
      es: "Sal para seleccionar bacterias lácticas, condiciones anaeróbicas, y el pH como barrera de seguridad.",
    },
    modules: ["m6"],
  },
  {
    id: "food-safety",
    name: { en: "Food safety", es: "Inocuidad alimentaria" },
    description: {
      en: "Time-and-temperature pasteurisation, ground-meat logic, and the pH 4.6 barrier.",
      es: "Pasteurización por tiempo y temperatura, lógica de la carne molida, y la barrera de pH 4.6.",
    },
    modules: ["m1", "m6", "m7"],
  },
  {
    id: "fire-management",
    name: { en: "Fire management", es: "Manejo del fuego" },
    description: {
      en: "Two-zone setups, airflow as the throttle, and clean smoke.",
      es: "Montaje de dos zonas, el aire como acelerador, y humo limpio.",
    },
    modules: ["m7"],
  },
  {
    id: "resting-meat",
    name: { en: "Resting meat", es: "Reposo de la carne" },
    description: {
      en: "Letting fibres relax so juice stays in the meat rather than on the board.",
      es: "Dejar que las fibras se relajen para que el jugo quede en la carne y no en la tabla.",
    },
    modules: ["m1", "m7"],
  },
  {
    id: "orchestration",
    name: { en: "Orchestration", es: "Orquestación" },
    description: {
      en: "Reading a menu as a project: critical path, make-ahead, and what must be hot at the end.",
      es: "Leer un menú como un proyecto: ruta crítica, preparación anticipada, y qué debe estar caliente al final.",
    },
    modules: ["m8"],
  },
  {
    id: "sensory-analysis",
    name: { en: "Sensory analysis", es: "Análisis sensorial" },
    description: {
      en: "Naming what you taste, and calibrating your own thresholds against known references.",
      es: "Nombrar lo que probás, y calibrar tus propios umbrales contra referencias conocidas.",
    },
    modules: ["taste"],
  },
  {
    id: "ingredient-analysis",
    name: { en: "Ingredient analysis", es: "Análisis de ingredientes" },
    description: {
      en: "Working out what an unfamiliar ingredient does, and what could stand in for it.",
      es: "Deducir qué hace un ingrediente desconocido, y qué podría reemplazarlo.",
    },
    modules: ["taste", "m3"],
  },
];

export const SKILL_BY_ID = new Map(SKILLS.map((s) => [s.id, s]));
