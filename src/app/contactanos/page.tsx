import type { Metadata } from "next"
import { ContactInteractive } from "@/components/contact/contact-interactive"

export const metadata: Metadata = {
  title:
    "Contáctanos | Diamante Azul — Alquiler de Inflables en Lima Moderna y Arequipa",
  description:
    "Cotiza y consulta disponibilidad para tu evento en Lima Moderna (San Isidro, Miraflores, Surco, San Borja, Magdalena del Mar, Surquillo, San Luis y zonas cercanas) o en la ciudad de Arequipa por WhatsApp al 948 311 603.",
}

export default function ContactanosPage() {
  return <ContactInteractive />
}

