import type { Metadata } from "next"
import { AboutStoryInteractive } from "@/components/about/about-story-interactive"

export const metadata: Metadata = {
  title: "Quiénes Somos | Diamante Azul — Alquiler de Inflables Pastel en Lima",
  description:
    "Conoce la historia de Diamante Azul: castillos inflables modernos en tonos pastel pensados para pequeñas aventuras, recuerdos felices y hogares en Lima.",
}

export default function QuienesSomosPage() {
  return <AboutStoryInteractive />
}

