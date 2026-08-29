import type { Equipment } from "@/types";

/**
 * Equipment catalogue. Modules, drills and recipes reference these IDs and
 * declare them as required / recommended / optional, so a learner building a
 * kitchen gradually can see what a piece of work actually demands.
 *
 * Tier is buying advice, independent of any single recipe:
 *   essential  — buy first, everything leans on it
 *   worthwhile — buy when the relevant module comes up
 *   luxury     — genuinely optional; the technique works without it
 */
export const EQUIPMENT: Equipment[] = [
  {
    id: "chef-knife",
    name: { en: "Chef's knife", es: "Cuchillo de chef" },
    tier: "essential",
    note: {
      en: "One good 8\" knife beats a block of mediocre ones. Comfort in the hand matters more than the brand.",
      es: "Un buen cuchillo de 8\" supera a un bloque de cuchillos mediocres. La comodidad importa más que la marca.",
    },
  },
  {
    id: "cutting-board",
    name: { en: "Cutting board", es: "Tabla de cortar" },
    tier: "essential",
    note: {
      en: "Big enough to work on. Damp towel underneath so it cannot slide.",
      es: "Suficientemente grande para trabajar. Toalla húmeda debajo para que no se deslice.",
    },
  },
  {
    id: "thermometer",
    name: { en: "Instant-read thermometer", es: "Termómetro de lectura instantánea" },
    tier: "essential",
    note: {
      en: "The instrument the protein modules run on. Fast and accurate beats expensive.",
      es: "El instrumento con el que corren los módulos de proteína. Rápido y preciso le gana a caro.",
    },
  },
  {
    id: "scale",
    name: { en: "Digital scale", es: "Báscula digital" },
    tier: "essential",
    note: {
      en: "1 g resolution. Baker's percentages and brine percentages are meaningless without it.",
      es: "Resolución de 1 g. Los porcentajes del panadero y de salmuera no significan nada sin ella.",
    },
  },
  {
    id: "skillet",
    name: { en: "Heavy skillet", es: "Sartén pesada" },
    tier: "essential",
    note: {
      en: "Cast iron or thick stainless. Thermal mass is what lets you sear without the pan crashing.",
      es: "Hierro fundido o acero grueso. La masa térmica es lo que permite sellar sin que la sartén se enfríe.",
    },
  },
  {
    id: "nonstick",
    name: { en: "Non-stick or carbon-steel pan", es: "Sartén antiadherente o de acero al carbono" },
    tier: "worthwhile",
    note: {
      en: "Effectively required for eggs. Keep one dedicated and treat it well.",
      es: "Prácticamente obligatoria para huevos. Tené una dedicada y cuidala.",
    },
  },
  {
    id: "pot",
    name: { en: "Lidded pot", es: "Olla con tapa" },
    tier: "essential",
    note: {
      en: "A tight lid is a variable: it decides how much water escapes from your rice.",
      es: "Una tapa hermética es una variable: decide cuánta agua se escapa de tu arroz.",
    },
  },
  {
    id: "whetstone",
    name: { en: "Whetstone", es: "Piedra de afilar" },
    tier: "worthwhile",
    note: {
      en: "A 1000/6000 combination stone covers everything. Practise on a cheap knife first.",
      es: "Una piedra combinada 1000/6000 cubre todo. Practicá primero en un cuchillo barato.",
    },
  },
  {
    id: "sheet-tray",
    name: { en: "Sheet tray", es: "Bandeja de horno" },
    tier: "essential",
    note: {
      en: "Roasting needs space between pieces. Two trays beat one crowded one.",
      es: "Asar necesita espacio entre las piezas. Dos bandejas superan a una amontonada.",
    },
  },
  {
    id: "wire-rack",
    name: { en: "Wire rack", es: "Rejilla" },
    tier: "worthwhile",
    note: {
      en: "For dry-brining uncovered and resting without steaming the underside soggy.",
      es: "Para salmuera seca al descubierto y para reposar sin que la base se humedezca.",
    },
  },
  {
    id: "fermentation-jar",
    name: { en: "Wide-mouth jar", es: "Frasco de boca ancha" },
    tier: "worthwhile",
    note: {
      en: "Any clean jar works. The real requirement is keeping everything under the brine.",
      es: "Sirve cualquier frasco limpio. El requisito real es mantener todo bajo la salmuera.",
    },
  },
  {
    id: "fermentation-weight",
    name: { en: "Fermentation weight", es: "Peso para fermentar" },
    tier: "worthwhile",
    note: {
      en: "A small water-filled bag does the same job: hold the vegetables under the surface.",
      es: "Una bolsita con agua hace lo mismo: mantener las verduras bajo la superficie.",
    },
  },
  {
    id: "dutch-oven",
    name: { en: "Dutch oven", es: "Olla de hierro fundido" },
    tier: "worthwhile",
    note: {
      en: "Traps steam for a good crust on bread and holds a steady braise.",
      es: "Atrapa vapor para una buena corteza de pan y mantiene un braseado estable.",
    },
  },
  {
    id: "baking-steel",
    name: { en: "Baking steel or stone", es: "Acero o piedra para hornear" },
    tier: "luxury",
    note: {
      en: "Real improvement for pizza, but a preheated upside-down sheet tray gets you most of the way.",
      es: "Mejora real para pizza, pero una bandeja precalentada al revés te lleva casi igual de lejos.",
    },
  },
  {
    id: "grill",
    name: { en: "Grill", es: "Parrilla" },
    tier: "worthwhile",
    note: {
      en: "Charcoal gives you the two-zone fire the module is built around; gas can do it too.",
      es: "El carbón te da el fuego de dos zonas sobre el que se construye el módulo; el gas también puede.",
    },
  },
  {
    id: "blender",
    name: { en: "Blender or food processor", es: "Licuadora o procesador" },
    tier: "worthwhile",
    note: {
      en: "Sauces, salsas and pastes. A mortar does it better but slower.",
      es: "Salsas y pastas. Un mortero lo hace mejor pero más lento.",
    },
  },
  {
    id: "sieve",
    name: { en: "Fine sieve", es: "Colador fino" },
    tier: "worthwhile",
    note: {
      en: "Rinsing rice and straining stock. A muslin-lined colander substitutes.",
      es: "Enjuagar arroz y colar caldo. Un colador con manta de cielo lo sustituye.",
    },
  },
  {
    id: "sous-vide",
    name: { en: "Sous-vide circulator", es: "Circulador sous-vide" },
    tier: "luxury",
    note: {
      en: "Makes the temperature curve trivial. A great teacher, but not required to learn the principle.",
      es: "Vuelve trivial la curva de temperatura. Gran maestro, pero no hace falta para aprender el principio.",
    },
  },
  {
    id: "ph-strips",
    name: { en: "pH strips", es: "Tiras de pH" },
    tier: "worthwhile",
    note: {
      en: "Turns the fermentation safety barrier from a belief into a measurement.",
      es: "Convierte la barrera de seguridad de la fermentación de una creencia en una medición.",
    },
  },
  {
    id: "tasting-glasses",
    name: { en: "Small tasting cups", es: "Vasitos para catar" },
    tier: "worthwhile",
    note: {
      en: "Identical vessels for calibration flights, exactly as you would set up a coffee cupping.",
      es: "Recipientes idénticos para tandas de calibración, igual que montarías una cata de café.",
    },
  },
];

export const EQUIPMENT_BY_ID = new Map(EQUIPMENT.map((e) => [e.id, e]));
