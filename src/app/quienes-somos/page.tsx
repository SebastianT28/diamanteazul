import type { Metadata } from "next"
import { AboutStoryInteractive } from "@/components/about/about-story-interactive"

export const metadata: Metadata = {
  title:
    "Quiénes Somos | Diamante Azul — Alquiler de Inflables en Lima Moderna y Arequipa",
  description:
    "Conoce la historia de Diamante Azul: alquiler de juegos inflables seguros y modernos para cumpleaños y eventos en Lima Moderna (San Isidro, Miraflores, Surco, San Borja, Magdalena del Mar, Surquillo, San Luis) y en la ciudad de Arequipa.",
}

export default function QuienesSomosPage() {
  return <AboutStoryInteractive />
}

