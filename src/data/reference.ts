import type { ReferenceEntry } from "@/types";

/**
 * The reference layer.
 *
 * Lessons teach; this remembers. Numbers and definitions that would otherwise
 * be repeated across modules live here once, so a lesson can link instead of
 * restating — and so corrections happen in one place.
 *
 * Engineering analogies are included as *aids*, alongside the culinary
 * explanation, never as a replacement for it.
 */
export const REFERENCE: ReferenceEntry[] = [
  {
    id: "carryover-cooking",
    category: "temperature",
    term: { en: "Carryover cooking", es: "Cocción residual" },
    definition: {
      en: "Food keeps cooking after it leaves the heat. The hot exterior continues conducting energy inward until the temperature gradient flattens, so the centre climbs several degrees during the rest. Pull below your target by that amount.",
      es: "La comida sigue cocinándose después de salir del fuego. El exterior caliente sigue conduciendo energía hacia adentro hasta que el gradiente se aplana, así que el centro sube varios grados durante el reposo. Retirá por debajo del objetivo esa misma cantidad.",
    },
    analogy: {
      en: "A system keeps changing state after the input is removed — you aim for the settling value, not the value at shutoff.",
      es: "Un sistema sigue cambiando de estado después de quitar la entrada — apuntás al valor de asentamiento, no al del momento de apagar.",
    },
    related: ["doneness-temperatures", "resting"],
    blocks: {
      en: [
        {
          kind: "table",
          head: ["Thickness", "Typical carryover"],
          rows: [
            ["Thin (&lt;2 cm)", "+2 °C / 4 °F"],
            ["Medium (2–4 cm)", "+3 °C / 5 °F"],
            ["Thick (&gt;4 cm) or a roast", "+5 °C / 9 °F or more"],
          ],
        },
      ],
      es: [
        {
          kind: "table",
          head: ["Grosor", "Cocción residual típica"],
          rows: [
            ["Delgado (&lt;2 cm)", "+2 °C / 4 °F"],
            ["Medio (2–4 cm)", "+3 °C / 5 °F"],
            ["Grueso (&gt;4 cm) o un asado", "+5 °C / 9 °F o más"],
          ],
        },
      ],
    },
  },
  {
    id: "doneness-temperatures",
    category: "temperature",
    term: { en: "Doneness temperatures", es: "Temperaturas de cocción" },
    definition: {
      en: "Target internal temperatures, given as the value to rest to. Subtract the carryover to decide when to pull. Whole-muscle beef and lamb are a texture choice; ground meat and poultry are a safety threshold.",
      es: "Temperaturas internas objetivo, dadas como el valor al que reposar. Restá la cocción residual para decidir cuándo retirar. La res y el cordero de músculo entero son una elección de textura; la carne molida y las aves son un umbral de seguridad.",
    },
    related: ["carryover-cooking", "ground-meat-safety", "pasteurisation"],
    blocks: {
      en: [
        {
          kind: "table",
          head: ["Cut", "Target", "Note"],
          rows: [
            ["Beef / lamb, rare", "52 °C / 125 °F", "Texture choice — interior is sterile"],
            ["Beef / lamb, medium-rare", "54 °C / 130 °F", ""],
            ["Beef / lamb, medium", "60 °C / 140 °F", ""],
            ["Chicken breast", "74 °C / 165 °F", "Instant-safe; 65 °C / 150 °F held ≥3 min is equally safe and juicier"],
            ["Chicken thigh", "82 °C / 180 °F", "Range 74–88 °C; collagen must render"],
            ["Pork chop / loin", "63 °C / 145 °F", "Then rest — medium, slightly pink"],
            ["Burger / ground beef", "71 °C / 160 °F", "Required minimum, not a target to hover near"],
            ["Ground poultry", "74 °C / 165 °F", ""],
            ["Salmon", "52–60 °C / 125–140 °F", "Buttery to firm"],
          ],
        },
      ],
      es: [
        {
          kind: "table",
          head: ["Corte", "Objetivo", "Nota"],
          rows: [
            ["Res / cordero, rojo", "52 °C / 125 °F", "Elección de textura — el interior es estéril"],
            ["Res / cordero, medio-rojo", "54 °C / 130 °F", ""],
            ["Res / cordero, término medio", "60 °C / 140 °F", ""],
            ["Pechuga de pollo", "74 °C / 165 °F", "Seguro al instante; 65 °C / 150 °F por ≥3 min es igual de seguro y más jugoso"],
            ["Muslo de pollo", "82 °C / 180 °F", "Rango 74–88 °C; el colágeno debe fundirse"],
            ["Chuleta / lomo de cerdo", "63 °C / 145 °F", "Luego reposar — término medio, algo rosado"],
            ["Hamburguesa / carne molida", "71 °C / 160 °F", "Mínimo obligatorio, no un objetivo al que rondar"],
            ["Ave molida", "74 °C / 165 °F", ""],
            ["Salmón", "52–60 °C / 125–140 °F", "Mantecoso a firme"],
          ],
        },
      ],
    },
  },
  {
    id: "ground-meat-safety",
    category: "safety",
    term: { en: "Why ground meat is different", es: "Por qué la carne molida es distinta" },
    definition: {
      en: "Bacteria live on surfaces. Grinding distributes the surface through the whole mass, so a rare burger has contaminated meat at its centre where a rare steak does not. Searing the outside cannot fix an interior that never got hot.",
      es: "Las bacterias viven en las superficies. Moler distribuye la superficie por toda la masa, así que una hamburguesa poco cocida tiene carne contaminada en el centro donde un bife no la tiene. Sellar el exterior no arregla un interior que nunca se calentó.",
    },
    related: ["doneness-temperatures", "pasteurisation"],
  },
  {
    id: "pasteurisation",
    category: "safety",
    term: { en: "Pasteurisation is time × temperature", es: "La pasteurización es tiempo × temperatura" },
    definition: {
      en: "Safety is not a single number. Holding chicken breast at 65 °C / 150 °F for at least three minutes achieves the same reduction as touching 74 °C / 165 °F instantly — and leaves it noticeably juicier. This requires a reliable probe; without one, use the instant number.",
      es: "La seguridad no es un solo número. Mantener pechuga de pollo a 65 °C / 150 °F por al menos tres minutos logra la misma reducción que tocar 74 °C / 165 °F al instante — y queda notablemente más jugosa. Esto requiere un termómetro confiable; sin uno, usá el número instantáneo.",
    },
    related: ["doneness-temperatures"],
  },
  {
    id: "resting",
    category: "method",
    term: { en: "Resting meat", es: "Reposo de la carne" },
    definition: {
      en: "As muscle heats, fibres contract and squeeze moisture toward the centre and out. Resting lets them relax and reabsorb, so the juice ends up in the meat rather than on the board. Bigger cuts need longer.",
      es: "Al calentarse, las fibras del músculo se contraen y empujan la humedad hacia el centro y hacia afuera. El reposo les permite relajarse y reabsorber, así el jugo queda en la carne y no en la tabla. Los cortes grandes necesitan más tiempo.",
    },
    related: ["carryover-cooking"],
  },
  {
    id: "maillard",
    category: "glossary",
    term: { en: "Maillard reaction", es: "Reacción de Maillard" },
    definition: {
      en: "Amino acids and reducing sugars reacting above roughly 140 °C / 285 °F to produce hundreds of new aroma compounds. It needs a dry surface: while water is present the surface is pinned near 100 °C and cannot get there. This is why a crowded pan steams instead of browning.",
      es: "Aminoácidos y azúcares reductores reaccionando por encima de unos 140 °C / 285 °F para producir cientos de compuestos aromáticos nuevos. Necesita una superficie seca: mientras haya agua, la superficie queda anclada cerca de 100 °C y no puede llegar. Por eso una sartén amontonada cuece al vapor en vez de dorar.",
    },
    analogy: {
      en: "A reaction with a threshold input — below it nothing happens, however long you wait.",
      es: "Una reacción con un umbral de entrada — por debajo no pasa nada, por más que esperés.",
    },
    related: ["browning-vs-boiling"],
  },
  {
    id: "browning-vs-boiling",
    category: "method",
    term: { en: "Why boiled vegetables taste of nothing", es: "Por qué las verduras hervidas no saben a nada" },
    definition: {
      en: "Water caps the surface at 100 °C, below every browning reaction, and simultaneously leaches soluble flavour into the cooking liquid. Roasting and searing remove that ceiling; the flavour you associate with 'good vegetables' is mostly created at the surface, not extracted from inside.",
      es: "El agua limita la superficie a 100 °C, por debajo de toda reacción de dorado, y al mismo tiempo lixivia el sabor soluble hacia el líquido de cocción. Asar y sellar quitan ese techo; el sabor que asociás con 'verduras buenas' se crea sobre todo en la superficie, no se extrae del interior.",
    },
    related: ["maillard"],
  },
  {
    id: "bakers-percentage",
    category: "ratio",
    term: { en: "Baker's percentage", es: "Porcentaje del panadero" },
    definition: {
      en: "Every ingredient expressed as a percentage of flour weight, with flour itself at 100%. It makes any dough scalable and directly comparable to any other, which is why bread recipes are written this way and why a scale is non-negotiable.",
      es: "Cada ingrediente expresado como porcentaje del peso de la harina, con la harina misma al 100%. Hace que cualquier masa sea escalable y directamente comparable con otra, por eso las recetas de pan se escriben así y por eso la báscula no es negociable.",
    },
    analogy: {
      en: "Normalised units: you compare two doughs the way you compare two brew ratios, not by absolute grams.",
      es: "Unidades normalizadas: comparás dos masas como comparás dos ratios de extracción, no por gramos absolutos.",
    },
    related: ["hydration"],
    blocks: {
      en: [
        {
          kind: "table",
          head: ["Ingredient", "Typical %", "Role"],
          rows: [
            ["Flour", "100%", "The reference"],
            ["Water", "55–85%", "Handling and crumb openness"],
            ["Salt", "~2%", "Throttles yeast, tightens gluten, seasons"],
            ["Instant yeast", "0.2–1%", "Rate of fermentation"],
          ],
        },
      ],
      es: [
        {
          kind: "table",
          head: ["Ingrediente", "% típico", "Función"],
          rows: [
            ["Harina", "100%", "La referencia"],
            ["Agua", "55–85%", "Manejo y apertura de la miga"],
            ["Sal", "~2%", "Regula la levadura, tensa el gluten, sazona"],
            ["Levadura instantánea", "0.2–1%", "Velocidad de fermentación"],
          ],
        },
      ],
    },
  },
  {
    id: "hydration",
    category: "ratio",
    term: { en: "Hydration", es: "Hidratación" },
    definition: {
      en: "Water as a percentage of flour weight. Low hydration is tight and easy to shape; high hydration is slack, sticky and opens the crumb. It is the single dial that most changes how a dough feels in the hand.",
      es: "Agua como porcentaje del peso de la harina. Baja hidratación es firme y fácil de formar; alta hidratación es floja, pegajosa y abre la miga. Es la perilla que más cambia cómo se siente una masa en la mano.",
    },
    related: ["bakers-percentage"],
  },
  {
    id: "rice-ratios",
    category: "ratio",
    term: { en: "Rice and grain water ratios", es: "Proporciones de agua para arroz y granos" },
    definition: {
      en: "A grain absorbs a roughly fixed amount of water — about its own weight. Everything above that evaporates, so the correct ratio depends on your lid, pot, heat and batch size as much as on the grain. Evaporation scales with surface area, not volume, which is why big batches need proportionally less water and why the finger-knuckle method beats a fixed number.",
      es: "Un grano absorbe una cantidad de agua más o menos fija — cerca de su propio peso. Todo lo que pase de ahí se evapora, así que la proporción correcta depende de tu tapa, olla, fuego y tamaño del lote tanto como del grano. La evaporación depende de la superficie, no del volumen, por eso los lotes grandes necesitan proporcionalmente menos agua y por eso el método del nudillo le gana a un número fijo.",
    },
    related: ["gelatinisation"],
    blocks: {
      en: [
        {
          kind: "table",
          head: ["Grain", "Grain : water", "Note"],
          rows: [
            ["Long-grain white, rinsed", "1 : 1.5", "Tight lid; lean lower for big batches"],
            ["Medium / short white", "1 : 1.25", ""],
            ["Sushi / short-grain", "1 : 1.2", ""],
            ["Brown rice", "1 : 2–2.25", "Bran genuinely needs the extra water and time"],
            ["Quinoa", "1 : 2", "Rinse to remove saponins"],
            ["Couscous", "1 : 1", "Not a grain — hydrate off heat"],
            ["Pearl barley / farro", "1 : 3", "Or cook like pasta and drain"],
          ],
        },
      ],
      es: [
        {
          kind: "table",
          head: ["Grano", "Grano : agua", "Nota"],
          rows: [
            ["Blanco de grano largo, enjuagado", "1 : 1.5", "Tapa hermética; bajá para lotes grandes"],
            ["Blanco medio / corto", "1 : 1.25", ""],
            ["Sushi / grano corto", "1 : 1.2", ""],
            ["Arroz integral", "1 : 2–2.25", "El salvado sí necesita el agua y el tiempo extra"],
            ["Quinoa", "1 : 2", "Enjuagá para quitar saponinas"],
            ["Cuscús", "1 : 1", "No es un grano — hidratalo fuera del fuego"],
            ["Cebada perlada / farro", "1 : 3", "O cocinalo como pasta y escurrí"],
          ],
        },
      ],
    },
  },
  {
    id: "gelatinisation",
    category: "glossary",
    term: { en: "Starch gelatinisation", es: "Gelatinización del almidón" },
    definition: {
      en: "Above roughly 60–75 °C / 140–167 °F starch granules absorb water and swell. The ratio of amylose to amylopectin decides whether the result is fluffy and separate or sticky and creamy — which is why basmati and risotto rice behave like different ingredients.",
      es: "Por encima de unos 60–75 °C / 140–167 °F los gránulos de almidón absorben agua y se hinchan. La proporción entre amilosa y amilopectina decide si el resultado es suelto y separado o pegajoso y cremoso — por eso el basmati y el arroz para risotto se comportan como ingredientes distintos.",
    },
    related: ["rice-ratios"],
  },
  {
    id: "brine-percentages",
    category: "ratio",
    term: { en: "Brine and ferment percentages", es: "Porcentajes de salmuera y fermentos" },
    definition: {
      en: "Salt as a percentage by weight. In a submerged brine it is a percentage of the water; in a dry-salted ferment it is a percentage of the vegetable. Salt selects for lactic bacteria; the microbes then drop pH below 4.6, and that acidity is what makes the ferment safe.",
      es: "Sal como porcentaje del peso. En una salmuera sumergida es un porcentaje del agua; en un fermento salado en seco es un porcentaje de la verdura. La sal selecciona bacterias lácticas; los microbios bajan el pH por debajo de 4.6, y esa acidez es lo que vuelve seguro el fermento.",
    },
    related: ["ph-safety"],
    blocks: {
      en: [
        {
          kind: "table",
          head: ["Use", "Salt", "Basis"],
          rows: [
            ["Submerged brine, pickles", "2–3.5%", "Of water weight"],
            ["Dry-salted kraut / kimchi", "~2%", "Of vegetable weight"],
            ["Quick vinegar pickle", "n/a", "Acid is added directly — not a ferment"],
          ],
        },
      ],
      es: [
        {
          kind: "table",
          head: ["Uso", "Sal", "Base"],
          rows: [
            ["Salmuera sumergida, encurtidos", "2–3.5%", "Del peso del agua"],
            ["Chucrut / kimchi salado en seco", "~2%", "Del peso de la verdura"],
            ["Encurtido rápido con vinagre", "n/a", "El ácido se agrega directo — no es un fermento"],
          ],
        },
      ],
    },
  },
  {
    id: "ph-safety",
    category: "safety",
    term: { en: "The pH 4.6 barrier", es: "La barrera del pH 4.6" },
    definition: {
      en: "Below pH 4.6 the organisms that matter most for safety cannot grow. A lacto-ferment is safe because its own bacteria produce that acidity while salt and an anaerobic, fully submerged environment hold spoilage organisms off in the meantime. Fuzzy or coloured mould means discard; a flat white film is usually kahm yeast. For canning or shelf-stable preserving, follow tested guidance rather than improvising.",
      es: "Por debajo de pH 4.6 los organismos que más importan para la seguridad no pueden crecer. Un fermento láctico es seguro porque sus propias bacterias producen esa acidez mientras la sal y un ambiente anaeróbico, totalmente sumergido, mantienen a raya a los organismos de descomposición. Moho velloso o de color significa descartar; una película blanca plana suele ser levadura kahm. Para enlatado o conservación estable, seguí guías probadas en vez de improvisar.",
    },
    related: ["brine-percentages"],
  },
  {
    id: "emulsion",
    category: "glossary",
    term: { en: "Emulsion", es: "Emulsión" },
    definition: {
      en: "Fat suspended in water (or the reverse) with the help of an emulsifier and agitation. Egg yolk lecithin, mustard and starch all do the job. Emulsions break when they get too hot or when fat is added faster than it can be dispersed — and can usually be rescued by whisking the broken mixture slowly into a fresh base.",
      es: "Grasa suspendida en agua (o al revés) con ayuda de un emulsionante y agitación. La lecitina de la yema, la mostaza y el almidón hacen ese trabajo. Las emulsiones se cortan cuando se calientan demasiado o cuando se agrega grasa más rápido de lo que se puede dispersar — y normalmente se rescatan batiendo la mezcla cortada lentamente sobre una base nueva.",
    },
    related: ["starch-stabilised-sauce"],
  },
  {
    id: "starch-stabilised-sauce",
    category: "troubleshooting",
    term: { en: "Grainy cheese sauce", es: "Salsa de queso granulosa" },
    definition: {
      en: "Cheese proteins seize and squeeze out fat above roughly 77–82 °C / 170–180 °F. Starchy pasta water is what keeps cacio e pepe or alfredo together: the starch stabilises the emulsion. Take the pan off the heat before the cheese goes in, and use the cooking water, not fresh water.",
      es: "Las proteínas del queso se contraen y sueltan la grasa por encima de unos 77–82 °C / 170–180 °F. El agua almidonada de la pasta es lo que mantiene unido un cacio e pepe o un alfredo: el almidón estabiliza la emulsión. Sacá la sartén del fuego antes de agregar el queso, y usá el agua de cocción, no agua limpia.",
    },
    related: ["emulsion"],
  },
  {
    id: "two-zone-fire",
    category: "method",
    term: { en: "Two-zone fire", es: "Fuego de dos zonas" },
    definition: {
      en: "One hot side for browning and one cool side for gentle cook-through, so you move the food rather than fight the fire. It separates the two variables — surface reaction and internal temperature — and lets you dial each independently. Reverse searing is the same idea run in the other order.",
      es: "Un lado caliente para dorar y uno frío para cocinar suave, así movés la comida en vez de pelear con el fuego. Separa las dos variables — reacción superficial y temperatura interna — y te deja ajustar cada una por separado. El sellado inverso es la misma idea en el otro orden.",
    },
    analogy: {
      en: "Two independent control loops instead of one overloaded one.",
      es: "Dos lazos de control independientes en vez de uno sobrecargado.",
    },
    related: ["maillard", "doneness-temperatures"],
  },
  {
    id: "mise-en-place",
    category: "method",
    term: { en: "Mise en place", es: "Mise en place" },
    definition: {
      en: "Everything prepped, measured and arranged before heat is applied. Once the pan is hot there is no time to chop; the work you did beforehand is the only work available to you. At menu scale this becomes scheduling: identify the longest-lead item and work backwards from serving time.",
      es: "Todo preparado, medido y ordenado antes de aplicar calor. Una vez que la sartén está caliente no hay tiempo de picar; el trabajo que hiciste antes es el único trabajo disponible. A escala de menú esto se vuelve planificación: identificá el ítem de mayor tiempo de espera y trabajá hacia atrás desde la hora de servir.",
    },
    analogy: {
      en: "Staging your inputs before the real-time section of the program runs.",
      es: "Preparar tus entradas antes de que corra la sección en tiempo real del programa.",
    },
    related: ["critical-path"],
  },
  {
    id: "critical-path",
    category: "method",
    term: { en: "Critical path", es: "Ruta crítica" },
    definition: {
      en: "The component whose lead time determines when you must start. A 24-hour dough or a stock sets the schedule for the entire meal; everything else is arranged around it. Identify it first, then work backwards from the serving time.",
      es: "El componente cuyo tiempo de espera determina cuándo tenés que empezar. Una masa de 24 horas o un caldo fijan el horario de toda la comida; todo lo demás se ordena alrededor. Identificalo primero y trabajá hacia atrás desde la hora de servir.",
    },
    related: ["mise-en-place"],
  },
  {
    id: "seasoning-balance",
    category: "troubleshooting",
    term: { en: "It tastes flat — what to add", es: "Sabe plano — qué agregar" },
    definition: {
      en: "Most 'missing something' dishes are missing salt or acid. Salt raises perceived flavour intensity long before it tastes salty; acid cuts richness and makes everything read brighter. Fat carries aroma, sweetness rounds harsh edges, and umami adds depth.",
      es: "La mayoría de los platos a los que 'les falta algo' están faltos de sal o de acidez. La sal sube la intensidad percibida del sabor mucho antes de saber salada; el ácido corta lo graso y hace que todo se lea más brillante. La grasa transporta el aroma, el dulzor redondea los filos ásperos, y el umami agrega profundidad.",
    },
    related: ["emulsion"],
    blocks: {
      en: [
        {
          kind: "table",
          head: ["It tastes…", "Add", "Why"],
          rows: [
            ["Flat, 'missing something'", "Salt, then acid", "Salt raises perceived intensity across the board"],
            ["Heavy, cloying", "Acid", "Cuts fat and resets the palate between bites"],
            ["Harsh, sharp", "Fat or a little sweetness", "Rounds the edges and carries aroma"],
            ["Thin, watery", "Reduce, or add body", "Concentrates dissolved solids"],
            ["Shallow but seasoned", "Umami", "Glutamate adds depth salt cannot"],
          ],
        },
      ],
      es: [
        {
          kind: "table",
          head: ["Sabe…", "Agregá", "Por qué"],
          rows: [
            ["Plano, 'le falta algo'", "Sal, luego ácido", "La sal sube la intensidad percibida en general"],
            ["Pesado, empalagoso", "Ácido", "Corta la grasa y resetea el paladar entre bocados"],
            ["Áspero, filoso", "Grasa o un poco de dulzor", "Redondea los filos y transporta aroma"],
            ["Aguado, sin cuerpo", "Reducir, o dar cuerpo", "Concentra los sólidos disueltos"],
            ["Superficial pero sazonado", "Umami", "El glutamato da profundidad que la sal no puede"],
          ],
        },
      ],
    },
  },
  {
    id: "knife-edge",
    category: "glossary",
    term: { en: "Edge geometry", es: "Geometría del filo" },
    definition: {
      en: "A sharp edge is a clean apex where two bevels meet; a dull edge is a rounded apex that crushes instead of slicing. Western knives are commonly ground around 15–20° per side and Japanese ones shallower. The apex is far too small to judge by eye, so you work by feel — raising a burr tells you the two bevels have actually met.",
      es: "Un filo afilado es un ápice limpio donde se encuentran dos biseles; un filo romo es un ápice redondeado que aplasta en vez de cortar. Los cuchillos occidentales suelen afilarse a unos 15–20° por lado y los japoneses más cerrados. El ápice es demasiado pequeño para juzgarlo a ojo, así que trabajás por tacto — levantar una rebaba te dice que los dos biseles realmente se encontraron.",
    },
    related: [],
  },
];

export const REFERENCE_BY_ID = new Map(REFERENCE.map((r) => [r.id, r]));

export const REFERENCE_CATEGORIES = [...new Set(REFERENCE.map((r) => r.category))];
