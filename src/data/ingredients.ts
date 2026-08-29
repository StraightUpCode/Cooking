import type { Ingredient } from "@/types";

/**
 * The Ingredient Lab.
 *
 * Two deliberate design choices:
 *
 * 1. Availability is scoped to Nicaragua and is an *estimate to be corrected*,
 *    not an authority. Anything genuinely unverified is marked "unknown" rather
 *    than guessed at, and each entry says what to check locally.
 *
 * 2. Substitutions distinguish a close substitute from a FUNCTIONAL one — what
 *    job the replacement actually does, and how the result differs. "X replaces
 *    Y" on its own is rarely true and never useful.
 */
export const INGREDIENTS: Ingredient[] = [
  {
    id: "soy-sauce",
    name: { en: "Soy sauce", es: "Salsa de soya" },
    category: "fermented",
    flavorProfile: ["umami", "salty", "fermented"],
    functions: ["seasoning", "umami", "marinade", "browning"],
    availability: {
      region: "Nicaragua",
      level: "common",
      note: {
        en: "Widely stocked in supermarkets. Naturally brewed versions have far more aroma than hydrolysed ones — check the label for a short ingredient list.",
        es: "Muy disponible en supermercados. Las versiones fermentadas naturalmente tienen mucho más aroma que las hidrolizadas — mirá que la lista de ingredientes sea corta.",
      },
    },
    storage: {
      en: "Cool cupboard; refrigerate after opening to protect aroma. Keeps for months.",
      es: "Alacena fresca; refrigerá después de abrir para proteger el aroma. Dura meses.",
    },
    commonUses: {
      en: ["Stir-fry sauces", "Marinades", "Braises", "A few drops to deepen a sauce"],
      es: ["Salsas para saltear", "Marinadas", "Guisos", "Unas gotas para dar profundidad a una salsa"],
    },
    substitutions: [
      {
        ingredient: "fish-sauce",
        label: { en: "Fish sauce (use less)", es: "Salsa de pescado (usá menos)" },
        functional: true,
        result: {
          en: "Delivers the same salt-plus-glutamate job with more pungency and no roasted-wheat note. Start at half the volume.",
          es: "Cumple el mismo trabajo de sal más glutamato, con más pungencia y sin la nota de trigo tostado. Empezá con la mitad del volumen.",
        },
      },
      {
        label: { en: "Salt + a little Worcestershire", es: "Sal + un poco de salsa inglesa" },
        functional: true,
        result: {
          en: "Covers salt and some savoury depth, but loses the fermented aroma that makes soy taste like soy.",
          es: "Cubre la sal y algo de profundidad salada, pero pierde el aroma fermentado que hace que la soya sepa a soya.",
        },
      },
    ],
  },
  {
    id: "fish-sauce",
    name: { en: "Fish sauce", es: "Salsa de pescado" },
    category: "fermented",
    flavorProfile: ["umami", "salty", "fermented", "aromatic"],
    functions: ["seasoning", "umami", "marinade"],
    availability: {
      region: "Nicaragua",
      level: "specialty",
      note: {
        en: "Check Asian-import shelves in larger supermarkets. Not verified for smaller towns — treat as import if your local shops do not carry it.",
        es: "Buscá en los estantes de importados asiáticos de supermercados grandes. No verificado en pueblos pequeños — tratalo como importado si no lo encontrás.",
      },
    },
    storage: {
      en: "Keeps almost indefinitely; darkens with age. Refrigerate once open if your kitchen runs hot.",
      es: "Dura casi indefinidamente; se oscurece con el tiempo. Refrigerá una vez abierta si tu cocina es caliente.",
    },
    commonUses: {
      en: ["Dipping sauces", "Marinades", "A hidden half-teaspoon in stews and ragùs"],
      es: ["Salsas para mojar", "Marinadas", "Media cucharadita escondida en guisos y ragús"],
    },
    substitutions: [
      {
        ingredient: "soy-sauce",
        label: { en: "Soy sauce + a pinch of salt", es: "Salsa de soya + una pizca de sal" },
        functional: true,
        result: {
          en: "Same savoury-salty function, milder and less complex. You lose the fermented-fish top note, which is the point in some dishes.",
          es: "La misma función salada-sabrosa, más suave y menos compleja. Perdés la nota de pescado fermentado, que en algunos platos es justamente el punto.",
        },
      },
    ],
  },
  {
    id: "miso",
    name: { en: "Miso", es: "Miso" },
    category: "fermented",
    flavorProfile: ["umami", "salty", "fermented", "sweet"],
    functions: ["seasoning", "umami", "marinade", "thickening"],
    availability: {
      region: "Nicaragua",
      level: "import",
      note: {
        en: "Expect to import or find it only in specialist stores. Worth planning ahead for — and Module 06 teaches making it, which is the long-term answer.",
        es: "Esperá tener que importarlo o encontrarlo solo en tiendas especializadas. Vale la pena planificarlo — y el Módulo 06 enseña a hacerlo, que es la respuesta a largo plazo.",
      },
    },
    storage: {
      en: "Refrigerated, tightly closed. It is a living ferment and keeps for many months; colour deepens over time.",
      es: "Refrigerado y bien cerrado. Es un fermento vivo y dura muchos meses; el color se profundiza con el tiempo.",
    },
    commonUses: {
      en: ["Soups", "Glazes for fish and aubergine", "Marinades", "Whisked into dressings and butter"],
      es: ["Sopas", "Glaseados para pescado y berenjena", "Marinadas", "Batido en aderezos y mantequilla"],
    },
    substitutions: [
      {
        label: { en: "Soy sauce + a little tahini or nut butter", es: "Salsa de soya + un poco de tahini o mantequilla de nuez" },
        functional: true,
        result: {
          en: "Reproduces salt, glutamate and body. It cannot reproduce miso's fermented sweetness or its thickening effect on a glaze.",
          es: "Reproduce sal, glutamato y cuerpo. No reproduce el dulzor fermentado del miso ni su efecto espesante en un glaseado.",
        },
      },
    ],
  },
  {
    id: "gochujang",
    name: { en: "Gochujang", es: "Gochujang" },
    category: "fermented",
    flavorProfile: ["umami", "heat", "sweet", "fermented"],
    functions: ["seasoning", "heat", "marinade", "sauce base"],
    availability: {
      region: "Nicaragua",
      level: "import",
      note: {
        en: "Assume import unless you have found it locally. Verify before planning a menu around it.",
        es: "Asumí que hay que importarlo salvo que ya lo hayas encontrado localmente. Verificá antes de planear un menú alrededor de él.",
      },
    },
    storage: {
      en: "Refrigerate after opening. Keeps for months; it is already a preserved product.",
      es: "Refrigerá después de abrir. Dura meses; ya es un producto conservado.",
    },
    commonUses: {
      en: ["Marinades for pork and chicken", "Stews", "Dipping and glazing sauces"],
      es: ["Marinadas para cerdo y pollo", "Guisos", "Salsas para mojar y glasear"],
    },
    substitutions: [
      {
        label: {
          en: "Local chile paste + miso or soy + a little sugar",
          es: "Pasta de chile local + miso o soya + un poco de azúcar",
        },
        functional: true,
        result: {
          en: "Rebuilds the three jobs gochujang does — heat, fermented savouriness, sweetness. Different aroma, same structural role in a sauce.",
          es: "Reconstruye los tres trabajos del gochujang — picante, sabor fermentado y dulzor. Aroma distinto, mismo papel estructural en una salsa.",
        },
      },
    ],
  },
  {
    id: "rice-vinegar",
    name: { en: "Rice vinegar", es: "Vinagre de arroz" },
    category: "acid",
    flavorProfile: ["acidic", "sweet"],
    functions: ["acidity", "pickling", "seasoning", "balance"],
    availability: {
      region: "Nicaragua",
      level: "specialty",
      note: {
        en: "Usually on the imported-foods shelf. Worth checking whether yours is seasoned (with added sugar and salt) — that changes the maths.",
        es: "Normalmente en el estante de importados. Revisá si el tuyo es sazonado (con azúcar y sal añadidas) — eso cambia las cuentas.",
      },
    },
    storage: {
      en: "Cupboard, indefinitely. Acidity is its own preservative.",
      es: "Alacena, indefinidamente. La acidez es su propio conservante.",
    },
    commonUses: {
      en: ["Sushi rice", "Quick pickles", "Dressings", "Finishing a heavy dish"],
      es: ["Arroz para sushi", "Encurtidos rápidos", "Aderezos", "Terminar un plato pesado"],
    },
    substitutions: [
      {
        label: {
          en: "White vinegar + a small amount of sugar, diluted",
          es: "Vinagre blanco + un poco de azúcar, diluido",
        },
        functional: true,
        result: {
          en: "Functionally similar — acidity with mild sweetness and low aggression — but not identical. White vinegar is sharper, so cut it with water and add sugar to soften the attack.",
          es: "Funcionalmente similar — acidez con dulzor suave y poca agresividad — pero no idéntico. El vinagre blanco es más filoso, así que rebajalo con agua y agregá azúcar para suavizar el golpe.",
        },
      },
      {
        ingredient: "lime",
        label: { en: "Lime juice", es: "Jugo de limón" },
        functional: false,
        result: {
          en: "Covers the acid function but brings its own strong aroma. Right in Latin dishes, wrong in a delicate sushi rice.",
          es: "Cubre la función ácida pero trae su propio aroma fuerte. Correcto en platos latinos, incorrecto en un arroz de sushi delicado.",
        },
      },
    ],
  },
  {
    id: "lime",
    name: { en: "Lime", es: "Limón" },
    category: "acid",
    flavorProfile: ["acidic", "aromatic", "bitter"],
    functions: ["acidity", "balance", "aroma", "marinade"],
    availability: {
      region: "Nicaragua",
      level: "common",
      note: {
        en: "Everywhere and cheap. The default acid in this kitchen — reach for it before anything imported.",
        es: "En todos lados y barato. El ácido por defecto en esta cocina — usalo antes que cualquier cosa importada.",
      },
    },
    storage: {
      en: "Room temperature for a few days, refrigerated for longer. Zest before juicing; the aroma lives in the peel.",
      es: "Temperatura ambiente unos días, refrigerado por más tiempo. Rallá la cáscara antes de exprimir; el aroma vive en la cáscara.",
    },
    commonUses: {
      en: ["Finishing almost anything rich", "Pickled onions", "Marinades", "Salsas"],
      es: ["Terminar casi cualquier cosa grasosa", "Cebolla encurtida", "Marinadas", "Salsas"],
    },
    substitutions: [
      {
        label: { en: "Vinegar (any)", es: "Vinagre (cualquiera)" },
        functional: true,
        result: {
          en: "Same acid job, no citrus aroma. Fine when acid is structural, wrong when the lime is meant to be tasted.",
          es: "El mismo trabajo ácido, sin aroma cítrico. Sirve cuando la acidez es estructural, no cuando el limón debe notarse.",
        },
      },
    ],
  },
  {
    id: "parmesan",
    name: { en: "Parmesan", es: "Parmesano" },
    category: "dairy",
    flavorProfile: ["umami", "salty", "fat"],
    functions: ["umami", "seasoning", "emulsifier", "finishing"],
    availability: {
      region: "Nicaragua",
      level: "specialty",
      note: {
        en: "Generic grated 'parmesano' is widely sold; true aged Parmigiano-Reggiano is a specialty purchase. They behave differently in a sauce — the aged cheese melts smoothly, the dry generic one can go grainy.",
        es: "El 'parmesano' rallado genérico se vende en todos lados; el Parmigiano-Reggiano añejo real es una compra especializada. Se comportan distinto en una salsa — el añejo se funde parejo, el genérico seco puede volverse granuloso.",
      },
    },
    storage: {
      en: "Refrigerated, wrapped. Keep the rind — it is free flavour for stocks and beans.",
      es: "Refrigerado y envuelto. Guardá la corteza — es sabor gratis para caldos y frijoles.",
    },
    commonUses: {
      en: ["Cacio e pepe and other starch-stabilised sauces", "Finishing pasta", "Rinds in broth"],
      es: ["Cacio e pepe y otras salsas estabilizadas con almidón", "Terminar pastas", "Cortezas en caldo"],
    },
    substitutions: [
      {
        label: { en: "Any hard, aged, salty cheese", es: "Cualquier queso duro, añejo y salado" },
        functional: true,
        result: {
          en: "Local aged cheeses can do the salt-and-umami job. Melting behaviour varies, so test in a small amount of sauce before committing the batch.",
          es: "Los quesos añejos locales pueden hacer el trabajo de sal y umami. El comportamiento al fundir varía, así que probá en poca salsa antes de comprometer toda la tanda.",
        },
      },
    ],
  },
  {
    id: "rice",
    name: { en: "Rice", es: "Arroz" },
    category: "grain",
    flavorProfile: ["neutral", "sweet"],
    functions: ["staple", "base", "thickening"],
    availability: {
      region: "Nicaragua",
      level: "common",
      note: {
        en: "A daily staple. Long-grain is the default; check whether yours is parboiled, which changes the water ratio.",
        es: "Un básico diario. El grano largo es lo normal; fijate si el tuyo es precocido, lo que cambia la proporción de agua.",
      },
    },
    storage: {
      en: "Airtight, cool and dry. Brown rice has oil in the bran and goes rancid far sooner than white.",
      es: "Hermético, fresco y seco. El arroz integral tiene aceite en el salvado y se pone rancio mucho antes que el blanco.",
    },
    commonUses: {
      en: ["Gallo pinto", "Plain steamed rice", "Fried rice from day-old rice", "Risotto with the right variety"],
      es: ["Gallo pinto", "Arroz blanco al vapor", "Arroz frito con arroz del día anterior", "Risotto con la variedad correcta"],
    },
    substitutions: [],
  },
  {
    id: "beans",
    name: { en: "Red beans", es: "Frijoles rojos" },
    category: "legume",
    flavorProfile: ["neutral", "sweet"],
    functions: ["staple", "protein", "base"],
    availability: {
      region: "Nicaragua",
      level: "common",
      note: {
        en: "Central to the daily table. Age matters more than brand: old beans never soften, however long you cook them.",
        es: "Centrales en la mesa diaria. La edad importa más que la marca: los frijoles viejos nunca se ablandan, por más que los cocinés.",
      },
    },
    storage: {
      en: "Airtight and dry. Buy from somewhere with turnover — you cannot see age through the bag.",
      es: "Hermético y seco. Comprá donde haya rotación — la edad no se ve a través de la bolsa.",
    },
    commonUses: {
      en: ["Gallo pinto", "Refried beans", "Bean broth as a seasoning liquid"],
      es: ["Gallo pinto", "Frijoles molidos", "Caldo de frijol como líquido de sazón"],
    },
    substitutions: [],
  },
  {
    id: "black-vinegar",
    name: { en: "Chinkiang black vinegar", es: "Vinagre negro de Chinkiang" },
    category: "acid",
    flavorProfile: ["acidic", "umami", "sweet", "fermented"],
    functions: ["acidity", "seasoning", "dipping"],
    availability: {
      region: "Nicaragua",
      level: "import",
      note: {
        en: "Assume import. A good candidate for the unfamiliar-ingredient project rather than a weeknight staple.",
        es: "Asumí importación. Buen candidato para el proyecto de ingrediente desconocido, no para un básico entre semana.",
      },
    },
    storage: { en: "Cupboard, indefinitely.", es: "Alacena, indefinidamente." },
    commonUses: {
      en: ["Dumpling dipping sauce", "Braises", "Cold noodle dressings"],
      es: ["Salsa para mojar dumplings", "Guisos", "Aderezos para fideos fríos"],
    },
    substitutions: [
      {
        label: {
          en: "Balsamic thinned with water, or rice vinegar + a drop of molasses",
          es: "Balsámico rebajado con agua, o vinagre de arroz + una gota de melaza",
        },
        functional: true,
        result: {
          en: "Approximates the malty, slightly sweet acidity. The smoky-fermented depth does not come across.",
          es: "Aproxima la acidez maltosa y algo dulce. La profundidad ahumada y fermentada no se traslada.",
        },
      },
    ],
  },
  {
    id: "doubanjiang",
    name: { en: "Doubanjiang (fermented broad bean chilli paste)", es: "Doubanjiang (pasta de habas y chile fermentada)" },
    category: "fermented",
    flavorProfile: ["umami", "salty", "heat", "fermented"],
    functions: ["sauce base", "seasoning", "heat"],
    availability: {
      region: "Nicaragua",
      level: "import",
      note: {
        en: "Assume import. Very salty, so it replaces some of the salt in a dish rather than adding to it.",
        es: "Asumí importación. Es muy salada, así que reemplaza parte de la sal del plato en vez de sumarse a ella.",
      },
    },
    storage: { en: "Refrigerate after opening.", es: "Refrigerá después de abrir." },
    commonUses: {
      en: ["Mapo tofu", "Braises", "Stir-fry bases bloomed in oil"],
      es: ["Mapo tofu", "Guisos", "Bases para saltear activadas en aceite"],
    },
    substitutions: [
      {
        ingredient: "gochujang",
        label: { en: "Gochujang + extra salt", es: "Gochujang + sal extra" },
        functional: true,
        result: {
          en: "Both are fermented chilli pastes, but gochujang is sweeter and less salty. Add salt and cut any sugar elsewhere in the dish.",
          es: "Ambas son pastas de chile fermentado, pero el gochujang es más dulce y menos salado. Agregá sal y quitá azúcar en otra parte del plato.",
        },
      },
    ],
  },
  {
    id: "koji",
    name: { en: "Koji (Aspergillus oryzae)", es: "Koji (Aspergillus oryzae)" },
    category: "culture",
    flavorProfile: ["umami", "sweet", "fermented"],
    functions: ["culture", "enzymatic breakdown", "curing"],
    availability: {
      region: "Nicaragua",
      level: "exotic",
      note: {
        en: "Specialist purchase, usually ordered online as spores. This is a plan-months-ahead ingredient, which is exactly why Module 06 starts its clock early.",
        es: "Compra especializada, normalmente pedida en línea como esporas. Es un ingrediente de planificar con meses, que es justo por qué el Módulo 06 arranca su reloj temprano.",
      },
    },
    storage: {
      en: "Spores refrigerated or frozen; fresh koji is perishable and should be used or frozen quickly.",
      es: "Esporas refrigeradas o congeladas; el koji fresco es perecedero y hay que usarlo o congelarlo rápido.",
    },
    commonUses: {
      en: ["Miso", "Shio koji as a marinade", "Amazake", "Quick-curing proteins"],
      es: ["Miso", "Shio koji como marinada", "Amazake", "Curado rápido de proteínas"],
    },
    substitutions: [
      {
        label: { en: "No true substitute", es: "Sin sustituto real" },
        functional: false,
        result: {
          en: "Koji is an enzyme factory, not a flavouring. Buying miso or shio koji gives you the *product* of koji, never the process.",
          es: "El koji es una fábrica de enzimas, no un saborizante. Comprar miso o shio koji te da el *producto* del koji, nunca el proceso.",
        },
      },
    ],
  },
  {
    id: "oyster-sauce",
    name: { en: "Oyster sauce", es: "Salsa de ostras" },
    category: "condiment",
    flavorProfile: ["umami", "salty", "sweet"],
    functions: ["seasoning", "umami", "glazing", "thickening"],
    availability: {
      region: "Nicaragua",
      level: "specialty",
      note: {
        en: "Often alongside soy sauce in bigger supermarkets, but not verified everywhere — check before relying on it.",
        es: "A menudo junto a la salsa de soya en supermercados grandes, pero no verificado en todos lados — revisá antes de depender de ella.",
      },
    },
    storage: { en: "Refrigerate after opening.", es: "Refrigerá después de abrir." },
    commonUses: {
      en: ["Stir-fries", "Glazed vegetables", "Noodle sauces"],
      es: ["Salteados", "Verduras glaseadas", "Salsas para fideos"],
    },
    substitutions: [
      {
        label: {
          en: "Soy sauce + a little sugar + a starch slurry",
          es: "Salsa de soya + un poco de azúcar + una mezcla de almidón",
        },
        functional: true,
        result: {
          en: "Rebuilds the three functions: salt-umami, sweetness, and the body that makes it cling. Less seafood depth.",
          es: "Reconstruye las tres funciones: sal-umami, dulzor y el cuerpo que la hace adherirse. Menos profundidad marina.",
        },
      },
    ],
  },
  {
    id: "masa-harina",
    name: { en: "Masa harina (nixtamalised corn flour)", es: "Masa harina (harina de maíz nixtamalizado)" },
    category: "grain",
    flavorProfile: ["neutral", "aromatic"],
    functions: ["staple", "dough", "thickening"],
    availability: {
      region: "Nicaragua",
      level: "common",
      note: {
        en: "Corn is local and nixtamalised flour is a staple. Note that plain corn flour is not the same thing — nixtamalisation is what makes the dough cohere.",
        es: "El maíz es local y la harina nixtamalizada es un básico. Ojo: la harina de maíz común no es lo mismo — la nixtamalización es lo que hace que la masa se una.",
      },
    },
    storage: { en: "Airtight and dry; it stales like any flour.", es: "Hermético y seco; se pone viejo como cualquier harina." },
    commonUses: {
      en: ["Tortillas", "Tamales", "Thickening stews"],
      es: ["Tortillas", "Tamales", "Espesar guisos"],
    },
    substitutions: [],
  },
];

export const INGREDIENT_BY_ID = new Map(INGREDIENTS.map((i) => [i.id, i]));

/** Distinct categories for the filter row, derived rather than hardcoded. */
export const INGREDIENT_CATEGORIES = [...new Set(INGREDIENTS.map((i) => i.category))].sort();
