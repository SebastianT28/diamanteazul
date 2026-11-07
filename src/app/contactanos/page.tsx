import type { Metadata } from "next"
import { ContactInteractive } from "@/components/contact/contact-interactive"

export const metadata: Metadata = {
  title: "Contáctanos | Diamante Azul — Alquiler de Inflables Pastel en Lima",
  description:
    "¿Eligiendo tu paquete de alquiler, consultando disponibilidad de fecha o preparándote para el gran día? Escríbenos por formulario o directamente a nuestro WhatsApp.",
}

export default function ContactanosPage() {
  return <ContactInteractive />
}

