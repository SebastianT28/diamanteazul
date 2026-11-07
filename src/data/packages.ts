export type ModelSlug =
  | "arcoiris-rosa"
  | "arcoiris-lavanda"
  | "arcoiris-azul"
  | "clasico-blanco"
  | "celeste-diamante"
  | "mini-blanco"
  | "mini-arcoiris"

export type PackageSlug = "basico" | "medio" | "premium" | ModelSlug

export type PackageAccent = "blue" | "pink" | "lavender"

export interface PackageGalleryPlaceholder {
  id: string
  label: string
  aspectDescription: string
  fileHint: string
}

export interface PackageSizeOption {
  id: string
  label: string
  price: string
  regularPrice: string
  isDefault?: boolean
}

export interface PackageFeatureBullet {
  emoji: string
  text: string
}

export interface PackageSpecRow {
  label: string
  value: string
}

export interface PackageAccordionItem {
  title: string
  content: string
}

export interface PackageReviewItem {
  quote: string
  name: string
  initials: string
  district: string
  avatarBg?: string
  avatarColor?: string
}

export interface ModelSwitcherItem {
  slug: ModelSlug
  title: string
  shortLines: [string, string]
  price: string
  regularPrice: string
}

export interface InflatablePackage {
  slug: PackageSlug
  modelKey: ModelSlug
  tierName: string
  title: string
  subtitle: string
  shortDescription: string
  fullDescription: string
  accent: PackageAccent
  isFeatured?: boolean
  featuredLabel?: string
  categories: ("casa" | "jardin")[]
  price: string
  regularPrice: string
  sizeOptions: PackageSizeOption[]
  featureBullets: PackageFeatureBullet[]
  detailsHeading: {
    line1: string
    line2: string
  }
  detailsIntro: string
  tableSpecs: PackageSpecRow[]
  accordions: PackageAccordionItem[]
  reviewColumns: PackageReviewItem[][]
  specs: {
    minSpace: string
    heightClearance: string
    recommendedAges: string
    simultaneousCapacity: string
    durationHours: string
    powerRequirement: string
    setupAdvanceTime: string
  }
  preliminaryHighlights: string[]
  includedItems: string[]
  idealFor: string[]
  galleryPlaceholders: PackageGalleryPlaceholder[]
}

export const WHATSAPP_CONFIG = {
  phone: "51999999999",
  displayPhone: "+51 999 999 999",
  businessName: "Diamante Azul",
  legalName: "Diamante Azul Servicios EIRL",
} as const

export const COVERAGE_DISTRICTS = [
  "Santiago de Surco",
  "Miraflores",
  "San Borja",
  "San Isidro",
  "Magdalena del Mar",
  "Surquillo",
  "San Luis",
  "Otro distrito en Lima",
] as const

export const EVENT_TYPES = [
  "Cumpleaños Infantil",
  "Celebración Familiar",
  "Colegio o Nido",
  "Evento Corporativo",
] as const

export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/diamanteazulaqp",
  facebook: "https://www.facebook.com/share/1F6tXrvwF8/",
  tiktok: "https://www.tiktok.com/@diamanteazul360",
} as const

export const MODEL_SWITCHER_ITEMS: ModelSwitcherItem[] = [
  {
    slug: "arcoiris-rosa",
    title: "Arcoíris Rosa",
    shortLines: ["Arcoíris", "Rosa"],
    price: "S/ 450.00",
    regularPrice: "S/ 520.00",
  },
  {
    slug: "arcoiris-lavanda",
    title: "Arcoíris Lavanda",
    shortLines: ["Arcoíris", "Lavanda"],
    price: "S/ 450.00",
    regularPrice: "S/ 520.00",
  },
  {
    slug: "arcoiris-azul",
    title: "Arcoíris Azul",
    shortLines: ["Arcoíris", "Azul"],
    price: "S/ 480.00",
    regularPrice: "S/ 550.00",
  },
  {
    slug: "clasico-blanco",
    title: "El Clásico Blanco",
    shortLines: ["Clásico", "Blanco"],
    price: "S/ 350.00",
    regularPrice: "S/ 410.00",
  },
  {
    slug: "celeste-diamante",
    title: "Celeste Diamante",
    shortLines: ["Celeste", "Diamante"],
    price: "S/ 350.00",
    regularPrice: "S/ 410.00",
  },
  {
    slug: "mini-blanco",
    title: "El Mini Blanco",
    shortLines: ["Mini", "Blanco"],
    price: "S/ 250.00",
    regularPrice: "S/ 300.00",
  },
  {
    slug: "mini-arcoiris",
    title: "Mini Arcoíris",
    shortLines: ["Mini", "Arcoíris"],
    price: "S/ 280.00",
    regularPrice: "S/ 330.00",
  },
]

const DEFAULT_BULLETS: PackageFeatureBullet[] = [
  { emoji: "💨", text: "Se infla en menos de 2 minutos" },
  { emoji: "🏡", text: "Ideal para casas, departamentos y jardines en Lima" },
  { emoji: "🤸", text: "Diseño acolchado y cerrado de alta seguridad" },
  { emoji: "☀️", text: "Apto para uso en interiores y exteriores" },
  { emoji: "🎉", text: "Perfecto para cumpleaños, sesiones de fotos y eventos" },
]

const DEFAULT_ACCORDIONS: PackageAccordionItem[] = [
  {
    title: "¿Qué incluye exactamente el servicio de alquiler?",
    content:
      "Incluye el traslado gratuito en zonas de cobertura de Lima Metropolitana, instalación profesional 45 minutos antes de tu evento, desinfección en sitio, turbina silenciosa, pisos de microporoso perimetrales, pelotas pastel decorativas y recojo puntual al finalizar.",
  },
  {
    title: "Cuidado, seguridad y requisitos de espacio",
    content:
      "Se requiere dejar al menos 80 cm libres alrededor del inflable y contar con un tomacorriente estándar de 220V a menos de 15 metros (nosotros llevamos la extensión vulcanizada). El uso debe realizarse sin calzado, sin objetos punzantes y siempre bajo supervisión de un adulto.",
  },
]

const DEFAULT_REVIEW_COLUMNS: PackageReviewItem[][] = [
  [
    {
      quote:
        "El Clásico Blanco es aún más lindo en persona. El tono blanco mate se vio súper elegante con el arco de globos pastel y los niños saltaron toda la tarde.",
      name: "Sofía Martínez",
      initials: "SM",
      district: "Miraflores, Lima",
    },
    {
      quote:
        "La entrega fue súper puntual y todo llegó impecable y desinfectado. En menos de 10 minutos ya estaba instalado y listo para la fiesta.",
      name: "Romina Torres",
      initials: "RT",
      district: "San Isidro, Lima",
      avatarBg: "#FCE9EE",
      avatarColor: "#9B4D5E",
    },
    {
      quote:
        "Me encanta que todo esté incluido: motor, pisos acolchados, pelotas pastel y armado. Cero estrés para nosotros como papás.",
      name: "Helena Ríos",
      initials: "HR",
      district: "Santiago de Surco",
      avatarBg: "#EAECF7",
      avatarColor: "#4E5685",
    },
  ],
  [
    {
      quote:
        "La mejor elección para el cumpleaños en nuestro jardín. Mantuvo a los pequeños entretenidos por horas lejos de las pantallas.",
      name: "Elena Wong",
      initials: "EW",
      district: "La Molina, Lima",
    },
    {
      quote:
        "Perfecto para fiestas infantiles elegantes. Combinó hermoso con toda nuestra decoración y las fotos familiares quedaron de revista.",
      name: "Luciana Benavides",
      initials: "LB",
      district: "San Borja, Lima",
      avatarBg: "#FCE9EE",
      avatarColor: "#9B4D5E",
    },
    {
      quote:
        "Lo usamos en nuestra terraza techada y entró perfecto en la medida 3×3m. Las mallas laterales permiten ver a los niños todo el tiempo.",
      name: "Renata Herrera",
      initials: "RH",
      district: "Barranco, Lima",
      avatarBg: "#EAECF7",
      avatarColor: "#4E5685",
    },
  ],
  [
    {
      quote:
        "Muy impresionada con la calidad del material. Las costuras se sienten súper firmes y seguras, y el acabado mate luce increíble.",
      name: "Camila Espinoza",
      initials: "CE",
      district: "Magdalena del Mar",
    },
    {
      quote:
        "La atención por WhatsApp fue rapidísima. Reservamos con Yape y el equipo llegó 45 minutos antes del evento para dejar todo listo.",
      name: "Andrea Cáceres",
      initials: "AC",
      district: "Jesús María, Lima",
      avatarBg: "#FCE9EE",
      avatarColor: "#9B4D5E",
    },
    {
      quote:
        "El tono pastel es exactamente lo que buscaba. Se adapta a cualquier temática de cumpleaños sin verse recargado ni chillón.",
      name: "Mariana Tudela",
      initials: "MT",
      district: "Chacarilla, Surco",
      avatarBg: "#EAECF7",
      avatarColor: "#4E5685",
    },
  ],
]

function createGalleryPlaceholders(prefix: string, title: string): PackageGalleryPlaceholder[] {
  return [
    {
      id: `${prefix}-1`,
      label: `Vista principal de ${title}`,
      aspectDescription: "Fotografía destacada en evento infantil (1:1)",
      fileHint: `/images/paquetes/${prefix}-1.webp`,
    },
    {
      id: `${prefix}-2`,
      label: `Ángulo lateral y resbaladera de ${title}`,
      aspectDescription: "Detalle de zona de salto y paredes acolchadas",
      fileHint: `/images/paquetes/${prefix}-2.webp`,
    },
    {
      id: `${prefix}-3`,
      label: "Pisos acolchados y pelotas pastel incluidas",
      aspectDescription: "Zona de ingreso con tapetes microporosos",
      fileHint: `/images/paquetes/${prefix}-3.webp`,
    },
    {
      id: `${prefix}-4`,
      label: "Detalles de costuras y acabado mate",
      aspectDescription: "Vinilo PVC de alta densidad sanitizado",
      fileHint: `/images/paquetes/${prefix}-4.webp`,
    },
    {
      id: `${prefix}-5`,
      label: "Montaje completo en terraza o jardín",
      aspectDescription: "Presentación estética lista para decorar",
      fileHint: `/images/paquetes/${prefix}-5.webp`,
    },
  ]
}

const CLASICO_BLANCO_BASE: Omit<InflatablePackage, "slug"> = {
  modelKey: "clasico-blanco",
  tierName: "Paquete Medio",
  title: "El Clásico Blanco",
  subtitle: "Castillo blanco mate con resbaladera para fiestas elegantes en Lima.",
  shortDescription:
    "Diseñado en nuestro exclusivo blanco mate suave para casas y jardines.",
  fullDescription:
    "Diseñado en nuestro exclusivo blanco mate suave, se integra en casas modernas, fiestas elegantes y celebraciones en jardín, brindando toda la alegría de un castillo inflable con una estética delicada y refinada.",
  accent: "blue",
  isFeatured: true,
  featuredLabel: "Más solicitado en Lima Moderna",
  categories: ["casa", "jardin"],
  price: "S/ 350.00",
  regularPrice: "S/ 410.00",
  sizeOptions: [
    {
      id: "3x3m",
      label: "3×3m (6ft)",
      price: "S/ 320.00",
      regularPrice: "S/ 370.00",
    },
    {
      id: "4x3m",
      label: "4×3m (8ft)",
      price: "S/ 350.00",
      regularPrice: "S/ 410.00",
      isDefault: true,
    },
  ],
  featureBullets: DEFAULT_BULLETS,
  detailsHeading: {
    line1: "Hecho para su mundo.",
    line2: "Y el tuyo.",
  },
  detailsIntro:
    "Su propio espacio seguro para saltar, reír y jugar. Con amplia zona de rebote cerrada con malla de visibilidad y disponible en dos medidas, está diseñado para eventos inolvidables en interiores o exteriores. La turbina eléctrica y todos los accesorios están incluidos.",
  tableSpecs: [
    { label: "Dónde instalar", value: "Interiores o exteriores" },
    { label: "Edades recomendadas", value: "2 a 8 años" },
    {
      label: "Dimensiones modelo 3×3m (6ft)",
      value: "Alto 210 × Largo 300 × Ancho 280 cm",
    },
    {
      label: "Dimensiones modelo 4×3m (8ft)",
      value: "Alto 240 × Largo 400 × Ancho 300 cm",
    },
    {
      label: "Capacidad simultánea",
      value: "3×3m: 3–4 niños / 4×3m: 5–6 niños",
    },
    { label: "Peso máximo por niño", value: "3×3m: 25 kg / 4×3m: 30 kg" },
    { label: "Peso total soportado", value: "3×3m: 110 kg / 4×3m: 160 kg" },
    { label: "Tiempo de alquiler incluido", value: "Hasta 5 horas por evento" },
    { label: "Diseñado para", value: "Eventos familiares y cumpleaños" },
  ],
  accordions: DEFAULT_ACCORDIONS,
  reviewColumns: DEFAULT_REVIEW_COLUMNS,
  specs: {
    minSpace: "4.0 m × 3.0 m",
    heightClearance: "2.6 m libres",
    recommendedAges: "2 a 8 años",
    simultaneousCapacity: "5 a 6 niños",
    durationHours: "Hasta 5 horas",
    powerRequirement: "Enchufe 220V a menos de 15 m",
    setupAdvanceTime: "45 min antes del evento",
  },
  preliminaryHighlights: [
    "Castillo blanco mate con resbaladera integrada",
    "Pisos acolchados y set de pelotas pastel",
    "Traslado, instalación y desinfección gratis en Lima",
  ],
  includedItems: [
    "Castillo inflable El Clásico Blanco higienizado",
    "Turbina eléctrica silenciosa de flujo continuo",
    "Pisos acolchados perimetrales en tonos neutros",
    "Set de pelotas pastel decorativas",
    "Estacas de jardín o pesas de anclaje para interiores",
    "Armado profesional y recojo puntual",
  ],
  idealFor: [
    "Cumpleaños infantiles con decoración estética o arco de globos",
    "Casas, terrazas techadas, cocheras y jardines en Lima",
    "Sesiones fotográficas y celebraciones de 1 a 8 años",
  ],
  galleryPlaceholders: createGalleryPlaceholders("clasico-blanco", "El Clásico Blanco"),
}

const MINI_BLANCO_BASE: Omit<InflatablePackage, "slug"> = {
  modelKey: "mini-blanco",
  tierName: "Paquete Básico",
  title: "El Mini Blanco",
  subtitle: "Formato compacto pensado para departamentos, salas y terrazas en Lima.",
  shortDescription:
    "Castillo compacto en blanco mate suave para niños de 1 a 5 años.",
  fullDescription:
    "Toda la estética minimalista de nuestro castillo insignia en un formato compacto pensado especialmente para salas de departamentos, terrazas pequeñas y celebraciones íntimas de primeros añitos en casa.",
  accent: "blue",
  categories: ["casa"],
  price: "S/ 250.00",
  regularPrice: "S/ 300.00",
  sizeOptions: [
    {
      id: "2.2x2.2m",
      label: "2.2×2.2m (Mini)",
      price: "S/ 250.00",
      regularPrice: "S/ 300.00",
      isDefault: true,
    },
    {
      id: "2.5x2.5m",
      label: "2.5×2.5m (Plus)",
      price: "S/ 280.00",
      regularPrice: "S/ 330.00",
    },
  ],
  featureBullets: DEFAULT_BULLETS,
  detailsHeading: {
    line1: "Hecho para su mundo.",
    line2: "Y el tuyo.",
  },
  detailsIntro:
    "Diseñado especialmente para entrar sin complicaciones en salas, comedores y terrazas de departamento en Lima. Paredes acolchadas bajas y malla perimetral para que los más pequeños salten con total seguridad.",
  tableSpecs: [
    { label: "Dónde instalar", value: "Salas, terrazas o jardines" },
    { label: "Edades recomendadas", value: "1 a 5 años" },
    {
      label: "Dimensiones modelo 2.2×2.2m",
      value: "Alto 175 × Largo 220 × Ancho 220 cm",
    },
    {
      label: "Dimensiones modelo 2.5×2.5m",
      value: "Alto 190 × Largo 250 × Ancho 250 cm",
    },
    {
      label: "Capacidad simultánea",
      value: "3 a 4 niños pequeños",
    },
    { label: "Peso máximo por niño", value: "22 kg" },
    { label: "Peso total soportado", value: "90 kg" },
    { label: "Tiempo de alquiler incluido", value: "Hasta 5 horas por evento" },
    { label: "Diseñado para", value: "Primeros añitos y departamentos" },
  ],
  accordions: DEFAULT_ACCORDIONS,
  reviewColumns: DEFAULT_REVIEW_COLUMNS,
  specs: {
    minSpace: "2.6 m × 2.6 m",
    heightClearance: "2.1 m libres",
    recommendedAges: "1 a 5 años",
    simultaneousCapacity: "3 a 4 niños",
    durationHours: "Hasta 5 horas",
    powerRequirement: "Enchufe 220V a menos de 15 m",
    setupAdvanceTime: "45 min antes del evento",
  },
  preliminaryHighlights: [
    "Tamaño compacto ideal para departamentos en Lima",
    "Pisos acolchados y pelotas pastel incluidos",
    "Traslado, instalación y desinfección gratis",
  ],
  includedItems: [
    "Castillo inflable compacto El Mini Blanco",
    "Turbina eléctrica silenciosa de uso interior",
    "Tapetes acolchados de microporoso en el ingreso",
    "Set de pelotas pastel suaves",
    "4 pesas de estabilidad para piso interior",
    "Instalación y sanitización completa en sitio",
  ],
  idealFor: [
    "Primer añito, baby showers y bautizos en departamento",
    "Salas, terrazas techadas y salones de usos múltiples",
    "Juegos seguros para bebés y niños de 1 a 5 años",
  ],
  galleryPlaceholders: createGalleryPlaceholders("mini-blanco", "El Mini Blanco"),
}

const ARCOIRIS_ROSA_BASE: Omit<InflatablePackage, "slug"> = {
  modelKey: "arcoiris-rosa",
  tierName: "Paquete Premium",
  title: "Arcoíris Rosa",
  subtitle: "Castillo pastel con arcoíris, tobogán y piscina de pelotas integrada.",
  shortDescription:
    "Tonos rosa empolvado, lavanda y celeste con tobogán y piscina de pelotas.",
  fullDescription:
    "Nuestra pieza estrella en tonos rosa pastel, lavanda suave y blanco perla. Cuenta con arco frontal escultural, resbaladera acolchada y zona de pelotas pastel integrada para crear el escenario central soñado en cualquier celebración.",
  accent: "pink",
  isFeatured: true,
  featuredLabel: "Favorito para Cumpleaños",
  categories: ["casa", "jardin"],
  price: "S/ 450.00",
  regularPrice: "S/ 520.00",
  sizeOptions: [
    {
      id: "3x3m",
      label: "3×3m (6ft)",
      price: "S/ 410.00",
      regularPrice: "S/ 470.00",
    },
    {
      id: "4x4m",
      label: "4×4m (8ft)",
      price: "S/ 450.00",
      regularPrice: "S/ 520.00",
      isDefault: true,
    },
  ],
  featureBullets: DEFAULT_BULLETS,
  detailsHeading: {
    line1: "Hecho para su mundo.",
    line2: "Y el tuyo.",
  },
  detailsIntro:
    "Un diseño de ensueño con arcoíris pastel en relieve, zona de rebote amplia y piscina de pelotas integrada. Pensado para destacar en fotografías familiares mientras los niños disfrutan horas de juego seguro.",
  tableSpecs: [
    { label: "Dónde instalar", value: "Interiores amplios o jardines" },
    { label: "Edades recomendadas", value: "2 a 9 años" },
    {
      label: "Dimensiones modelo 3×3m (6ft)",
      value: "Alto 225 × Largo 320 × Ancho 300 cm",
    },
    {
      label: "Dimensiones modelo 4×4m (8ft)",
      value: "Alto 250 × Largo 400 × Ancho 380 cm",
    },
    {
      label: "Capacidad simultánea",
      value: "3×3m: 4–5 niños / 4×4m: 6–8 niños",
    },
    { label: "Peso máximo por niño", value: "30 kg" },
    { label: "Peso total soportado", value: "180 kg" },
    { label: "Tiempo de alquiler incluido", value: "Hasta 5 horas por evento" },
    { label: "Diseñado para", value: "Cumpleaños temáticos y jardines" },
  ],
  accordions: DEFAULT_ACCORDIONS,
  reviewColumns: DEFAULT_REVIEW_COLUMNS,
  specs: {
    minSpace: "4.5 m × 4.2 m",
    heightClearance: "2.8 m libres",
    recommendedAges: "2 a 9 años",
    simultaneousCapacity: "6 a 8 niños",
    durationHours: "Hasta 5 horas",
    powerRequirement: "Enchufe 220V a menos de 15 m",
    setupAdvanceTime: "45 min antes del evento",
  },
  preliminaryHighlights: [
    "Castillo Arcoíris Rosa con tobogán y piscina de pelotas",
    "Pelotas en tonos rosa pastel, perla y lavanda",
    "Traslado, montaje y sanitización gratis en Lima",
  ],
  includedItems: [
    "Castillo inflable Arcoíris Rosa con piscina de pelotas",
    "Turbina eléctrica silenciosa certificada",
    "Pisos acolchados perimetrales en tonos pastel",
    "Set abundante de pelotas rosa, blanco y lavanda",
    "Estacas de jardín y pesas de estabilidad",
    "Instalación técnica 45 minutos antes del evento",
  ],
  idealFor: [
    "Fiestas temáticas en tonos rosa pastel, arcoíris o princesa moderna",
    "Jardines, terrazas amplias y salones de eventos en Lima",
    "Celebraciones familiares que buscan impacto visual en fotos",
  ],
  galleryPlaceholders: createGalleryPlaceholders("arcoiris-rosa", "Arcoíris Rosa"),
}

export const PACKAGES_DATA: InflatablePackage[] = [
  // 1. Tier Slugs (Básico, Medio, Premium)
  {
    ...MINI_BLANCO_BASE,
    slug: "basico",
  },
  {
    ...CLASICO_BLANCO_BASE,
    slug: "medio",
  },
  {
    ...ARCOIRIS_ROSA_BASE,
    slug: "premium",
  },

  // 2. Individual 7 Catalog Model Slugs
  {
    ...CLASICO_BLANCO_BASE,
    slug: "clasico-blanco",
  },
  {
    ...ARCOIRIS_ROSA_BASE,
    slug: "arcoiris-rosa",
  },
  {
    ...ARCOIRIS_ROSA_BASE,
    slug: "arcoiris-lavanda",
    modelKey: "arcoiris-lavanda",
    tierName: "Paquete Premium",
    title: "Arcoíris Lavanda",
    subtitle: "Tonos lavanda suave, celeste y rosa pastel con tobogán y pelotas.",
    shortDescription:
      "Castillo pastel en lavanda y celeste con resbaladera y zona de pelotas.",
    fullDescription:
      "Inspirado en una paleta de ensueño lavanda, celeste cielo y blanco suave. Su arco superior y resbaladera acolchada crean un rincón mágico que enamora a niños y adultos por igual.",
    accent: "lavender",
    price: "S/ 450.00",
    regularPrice: "S/ 520.00",
    galleryPlaceholders: createGalleryPlaceholders("arcoiris-lavanda", "Arcoíris Lavanda"),
  },
  {
    ...ARCOIRIS_ROSA_BASE,
    slug: "arcoiris-azul",
    modelKey: "arcoiris-azul",
    tierName: "Paquete Premium",
    title: "Arcoíris Azul",
    subtitle: "Circuito completo en tonos celeste diamante, azul pastel y blanco.",
    shortDescription:
      "Gran formato en gama celeste y azul pastel para máxima diversión.",
    fullDescription:
      "Combina la frescura de nuestro Celeste Diamante con suaves arcos en tonos azul hielo y blanco mate. Su amplio espacio de salto y tobogán lo convierten en el favorito para jardines y fiestas con muchos invitados.",
    accent: "blue",
    price: "S/ 480.00",
    regularPrice: "S/ 550.00",
    sizeOptions: [
      {
        id: "4x4m",
        label: "4×4m (8ft)",
        price: "S/ 450.00",
        regularPrice: "S/ 520.00",
      },
      {
        id: "5x4m",
        label: "5×4m (10ft)",
        price: "S/ 480.00",
        regularPrice: "S/ 550.00",
        isDefault: true,
      },
    ],
    galleryPlaceholders: createGalleryPlaceholders("arcoiris-azul", "Arcoíris Azul"),
  },
  {
    ...CLASICO_BLANCO_BASE,
    slug: "celeste-diamante",
    modelKey: "celeste-diamante",
    tierName: "Paquete Medio",
    title: "Celeste Diamante",
    subtitle: "Nuestro emblemático tono celeste pastel con acabado mate y tobogán.",
    shortDescription:
      "Castillo en tono Celeste Diamante suave con resbaladera integrada.",
    fullDescription:
      "Vestido con nuestro color insignia Celeste Diamante en acabado mate aterciopelado. Aporta luz, serenidad y un estilo inconfundible a cumpleaños al aire libre, terrazas y celebraciones familiares en Lima.",
    accent: "blue",
    price: "S/ 350.00",
    regularPrice: "S/ 410.00",
    galleryPlaceholders: createGalleryPlaceholders("celeste-diamante", "Celeste Diamante"),
  },
  {
    ...MINI_BLANCO_BASE,
    slug: "mini-blanco",
  },
  {
    ...MINI_BLANCO_BASE,
    slug: "mini-arcoiris",
    modelKey: "mini-arcoiris",
    tierName: "Paquete Básico",
    title: "Mini Arcoíris",
    subtitle: "Compacto interior con delicado arco pastel para espacios reducidos.",
    shortDescription:
      "Formato mini con detalles arcoíris pastel ideal para departamentos.",
    fullDescription:
      "Todo el encanto de nuestra colección Arcoíris en una silueta compacta de 2.5×2.5m. Diseñado para caber en salas, cocheras o terrazas sin renunciar a los tonos pastel de Diamante Azul.",
    accent: "pink",
    price: "S/ 280.00",
    regularPrice: "S/ 330.00",
    sizeOptions: [
      {
        id: "2.2x2.2m",
        label: "2.2×2.2m (Mini)",
        price: "S/ 260.00",
        regularPrice: "S/ 310.00",
      },
      {
        id: "2.5x2.5m",
        label: "2.5×2.5m (Plus)",
        price: "S/ 280.00",
        regularPrice: "S/ 330.00",
        isDefault: true,
      },
    ],
    galleryPlaceholders: createGalleryPlaceholders("mini-arcoiris", "Mini Arcoíris"),
  },
]

export const FAQ_ITEMS = [
  {
    id: "faq-espacio",
    question: "¿Cómo sé qué paquete entra en mi casa, cochera o jardín?",
    answer:
      "Cada tarjeta indica el área mínima en metros (largo × ancho) y la altura libre necesaria. Si tienes dudas, escríbenos por WhatsApp con las medidas aproximadas o una foto de tu espacio y te confirmamos al instante qué modelo se adapta mejor.",
  },
  {
    id: "faq-limpieza",
    question: "¿Cómo garantizan la limpieza e higiene de los inflables?",
    answer:
      "Todos nuestros equipos son renovados frecuentemente y pasan por un proceso de limpieza y desinfección antes de cada evento. Además, instalamos una lona base protectora y una alfombra en el ingreso para mantener el área de salto impecable.",
  },
  {
    id: "faq-instalacion",
    question: "¿El tiempo de instalación descuenta las horas de alquiler?",
    answer:
      "No. Nuestro equipo uniformado llega entre 45 y 60 minutos antes de la hora de inicio de tu evento para instalar, anclar y desinfectar el inflable con total tranquilidad. Tus horas contratadas corren únicamente desde la hora pactada para tu fiesta.",
  },
  {
    id: "faq-superficie",
    question: "¿Se puede instalar sobre piso de cemento, cerámica o césped?",
    answer:
      "Sí. Instalamos tanto en césped (usando estacas de seguridad) como en superficies duras de cocheras, terrazas o salones (usando contrapesos y lonas amortiguadoras). Solo necesitamos acceso a una toma de corriente estándar de 220V.",
  },
  {
    id: "faq-distritos",
    question: "¿En qué distritos de Lima brindan el servicio?",
    answer:
      "Atendemos principalmente en Lima Moderna: Santiago de Surco, Miraflores, San Borja, San Isidro, Magdalena del Mar, La Molina, Barranco, Surquillo, Jesús María y distritos aledaños previa coordinación por WhatsApp.",
  },
] as const

export function getPackageBySlug(slug: string): InflatablePackage | undefined {
  return PACKAGES_DATA.find((pkg) => pkg.slug === slug)
}

export function buildWhatsAppUrl(
  params:
    | string
    | {
        packageTitle?: string
        tierName?: string
        district?: string
        eventType?: string
        customMessage?: string
      }
): string {
  if (typeof params === "string") {
    return `https://wa.me/${WHATSAPP_CONFIG.phone}?text=${encodeURIComponent(
      params
    )}`
  }

  if (params.customMessage) {
    return `https://wa.me/${WHATSAPP_CONFIG.phone}?text=${encodeURIComponent(
      params.customMessage
    )}`
  }

  const pkgPart =
    params.tierName && params.packageTitle
      ? `el *${params.tierName} (${params.packageTitle})*`
      : "sus paquetes de alquiler de inflables"

  const eventPart = params.eventType
    ? ` para un *${params.eventType}*`
    : " para un evento"

  const districtPart = params.district ? ` en *${params.district}*` : " en Lima"

  const text = `Hola ${WHATSAPP_CONFIG.businessName}, vi en su web ${pkgPart} y me gustaría consultar disponibilidad y cotización${eventPart}${districtPart}.`

  return `https://wa.me/${WHATSAPP_CONFIG.phone}?text=${encodeURIComponent(text)}`
}
