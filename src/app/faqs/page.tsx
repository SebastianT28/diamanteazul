import type { Metadata } from "next"
import { FaqInteractive } from "@/components/faqs/faq-interactive"

export const metadata: Metadata = {
  title:
    "Preguntas Frecuentes (FAQs) | Diamante Azul — Alquiler de Inflables en Lima y Arequipa",
  description:
    "Encuentra respuestas sobre instalación, cobertura en Lima Moderna (San Isidro, Miraflores, Surco, San Borja, Magdalena del Mar, Surquillo, San Luis y zonas cercanas) y en la ciudad de Arequipa, seguridad, desinfección y reservas.",
}

export default function FaqsPage() {
  return <FaqInteractive />
}

