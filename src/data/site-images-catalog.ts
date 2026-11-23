import { PACKAGES_DATA } from "@/data/packages"

export type AdminImageSection =
  | "home"
  | "catalogo"
  | "quienes-somos"
  | "paginas"
  | "mosaico"

export interface EditableImageSlot {
  key: string
  section: AdminImageSection
  sectionLabel: string
  title: string
  subtitle: string
  path: string
  recommendedSize: string
  recommendedFormat: string
}

const HOME_SLOTS: EditableImageSlot[] = [
  {
    key: "home-logo",
    section: "home",
    sectionLabel: "Inicio y Marca",
    title: "Logo Oficial Diamante Azul",
    subtitle: "Cabecera principal del sitio web (Desktop y Móvil)",
    path: "/images/home/logo_diamante_azul.webp",
    recommendedSize: "520 × 176 px (fondo transparente)",
    recommendedFormat: "Webp",
  },
  {
    key: "home-hero",
    section: "home",
    sectionLabel: "Inicio y Marca",
    title: "Portada Principal (Hero Home)",
    subtitle: "Imagen principal de portada en Inicio (Lima y Arequipa)",
    path: "/images/home/home_hero_portada-02.webp",
    recommendedSize: "1920 × 1080 px (16:9)",
    recommendedFormat: "Webp",
  },
  {
    key: "home-momento-1",
    section: "home",
    sectionLabel: "Inicio y Marca",
    title: "Momento 1: Tardes en sala o terraza",
    subtitle: "Sección «Para los días que siempre recordarán»",
    path: "/images/home/home_momento_1_sala.webp",
    recommendedSize: "800 × 600 px (4:3)",
    recommendedFormat: "Webp",
  },
  {
    key: "home-momento-2",
    section: "home",
    sectionLabel: "Inicio y Marca",
    title: "Momento 2: Sol y diversión en el jardín",
    subtitle: "Sección «Para los días que siempre recordarán»",
    path: "/images/home/home_momento_2_jardin.webp",
    recommendedSize: "800 × 600 px (4:3)",
    recommendedFormat: "Webp",
  },
  {
    key: "home-momento-3",
    section: "home",
    sectionLabel: "Inicio y Marca",
    title: "Momento 3: Tardes de amigos más felices",
    subtitle: "Sección «Para los días que siempre recordarán»",
    path: "/images/home/home_momento_3_amigos.webp",
    recommendedSize: "800 × 600 px (4:3)",
    recommendedFormat: "Webp",
  },
  {
    key: "home-momento-4",
    section: "home",
    sectionLabel: "Inicio y Marca",
    title: "Momento 4: Días refrescantes de verano",
    subtitle: "Sección «Para los días que siempre recordarán»",
    path: "/images/home/home_momento_4_familia.webp",
    recommendedSize: "800 × 600 px (4:3)",
    recommendedFormat: "Webp",
  },
  {
    key: "home-momento-5",
    section: "home",
    sectionLabel: "Inicio y Marca",
    title: "Momento 5: Cumpleaños y eventos con estilo",
    subtitle: "Sección «Para los días que siempre recordarán»",
    path: "/images/home/home_momento_5_cumpleanos.webp",
    recommendedSize: "800 × 600 px (4:3)",
    recommendedFormat: "Webp",
  },
  {
    key: "home-momento-6",
    section: "home",
    sectionLabel: "Inicio y Marca",
    title: "Momento 6: Diversión sin preocupaciones",
    subtitle: "Sección «Para los días que siempre recordarán»",
    path: "/images/home/home_momento_6_instalacion.webp",
    recommendedSize: "800 × 600 px (4:3)",
    recommendedFormat: "Webp",
  },
]

const CATALOG_SLOTS: EditableImageSlot[] = (() => {
  const slots: EditableImageSlot[] = []
  const seenPaths = new Set<string>()

  for (const pkg of PACKAGES_DATA) {
    const imgs = pkg.images && pkg.images.length > 0 ? pkg.images : [pkg.image]
    imgs.forEach((imgPath, idx) => {
      if (seenPaths.has(imgPath)) return
      seenPaths.add(imgPath)
      const viewSuffix = imgs.length > 1 ? ` (Vista ${idx + 1})` : ""
      slots.push({
        key: `cat-${pkg.slug}-${idx + 1}`,
        section: "catalogo",
        sectionLabel: "Catálogo de Productos",
        title: `${pkg.title}${viewSuffix}`,
        subtitle: `${pkg.categoryName} · ${pkg.collectionName} (${pkg.price})`,
        path: imgPath,
        recommendedSize: "1000 × 1000 px (1:1)",
        recommendedFormat: "Webp",
      })
    })
  }
  return slots
})()

const ABOUT_SLOTS: EditableImageSlot[] = [
  {
    key: "about-hero",
    section: "quienes-somos",
    sectionLabel: "Quiénes Somos",
    title: "Portada Quiénes Somos",
    subtitle: "Banner superior de la página Quiénes Somos",
    path: "/images/pages/quienes_somos_portada.webp",
    recommendedSize: "1920 × 1080 px (16:9)",
    recommendedFormat: "Webp",
  },
  {
    key: "about-journey-2022",
    section: "quienes-somos",
    sectionLabel: "Quiénes Somos",
    title: "Nuestro Recorrido — 2022",
    subtitle: "Tarjeta 1 del carrusel «Un pequeño salto a través del tiempo»",
    path: "/images/pages/recorrido_1_2022.webp",
    recommendedSize: "1000 × 750 px (4:3)",
    recommendedFormat: "Webp",
  },
  {
    key: "about-journey-2023",
    section: "quienes-somos",
    sectionLabel: "Quiénes Somos",
    title: "Nuestro Recorrido — 2023",
    subtitle: "Tarjeta 2 del carrusel «Un pequeño salto a través del tiempo»",
    path: "/images/pages/recorrido_2_2023.webp",
    recommendedSize: "1000 × 750 px (4:3)",
    recommendedFormat: "Webp",
  },
  {
    key: "about-journey-2025",
    section: "quienes-somos",
    sectionLabel: "Quiénes Somos",
    title: "Nuestro Recorrido — 2025",
    subtitle: "Tarjeta 3 del carrusel «Un pequeño salto a través del tiempo»",
    path: "/images/pages/recorrido_3_2025.webp",
    recommendedSize: "1000 × 750 px (4:3)",
    recommendedFormat: "Webp",
  },
  {
    key: "about-journey-2026",
    section: "quienes-somos",
    sectionLabel: "Quiénes Somos",
    title: "Nuestro Recorrido — 2026",
    subtitle: "Tarjeta 4 del carrusel «Un pequeño salto a través del tiempo»",
    path: "/images/pages/recorrido_4_2026.webp",
    recommendedSize: "1000 × 750 px (4:3)",
    recommendedFormat: "Webp",
  },
  {
    key: "about-details",
    section: "quienes-somos",
    sectionLabel: "Quiénes Somos",
    title: "Sección «Está en los detalles»",
    subtitle: "Imagen lateral de calidad y acabados en Quiénes Somos",
    path: "/images/pages/quienes_somos_detalles.webp",
    recommendedSize: "1000 × 1000 px (1:1)",
    recommendedFormat: "Webp",
  },
]

const PAGES_SLOTS: EditableImageSlot[] = [
  {
    key: "faqs-hero",
    section: "paginas",
    sectionLabel: "FAQs y Contáctanos",
    title: "Portada Preguntas Frecuentes (FAQs)",
    subtitle: "Banner superior de la página de FAQs",
    path: "/images/pages/faqs_portada.webp",
    recommendedSize: "1920 × 1080 px (16:9)",
    recommendedFormat: "Webp",
  },
  {
    key: "contact-hero",
    section: "paginas",
    sectionLabel: "FAQs y Contáctanos",
    title: "Portada Contáctanos",
    subtitle: "Banner superior de la página Contáctanos",
    path: "/images/pages/contactanos_portada.webp",
    recommendedSize: "1920 × 1080 px (16:9)",
    recommendedFormat: "Webp",
  },
]

const MOSAIC_SLOTS: EditableImageSlot[] = Array.from({ length: 10 }, (_, i) => {
  const num = i + 1
  return {
    key: `mosaico-${num}`,
    section: "mosaico",
    sectionLabel: "Mosaico Inferior",
    title: `Mosaico Inferior — Foto #${num}`,
    subtitle:
      num === 8
        ? "Foto #8 (con frase superpuesta en el mosaico)"
        : `Foto #${num} de la galería inferior en Quiénes Somos y FAQs`,
    path: `/images/pages/mosaico_${num}.webp`,
    recommendedSize: "600 × 600 px (1:1)",
    recommendedFormat: "Webp",
  }
})

export const EDITABLE_IMAGE_SLOTS: EditableImageSlot[] = [
  ...HOME_SLOTS,
  ...CATALOG_SLOTS,
  ...ABOUT_SLOTS,
  ...PAGES_SLOTS,
  ...MOSAIC_SLOTS,
]

export const ADMIN_IMAGE_SECTIONS: {
  id: AdminImageSection | "all"
  label: string
}[] = [
  { id: "all", label: "Todas las imágenes" },
  { id: "home", label: "Inicio y Marca" },
  { id: "catalogo", label: "Catálogo (31 productos)" },
  { id: "quienes-somos", label: "Quiénes Somos" },
  { id: "paginas", label: "FAQs y Contáctanos" },
  { id: "mosaico", label: "Mosaico Inferior" },
]
