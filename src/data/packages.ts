export type PackageSlug = "basico" | "medio" | "premium"

export type PackageAccent = "blue" | "pink" | "lavender"

export interface PackageGalleryPlaceholder {
  id: string
  label: string
  aspectDescription: string
  fileHint: string
}

export interface InflatablePackage {
  slug: PackageSlug
  tierName: string
  title: string
  subtitle: string
  shortDescription: string
  fullDescription: string
  accent: PackageAccent
  isFeatured?: boolean
  featuredLabel?: string
  categories: ("casa" | "jardin")[]
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

export const PACKAGES_DATA: InflatablePackage[] = [
  {
    slug: "basico",
    tierName: "Paquete Básico",
    title: "Pack Diversión Mini",
    subtitle: "Para salas, terrazas y cocheras con niños pequeños.",
    shortDescription:
      "Inflable compacto y desinfectado para fiestas en casa (2 a 6 años).",
    fullDescription:
      "Ideal para interiores o terrazas compactas. Llegamos 60 minutos antes para desinfectar e instalar sobre piso protector.",
    accent: "blue",
    categories: ["casa"],
    specs: {
      minSpace: "3.5 m × 3.5 m",
      heightClearance: "2.6 m libres",
      recommendedAges: "2 a 6 años",
      simultaneousCapacity: "4 a 5 niños",
      durationHours: "Hasta 4 horas",
      powerRequirement: "Enchufe 220V a menos de 15 m",
      setupAdvanceTime: "60 min antes del evento",
    },
    preliminaryHighlights: [
      "1 inflable infantil compacto renovado",
      "Alfombra acolchada de ingreso e higiene",
      "Transporte, montaje anticipado y desinfección",
    ],
    includedItems: [
      "Alquiler de 1 inflable infantil compacto hasta por 4 horas efectivas de juego",
      "Instalación 60 minutos antes del inicio (el tiempo de montaje no descuenta tus horas)",
      "Desinfección profunda del equipo antes de iniciar el servicio",
      "Piso protector y alfombra de recepción para el calzado de los niños",
      "Motor soplador silencioso de uso continuo con extensión eléctrica segura",
      "Personal uniformado para el montaje técnico y recojo puntual",
    ],
    idealFor: [
      "Cumpleaños de 2 a 6 años en casa o departamento con terraza",
      "Cocheras techadas y salones de recepción en edificios",
      "Reuniones familiares con niños pequeños",
    ],
    galleryPlaceholders: [
      {
        id: "basico-1",
        label: "Vista frontal del inflable compacto",
        aspectDescription: "Fotografía principal montada en terraza o sala (4:3)",
        fileHint: "/images/paquetes/basico-principal.webp",
      },
      {
        id: "basico-2",
        label: "Ángulo lateral y escala con niños",
        aspectDescription: "Referencia de altura y área de salto segura",
        fileHint: "/images/paquetes/basico-lateral.webp",
      },
      {
        id: "basico-3",
        label: "Detalle de limpieza y alfombra de ingreso",
        aspectDescription: "Lona sanitizada y zona de acceso acolchada",
        fileHint: "/images/paquetes/basico-limpieza.webp",
      },
      {
        id: "basico-4",
        label: "Anclaje y motor cubierto",
        aspectDescription: "Instalación eléctrica ordenada y segura",
        fileHint: "/images/paquetes/basico-seguridad.webp",
      },
    ],
  },
  {
    slug: "medio",
    tierName: "Paquete Medio",
    title: "Pack Fiesta Diamante",
    subtitle: "Castillo con tobogán para cumpleaños en Lima Moderna.",
    shortDescription:
      "Zona de salto y resbaladera para fiestas infantiles de 3 a 10 años.",
    fullDescription:
      "Castillo mediano con tobogán, desinfección previa y montaje puntual con personal uniformado.",
    accent: "pink",
    isFeatured: true,
    featuredLabel: "Más solicitado en Lima Moderna",
    categories: ["casa", "jardin"],
    specs: {
      minSpace: "5.0 m × 4.5 m",
      heightClearance: "3.4 m libres",
      recommendedAges: "3 a 10 años",
      simultaneousCapacity: "6 a 8 niños",
      durationHours: "Hasta 5 horas",
      powerRequirement: "Enchufe 220V a menos de 15 m",
      setupAdvanceTime: "60 min antes del evento",
    },
    preliminaryHighlights: [
      "1 castillo mediano con tobogán integrado",
      "Personal uniformado e instalación anticipada",
      "Desinfección completa y lona protectora de piso",
    ],
    includedItems: [
      "Alquiler de 1 castillo inflable mediano con tobogán hasta por 5 horas de evento",
      "Llegada e instalación 60 minutos antes de la hora pactada",
      "Limpieza y sanitización completa del inflable frente al cliente",
      "Lona base protectora y alfombra acolchada en el ingreso",
      "Anclaje seguro adaptado a césped o piso firme (losa, cochera o salón)",
      "Personal capacitado y uniformado para entrega e instrucción de uso seguro",
    ],
    idealFor: [
      "Cumpleaños infantiles en jardines, patios amplios o locales de eventos",
      "Celebraciones con grupos de amigos del colegio (3 a 10 años)",
      "Fiestas temáticas que buscan un inflable limpio, moderno y bien presentado",
    ],
    galleryPlaceholders: [
      {
        id: "medio-1",
        label: "Vista principal del Castillo con Tobogán",
        aspectDescription: "Fotografía destacada del inflable mediano en evento (4:3)",
        fileHint: "/images/paquetes/medio-principal.webp",
      },
      {
        id: "medio-2",
        label: "Vista del tobogán y área interior",
        aspectDescription: "Detalle de la resbaladera y muros de malla de seguridad",
        fileHint: "/images/paquetes/medio-tobogan.webp",
      },
      {
        id: "medio-3",
        label: "Presentación y protocolo de higiene",
        aspectDescription: "Personal uniformado realizando la entrega limpia",
        fileHint: "/images/paquetes/medio-personal.webp",
      },
      {
        id: "medio-4",
        label: "Montaje completo en jardín o terraza",
        aspectDescription: "Distribución del espacio de 5.0 m × 4.5 m",
        fileHint: "/images/paquetes/medio-montaje.webp",
      },
    ],
  },
  {
    slug: "premium",
    tierName: "Paquete Premium",
    title: "Pack Experiencia Total",
    subtitle: "Gran formato para jardines amplios, colegios y empresas.",
    shortDescription:
      "Circuito de gran formato con operador uniformado de supervisión.",
    fullDescription:
      "Pensado para jardines amplios, colegios y empresas. Incluye inflable de gran formato y operador uniformado en turno.",
    accent: "lavender",
    categories: ["jardin"],
    specs: {
      minSpace: "7.0 m × 5.0 m",
      heightClearance: "4.2 m libres",
      recommendedAges: "2 a 12 años",
      simultaneousCapacity: "10 a 12 niños",
      durationHours: "Hasta 6 horas",
      powerRequirement: "Enchufe 220V independiente a menos de 20 m",
      setupAdvanceTime: "90 min antes del evento",
    },
    preliminaryHighlights: [
      "Inflable de gran formato o circuito de actividades",
      "Operador uniformado de supervisión durante el evento",
      "Logística prioritaria para fiestas grandes, colegios y empresas",
    ],
    includedItems: [
      "Alquiler de 1 inflable de gran formato o circuito recreativo hasta por 6 horas",
      "Operador uniformado de Diamante Azul durante el servicio para supervisar el orden y seguridad",
      "Llegada con 90 minutos de anticipación para montaje y pruebas técnicas",
      "Desinfección integral previa, lona de protección pesada y zona de ingreso señalizada",
      "Capacidad logística para coordinar horarios con productoras, colegios o clubes",
      "Desmontaje ordenado y puntual al finalizar la celebración",
    ],
    idealFor: [
      "Cumpleaños infantiles en jardines grandes, clubes o casas de campo",
      "Kermesses, aniversarios de colegios, nidos y actividades escolares",
      "Family Days y celebraciones corporativas para colaboradores y sus familias",
    ],
    galleryPlaceholders: [
      {
        id: "premium-1",
        label: "Vista panorámica del Inflable Gran Formato",
        aspectDescription: "Fotografía principal de impacto visual en jardín amplio (4:3)",
        fileHint: "/images/paquetes/premium-principal.webp",
      },
      {
        id: "premium-2",
        label: "Recorrido interior, obstáculos y doble caída",
        aspectDescription: "Amplitud para grupos de 10 a 12 niños",
        fileHint: "/images/paquetes/premium-circuito.webp",
      },
      {
        id: "premium-3",
        label: "Supervisión con personal uniformado",
        aspectDescription: "Atención respetuosa y control de ingreso seguro",
        fileHint: "/images/paquetes/premium-operador.webp",
      },
      {
        id: "premium-4",
        label: "Montaje en colegio o evento corporativo",
        aspectDescription: "Instalación profesional de alto tránsito",
        fileHint: "/images/paquetes/premium-corporativo.webp",
      },
    ],
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
      "No. Nuestro equipo uniformado llega entre 60 y 90 minutos antes de la hora de inicio de tu evento para instalar, anclar y desinfectar el inflable con total tranquilidad. Tus horas contratadas corren únicamente desde la hora pactada para tu fiesta.",
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
      "Atendemos principalmente en Lima Moderna: Santiago de Surco, Miraflores, San Borja, San Isidro, Magdalena del Mar, Surquillo, San Luis y distritos aledaños previa coordinación por WhatsApp.",
  },
] as const

export function getPackageBySlug(slug: string): InflatablePackage | undefined {
  return PACKAGES_DATA.find((pkg) => pkg.slug === slug)
}

export function buildWhatsAppUrl(params: {
  packageTitle?: string
  tierName?: string
  district?: string
  eventType?: string
  customMessage?: string
}): string {
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
