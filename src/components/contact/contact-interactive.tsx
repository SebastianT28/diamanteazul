"use client"

import { ChangeEvent, FormEvent, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  buildMailtoUrl,
  buildWhatsAppUrl,
  WHATSAPP_CONFIG,
} from "@/data/packages"
import { useCity } from "@/lib/city-context"

const SUBJECT_OPTIONS = [
  "Atención al Cliente y Reservas",
  "Consulta de Disponibilidad y Paquetes",
  "Asesoría de Medidas y Espacio",
  "Consulta sobre una Reserva Existente",
]

export function ContactInteractive() {
  const { city, cityConfig } = useCity()
  const [subject, setSubject] = useState(SUBJECT_OPTIONS[0])
  const [email, setEmail] = useState("")
  const [fileName, setFileName] = useState("")
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setFileName(file ? file.name : "")
  }

  const whatsappMessage = (() => {
    const cleanEmail = email.trim() ? ` (${email.trim()})` : ""
    const fileNote = fileName.trim() ? ` [Adjunto: ${fileName.trim()}]` : ""
    const cleanMsg = message.trim()
    if (cleanMsg) {
      return `Buen día, escribo por ${subject.toLowerCase()} en ${cityConfig.name}${cleanEmail}${fileNote}: ${cleanMsg}`
    }
    return `Buen día, quisiera realizar una consulta sobre ${subject.toLowerCase()} en ${cityConfig.name}.`
  })()

  const whatsappHref = buildWhatsAppUrl(whatsappMessage)

  const mailtoHref = (() => {
    const cleanEmail = email.trim()
    const cleanFile = fileName.trim()
    const cleanMsg = message.trim()
    const emailSubject = `[Diamante Azul - ${cityConfig.name}] ${subject}`
    const emailBodyLines = [
      "Buen día equipo de Diamante Azul,",
      "",
      `Les escribo desde el sitio web para realizar una consulta sobre ${subject.toLowerCase()}:`,
      "",
      `• Ciudad de atención: ${cityConfig.name}`,
      `• Asunto: ${subject}`,
      ...(cleanEmail ? [`• Correo de contacto: ${cleanEmail}`] : []),
      ...(cleanFile
        ? [`• Archivo referenciado (adjuntar al correo): ${cleanFile}`]
        : []),
      "",
      "Mensaje:",
      cleanMsg ||
        `Quisiera recibir información y disponibilidad sobre el alquiler de inflables en ${cityConfig.name}.`,
    ]
    return buildMailtoUrl({
      subject: emailSubject,
      body: emailBodyLines.join("\n"),
    })
  })()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    window.location.href = mailtoHref
    setSubmitted(true)
    setEmail("")
    setFileName("")
    setMessage("")
  }

  return (
    <main
      className="hb-story hb-story--page hb-contact hb-story--full-width"
      id="contactanos-page"
    >
      {/* 1. HERO DE ENTRADA CON ONDA INFERIOR (.hb-story__hero--cover) */}
      <section
        className="hb-story__hero hb-story__hero--cover"
        aria-labelledby="hbc-title"
      >
        <figure className="hb-story__hero-backdrop" aria-hidden="true">
          <Image
            src="/images/pages/contactanos_portada.webp"
            alt="Celebración infantil en jardín con castillo inflable Arcoíris Mágico de Diamante Azul"
            fill
            priority
            sizes="100vw"
            className="hb-story__hero-img"
          />
        </figure>
        <div className="hb-story__inner hb-story__hero-content">
          <p className="hb-story__eyebrow">Contáctanos</p>
          <h1 id="hbc-title">Estamos a un mensaje de distancia.</h1>
          <div className="hb-story__copy">
            <p className="hb-story__lead">
              ¿Eligiendo tu paquete de alquiler, consultando disponibilidad de
              fecha o preparándote para el gran día? Estamos aquí para ayudarte.
            </p>
          </div>
        </div>
      </section>

      {/* 2. CONTENEDOR CENTRAL (.hb-contact__inner) */}
      <div className="hb-story__inner hb-contact__inner">
        {/* 2.1 APARTADO "¿BUSCAS UNA RESPUESTA RÁPIDA?" (Caja única central de FAQs) */}
        <section
          className="hb-contact__quick"
          aria-labelledby="hbc-quick-title"
        >
          <div className="hb-contact__intro">
            <p className="hb-story__eyebrow">Lo más útil</p>
            <h2 id="hbc-quick-title">¿Buscas una respuesta rápida?</h2>
          </div>
          <div className="hb-contact__links">
            <Link className="hb-contact__link" href="/faqs">
              <span className="hb-contact__link-icon" aria-hidden="true">
                ?
              </span>
              <h3>FAQs</h3>
              <p>
                Instalación, seguridad, tiempos de reserva y preguntas
                frecuentes sobre nuestros castillos inflables.
              </p>
              <span className="hb-contact__link-label">
                <span>Explorar las FAQs</span>
                <span aria-hidden="true">↗</span>
              </span>
            </Link>
          </div>
        </section>

        {/* 2.2 APARTADO "PONTE EN CONTACTO" + FORMULARIO CON BOTÓN "O IR A WHATSAPP" */}
        <div className="hb-contact__layout">
          {/* Columna Izquierda: Soporte directo + Tarjeta de consejo */}
          <aside
            className="hb-contact__support"
            aria-labelledby="hbc-support-title"
          >
            <p className="hb-story__eyebrow">Un poco de ayuda personal</p>
            <h2 id="hbc-support-title">Ponte en contacto.</h2>
            <p>
              Cuéntanos en qué podemos ayudarte usando el formulario, o escribe
              directamente a nuestro equipo.
            </p>

            <div className="hb-contact__support-item">
              <h3>WhatsApp y Teléfono</h3>
              <a
                className="hb-contact__email"
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                {WHATSAPP_CONFIG.displayPhone}
              </a>
            </div>

            <div className="hb-contact__support-item">
              <h3>Escríbenos por correo</h3>
              <a
                className="hb-contact__email"
                href={mailtoHref}
              >
                {WHATSAPP_CONFIG.email}
              </a>
            </div>

            <div className="hb-contact__support-item">
              <h3>Cobertura en {cityConfig.name}</h3>
              <p>
                {city === "lima"
                  ? "Atención prioritaria en Lima Moderna (San Isidro, Miraflores, Surco, San Borja, Magdalena del Mar, Surquillo y San Luis) y zonas cercanas."
                  : "Atención y cobertura completa para cumpleaños infantiles y eventos en la ciudad de Arequipa."}
              </p>
            </div>

            <div className="hb-contact__support-item">
              <h3>Nuestro horario de atención</h3>
              <p>Lunes a Sábado, 9:00 am – 7:00 pm</p>
            </div>

            <div className="hb-contact__support-item">
              <h3>¿Prefieres chat en vivo?</h3>
              <p>
                Cuando el ícono de ayuda esté disponible en la esquina inferior
                derecha de tu pantalla, tócalo para iniciar una conversación.
              </p>
            </div>

            <div className="hb-contact__tip">
              <h3>¿Sobre una reserva existente?</h3>
              <p>
                Incluye tu nombre y fecha de evento en tu mensaje para encontrar
                tu reserva rápidamente. Adjuntar una foto del espacio ayuda
                mucho si tu consulta es sobre medidas o instalación.
              </p>
            </div>
          </aside>

          {/* Columna Derecha: Panel del Formulario con botón Enviar + "O ir a WhatsApp" al costado */}
          <section
            className="hb-contact__form-panel"
            aria-labelledby="hbc-form-title"
          >
            <div className="hb-contact__form-intro">
              <p className="hb-story__eyebrow">Envíanos un mensaje</p>
              <h2 id="hbc-form-title">¿Cómo podemos ayudarte?</h2>
              <p>
                Cuéntanos un poco sobre tu consulta y verifica tu correo
                electrónico antes de enviar.
              </p>
            </div>

            <section className="contact-form hb-contact-form">
              {submitted && (
                <div className="alert alert-success" role="status">
                  ¡Gracias por escribirnos! Hemos recibido tu mensaje y nuestro
                  equipo de Diamante Azul te responderá a la brevedad.
                </div>
              )}

              <form
                className="hb-contact-form__form"
                onSubmit={handleSubmit}
              >
                <section className="form-fields">
                  <div className="form-group">
                    <label htmlFor="hbc-subject" className="form-control-label">
                      Asunto
                    </label>
                    <div>
                      <select
                        id="hbc-subject"
                        name="id_contact"
                        required
                        className="form-control form-control-select"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                      >
                        {SUBJECT_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="hbc-email" className="form-control-label">
                      Correo electrónico
                    </label>
                    <div>
                      <input
                        className="form-control"
                        id="hbc-email"
                        name="from"
                        autoComplete="email"
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tucorreo@ejemplo.com"
                      />
                    </div>
                  </div>

                  <div className="form-group hb-contact-form__wide">
                    <label
                      htmlFor="hbc-attachment"
                      className="form-control-label"
                    >
                      Archivo adjunto
                    </label>
                    <div>
                      <input
                        id="hbc-attachment"
                        type="file"
                        name="fileUpload"
                        tabIndex={-1}
                        onChange={handleFileChange}
                        style={{
                          position: "absolute",
                          clip: "rect(0px, 0px, 0px, 0px)",
                        }}
                      />
                      <div className="bootstrap-filestyle input-group">
                        <input
                          type="text"
                          className="form-control"
                          value={fileName}
                          placeholder="Foto de tu espacio o comprobante (opcional)"
                          disabled
                        />
                        <span
                          className="group-span-filestyle input-group-btn"
                          tabIndex={0}
                        >
                          <label
                            htmlFor="hbc-attachment"
                            className="btn btn-default"
                          >
                            <span className="buttonText">Elegir archivo</span>
                          </label>
                        </span>
                      </div>
                    </div>
                    <span className="form-control-comment">Opcional</span>
                  </div>

                  <div className="form-group hb-contact-form__wide">
                    <label htmlFor="hbc-message" className="form-control-label">
                      Mensaje
                    </label>
                    <div>
                      <textarea
                        className="form-control"
                        id="hbc-message"
                        name="message"
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="¿Cómo podemos ayudarte? Indícanos la fecha tentativa de tu evento, distrito o el paquete que te gustaría reservar."
                        rows={7}
                      />
                    </div>
                  </div>
                </section>

                <div className="form-footer">
                  <div className="hb-contact-form__actions">
                    <button
                      className="btn btn-primary"
                      type="submit"
                      name="submitMessage"
                    >
                      Enviar
                    </button>
                    <a
                      className="hb-contact-form__whatsapp"
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.9"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                      </svg>
                      <span>O ir a WhatsApp</span>
                    </a>
                  </div>
                </div>
              </form>
            </section>
          </section>
        </div>
      </div>
    </main>
  )
}
