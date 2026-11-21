export type ProductCategorySlug =
  | "castillos-toboganes"
  | "inflables-acuaticos"
  | "juegos-entretenimiento"
  | "sesiones-fotos"
  | "complementos-extras"

export interface ProductCategoryInfo {
  slug: ProductCategorySlug
  label: string
  shortLabel: string
  note: string
}

export const PRODUCT_CATEGORIES: ProductCategoryInfo[] = [
  {
    slug: "castillos-toboganes",
    label: "Castillos y Toboganes",
    shortLabel: "Castillos y Toboganes",
    note: "Líneas Dreamy Pastel, White Trend y Diversión a Color",
  },
  {
    slug: "inflables-acuaticos",
    label: "Inflables Acuáticos",
    shortLabel: "Inflables Acuáticos",
    note: "Aquaroller, Cañón de Espuma y Piscina con Botes",
  },
  {
    slug: "juegos-entretenimiento",
    label: "Juegos y Entretenimiento",
    shortLabel: "Juegos y Entretenimiento",
    note: "Bubble House, Soft Play, Reloj Demoledor y más",
  },
  {
    slug: "sesiones-fotos",
    label: "Sesiones de Fotos",
    shortLabel: "Sesiones de Fotos",
    note: "Plataforma 360°, Domo Overhead 360 y Estación de Fotos",
  },
  {
    slug: "complementos-extras",
    label: "Complementos y Extras",
    shortLabel: "Complementos y Extras",
    note: "Sillas metálicas tapizadas y generadores eléctricos",
  },
]

export type PackageSlug = string
export type ModelSlug = string
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
  regularPrice?: string
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

export interface PackageIncludedCard {
  title: string
  description: string
  blobColor: string
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
  slug: string
  title: string
  shortLines: [string, string]
  price: string
  regularPrice?: string
  category: ProductCategorySlug
  image: string
}

export interface InflatablePackage {
  slug: string
  modelKey: string
  category: ProductCategorySlug
  categoryName: string
  collectionName: string
  tierName: string
  title: string
  subtitle: string
  shortDescription: string
  fullDescription: string
  image: string
  images: string[]
  accent: PackageAccent
  isFeatured?: boolean
  featuredLabel?: string
  isNew?: boolean
  categories: ("casa" | "jardin")[]
  price: string
  regularPrice?: string
  variantLabel: string
  sizeOptions: PackageSizeOption[]
  cardTagsLabel: string
  cardTags: string[]
  featureBullets: PackageFeatureBullet[]
  includedCards: PackageIncludedCard[]
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
  phone: "51948311603",
  displayPhone: "+51 948 311 603",
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
  "Otro distrito",
] as const

export const EVENT_TYPES = [
  "Cumpleaños Infantil",
  "Celebración Familiar",
  "Colegio o Nido",
  "Evento Corporativo",
] as const

export const SOCIAL_LINKS = {
  instagram:
    "https://www.instagram.com/diamanteazulaqp?utm_source=ig_web_button_share_sheet&dmpr=ZDNlZDc0MzIxNw==",
  facebook: "https://www.facebook.com/profile.php?id=100089693337295",
  tiktok:
    "https://www.tiktok.com/@diamanteazul360?is_from_webapp=1&sender_device=pc",
} as const

const DEFAULT_REVIEW_COLUMNS: PackageReviewItem[][] = [
  [
    {
      quote:
        "Excelente servicio de Diamante Azul. Llegaron puntuales, todo impecable y los niños se divirtieron las 5 horas sin parar.",
      name: "Sofía Martínez",
      initials: "SM",
      district: "Evento Familiar",
    },
    {
      quote:
        "La atención por WhatsApp fue súper rápida y clara. Nos ayudaron a elegir el modelo ideal para las medidas de nuestro jardín.",
      name: "Romina Torres",
      initials: "RT",
      district: "Cumpleaños Infantil",
      avatarBg: "#FCE9EE",
      avatarColor: "#9B4D5E",
    },
  ],
  [
    {
      quote:
        "Los equipos lucen como nuevos, limpios y muy bien cuidados. El personal de apoyo estuvo atento durante toda la celebración.",
      name: "Diego Garrido",
      initials: "DG",
      district: "Celebración en Casa",
    },
    {
      quote:
        "Muy recomendados por su puntualidad y presentación. Se encargaron del montaje y desmontaje sin que tuviéramos que preocuparnos por nada.",
      name: "Andrea Salazar",
      initials: "AS",
      district: "Fiesta Infantil",
      avatarBg: "#EAECF7",
      avatarColor: "#4E578C",
    },
  ],
  [
    {
      quote:
        "Contratamos con Diamante Azul para nuestro evento y superó nuestras expectativas. Seguridad, limpieza y trato súper amable.",
      name: "Camila Benavides",
      initials: "CB",
      district: "Evento Especial",
    },
    {
      quote:
        "Totalmente confiables. Reservamos con el 50% de adelanto y el día de la fiesta estuvieron instalando con total puntualidad.",
      name: "Rodrigo Paz",
      initials: "RP",
      district: "Celebración Familiar",
      avatarBg: "#E3F3F9",
      avatarColor: "#236B88",
    },
  ],
]

interface RawProductSeed {
  slug: string
  title: string
  category: ProductCategorySlug
  collectionName: string
  subtitle: string
  description: string
  image: string
  images?: string[]
  price: string
  variantLabel?: string
  sizeOptions: PackageSizeOption[]
  cardTagsLabel: string
  cardTags: string[]
  dimensions: string
  ages: string
  duration: string
  mobility: string
  extraHour?: string
  accent: PackageAccent
  isNew?: boolean
  isFeatured?: boolean
  bullets: PackageFeatureBullet[]
  includedCards: PackageIncludedCard[]
  extraSpecs?: PackageSpecRow[]
}

const RAW_PRODUCTS: RawProductSeed[] = [
  // ===========================================================================
  // 1. CASTILLOS Y TOBOGANES (16 PRODUCTOS)
  // ===========================================================================
  {
    slug: "arcoiris-magico",
    title: "Arcoíris Mágico",
    category: "castillos-toboganes",
    collectionName: "Dreamy Collection",
    subtitle: "Dreamy Collection · Con tobogán y piscina de pelotas",
    description:
      "Un inflable lleno de colores pastel que invita a los niños a saltar, deslizarse y divertirse sin parar. Cuenta con un arcoíris de entrada, una amplia zona de saltos, un tobogán integrado y una piscina de pelotas que hará cada momento inolvidable. ¡Perfecto para cumpleaños, fiestas y eventos especiales!",
    image: "/images/catalogo/arcoiris-magico.webp",
    price: "S/ 600",
    variantLabel: "Medida y Tiempo",
    sizeOptions: [
      { id: "6x5m-5h", label: "6m × 5m · 5 Horas", price: "S/ 600", isDefault: true },
    ],
    cardTagsLabel: "Medidas",
    cardTags: ["6×5×4m", "5 hrs"],
    dimensions: "6.00 m (largo) × 5.00 m (ancho) × 4.00 m (alto)",
    ages: "Niños pequeños e infantiles",
    duration: "5 horas",
    mobility: "S/ 30.00",
    extraHour: "S/ 70.00",
    accent: "pink",
    isNew: true,
    isFeatured: true,
    bullets: [
      { emoji: "🌈", text: "Arcoíris pastel de entrada decorativo" },
      { emoji: "🤸", text: "Zona de saltos amplia y acolchada" },
      { emoji: "🛝", text: "Tobogán integrado de caída suave" },
      { emoji: "⚪", text: "Piscina de pelotas pastel integrada" },
      { emoji: "⏱️", text: "Alquiler por 5 horas + 1 personal de apoyo" },
    ],
    includedCards: [
      {
        title: "Inflable Arcoíris Mágico",
        description: "Castillo pastel de 6m × 5m × 4m con arcoíris de entrada, zona de salto y tobogán.",
        blobColor: "#FCE9EE",
      },
      {
        title: "Piscina de Pelotas",
        description: "Área perimetral integrada con pelotas en tonos pastel suaves para los más pequeños.",
        blobColor: "#E3F3F9",
      },
      {
        title: "1 Personal de Apoyo",
        description: "Asistencia durante las 5 horas de alquiler para supervisar el uso seguro del juego.",
        blobColor: "#EAECF7",
      },
      {
        title: "Montaje y Desinfección",
        description: "Instalación completa en tu locación, turbina eléctrica y limpieza garantizada.",
        blobColor: "#E8F4FA",
      },
    ],
  },
  {
    slug: "tobogan-de-ensueno",
    title: "Tobogán de Ensueño",
    category: "castillos-toboganes",
    collectionName: "Dreamy Collection",
    subtitle: "Dreamy Collection · Doble deslizador y piscina de pelotas",
    description:
      "Un tobogán gigante en tonos pastel que invita a los niños a saltar, deslizarse y jugar sin parar. Cuenta con dos amplios deslizadores y una piscina de pelotas que hace de cada bajada una aventura llena de risas y diversión. ¡Perfecto para fiestas, cumpleaños y eventos al aire libre!",
    image: "/images/catalogo/tobogan-de-ensueno.webp",
    price: "S/ 600",
    variantLabel: "Medida y Tiempo",
    sizeOptions: [
      { id: "7x6m-5h", label: "7m × 6m · 5 Horas", price: "S/ 600", isDefault: true },
    ],
    cardTagsLabel: "Medidas",
    cardTags: ["7×6×5m", "5 hrs"],
    dimensions: "7.00 m (largo) × 6.00 m (ancho) × 5.00 m (alto)",
    ages: "Niños e infantiles",
    duration: "5 horas",
    mobility: "S/ 30.00",
    extraHour: "S/ 70.00",
    accent: "pink",
    isNew: true,
    bullets: [
      { emoji: "🛝", text: "Dos amplios toboganes deslizadores en tonos pastel" },
      { emoji: "⚪", text: "Gran piscina de pelotas en la zona de caída" },
      { emoji: "🪜", text: "Escalera central acolchada de fácil ascenso" },
      { emoji: "☀️", text: "Ideal para fiestas y cumpleaños al aire libre" },
      { emoji: "⏱️", text: "Incluye 5 horas de alquiler y 1 personal de apoyo" },
    ],
    includedCards: [
      {
        title: "Tobogán Doble Pastel",
        description: "Estructura gigante de 7m × 6m × 5m con escalera central y dos carriles de bajada.",
        blobColor: "#FCE9EE",
      },
      {
        title: "Gran Piscina de Pelotas",
        description: "Amplia zona de recepción llena de pelotas pastel para un aterrizaje divertido y seguro.",
        blobColor: "#E3F3F9",
      },
      {
        title: "1 Personal de Apoyo",
        description: "Operador incluido durante las 5 horas del servicio para asistir a los niños.",
        blobColor: "#EAECF7",
      },
      {
        title: "Instalación Completa",
        description: "Armado anticipado, turbina de flujo continuo y desmontaje al finalizar el evento.",
        blobColor: "#E8F4FA",
      },
    ],
  },
  {
    slug: "castillo-de-ensueno",
    title: "Castillo de Ensueño",
    category: "castillos-toboganes",
    collectionName: "Dreamy Collection",
    subtitle: "Dreamy Collection · Torres fortaleza y tobogán pastel",
    description:
      "Un divertido castillo inflable que invita a saltar, deslizarse y explorar sin parar. Con su tobogán integrado, arco de entrada y torres encantadoras en tonos pastel, se convierte en el escenario perfecto para vivir momentos llenos de alegría y risas.",
    image: "/images/catalogo/castillo-de-ensueno.webp",
    price: "S/ 600",
    variantLabel: "Medida y Tiempo",
    sizeOptions: [
      { id: "7x5.5m-5h", label: "7m × 5.5m · 5 Horas", price: "S/ 600", isDefault: true },
    ],
    cardTagsLabel: "Medidas",
    cardTags: ["7×5.5×5.5m", "5 hrs"],
    dimensions: "7.00 m (largo) × 5.50 m (ancho) × 5.50 m (alto)",
    ages: "Niños e infantiles",
    duration: "5 horas",
    mobility: "S/ 30.00",
    extraHour: "S/ 70.00",
    accent: "lavender",
    isNew: true,
    bullets: [
      { emoji: "🏰", text: "Torres estilo fortaleza en paleta pastel multicolor" },
      { emoji: "🤸", text: "Zona de salto amplia con mallas laterales" },
      { emoji: "🛝", text: "Doble tobogán integrado en la parte superior" },
      { emoji: "✨", text: "Arco de entrada acolchado con rampa de acceso" },
      { emoji: "⏱️", text: "5 horas de diversión + 1 personal de apoyo" },
    ],
    includedCards: [
      {
        title: "Castillo de Ensueño",
        description: "Inflable pastel de 7.00m × 5.50m × 5.50m con arco de entrada, zona de salto y tobogán.",
        blobColor: "#EAECF7",
      },
      {
        title: "1 Personal de Apoyo",
        description: "Acompañamiento durante las 5 horas del evento para el cuidado y orden de los niños.",
        blobColor: "#FCE9EE",
      },
      {
        title: "Turbina y Anclaje",
        description: "Equipos de inflado continuo y sujeción segura para jardín o superficie plana.",
        blobColor: "#E3F3F9",
      },
      {
        title: "Montaje y Limpieza",
        description: "Instalación puntual previa al inicio de tu celebración y desinfección garantizada.",
        blobColor: "#E8F4FA",
      },
    ],
  },
  {
    slug: "mega-circuito-encanto",
    title: "Mega Circuito Encanto",
    category: "castillos-toboganes",
    collectionName: "Dreamy Collection",
    subtitle: "Dreamy Collection · Circuito de 10 metros en tonos pastel",
    description:
      "Un increíble circuito inflable que combina obstáculos, túneles, escalada y gran resbalón para una experiencia completa de diversión. Sus colores pastel y diseño de castillo lo hacen perfecto para transformar cualquier evento en una aventura mágica.",
    image: "/images/catalogo/mega-circuito-encanto.webp",
    price: "S/ 650",
    variantLabel: "Medida y Tiempo",
    sizeOptions: [
      { id: "10x3m-5h", label: "10m × 3m · 5 Horas", price: "S/ 650", isDefault: true },
    ],
    cardTagsLabel: "Medidas",
    cardTags: ["10×3×3.3m", "5 hrs"],
    dimensions: "10.00 m (largo) × 3.00 m (ancho) × 3.30 m (alto)",
    ages: "Niños y cumpleaños infantiles",
    duration: "5 horas",
    mobility: "S/ 30.00",
    extraHour: "S/ 70.00",
    accent: "lavender",
    isNew: true,
    bullets: [
      { emoji: "🏃", text: "10 metros de recorrido con área de obstáculos pastel" },
      { emoji: "⭕", text: "Túneles de ingreso y diversión interactiva" },
      { emoji: "🧗", text: "Zona de escalada interior segura" },
      { emoji: "🛝", text: "Gran resbalón final acolchado" },
      { emoji: "⏱️", text: "Alquiler por 5 horas con 1 personal de apoyo" },
    ],
    includedCards: [
      {
        title: "Mega Circuito Pastel (10m)",
        description: "Circuito inflable de 10m × 3m × 3.3m con túneles, obstáculos, escalada y tobogán.",
        blobColor: "#EAECF7",
      },
      {
        title: "1 Personal de Apoyo",
        description: "Asistencia permanente durante las 5 horas para guiar el ingreso por turnos.",
        blobColor: "#E3F3F9",
      },
      {
        title: "Turbina de Alta Potencia",
        description: "Motor eléctrico de flujo continuo para mantener el circuito firme en todo momento.",
        blobColor: "#FCE9EE",
      },
      {
        title: "Instalación y Desinfección",
        description: "Armado profesional anticipado en tu evento y retiro puntual al finalizar.",
        blobColor: "#E8F4FA",
      },
    ],
  },
  {
    slug: "castillo-con-piscina-de-pelotas",
    title: "Castillo Inflable con Piscina de Pelotas",
    category: "castillos-toboganes",
    collectionName: "White Trend",
    subtitle: "White Trend · Castillo blanco 3×3m + globos y pelotas",
    description:
      "Nuestro Castillo Inflable blanco tiene múltiples usos. Se puede utilizar como área de juegos para niños, decoración de fiestas temáticas, sesión de fotos, revelación de género, bodas, fiestas y eventos corporativos para proporcionar diversión y emoción sin fin. Incluye pelotas de colores y una pequeña decoración con globos según la temática de la fiesta.",
    image: "/images/catalogo/castillo-con-piscina-de-pelotas.webp",
    price: "S/ 350",
    variantLabel: "Medida y Tiempo",
    sizeOptions: [
      { id: "3x3m-5h", label: "3m × 3m · 5 Horas", price: "S/ 350", isDefault: true },
    ],
    cardTagsLabel: "Medidas",
    cardTags: ["3×3m", "5 hrs"],
    dimensions: "3.00 m × 3.00 m",
    ages: "0 a 6 años",
    duration: "5 horas",
    mobility: "S/ 30.00",
    extraHour: "S/ 50.00",
    accent: "blue",
    bullets: [
      { emoji: "🤍", text: "Diseño White Trend 3m × 3m ideal para fiestas temáticas" },
      { emoji: "⚪", text: "Incluye piscina frontal con pelotas de colores" },
      { emoji: "🎈", text: "Incluye pequeña decoración con globos según temática" },
      { emoji: "📸", text: "Perfecto para cumpleaños, bodas y revelación de género" },
      { emoji: "⏱️", text: "5 horas de alquiler con 1 personal de apoyo" },
    ],
    includedCards: [
      {
        title: "Castillo Blanco 3×3m",
        description: "Castillo de rebote blanco con piscina frontal integrada para eventos elegantes.",
        blobColor: "#E3F3F9",
      },
      {
        title: "Pelotas de Colores",
        description: "Relleno de pelotas suaves para la piscina frontal del castillo.",
        blobColor: "#FCE9EE",
      },
      {
        title: "Decoración con Globos",
        description: "Incluye una pequeña guirnalda de globos personalizada según la temática de tu fiesta.",
        blobColor: "#EAECF7",
      },
      {
        title: "1 Personal + Instalación",
        description: "Montaje, desinfección y 1 personal de apoyo durante las 5 horas del servicio.",
        blobColor: "#E8F4FA",
      },
    ],
  },
  {
    slug: "castillo-blanco-con-tobogan",
    title: "Castillo Blanco con Tobogán",
    category: "castillos-toboganes",
    collectionName: "White Trend",
    subtitle: "White Trend · Castillo blanco 3.5×3.5m + decoración globos",
    description:
      "Nuestro divertido Castillo de rebote inflable blanco para niños brinda entretenimiento sin fin y fomenta el juego imaginativo activo para niños (edad sugerida: de 0 a 6 años). ¡El tobogán solo aumenta la diversión! Incluye una pequeña decoración con globos según la temática de la fiesta.",
    image: "/images/catalogo/castillo-blanco-con-tobogan.webp",
    price: "S/ 350",
    variantLabel: "Medida y Tiempo",
    sizeOptions: [
      { id: "3.5x3.5m-5h", label: "3.5m × 3.5m · 5 Horas", price: "S/ 350", isDefault: true },
    ],
    cardTagsLabel: "Medidas",
    cardTags: ["3.5×3.5m", "0 a 6 años"],
    dimensions: "3.50 m (largo) × 3.50 m (ancho)",
    ages: "De 0 a 6 años",
    duration: "5 horas",
    mobility: "S/ 30.00",
    extraHour: "S/ 50.00",
    accent: "blue",
    bullets: [
      { emoji: "🏰", text: "Castillo blanco de 3.5m × 3.5m con torres clásicas" },
      { emoji: "🛝", text: "Resbaladera blanca integrada hacia la salida" },
      { emoji: "🎈", text: "Incluye pequeña decoración con globos según temática" },
      { emoji: "👶", text: "Edad recomendada de 0 a 6 años" },
      { emoji: "⏱️", text: "5 horas de alquiler + 1 personal de apoyo" },
    ],
    includedCards: [
      {
        title: "Castillo Blanco 3.5×3.5m",
        description: "Área de rebote amplia con tobogán integrado en acabado blanco mate estética White Trend.",
        blobColor: "#E3F3F9",
      },
      {
        title: "Decoración con Globos",
        description: "Pequeño arreglo de globos incluido en los colores de la temática de tu celebración.",
        blobColor: "#FCE9EE",
      },
      {
        title: "1 Personal de Apoyo",
        description: "Supervisión y apoyo durante las 5 horas de duración del alquiler.",
        blobColor: "#EAECF7",
      },
      {
        title: "Armado y Desinfección",
        description: "Instalación profesional, turbina eléctrica y limpieza previa garantizada.",
        blobColor: "#E8F4FA",
      },
    ],
  },
  {
    slug: "inflable-obstaculos",
    title: "Inflable Obstáculos Blanco",
    category: "castillos-toboganes",
    collectionName: "White Trend",
    subtitle: "White Trend · Circuito gigante 9×4m con piscina de pelotas",
    description:
      "Diversión asegurada con este inflable gigante que combina escalada, recorrido de obstáculos y un súper resbalón que termina en piscina de pelotas. Ideal para niños con mucha energía, perfecto para cumpleaños, eventos y todo tipo de celebraciones.",
    image: "/images/catalogo/inflable-obstaculos-blanco.webp",
    price: "S/ 500",
    variantLabel: "Medida y Tiempo",
    sizeOptions: [
      { id: "9x4m-5h", label: "9m × 4m · 5 Horas", price: "S/ 500", isDefault: true },
    ],
    cardTagsLabel: "Medidas",
    cardTags: ["9×4m", "5 hrs"],
    dimensions: "9.00 m (largo) × 4.00 m (ancho)",
    ages: "Niños e infantiles",
    duration: "5 horas",
    mobility: "S/ 50.00",
    extraHour: "S/ 50.00",
    accent: "blue",
    bullets: [
      { emoji: "🤍", text: "Circuito gigante blanco de 9m de largo × 4m de ancho" },
      { emoji: "🧗", text: "Combina zona de escalada y recorrido de obstáculos" },
      { emoji: "🛝", text: "Súper resbalón que termina en piscina de pelotas" },
      { emoji: "🎉", text: "Ideal para cumpleaños y celebraciones al aire libre" },
      { emoji: "⏱️", text: "Alquiler por 5 horas + 1 personal de apoyo" },
    ],
    includedCards: [
      {
        title: "Circuito Blanco 9×4m",
        description: "Inflable gigante con túneles, obstáculos, zona de escalada y tobogán.",
        blobColor: "#E3F3F9",
      },
      {
        title: "Piscina de Pelotas Final",
        description: "Zona de caída integrada con pelotas para un aterrizaje seguro y divertido.",
        blobColor: "#FCE9EE",
      },
      {
        title: "1 Personal de Apoyo",
        description: "Operador presente durante las 5 horas del evento para asistir a los niños.",
        blobColor: "#EAECF7",
      },
      {
        title: "Montaje y Desmontaje",
        description: "Instalación técnica completa, turbina eléctrica y limpieza en sitio.",
        blobColor: "#E8F4FA",
      },
    ],
  },
  {
    slug: "castillo-3-en-1",
    title: "Castillo 3 en 1",
    category: "castillos-toboganes",
    collectionName: "Diversión a Color",
    subtitle: "Diversión a Color · Saltarín, tobogán y piscina de pelotas",
    description:
      "Castillo con tobogán y piscina de pelotas en donde los pequeños se divertirán sin parar. Diseñado especialmente para niños de 0 a 5 años con dimensiones prácticas para casa o jardín.",
    image: "/images/catalogo/castillo-3-en-1.webp",
    price: "S/ 300",
    variantLabel: "Medida y Tiempo",
    sizeOptions: [
      { id: "3x4m-5h", label: "3m × 4m · 5 Horas", price: "S/ 300", isDefault: true },
    ],
    cardTagsLabel: "Medidas",
    cardTags: ["3×4×2.5m", "0 a 5 años"],
    dimensions: "3.00 m (largo) × 4.00 m (ancho) × 2.50 m (alto)",
    ages: "De 0 a 5 años",
    duration: "5 horas",
    mobility: "S/ 30.00",
    extraHour: "S/ 50.00",
    accent: "blue",
    bullets: [
      { emoji: "🏰", text: "3 actividades en 1: zona de salto, tobogán y piscina" },
      { emoji: "👶", text: "Edad recomendada de 0 a 5 años" },
      { emoji: "📐", text: "Medidas compactas: 3m largo × 4m ancho × 2.5m alto" },
      { emoji: "⚪", text: "Incluye pelotas de colores en la piscina lateral" },
      { emoji: "⏱️", text: "5 horas de alquiler con 1 personal de apoyo" },
    ],
    includedCards: [
      {
        title: "Castillo 3 en 1 (3×4m)",
        description: "Inflable multicolor con área de salto, resbaladera y piscina de pelotas integrada.",
        blobColor: "#E3F3F9",
      },
      {
        title: "Pelotas de Colores",
        description: "Pelotas plásticas incluidas para el área de piscina del inflable.",
        blobColor: "#FCE9EE",
      },
      {
        title: "1 Personal de Apoyo",
        description: "Acompañamiento durante las 5 horas de alquiler para supervisar a los pequeños.",
        blobColor: "#EAECF7",
      },
      {
        title: "Instalación y Turbina",
        description: "Armado en tu locación, motor eléctrico continuo y desinfección previa.",
        blobColor: "#E8F4FA",
      },
    ],
  },
  {
    slug: "bloques-a-tu-medida",
    title: "Bloques a tu Medida",
    category: "castillos-toboganes",
    collectionName: "Diversión a Color",
    subtitle: "Diversión a Color · Tobogán y obstáculos tipo bloques (5×5m)",
    description:
      "Nuestro inflable de bloques es perfecto para adaptarse a espacios grandes y pequeños, tiene un divertido tobogán y zona de obstáculos que harán más divertido tu evento. Recomendado para niños de 0 a 7 años.",
    image: "/images/catalogo/bloques-a-tu-medida.webp",
    price: "S/ 350",
    variantLabel: "Medida y Tiempo",
    sizeOptions: [
      { id: "5x5m-5h", label: "5m × 5m · 5 Horas", price: "S/ 350", isDefault: true },
    ],
    cardTagsLabel: "Medidas",
    cardTags: ["5×5×4.2m", "0 a 7 años"],
    dimensions: "5.00 m (largo) × 5.00 m (ancho) × 4.20 m (alto)",
    ages: "De 0 a 7 años",
    duration: "5 horas",
    mobility: "S/ 30.00",
    extraHour: "S/ 50.00",
    accent: "pink",
    bullets: [
      { emoji: "🧱", text: "Diseño temático de bloques multicolores de 5m × 5m" },
      { emoji: "🛝", text: "Tobogán lateral integrado y escalera de ascenso" },
      { emoji: "🤸", text: "Zona interior de salto con obstáculos acolchados" },
      { emoji: "🧒", text: "Ideal para niños de 0 a 7 años" },
      { emoji: "⏱️", text: "5 horas de servicio + 1 personal de apoyo" },
    ],
    includedCards: [
      {
        title: "Inflable Bloques 5×5m",
        description: "Castillo multicolor de 5m × 5m × 4.2m con obstáculos interiores y resbaladera.",
        blobColor: "#FCE9EE",
      },
      {
        title: "1 Personal de Apoyo",
        description: "Personal presente durante las 5 horas para velar por el orden y seguridad.",
        blobColor: "#E3F3F9",
      },
      {
        title: "Turbina y Sujeción",
        description: "Motor eléctrico de inflado continuo y anclajes seguros para el evento.",
        blobColor: "#EAECF7",
      },
      {
        title: "Montaje y Desinfección",
        description: "Instalación anticipada y limpieza completa antes del ingreso de los niños.",
        blobColor: "#E8F4FA",
      },
    ],
  },
  {
    slug: "super-slide",
    title: "Super Slide",
    category: "castillos-toboganes",
    collectionName: "Diversión a Color",
    subtitle: "Diversión a Color · Tobogán clásico de 7 metros de largo",
    description:
      "Sus invitados experimentarán la emoción mientras se deslizan por 5 metros de diversión inflable. Este tobogán inflable clásico es ideal para niños de hasta 12 años. Cuenta con una escalera para subir a la cima y una cubierta de malla superior para mantener seguros a los invitados.",
    image: "/images/catalogo/super-slide.webp",
    price: "S/ 350",
    variantLabel: "Medida y Tiempo",
    sizeOptions: [
      { id: "7x4m-5h", label: "7m × 4m · 5 Horas", price: "S/ 350", isDefault: true },
    ],
    cardTagsLabel: "Medidas",
    cardTags: ["7×4×5m", "Hasta 12 años"],
    dimensions: "7.00 m (largo) × 4.00 m (ancho) × 5.00 m (alto)",
    ages: "Hasta 12 años",
    duration: "5 horas",
    mobility: "S/ 30.00",
    extraHour: "S/ 50.00",
    accent: "blue",
    bullets: [
      { emoji: "🛝", text: "Gran tobogán inflable de 7m de largo × 5m de alto" },
      { emoji: "🪜", text: "Escalera acolchada de ascenso seguro" },
      { emoji: "🛡️", text: "Cubierta superior de malla protectora en la cima" },
      { emoji: "👦", text: "Ideal para niños de hasta 12 años" },
      { emoji: "⏱️", text: "5 horas de alquiler + 1 personal de apoyo" },
    ],
    includedCards: [
      {
        title: "Tobogán Super Slide",
        description: "Tobogán inflable de 7m × 4m × 5m con escalera lateral, carril de deslizamiento y malla superior.",
        blobColor: "#E3F3F9",
      },
      {
        title: "1 Personal de Apoyo",
        description: "Asistencia permanente durante las 5 horas del evento para coordinar los turnos de bajada.",
        blobColor: "#FCE9EE",
      },
      {
        title: "Equipo de Inflado",
        description: "Turbina eléctrica de alta potencia y anclajes de estabilidad.",
        blobColor: "#EAECF7",
      },
      {
        title: "Instalación y Limpieza",
        description: "Armado completo antes de tu celebración, desinfección y desmontaje.",
        blobColor: "#E8F4FA",
      },
    ],
  },
  {
    slug: "tobogan-inflable-con-obstaculos",
    title: "Tobogán Inflable con Obstáculos Divertidos",
    category: "castillos-toboganes",
    collectionName: "Diversión a Color",
    subtitle: "Diversión a Color · Tobogán + circuito de túneles (6×5.5m)",
    description:
      "Nuestro Tobogán Inflable es perfecto para tu fiesta ya que es versátil para cada edad hasta los 12 años; tiene un divertido tobogán que lleva a la zona de obstáculos y túneles en donde se divierten los más pequeños también.",
    image: "/images/catalogo/tobogan-inflable-con-obstaculos.webp",
    price: "S/ 380",
    variantLabel: "Medida y Tiempo",
    sizeOptions: [
      { id: "6x5.5m-5h", label: "6m × 5.5m · 5 Horas", price: "S/ 380", isDefault: true },
    ],
    cardTagsLabel: "Medidas",
    cardTags: ["6×5.5×4.5m", "Hasta 12 años"],
    dimensions: "6.00 m (largo) × 5.50 m (ancho) × 4.50 m (alto)",
    ages: "Hasta 12 años",
    duration: "5 horas",
    mobility: "S/ 30.00",
    extraHour: "S/ 50.00",
    accent: "lavender",
    bullets: [
      { emoji: "🛝", text: "Tobogán alto conectado a circuito de obstáculos" },
      { emoji: "⭕", text: "Túneles y figuras inflables para saltar y esquivar" },
      { emoji: "👧", text: "Versátil para niños pequeños y grandes hasta 12 años" },
      { emoji: "📐", text: "Dimensiones amplias: 6m largo × 5.5m ancho × 4.5m alto" },
      { emoji: "⏱️", text: "5 horas de alquiler + 1 personal de apoyo" },
    ],
    includedCards: [
      {
        title: "Tobogán con Obstáculos",
        description: "Estructura combinada de 6m × 5.5m × 4.5m con resbaladera alta, túneles y obstáculos.",
        blobColor: "#EAECF7",
      },
      {
        title: "1 Personal de Apoyo",
        description: "Operador incluido durante las 5 horas de evento para supervisar el juego.",
        blobColor: "#E3F3F9",
      },
      {
        title: "Turbina y Anclaje",
        description: "Motor eléctrico continuo y sistema de fijación segura en piso o césped.",
        blobColor: "#FCE9EE",
      },
      {
        title: "Montaje y Desinfección",
        description: "Armado puntual en la locación e higienización completa de la superficie.",
        blobColor: "#E8F4FA",
      },
    ],
  },
  {
    slug: "tobogan-inflable-de-bloques",
    title: "Tobogán Inflable de Bloques",
    category: "castillos-toboganes",
    collectionName: "Diversión a Color",
    subtitle: "Diversión a Color · Doble carril, trampolín y bloques (7×5.5m)",
    description:
      "Nuestro Tobogán inflable de bloques cuenta con obstáculos divertidos, escalones, trampolín y colores brillantes. Definitivamente, un inflable novedoso que será la atracción principal de tu fiesta.",
    image: "/images/catalogo/tobogan-inflable-de-bloques.webp",
    price: "S/ 450",
    variantLabel: "Medida y Tiempo",
    sizeOptions: [
      { id: "7x5.5m-5h", label: "7m × 5.5m · 5 Horas", price: "S/ 450", isDefault: true },
    ],
    cardTagsLabel: "Medidas",
    cardTags: ["7×5.5×5.5m", "5 hrs"],
    dimensions: "7.00 m (largo) × 5.50 m (ancho) × 5.50 m (alto)",
    ages: "Niños e infantiles",
    duration: "5 horas",
    mobility: "S/ 30.00",
    extraHour: "S/ 50.00",
    accent: "pink",
    bullets: [
      { emoji: "🧱", text: "Diseño de bloques gigantes en colores brillantes" },
      { emoji: "🛝", text: "Doble tobogán elevado con escalones centrales" },
      { emoji: "🤸", text: "Zona de trampolín y obstáculos divertidos" },
      { emoji: "📐", text: "Gran formato: 7.00m largo × 5.50m ancho × 5.50m alto" },
      { emoji: "⏱️", text: "5 horas de alquiler + 1 personal de apoyo" },
    ],
    includedCards: [
      {
        title: "Tobogán de Bloques 7×5.5m",
        description: "Castillo y tobogán doble estilo bloques con arco de entrada y área de obstáculos.",
        blobColor: "#FCE9EE",
      },
      {
        title: "1 Personal de Apoyo",
        description: "Supervisión durante las 5 horas del evento para un juego ordenado y seguro.",
        blobColor: "#E3F3F9",
      },
      {
        title: "Turbina Eléctrica",
        description: "Motor de inflado continuo de alto caudal para estructuras grandes.",
        blobColor: "#EAECF7",
      },
      {
        title: "Armado y Desinfección",
        description: "Instalación anticipada, limpieza completa y retiro al finalizar el evento.",
        blobColor: "#E8F4FA",
      },
    ],
  },
  {
    slug: "lego-en-accion",
    title: "Lego en Acción",
    category: "castillos-toboganes",
    collectionName: "Diversión a Color",
    subtitle: "Diversión a Color · Circuito gigante 9×4m para 0 a 13 años",
    description:
      "Nuestro inflable Lego en Acción es perfecto para niños de 0 a 13 años; tiene zona de obstáculos, túneles, toboganes y más en una estructura de 9 metros de largo. ¡Diversión asegurada!",
    image: "/images/catalogo/lego-en-accion.webp",
    price: "S/ 480",
    variantLabel: "Medida y Tiempo",
    sizeOptions: [
      { id: "9x4m-5h", label: "9m × 4m · 5 Horas", price: "S/ 480", isDefault: true },
    ],
    cardTagsLabel: "Medidas",
    cardTags: ["9×4×4.5m", "0 a 13 años"],
    dimensions: "9.00 m (largo) × 4.00 m (ancho) × 4.50 m (alto)",
    ages: "De 0 a 13 años",
    duration: "5 horas",
    mobility: "S/ 30.00",
    extraHour: "S/ 50.00",
    accent: "blue",
    bullets: [
      { emoji: "🧱", text: "Gran circuito temático tipo Lego de 9m × 4m × 4.5m" },
      { emoji: "🛝", text: "Tobogán elevado, arcos, túneles y zona de obstáculos" },
      { emoji: "👦", text: "Amplio rango de edad: de 0 a 13 años" },
      { emoji: "🎉", text: "Ideal para cumpleaños grandes, colegios y eventos" },
      { emoji: "⏱️", text: "5 horas de alquiler + 1 personal de apoyo" },
    ],
    includedCards: [
      {
        title: "Circuito Lego en Acción",
        description: "Inflable de 9m × 4m × 4.5m con arcos, obstáculos internos y gran tobogán.",
        blobColor: "#E3F3F9",
      },
      {
        title: "1 Personal de Apoyo",
        description: "Asistencia permanente durante las 5 horas de alquiler.",
        blobColor: "#FCE9EE",
      },
      {
        title: "Equipos de Inflado",
        description: "Turbina eléctrica industrial y sistema de anclaje perimetral.",
        blobColor: "#EAECF7",
      },
      {
        title: "Instalación y Limpieza",
        description: "Montaje completo en la locación y sanitización previa al evento.",
        blobColor: "#E8F4FA",
      },
    ],
  },
  {
    slug: "carrera-de-obstaculos",
    title: "Carrera de Obstáculos",
    category: "castillos-toboganes",
    collectionName: "Diversión a Color",
    subtitle: "Diversión a Color · Pista de obstáculos y tobogán (9×3m)",
    description:
      "Nuestro Inflable «Carrera de Obstáculos» es la atracción perfecta para que los niños disfruten al máximo. Con un diseño divertido y seguro de 9 metros de largo, es ideal para niños de 0 a 10 años y convierte cualquier evento en una experiencia inolvidable.",
    image: "/images/catalogo/carrera-de-obstaculos.webp",
    price: "S/ 480",
    variantLabel: "Medida y Tiempo",
    sizeOptions: [
      { id: "9x3m-5h", label: "9m × 3m · 5 Horas", price: "S/ 480", isDefault: true },
    ],
    cardTagsLabel: "Medidas",
    cardTags: ["9×3×3m", "0 a 10 años"],
    dimensions: "9.00 m (largo) × 3.00 m (ancho) × 3.00 m (alto)",
    ages: "De 0 a 10 años",
    duration: "5 horas",
    mobility: "S/ 30.00",
    extraHour: "S/ 50.00",
    accent: "lavender",
    bullets: [
      { emoji: "🏁", text: "Pista de 9m de largo × 3m de ancho × 3m de alto" },
      { emoji: "🥊", text: "Esferas colgantes, pilares inflables y aros de paso" },
      { emoji: "🛝", text: "Rampa de escalada y resbaladera final" },
      { emoji: "🧒", text: "Ideal para niños de 0 a 10 años" },
      { emoji: "⏱️", text: "5 horas de alquiler + 1 personal de apoyo" },
    ],
    includedCards: [
      {
        title: "Carrera de Obstáculos (9m)",
        description: "Circuito inflable de 9m × 3m × 3m con desafíos internos y tobogán.",
        blobColor: "#EAECF7",
      },
      {
        title: "1 Personal de Apoyo",
        description: "Operador encargado de organizar el ingreso y cuidar a los participantes.",
        blobColor: "#E3F3F9",
      },
      {
        title: "Turbina y Fijación",
        description: "Motor eléctrico de flujo constante y anclajes de seguridad.",
        blobColor: "#FCE9EE",
      },
      {
        title: "Montaje y Desinfección",
        description: "Armado puntual antes del evento y limpieza integral.",
        blobColor: "#E8F4FA",
      },
    ],
  },
  {
    slug: "gran-carrera-de-obstaculos",
    title: "Gran Carrera de Obstáculos",
    category: "castillos-toboganes",
    collectionName: "Diversión a Color",
    subtitle: "Diversión a Color · Circuito extremo de 15 metros (Niños y adultos)",
    description:
      "¡El inflable perfecto para la competición y diversión en tus eventos! Con 15 metros de largo, cuenta con varios desafíos como zona de obstáculos, muro de escalada, túneles y tobogán. ¡Diversión garantizada para niños y adultos!",
    image: "/images/catalogo/gran-carrera-de-obstaculos.webp",
    price: "S/ 550",
    variantLabel: "Medida y Tiempo",
    sizeOptions: [
      { id: "15x3.6m-5h", label: "15m × 3.6m · 5 Horas", price: "S/ 550", isDefault: true },
    ],
    cardTagsLabel: "Medidas",
    cardTags: ["15×3.6×4.5m", "Niños y adultos"],
    dimensions: "15.00 m (largo) × 3.60 m (ancho) × 4.50 m (alto)",
    ages: "Niños, jóvenes y adultos",
    duration: "5 horas",
    mobility: "S/ 30.00",
    extraHour: "S/ 50.00",
    accent: "blue",
    isFeatured: true,
    bullets: [
      { emoji: "🏆", text: "Pista gigante de competición de 15 metros de largo" },
      { emoji: "🧗", text: "Doble túnel de entrada, obstáculos, muro de escalada y tobogán" },
      { emoji: "🙌", text: "Apto para competencias entre niños y adultos" },
      { emoji: "🏫", text: "Excelente para colegios, kermeses y eventos familiares" },
      { emoji: "⏱️", text: "5 horas de alquiler + 1 personal de apoyo" },
    ],
    includedCards: [
      {
        title: "Gran Carrera (15 Metros)",
        description: "Circuito monumental de 15m × 3.6m × 4.5m con doble carril de competencia y tobogán.",
        blobColor: "#E3F3F9",
      },
      {
        title: "1 Personal de Apoyo",
        description: "Supervisión durante las 5 horas del evento para coordinar las carreras.",
        blobColor: "#FCE9EE",
      },
      {
        title: "Sistema de Inflado Dual",
        description: "Turbinas de alta capacidad y anclajes reforzados para exteriores.",
        blobColor: "#EAECF7",
      },
      {
        title: "Instalación y Retiro",
        description: "Montaje completo anticipado, desinfección y desmontaje final.",
        blobColor: "#E8F4FA",
      },
    ],
  },
  {
    slug: "mega-slide",
    title: "Mega Slide",
    category: "castillos-toboganes",
    collectionName: "Diversión a Color",
    subtitle: "Diversión a Color · Doble tobogán de 7m de alto en 3 tiempos",
    description:
      "Lindo inflable de colores de gran formato: tiene dos toboganes llenos de diversión con caída emocionante en tres tiempos. Diseñado con máxima resistencia tanto para niños como para adultos.",
    image: "/images/catalogo/mega-slide.webp",
    price: "S/ 650",
    variantLabel: "Medida y Tiempo",
    sizeOptions: [
      { id: "10x6m-5h", label: "10m × 6m × 7m · 5 Horas", price: "S/ 650", isDefault: true },
    ],
    cardTagsLabel: "Medidas",
    cardTags: ["10×6×7m", "Niños y adultos"],
    dimensions: "10.00 m (largo) × 6.00 m (ancho) × 7.00 m (alto)",
    ages: "Niños y adultos",
    duration: "5 horas",
    mobility: "S/ 30.00",
    extraHour: "S/ 50.00",
    accent: "pink",
    isFeatured: true,
    bullets: [
      { emoji: "🎢", text: "Doble tobogán gigante con caída en tres tiempos" },
      { emoji: "📐", text: "Dimensiones imponentes: 10m largo × 6m ancho × 7m alto" },
      { emoji: "🙌", text: "Apto para niños y adultos" },
      { emoji: "🪜", text: "Doble escalera lateral acolchada con arcos de seguridad" },
      { emoji: "⏱️", text: "5 horas de alquiler + 1 personal de apoyo" },
    ],
    includedCards: [
      {
        title: "Tobogán Mega Slide (7m alto)",
        description: "Estructura gigante de 10m × 6m × 7m con dos carriles de caída en tres tiempos.",
        blobColor: "#FCE9EE",
      },
      {
        title: "1 Personal de Apoyo",
        description: "Operador permanente durante las 5 horas para controlar el ascenso y descenso.",
        blobColor: "#E3F3F9",
      },
      {
        title: "Turbina Industrial",
        description: "Equipo de inflado de alta potencia y anclajes de máxima seguridad.",
        blobColor: "#EAECF7",
      },
      {
        title: "Armado y Desmontaje",
        description: "Instalación profesional en tu evento y retiro puntual al concluir.",
        blobColor: "#E8F4FA",
      },
    ],
  },

  // ===========================================================================
  // 2. INFLABLES ACUÁTICOS (3 PRODUCTOS)
  // ===========================================================================
  {
    slug: "aquaroller",
    title: "Aquaroller",
    category: "inflables-acuaticos",
    collectionName: "Diversión Acuática",
    subtitle: "Diversión Acuática · Piscina 6×6m + 2 rodillos gigantes + Staff",
    description:
      "El Aquaroller es una divertida atracción inflable en donde niños o adultos giran dentro del rodillo transparente sobre nuestra piscina inflable de 6×6 metros. Sin duda una experiencia refrescante que no olvidarán.",
    image: "/images/catalogo/aquaroller.webp",
    price: "S/ 800",
    variantLabel: "Medida y Tiempo",
    sizeOptions: [
      { id: "6x6m-5h", label: "Piscina 6m × 6m · 5 Horas", price: "S/ 800", isDefault: true },
    ],
    cardTagsLabel: "Incluye",
    cardTags: ["6×6m", "2 Rodillos", "5 hrs"],
    dimensions: "6.00 m (largo) × 6.00 m (ancho)",
    ages: "Niños y adultos",
    duration: "5 horas",
    mobility: "S/ 30.00",
    extraHour: "S/ 50.00",
    accent: "blue",
    isFeatured: true,
    bullets: [
      { emoji: "🌊", text: "Piscina inflable perimetral de 6 × 6 metros" },
      { emoji: "🎡", text: "Incluye 2 rodillos inflables gigantes transparentes" },
      { emoji: "🙌", text: "Apto para niños y adultos" },
      { emoji: "🧑‍✈️", text: "Incluye Staff permanente durante todo el evento" },
      { emoji: "⏱️", text: "5 horas de diversión acuática garantizada" },
    ],
    includedCards: [
      {
        title: "Piscina Inflable 6×6m",
        description: "Piscina de alta resistencia de 6m × 6m para el desplazamiento seguro de los rodillos.",
        blobColor: "#E3F3F9",
      },
      {
        title: "2 Rodillos Aquaroller",
        description: "Dos cilindros inflables gigantes para girar y caminar sobre el agua sin mojarse.",
        blobColor: "#FCE9EE",
      },
      {
        title: "Staff Durante el Evento",
        description: "Personal a cargo durante las 5 horas para asistir el ingreso y salida de los participantes.",
        blobColor: "#EAECF7",
      },
      {
        title: "Montaje y Desmontaje",
        description: "Instalación completa de la piscina y los rodillos en tu locación.",
        blobColor: "#E8F4FA",
      },
    ],
  },
  {
    slug: "super-canon-de-espuma",
    title: "Super Cañón de Espuma",
    category: "inflables-acuaticos",
    collectionName: "Diversión Acuática",
    subtitle: "Diversión Acuática · Fiesta de espuma segura + Operador a cargo",
    description:
      "¡Nuestro cañón de espuma es la solución perfecta! Imagina un mar de espuma suave y esponjosa donde los niños puedan jugar, saltar y reír sin parar. La espuma que produce nuestra máquina es completamente segura para los niños. Ideal para cumpleaños, fiestas temáticas y eventos infantiles.",
    image: "/images/catalogo/canon-de-espuma.webp",
    price: "S/ 800",
    variantLabel: "Servicio",
    sizeOptions: [
      { id: "canon-5h", label: "Servicio Completo · Con Operador", price: "S/ 800", isDefault: true },
    ],
    cardTagsLabel: "Incluye",
    cardTags: ["Espuma segura", "Personal a cargo"],
    dimensions: "Alcance de disparo amplio para jardín o patio",
    ages: "Todas las edades (100% segura para niños)",
    duration: "5 horas",
    mobility: "S/ 30.00",
    accent: "blue",
    bullets: [
      { emoji: "🫧", text: "Genera un mar de espuma suave, densa y esponjosa" },
      { emoji: "🛡️", text: "Espuma hipoalergénica completamente segura para niños" },
      { emoji: "🧑‍🔧", text: "Incluye personal técnico a cargo de la operación" },
      { emoji: "🔧", text: "Incluye montaje y desmontaje completo del equipo" },
      { emoji: "🎉", text: "Ideal para cumpleaños de verano, colegios y fiestas temáticas" },
    ],
    includedCards: [
      {
        title: "Super Cañón de Espuma",
        description: "Máquina profesional lanzadora de espuma de alto rendimiento para exteriores.",
        blobColor: "#E3F3F9",
      },
      {
        title: "Espuma Segura Infantil",
        description: "Fórmula suave y segura para la piel y ojos de los niños.",
        blobColor: "#FCE9EE",
      },
      {
        title: "Personal a Cargo",
        description: "Operador especializado que maneja el cañón durante la dinámica de espuma.",
        blobColor: "#EAECF7",
      },
      {
        title: "Montaje y Desmontaje",
        description: "Instalación técnica previa y retiro completo del equipo al finalizar.",
        blobColor: "#E8F4FA",
      },
    ],
  },
  {
    slug: "piscina-con-botes-flotantes",
    title: "Piscina con Botes Flotantes",
    category: "inflables-acuaticos",
    collectionName: "Diversión Acuática",
    subtitle: "Diversión Acuática · Piscina inflable + 4 botes (niños y adultos)",
    description:
      "Diversión acuática para grandes y pequeños. Nuestra piscina inflable incluye 4 botes a pedal manual (2 botes para adultos y 2 botes para niños). Perfecta para cumpleaños, ferias, festivales y todo tipo de eventos donde quieras sorprender a tus invitados con una experiencia única y refrescante.",
    image: "/images/catalogo/piscina-con-botes.webp",
    price: "S/ 800",
    variantLabel: "Paquete y Tiempo",
    sizeOptions: [
      { id: "piscina-4-botes-5h", label: "Piscina + 4 Botes · 5 Horas", price: "S/ 800", isDefault: true },
    ],
    cardTagsLabel: "Incluye",
    cardTags: ["4 Botes", "Niños y adultos", "5 hrs"],
    dimensions: "Gran piscina inflable para 4 botes simultáneos",
    ages: "Niños y adultos",
    duration: "5 horas",
    mobility: "S/ 30.00",
    accent: "blue",
    bullets: [
      { emoji: "🚣", text: "Incluye 4 botes flotantes en total" },
      { emoji: "👨‍👧", text: "2 botes para adultos + 2 botes para niños" },
      { emoji: "🏊", text: "Gran piscina inflable de seguridad incluida" },
      { emoji: "🌞", text: "Perfecta para cumpleaños, ferias y festivales" },
      { emoji: "⏱️", text: "5 horas de alquiler + 1 personal de apoyo" },
    ],
    includedCards: [
      {
        title: "Piscina Inflable Gigante",
        description: "Piscina perimetral de alta resistencia para navegar con total seguridad.",
        blobColor: "#E3F3F9",
      },
      {
        title: "2 Botes para Niños",
        description: "Botes flotantes ergonómicos con ruedas de paletas laterales fáciles de impulsar.",
        blobColor: "#FCE9EE",
      },
      {
        title: "2 Botes para Adultos",
        description: "Botes de mayor capacidad para que los papás o jóvenes también participen.",
        blobColor: "#EAECF7",
      },
      {
        title: "Personal y Montaje",
        description: "Armado en locación y 1 personal de apoyo durante las 5 horas del evento.",
        blobColor: "#E8F4FA",
      },
    ],
  },

  // ===========================================================================
  // 3. JUEGOS Y ENTRETENIMIENTO (6 PRODUCTOS)
  // ===========================================================================
  {
    slug: "bubble-house",
    title: "Bubble House",
    category: "juegos-entretenimiento",
    collectionName: "Dreamy Collection",
    subtitle: "Dreamy / White Trend · Burbuja con globos en movimiento + arco",
    description:
      "Nuestra Bubble House es una burbuja inflable transparente en donde los invitados (niños y adultos) pueden jugar y divertirse con los globos que están en constante movimiento dentro de ella. ¡A los niños les encanta! Disponible en medidas de 3 metros y 4 metros.",
    image: "/images/catalogo/bubble-house.webp",
    price: "S/ 400",
    variantLabel: "Medida",
    sizeOptions: [
      { id: "3m-5h", label: "3 Metros · 5 Horas", price: "S/ 400", isDefault: true },
      { id: "4m-5h", label: "4 Metros · 5 Horas", price: "S/ 450" },
    ],
    cardTagsLabel: "Medidas",
    cardTags: ["3m (S/ 400)", "4m (S/ 450)"],
    dimensions: "Disponible en 3 metros o 4 metros de diámetro",
    ages: "Niños y adultos",
    duration: "5 horas",
    mobility: "S/ 30.00",
    accent: "pink",
    isFeatured: true,
    bullets: [
      { emoji: "🫧", text: "Burbuja transparente con globos en movimiento continuo" },
      { emoji: "🎈", text: "Globos interiores renovados permanentemente" },
      { emoji: "✨", text: "Incluye arco de globos decorativo externo" },
      { emoji: "🧑‍✈️", text: "Incluye Staff permanente durante las 5 horas del evento" },
      { emoji: "📐", text: "Disponible en 3 metros (S/ 400) y 4 metros (S/ 450)" },
    ],
    includedCards: [
      {
        title: "Domo Bubble House",
        description: "Burbuja transparente con túnel de ingreso acolchado en medida de 3m o 4m.",
        blobColor: "#FCE9EE",
      },
      {
        title: "Globos Internos + Arco Externo",
        description: "Incluye globos interiores en movimiento constante y arco de globos decorativo exterior.",
        blobColor: "#E3F3F9",
      },
      {
        title: "Staff Durante el Evento",
        description: "Operador permanente durante las 5 horas para asistir el ingreso a la burbuja.",
        blobColor: "#EAECF7",
      },
      {
        title: "Montaje y Desmontaje",
        description: "Instalación completa, inflado, decoración y retiro al finalizar la fiesta.",
        blobColor: "#E8F4FA",
      },
    ],
  },
  {
    slug: "soft-play",
    title: "Soft Play",
    category: "juegos-entretenimiento",
    collectionName: "Dreamy Collection",
    subtitle: "Dreamy / White Trend · Zona de estimulación temprana 3×4m",
    description:
      "Nuestro hermoso Soft Play está diseñado especialmente para los más pequeños, brindándoles un espacio seguro, colorido y lleno de diversión. Perfecto para estimular la imaginación y la motricidad mientras juegan en un circuito acolchado de 3m × 4m.",
    image: "/images/catalogo/soft-play.webp",
    price: "S/ 450",
    variantLabel: "Medida y Tiempo",
    sizeOptions: [
      { id: "3x4m-5h", label: "Circuito 3m × 4m · 5 Horas", price: "S/ 450", isDefault: true },
    ],
    cardTagsLabel: "Medida",
    cardTags: ["3×4m", "6 Estaciones", "5 hrs"],
    dimensions: "3.00 m × 4.00 m",
    ages: "Bebés y niños pequeños (Toddlers)",
    duration: "5 horas",
    mobility: "S/ 30.00",
    accent: "lavender",
    bullets: [
      { emoji: "⚪", text: "Incluye Mini piscina de pelotas acolchada" },
      { emoji: "🤸", text: "Incluye Mini trampolín y Balancín de espuma" },
      { emoji: "🧱", text: "Incluye 6 cubos didácticos acolchados" },
      { emoji: "🛝", text: "Incluye Mini escalera, resbaladera y circuito con aro de espuma" },
      { emoji: "📐", text: "Área segura de 3m × 4m por 5 horas de alquiler" },
    ],
    includedCards: [
      {
        title: "Mini Piscina + Mini Trampolín",
        description: "Piscina de pelotas suaves y mini cama saltarina adaptada para bebés y niños pequeños.",
        blobColor: "#EAECF7",
      },
      {
        title: "Escalera, Resbaladera y Aro",
        description: "Mini circuito psicomotriz con rampa, escalones y túnel con aro de espuma.",
        blobColor: "#FCE9EE",
      },
      {
        title: "Balancín + 6 Cubos de Espuma",
        description: "Piezas blandas para apilar, balancearse y estimular la motricidad con total seguridad.",
        blobColor: "#E3F3F9",
      },
      {
        title: "Pisos, Montaje y Limpieza",
        description: "Superficie acolchada de 3m × 4m, desinfección pieza por pieza y 1 personal de apoyo.",
        blobColor: "#E8F4FA",
      },
    ],
  },
  {
    slug: "piscina-inflable-de-pelotas",
    title: "Piscina Inflable de Pelotas",
    category: "juegos-entretenimiento",
    collectionName: "Dreamy Collection",
    subtitle: "Dreamy / White Trend · Piscina 3×3m segura y amplia",
    description:
      "La opción perfecta para que los niños disfruten de la diversión en un espacio seguro y amplio. Con su tamaño ideal de 3 × 3 metros, es perfecta para cumpleaños, reuniones y todo tipo de eventos infantiles.",
    image: "/images/catalogo/piscina-inflable-de-pelotas.webp",
    price: "S/ 340",
    variantLabel: "Medida y Tiempo",
    sizeOptions: [
      { id: "3x3m-5h", label: "3m × 3m · 5 Horas", price: "S/ 340", isDefault: true },
    ],
    cardTagsLabel: "Medidas",
    cardTags: ["3×3m", "5 hrs"],
    dimensions: "3.00 m × 3.00 m",
    ages: "Bebés y niños pequeños",
    duration: "5 horas",
    mobility: "S/ 30.00",
    accent: "pink",
    bullets: [
      { emoji: "⚪", text: "Amplia piscina de pelotas de 3 × 3 metros" },
      { emoji: "🛝", text: "Bordes acolchados seguros con mini resbaladera de ingreso" },
      { emoji: "👶", text: "Diversión 100% segura y visible para los más pequeños" },
      { emoji: "🎂", text: "Ideal para cumpleaños infantiles y reuniones familiares" },
      { emoji: "⏱️", text: "5 horas de alquiler + 1 personal de apoyo" },
    ],
    includedCards: [
      {
        title: "Piscina de Pelotas 3×3m",
        description: "Estructura blanca de 3m × 3m con bordes acolchados y resbaladera de acceso.",
        blobColor: "#FCE9EE",
      },
      {
        title: "Miles de Pelotas Suaves",
        description: "Relleno completo de pelotas limpias y desinfectadas para jugar sin parar.",
        blobColor: "#E3F3F9",
      },
      {
        title: "1 Personal de Apoyo",
        description: "Asistencia durante las 5 horas del servicio para mantener el orden y seguridad.",
        blobColor: "#EAECF7",
      },
      {
        title: "Instalación y Sanitización",
        description: "Montaje anticipado en casa o jardín y protocolo completo de limpieza.",
        blobColor: "#E8F4FA",
      },
    ],
  },
  {
    slug: "bumper-balls",
    title: "Bumper Balls",
    category: "juegos-entretenimiento",
    collectionName: "Diversión a Color",
    subtitle: "Diversión a Color · Pack de 2 pelotas inflables gigantes",
    description:
      "¡Diversión, adrenalina y risas aseguradas! Con nuestras Bumper Balls los niños y adultos pueden correr, chocar y rodar de manera segura dentro de estas pelotas inflables gigantes. Ideales para juegos en grupo, competencias y dinámicas divertidas en cualquier evento.",
    image: "/images/catalogo/bumper-balls.webp",
    price: "S/ 300",
    variantLabel: "Paquete y Tiempo",
    sizeOptions: [
      { id: "2-pelotas-5h", label: "2 Pelotas Bumper Balls · 5 Horas", price: "S/ 300", isDefault: true },
    ],
    cardTagsLabel: "Incluye",
    cardTags: ["2 Pelotas", "Niños y adultos", "5 hrs"],
    dimensions: "2 esferas inflables gigantes amortiguadas",
    ages: "Niños, jóvenes y adultos",
    duration: "5 horas",
    mobility: "S/ 30.00",
    accent: "blue",
    bullets: [
      { emoji: "⚽", text: "Incluye el alquiler de 2 pelotas Bumper Balls gigantes" },
      { emoji: "🛡️", text: "Arneses y agarraderas internas para chocar y rodar con seguridad" },
      { emoji: "🙌", text: "Apto para dinámicas entre niños, jóvenes y adultos" },
      { emoji: "🏆", text: "Ideal para juegos en grupo, fútbol burbuja y competencias" },
      { emoji: "⏱️", text: "5 horas de alquiler + 1 personal de apoyo" },
    ],
    includedCards: [
      {
        title: "2 Pelotas Bumper Balls",
        description: "Par de esferas inflables transparentes con cámaras de aire amortiguadoras.",
        blobColor: "#E3F3F9",
      },
      {
        title: "1 Personal de Apoyo",
        description: "Acompañamiento durante las 5 horas para asistir a los jugadores al colocarse las esferas.",
        blobColor: "#FCE9EE",
      },
      {
        title: "Inflado y Mantenimiento",
        description: "Equipo de inflado rápido y verificación de presión durante el evento.",
        blobColor: "#EAECF7",
      },
      {
        title: "Higiene Garantizada",
        description: "Desinfección interior y exterior de cada esfera antes de iniciar tu celebración.",
        blobColor: "#E8F4FA",
      },
    ],
  },
  {
    slug: "reloj-demoledor",
    title: "Reloj Demoledor",
    category: "juegos-entretenimiento",
    collectionName: "Diversión a Color",
    subtitle: "Diversión a Color · Juego mecánico giratorio de 5m de diámetro",
    description:
      "¡La competencia más divertida y llena de adrenalina! Este inflable de gran tamaño (5 metros de diámetro) pondrá a prueba la habilidad y agilidad de todos los participantes, que deberán esquivar y saltar para no ser derribados por el brazo giratorio. Ideal para fiestas, ferias y eventos.",
    image: "/images/catalogo/reloj-demoledor-01.webp",
    images: [
      "/images/catalogo/reloj-demoledor-01.webp",
      "/images/catalogo/reloj-demoledor-02.webp",
    ],
    price: "S/ 800",
    variantLabel: "Medida y Tiempo",
    sizeOptions: [
      { id: "5m-diametro-5h", label: "5m de Diámetro · 5 Horas", price: "S/ 800", isDefault: true },
    ],
    cardTagsLabel: "Medidas",
    cardTags: ["5m diámetro", "+4 años", "5 hrs"],
    dimensions: "5.00 metros de diámetro",
    ages: "Mayores de 4 años (niños, jóvenes y adultos)",
    duration: "5 horas",
    mobility: "S/ 30.00",
    accent: "pink",
    isFeatured: true,
    bullets: [
      { emoji: "⏰", text: "Brazo mecánico giratorio acolchado para saltar y esquivar" },
      { emoji: "⭕", text: "Colchón inflable circular de 5 metros de diámetro" },
      { emoji: "🧒", text: "Edad sugerida: Mayores de 4 años hasta adultos" },
      { emoji: "🎪", text: "Ideal para fiestas, colegios, ferias y eventos corporativos" },
      { emoji: "⏱️", text: "5 horas de alquiler con operador a cargo del control de giro" },
    ],
    includedCards: [
      {
        title: "Arena Inflable (5m Diámetro)",
        description: "Colchón perimetral inflable de alta absorción de caída para todos los jugadores.",
        blobColor: "#FCE9EE",
      },
      {
        title: "Mecanismo Reloj Giratorio",
        description: "Pedestal central con brazo acolchado de velocidad regulable según la edad.",
        blobColor: "#E3F3F9",
      },
      {
        title: "Operador de Control",
        description: "Personal encargado de operar el giro del brazo con total seguridad durante las 5 horas.",
        blobColor: "#EAECF7",
      },
      {
        title: "Montaje y Desmontaje",
        description: "Instalación técnica completa en tu evento y retiro puntual al finalizar.",
        blobColor: "#E8F4FA",
      },
    ],
  },
  {
    slug: "camas-saltarinas",
    title: "Camas Saltarinas",
    category: "juegos-entretenimiento",
    collectionName: "Diversión Clásica",
    subtitle: "Disponibles en 2.4m, 3.05m y 4m de diámetro con malla de seguridad",
    description:
      "La atracción clásica que nunca puede faltar en una fiesta infantil. Nuestras camas saltarinas ofrecen horas de diversión, risas y movimiento en un espacio seguro y resistente con malla protectora perimetral. Disponibles en 3 tamaños para adaptarse a cada tipo de evento y espacio.",
    image: "/images/catalogo/camas-saltarinas.webp",
    price: "S/ 130",
    variantLabel: "Seleccionar Diámetro",
    sizeOptions: [
      { id: "2.4m", label: "2.4 m de diámetro (Espacios reducidos)", price: "S/ 130", isDefault: true },
      { id: "3.05m", label: "3.05 m de diámetro (Tamaño intermedio)", price: "S/ 150" },
      { id: "4m", label: "4 m de diámetro (La más grande)", price: "S/ 180" },
    ],
    cardTagsLabel: "Diámetros",
    cardTags: ["2.4m (S/ 130)", "3.05m (S/ 150)", "4m (S/ 180)"],
    dimensions: "Disponible en 2.40 m, 3.05 m o 4.00 m de diámetro",
    ages: "Niños de todas las edades",
    duration: "5 horas",
    mobility: "S/ 30.00",
    accent: "blue",
    bullets: [
      { emoji: "🤸", text: "2.4 m de diámetro (S/ 130): Ideal para los más pequeños o espacios reducidos" },
      { emoji: "⭐", text: "3.05 m de diámetro (S/ 150): Tamaño intermedio perfecto para grupos de niños" },
      { emoji: "🚀", text: "4.0 m de diámetro (S/ 180): La más grande para máxima diversión y capacidad" },
      { emoji: "🛡️", text: "Estructura metálica reforzada con malla de seguridad y bordes acolchados" },
      { emoji: "🚚", text: "Incluye armado, desmontaje y desinfección (Movilidad: S/ 30.00)" },
    ],
    includedCards: [
      {
        title: "Cama Saltarina a Elección",
        description: "Trampolín circular en medida de 2.4m (S/ 130), 3.05m (S/ 150) o 4m (S/ 180).",
        blobColor: "#E3F3F9",
      },
      {
        title: "Malla Perimetral de Seguridad",
        description: "Red protectora alta con cierre de seguridad y postes recubiertos.",
        blobColor: "#FCE9EE",
      },
      {
        title: "Cubrerresortes Acolchado",
        description: "Protector circular grueso que cubre todos los resortes perimetrales.",
        blobColor: "#EAECF7",
      },
      {
        title: "Montaje y Desmontaje",
        description: "Armado completo en tu jardín o cochera y retiro al finalizar el evento.",
        blobColor: "#E8F4FA",
      },
    ],
  },

  // ===========================================================================
  // 4. SESIONES DE FOTOS (3 PRODUCTOS — CABINA ESPEJADA DESCARTADA)
  // ===========================================================================
  {
    slug: "plataforma-360",
    title: "Plataforma 360° (Video Booth 360°)",
    category: "sesiones-fotos",
    collectionName: "Diamante Azul Luxury",
    subtitle: "Luxury & Recuerdos · Videos HD Slow Motion + Accesorios + Staff",
    description:
      "Una experiencia inmersiva que convierte cada celebración en un recuerdo inolvidable. Nuestra Plataforma Giratoria 360° graba videos instantáneos con efecto slow motion, cámara lenta y reversa, listos para compartir al instante por WhatsApp o redes sociales con el marco y música personalizada de tu evento.",
    image: "/images/catalogo/plataforma-360.webp",
    price: "S/ 500",
    variantLabel: "Tiempo de Alquiler",
    sizeOptions: [
      { id: "3h", label: "2.5 a 3 Horas · Videos Ilimitados", price: "S/ 500", isDefault: true },
      { id: "4h", label: "4 Horas · Videos Ilimitados", price: "S/ 600" },
    ],
    cardTagsLabel: "Planes",
    cardTags: ["3 hrs (S/ 500)", "4 hrs (S/ 600)"],
    dimensions: "Espacio requerido: 2.50 m × 2.50 m",
    ages: "Niños, jóvenes y adultos (Todo tipo de eventos)",
    duration: "3 horas (S/ 500) o 4 horas (S/ 600)",
    mobility: "S/ 30.00",
    accent: "blue",
    isFeatured: true,
    bullets: [
      { emoji: "🎥", text: "Videos ilimitados en alta definición con efecto Slow Motion y reversa" },
      { emoji: "🎵", text: "Música personalizada y marco de video / branding con el logo o temática" },
      { emoji: "💸", text: "Incluye pistola de billetes, pistola de burbujas y accesorios premium" },
      { emoji: "🧑‍💼", text: "1 o 2 operadores especializados uniformados durante todo el servicio" },
      { emoji: "📲", text: "Envío instantáneo de los videos por WhatsApp o correo para Reels e Historias" },
    ],
    includedCards: [
      {
        title: "Plataforma 360° + Aro LED",
        description: "Plataforma giratoria motorizada con iluminación LED, alfombra y delimitadores.",
        blobColor: "#E3F3F9",
      },
      {
        title: "Videos HD + Branding",
        description: "Videos ilimitados en cámara lenta musicalizados y con marco personalizado de tu evento.",
        blobColor: "#EAECF7",
      },
      {
        title: "Accesorios y Pistolas",
        description: "Pistola lanza billetes, pistola de burbujas, sombreros, lentes y cotillón premium.",
        blobColor: "#FCE9EE",
      },
      {
        title: "1 o 2 Operadores",
        description: "Personal especializado que guía las poses y envía los videos al instante a cada invitado.",
        blobColor: "#E8F4FA",
      },
    ],
  },
  {
    slug: "domo-overhead-360",
    title: "Domo Overhead 360",
    category: "sesiones-fotos",
    collectionName: "Diamante Azul Luxury",
    subtitle: "Diamante Azul Luxury · Estructura geodésica LED + Video 360° (5 hrs)",
    description:
      "Un espacio que envuelve a tus invitados en una experiencia completamente diferente. El Domo Overhead 360 combina una imponente estructura geodésica con barras de iluminación LED y plataforma de video 360° inmersivo. Ideal para bodas, activaciones de marca, 15 años y eventos corporativos exclusivos.",
    image: "/images/catalogo/domo-overhead-360.webp",
    price: "S/ 1,000",
    variantLabel: "Plan Luxury",
    sizeOptions: [
      { id: "5h", label: "5 Horas · Servicio Luxury Completo", price: "S/ 1,000", isDefault: true },
    ],
    cardTagsLabel: "Incluye",
    cardTags: ["Domo LED", "5 Horas", "Videos 360°"],
    dimensions: "Domo geodésico iluminado con alfombra VIP y parantes",
    ages: "Bodas, eventos corporativos, marcas y fiestas exclusivas",
    duration: "5 horas",
    mobility: "S/ 30.00",
    accent: "lavender",
    isNew: true,
    isFeatured: true,
    bullets: [
      { emoji: "💎", text: "Diseño geodésico moderno envolvente con barras de iluminación LED" },
      { emoji: "🎬", text: "Videos inmersivos 360° ilimitados en alta definición" },
      { emoji: "🏛️", text: "Ideal para bodas, activaciones de marca y eventos corporativos" },
      { emoji: "🟥", text: "Incluye alfombra roja, parantes separadores VIP y accesorios" },
      { emoji: "⏱️", text: "5 horas de servicio continuo con personal especializado uniformado" },
    ],
    includedCards: [
      {
        title: "Domo Geodésico LED",
        description: "Estructura envolvente iluminada con barras LED que destaca en cualquier salón o jardín.",
        blobColor: "#EAECF7",
      },
      {
        title: "Plataforma y Videos 360°",
        description: "Captura de videos inmersivos en alta definición con edición y música instantánea.",
        blobColor: "#E3F3F9",
      },
      {
        title: "Alfombrado VIP y Accesorios",
        description: "Ingreso con alfombra roja, parantes dorados con cordón y mesa de accesorios.",
        blobColor: "#FCE9EE",
      },
      {
        title: "Personal Especializado (5h)",
        description: "Operadores uniformados a cargo del montaje, atención VIP y envío inmediato de videos.",
        blobColor: "#E8F4FA",
      },
    ],
  },
  {
    slug: "estacion-de-fotos",
    title: "Estación de Fotos",
    category: "sesiones-fotos",
    collectionName: "Diamante Azul Luxury",
    subtitle: "Diamante Azul Luxury · Cámara profesional + Fotos impresas (3 hrs)",
    description:
      "Una experiencia profesional que captura la esencia y elegancia de cada invitado en alta resolución. Nuestra Estación de Fotos cuenta con cámara profesional, aro de luz LED, fotografías impresas al instante, alfombrado elegante y divertidos accesorios temáticos.",
    image: "/images/catalogo/estacion-de-fotos.webp",
    price: "S/ 600",
    variantLabel: "Tiempo de Servicio",
    sizeOptions: [
      { id: "3h", label: "3 Horas · Fotos Impresas y Digitales", price: "S/ 600", isDefault: true },
    ],
    cardTagsLabel: "Incluye",
    cardTags: ["Fotos impresas", "Cámara Pro", "3 hrs"],
    dimensions: "Tótem fotográfico con alfombrado y delimitación",
    ages: "Todo tipo de celebraciones, bodas y eventos corporativos",
    duration: "3 horas",
    mobility: "S/ 30.00",
    accent: "blue",
    bullets: [
      { emoji: "📸", text: "Cámara Profesional y dispositivo de alta gama para máxima nitidez" },
      { emoji: "🖨️", text: "Incluye fotografías impresas al instante para tus invitados" },
      { emoji: "💡", text: "Aro de luz LED profesional para iluminación favorecedora" },
      { emoji: "🎩", text: "Elegante alfombrado, delimitación y divertidos accesorios temáticos" },
      { emoji: "🧑‍💼", text: "3 horas de servicio con personal especializado uniformado" },
    ],
    includedCards: [
      {
        title: "Cámara Pro + Aro de Luz LED",
        description: "Estación fotográfica equipada con cámara profesional Canon y aro de iluminación LED.",
        blobColor: "#E3F3F9",
      },
      {
        title: "Fotografías Impresas",
        description: "Recuerdos impresos en alta resolución entregados durante las 3 horas del evento.",
        blobColor: "#FCE9EE",
      },
      {
        title: "Alfombrado y Accesorios",
        description: "Delimitación elegante de la zona de fotos y cotillón temático para poses divertidas.",
        blobColor: "#EAECF7",
      },
      {
        title: "Personal Especializado",
        description: "Asistencia permanente durante todo el servicio para guiar a tus invitados.",
        blobColor: "#E8F4FA",
      },
    ],
  },

  // ===========================================================================
  // 5. COMPLEMENTOS Y EXTRAS (3 PRODUCTOS)
  // ===========================================================================
  {
    slug: "sillas-metalicas",
    title: "Sillas Metálicas Tapizadas",
    category: "complementos-extras",
    collectionName: "Complementos y Extras",
    subtitle: "Mobiliario para Eventos · Asiento tapizado de alto tránsito (94 cm)",
    description:
      "Servicio de alquiler de Sillas Metálicas especiales para darle un toque elegante y cómodo a tus reuniones al aire libre o en interior. Cuentan con estructura resistente y asiento tapizado acolchado especial para alto tránsito (altura de la silla: 94 cm).",
    image: "/images/catalogo/sillas-metalicas.webp",
    price: "S/ 3.50",
    variantLabel: "Tarifa de Alquiler",
    sizeOptions: [
      { id: "unidad", label: "Precio por Unidad (c/u)", price: "S/ 3.50 c/u", isDefault: true },
    ],
    cardTagsLabel: "Detalles",
    cardTags: ["Altura 94 cm", "Asiento tapizado", "S/ 3.50 c/u"],
    dimensions: "Altura de la silla: 94 cm",
    ages: "Invitados jóvenes y adultos",
    duration: "Por evento",
    mobility: "Depende de la zona y cantidad",
    accent: "lavender",
    bullets: [
      { emoji: "🪑", text: "Sillas metálicas elegantes para reuniones en jardín o interior" },
      { emoji: "🛋️", text: "Asiento tapizado acolchado especial para alto tránsito" },
      { emoji: "📏", text: "Altura total de la silla: 94 cm" },
      { emoji: "💰", text: "Precio de alquiler: S/ 3.50 por unidad (c/u)" },
      { emoji: "🚚", text: "Entrega y recojo en locación (movilidad según zona)" },
    ],
    includedCards: [
      {
        title: "Silla Metálica de 94 cm",
        description: "Estructura metálica firme con respaldar de varillas de diseño clásico y elegante.",
        blobColor: "#EAECF7",
      },
      {
        title: "Asiento Tapizado Acolchado",
        description: "Cojín integrado en tono claro de alta resistencia y comodidad para tus invitados.",
        blobColor: "#E3F3F9",
      },
      {
        title: "Limpieza Previa",
        description: "Cada silla se entrega limpia y revisada antes de tu reunión o celebración.",
        blobColor: "#FCE9EE",
      },
      {
        title: "Coordinación de Traslado",
        description: "Llevamos la cantidad de sillas que requieras junto con tu pedido de inflables.",
        blobColor: "#E8F4FA",
      },
    ],
  },
  {
    slug: "generador-electrico-8500w",
    title: "Generador Eléctrico 8500W",
    category: "complementos-extras",
    collectionName: "Complementos y Extras",
    subtitle: "Energía Autónoma · Potencia 8500 Watts + Gasolina × 5 horas",
    description:
      "Generador eléctrico de alta potencia (8500 watts) ideal para alimentar inflables grandes o múltiples turbinas en parques, clubes, playas o locales abiertos donde no se dispone de punto de electricidad cercano. Incluye gasolina para 5 horas continuas de evento.",
    image: "/images/catalogo/generador-electrico-8500w.webp",
    price: "S/ 250",
    variantLabel: "Potencia y Tiempo",
    sizeOptions: [
      { id: "8500w-5h", label: "8500 Watts · Incluye Gasolina × 5 hrs", price: "S/ 250", isDefault: true },
    ],
    cardTagsLabel: "Incluye",
    cardTags: ["8500 Watts", "Gasolina × 5 hrs"],
    dimensions: "Generador portátil de alto rendimiento (8500W)",
    ages: "Complemento técnico para eventos sin punto de luz",
    duration: "5 horas (con gasolina incluida)",
    mobility: "Depende de la zona",
    accent: "blue",
    bullets: [
      { emoji: "⚡", text: "Alta potencia de 8500 watts para inflables grandes o múltiples equipos" },
      { emoji: "⛽", text: "Incluye gasolina completa para 5 horas de funcionamiento" },
      { emoji: "🌳", text: "Soluciona eventos en parques, jardines amplios o clubes sin enchufe cercano" },
      { emoji: "🔧", text: "Instalación y puesta en marcha por nuestro personal técnico" },
      { emoji: "🚚", text: "Movilidad coordinada según la zona del evento" },
    ],
    includedCards: [
      {
        title: "Generador de 8500 Watts",
        description: "Equipo generador de alta capacidad para suministro eléctrico estable y continuo.",
        blobColor: "#E3F3F9",
      },
      {
        title: "Gasolina por 5 Horas",
        description: "Combustible incluido para cubrir las 5 horas completas de alquiler del inflable.",
        blobColor: "#FCE9EE",
      },
      {
        title: "Conexión y Pruebas",
        description: "Nuestro equipo técnico deja el generador conectado y funcionando con seguridad.",
        blobColor: "#EAECF7",
      },
      {
        title: "Retiro al Finalizar",
        description: "Desconexión y recojo del equipo junto con los juegos al terminar tu evento.",
        blobColor: "#E8F4FA",
      },
    ],
  },
  {
    slug: "generador-electrico-3600w",
    title: "Generador Eléctrico 3600W",
    category: "complementos-extras",
    collectionName: "Complementos y Extras",
    subtitle: "Energía Autónoma · Potencia 3600 Watts + Gasolina × 5 horas",
    description:
      "Generador eléctrico práctico de 3600 watts de potencia para eventos en exteriores o jardines sin tomacorriente cercano. Ideal para alimentar una turbina de inflable o estación recreativa con total autonomía. Incluye gasolina por 5 horas.",
    image: "/images/catalogo/generador-electrico-3600w.webp",
    price: "S/ 180",
    variantLabel: "Potencia y Tiempo",
    sizeOptions: [
      { id: "3600w-5h", label: "3600 Watts · Incluye Gasolina × 5 hrs", price: "S/ 180", isDefault: true },
    ],
    cardTagsLabel: "Incluye",
    cardTags: ["3600 Watts", "Gasolina × 5 hrs"],
    dimensions: "Generador portátil compacto (3600W)",
    ages: "Complemento técnico para eventos sin punto de luz",
    duration: "5 horas (con gasolina incluida)",
    mobility: "Depende de la zona",
    accent: "blue",
    bullets: [
      { emoji: "⚡", text: "Potencia de 3600 watts ideal para inflables individuales" },
      { emoji: "⛽", text: "Incluye gasolina por 5 horas de funcionamiento continuo" },
      { emoji: "🏡", text: "Perfecto para jardines, parques o áreas comunes sin punto de luz" },
      { emoji: "🔧", text: "Conexión segura a cargo de nuestro equipo al instalar" },
      { emoji: "🚚", text: "Movilidad coordinada según la zona del evento" },
    ],
    includedCards: [
      {
        title: "Generador de 3600 Watts",
        description: "Equipo portátil de suministro eléctrico autónomo para turbinas e inflables.",
        blobColor: "#E3F3F9",
      },
      {
        title: "Gasolina por 5 Horas",
        description: "Incluye el combustible necesario para las 5 horas de duración del alquiler.",
        blobColor: "#FCE9EE",
      },
      {
        title: "Puesta en Marcha",
        description: "Instalación y encendido supervisado por nuestro personal en la locación.",
        blobColor: "#EAECF7",
      },
      {
        title: "Recojo Puntual",
        description: "Retiro del generador al concluir las horas contratadas del servicio.",
        blobColor: "#E8F4FA",
      },
    ],
  },
]

function buildShortLines(title: string): [string, string] {
  const clean = title.replace(/\s*\(.*?\)\s*/g, "").trim()
  const words = clean.split(/\s+/)
  if (words.length === 1) return [words[0], ""]
  if (words.length === 2) return [words[0], words[1]]
  const mid = Math.ceil(words.length / 2)
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")]
}

export const PACKAGES_DATA: InflatablePackage[] = RAW_PRODUCTS.map((seed) => {
  const catInfo =
    PRODUCT_CATEGORIES.find((c) => c.slug === seed.category) ??
    PRODUCT_CATEGORIES[0]
  const galleryList = seed.images && seed.images.length > 0 ? seed.images : [seed.image]

  const baseSpecs: PackageSpecRow[] = [
    { label: "Categoría", value: catInfo.label },
    { label: "Línea / Colección", value: seed.collectionName },
    { label: "Medidas / Formato", value: seed.dimensions },
    { label: "Tiempo de alquiler", value: seed.duration },
    { label: "Edad / Público", value: seed.ages },
    { label: "Movilidad referencial", value: seed.mobility },
  ]
  if (seed.extraHour) {
    baseSpecs.push({ label: "Hora adicional", value: seed.extraHour })
  }
  if (seed.extraSpecs) {
    baseSpecs.push(...seed.extraSpecs)
  }

  const accordions: PackageAccordionItem[] = [
    {
      title: "Condiciones de reserva y servicio",
      content:
        "Se reserva la fecha con el 50% de adelanto (vía Yape al 948 311 603 o transferencia bancaria BCP) y el 50% restante se cancela el día del evento en cuanto el equipo quede instalado en la locación. Los precios del catálogo no incluyen IGV. Reservas sujetas a disponibilidad de fecha.",
    },
    {
      title: "Requisitos de espacio y electricidad",
      content:
        seed.category === "complementos-extras"
          ? "Nuestro equipo coordina previamente la entrega, ubicación segura e instalación del equipamiento en tu locación según la zona del evento."
          : "Para el funcionamiento del equipo se requiere contar con un punto de luz (tomacorriente estándar 220V) cercano a la zona de instalación. El alquiler del inflable no incluye generador eléctrico (disponible como complemento en la sección Extras).",
    },
  ]

  return {
    slug: seed.slug,
    modelKey: seed.slug,
    category: seed.category,
    categoryName: catInfo.label,
    collectionName: seed.collectionName,
    tierName: catInfo.label,
    title: seed.title,
    subtitle: seed.subtitle,
    shortDescription: seed.description,
    fullDescription: seed.description,
    image: seed.image,
    images: galleryList,
    accent: seed.accent,
    isFeatured: seed.isFeatured,
    featuredLabel: seed.collectionName,
    isNew: seed.isNew,
    categories: ["casa", "jardin"],
    price: seed.price,
    regularPrice: undefined,
    variantLabel: seed.variantLabel ?? "Opción",
    sizeOptions: seed.sizeOptions,
    cardTagsLabel: seed.cardTagsLabel,
    cardTags: seed.cardTags,
    featureBullets: seed.bullets,
    includedCards: seed.includedCards,
    detailsHeading: {
      line1: `${seed.title}.`,
      line2: "Diversión segura y garantizada.",
    },
    detailsIntro: seed.description,
    tableSpecs: baseSpecs,
    accordions,
    reviewColumns: DEFAULT_REVIEW_COLUMNS,
    specs: {
      minSpace: seed.dimensions,
      heightClearance: seed.dimensions,
      recommendedAges: seed.ages,
      simultaneousCapacity: seed.ages,
      durationHours: seed.duration,
      powerRequirement: "1 punto de luz 220V cercano",
      setupAdvanceTime: "Instalación anticipada incluida",
    },
    preliminaryHighlights: seed.bullets.slice(0, 3).map((b) => b.text),
    includedItems: seed.includedCards.map((c) => `${c.title}: ${c.description}`),
    idealFor: [catInfo.label, seed.collectionName],
    galleryPlaceholders: galleryList.map((imgUrl, idx) => ({
      id: `${seed.slug}-img-${idx + 1}`,
      label: `${seed.title} — Vista ${idx + 1}`,
      aspectDescription: "1000 × 1000 px (1:1)",
      fileHint: imgUrl,
    })),
  }
})

export const MODEL_SWITCHER_ITEMS: ModelSwitcherItem[] = PACKAGES_DATA.map(
  (pkg) => ({
    slug: pkg.slug,
    title: pkg.title,
    shortLines: buildShortLines(pkg.title),
    price: pkg.price,
    regularPrice: pkg.regularPrice,
    category: pkg.category,
    image: pkg.image,
  })
)

const LEGACY_SLUG_ALIASES: Record<string, string> = {
  basico: "castillo-3-en-1",
  medio: "castillo-blanco-con-tobogan",
  premium: "arcoiris-magico",
  "arcoiris-rosa": "arcoiris-magico",
  "arcoiris-lavanda": "castillo-de-ensueno",
  "arcoiris-azul": "mega-circuito-encanto",
  "clasico-blanco": "castillo-blanco-con-tobogan",
  "celeste-diamante": "castillo-con-piscina-de-pelotas",
  "mini-blanco": "piscina-inflable-de-pelotas",
  "mini-arcoiris": "soft-play",
}

export function getPackageBySlug(slug: string): InflatablePackage | undefined {
  const direct = PACKAGES_DATA.find((pkg) => pkg.slug === slug)
  if (direct) return direct
  const mapped = LEGACY_SLUG_ALIASES[slug]
  if (mapped) {
    return PACKAGES_DATA.find((pkg) => pkg.slug === mapped)
  }
  return undefined
}

export function getPackagesByCategory(
  category: ProductCategorySlug | "all"
): InflatablePackage[] {
  if (category === "all") return PACKAGES_DATA
  return PACKAGES_DATA.filter((pkg) => pkg.category === category)
}

export interface WhatsAppMessageParams {
  packageTitle?: string
  district?: string
  eventType?: string
  customMessage?: string
}

export function buildWhatsAppUrl(
  params: WhatsAppMessageParams | string = {}
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

  const pkgPart = params.packageTitle
    ? `el producto *${params.packageTitle}*`
    : "sus productos de alquiler para eventos"

  const eventPart = params.eventType
    ? ` para un evento tipo *${params.eventType}*`
    : ""

  const districtPart = params.district ? ` en *${params.district}*` : ""

  const text = `Hola ${WHATSAPP_CONFIG.businessName}, vi en su web ${pkgPart} y me gustaría consultar disponibilidad y cotización${eventPart}${districtPart}.`

  return `https://wa.me/${WHATSAPP_CONFIG.phone}?text=${encodeURIComponent(text)}`
}
