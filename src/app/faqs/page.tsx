import type { Metadata } from "next"
import { FaqInteractive } from "@/components/faqs/faq-interactive"

export const metadata: Metadata = {
  title:
    "Preguntas Frecuentes (FAQs) | Diamante Azul — Alquiler de Inflables Pastel en Lima",
  description:
  "Pequeñas dudas, Respuestas rápidas. Encuentra respuestas sobre instalación interior y exterior, tiempos de inflado, seguridad, desinfección y reservas de castillos inflables en Lima.",
}

export default function FaqsPage() {
  return <FaqInteractive />
}

