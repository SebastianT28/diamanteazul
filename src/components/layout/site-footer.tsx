"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { buildWhatsAppUrl } from "@/data/packages"

export function SiteFooter() {
  const [contactValue, setContactValue] = useState("")

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = contactValue.trim()
    const message = trimmed
      ? `Hola Diamante Azul, quiero unirme a las novedades / hacer una consulta. Mi contacto es: ${trimmed}`
      : "Hola Diamante Azul, quiero consultar disponibilidad de sus paquetes de inflables."
    window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer")
  }

  return (
    <>
      <footer id="contactanos" className="hbf-footer">
        <div className="hbf-footer__shell hbf-footer__inner">
          {/* Caja de Email o Número de Teléfono de WhatsApp (1:1 con referencia) */}
          <section
            className="hbf-footer__newsletter"
            aria-labelledby="hbf-newsletter-title"
          >
            <div className="hbf-footer__invite">
              <div className="hbf-footer__mail-heading">
                <span className="hbf-footer__mail-icon" aria-hidden="true">
                  <svg
                    viewBox="0 0 66 66"
                    width="54"
                    height="54"
                    xmlns="http://www.w3.org/2000/svg"
                    focusable="false"
                    fill="currentColor"
                  >
                    <path d="m62.79 55.54c.7-.42 1.32-1.06 1.69-1.8.38-.74.51-1.52.55-2.22.05-1.43-.22-2.63-.37-3.76-.17-1.14-.34-2.23-.49-3.27-.32-2.09-.61-4-.87-5.74-.54-3.48-1-6.28-1.42-8.54-.83-4.51-1.4-6.83-1.76-8.03-.22-.67-.5-.94-.66-1.06-.17-.12-.24-.08-.29-.04.12-.24.13-.54-2.61-2.04-1.37-.74-3.45-1.76-6.56-3.16-3.1-1.41-7.27-3.12-12.63-5.64-1.46-.65-3.02-1.61-4.98-2.45-.99-.41-2.09-.79-3.33-.87-1.23-.09-2.62.23-3.69.97-.25.19-.53.39-.76.57l-.64.55c-.43.36-.86.73-1.3 1.1-.87.73-1.75 1.46-2.62 2.19-1.76 1.45-3.5 2.9-5.16 4.27-3.33 2.75-6.35 5.26-8.49 7.12-1.65 1.44-2.78 2.48-3.17 2.93-.31-.04-.63-.04-1 .04-.64.11-1.32.69-1.51 1.35-.2.64-.14 1.16-.11 1.59l.11 1.26c.15 1.68.31 3.36.5 5.04.36 3.35.78 6.66 1.19 9.93.4 3.26.8 6.47 1.18 9.61.09.78.18 1.56.26 2.33.1.78.17 1.73.78 2.65s1.66 1.4 2.53 1.55c.89.17 1.72.14 2.5.09 5.95-.48 11.42-.97 16.22-1.45 8.75-.87 16.41-1.75 23.13-2.6 3.36-.44 6.48-.85 9.38-1.23 1.44-.19 2.99-.39 4.4-1.24zm-3.65-34.19c.04.17.17.45.23.99.11 1.22.48 3.58 1.12 8.09.31 2.26.7 5.07 1.17 8.55.23 1.74.49 3.65.77 5.75.14 1.05.29 2.14.45 3.29.15 1.15.38 2.33.32 3.41-.03.58-.16 1.09-.41 1.53-2.15-2.18-9.46-8.19-13.3-11.14-5.21-4-7.37-5.44-8.33-5.85 2.9-2.63 5.55-5.04 7.87-7.14 3.07-2.83 5.55-5.12 7.27-6.7.51-.47.93-.92 1.32-1.18 1.16.4 1.41.35 1.52.2-.02.03-.03.09 0 .2zm-52.26 2.96c2.29-1.68 5.43-4.01 8.88-6.62 1.72-1.32 3.51-2.7 5.33-4.09.9-.71 1.8-1.42 2.7-2.13.45-.36.89-.71 1.33-1.07l.66-.53c.21-.16.4-.28.59-.42 1.58-1.05 3.52-.63 5.26.14s3.37 1.78 4.9 2.46c5.44 2.55 9.63 4.21 12.76 5.52 3.13 1.29 5.25 2.16 6.69 2.75.52.21.94.37 1.3.5-.01.01-.02.01-.02.01-.38.28-.76.62-1.21.99-1.78 1.52-4.35 3.71-7.52 6.42-3.15 2.73-6.91 5.99-11.08 9.6-1.03.89-2.09 1.79-3.31 2.09-1.2.32-2.52-.18-3.91-.73-2.77-1.08-5.57-2.38-8.4-3.82-2.83-1.46-5.72-2.96-8.65-4.48-1.48-.75-2.98-1.49-4.51-2.19-.76-.36-1.54-.68-2.32-1.02l-1.18-.48-.59-.24c-.22-.09-.45-.16-.69-.22-.11-.03-.23-.05-.35-.08.57-.36 1.74-1.19 3.34-2.36zm-.65 35.04c-.27-.38-.39-1.02-.47-1.78-.09-.78-.18-1.56-.28-2.35-.41-3.14-.83-6.36-1.25-9.62-.44-3.26-.88-6.56-1.27-9.89-.2-1.66-.38-3.33-.54-5-.06-.79-.23-1.83-.1-2.16.06-.15.1-.2.29-.26.19-.05.52-.02.85.06.17.04.34.1.51.16l.58.23 1.15.46c.76.32 1.53.63 2.28.98 1.52.67 3 1.38 4.48 2.11 2.95 1.48 5.87 2.94 8.72 4.36.92.45 1.83.88 2.75 1.3-.74.45-2.36 2.19-6.63 7.64-3.24 4.13-9.62 12.89-10.17 14.39-.4-.14-.72-.34-.9-.63zm42.53-3.27c-6.71.82-14.36 1.68-23.09 2.55-4.78.48-10.26.99-16.16 1.49-.74.07-1.48.06-2.09-.08 1.57-1.22 8.29-9.2 11.45-13.23 4.74-6.04 5.83-7.83 5.9-8.49 1.67.75 3.33 1.45 4.99 2.06.7.27 1.42.53 2.21.71.77.18 1.65.21 2.45-.01 1.61-.44 2.74-1.51 3.76-2.42.75-.68 1.47-1.33 2.19-1.98.5.76 2.33 2.41 7.92 6.71 3.85 2.95 11.55 8.48 14.2 9.99-.18.21-.4.4-.67.56-.93.57-2.25.79-3.68.96-2.91.37-6.03.76-9.38 1.18z" />
                  </svg>
                </span>
                <span className="hbf-footer__eyebrow">
                  Un poquito más de alegría
                </span>
              </div>
              <h2 id="hbf-newsletter-title">Únete a nuestra familia feliz.</h2>
              <p>
                Nuevos modelos pastel, fechas disponibles e inspiración para
                tardes felices en casa. Directo a tu correo o WhatsApp.
              </p>
            </div>

            <form className="hbf-footer__form" onSubmit={handleSubmit}>
              <label
                className="hbf-footer__label"
                htmlFor="hbf-newsletter-contact"
              >
                Tu correo o número de WhatsApp
              </label>
              <div className="hbf-footer__field">
                <input
                  id="hbf-newsletter-contact"
                  className="hbf-footer__input"
                  name="contact"
                  type="text"
                  value={contactValue}
                  onChange={(e) => setContactValue(e.target.value)}
                  placeholder="Ingresa tu correo o WhatsApp..."
                  aria-describedby="hbf-newsletter-note"
                  required
                />
                <button className="hbf-footer__submit" type="submit">
                  <span>Quiero unirme</span>
                  <span aria-hidden="true">→</span>
                </button>
              </div>
              <p className="hbf-footer__note" id="hbf-newsletter-note">
                Al registrarte o escribirnos, aceptas recibir novedades y
                atención personalizada de Diamante Azul. Consulta nuestra{" "}
                <Link href="/politica-de-privacidad">
                  Política de Privacidad
                </Link>
                .
              </p>
            </form>
          </section>

          {/* Navigation + Socials */}
          <div className="hbf-footer__link-row">
            <nav aria-label="Enlaces de pie de página">
              <ul className="hbf-footer__links">
                <li>
                  <Link href="/#hbr-home-range">Todos los Paquetes</Link>
                </li>
                <li>
                  <Link href="/quienes-somos">Quiénes Somos</Link>
                </li>
                <li>
                  <Link href="/faqs">FAQs</Link>
                </li>
                <li>
                  <Link href="/contactanos">Contáctanos</Link>
                </li>
              </ul>
            </nav>
            <div className="hbf-footer__socials">
              <span className="hbf-footer__social-label">Síguenos</span>
              <a
                className="hbf-footer__social"
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                IG
              </a>
              <a
                className="hbf-footer__social"
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
              >
                TK
              </a>
              <a
                className="hbf-footer__social"
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                FB
              </a>
            </div>
          </div>

          {/* Safety Standards (Sin botones de medios de pago) */}
          <div className="hbf-footer__reassurance">
            <div className="hbf-footer__safety hbf-footer__standards">
              <div className="hbf-footer__standards-badge">
                CE · EN71 · SAFE
              </div>
              <div>
                <p className="hbf-footer__safety-title hbf-footer__standards-title">
                  Hecho para días felices en casa
                </p>
                <p className="hbf-footer__safety-copy hbf-footer__standards-copy">
                  Nuestros castillos inflables cumplen estándares de seguridad
                  infantil, costuras reforzadas y desinfección certificada antes
                  de cada evento.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Legal */}
          <div className="hbf-footer__bottom">
            <span>
              © 2026 Diamante Azul — Alquiler de Inflables y Eventos. Todos los
              derechos reservados.
            </span>
            <nav className="hbf-footer__legal" aria-label="Información legal">
              <Link href="/politica-de-privacidad">Política de Privacidad</Link>
              <Link href="/terminos-y-condiciones">Términos y Condiciones</Link>
            </nav>
          </div>
        </div>
      </footer>

      {/* Floating Chat / WhatsApp Launcher (#hbr-chat-tab) */}
      <a
        id="hbr-chat-tab"
        href={buildWhatsAppUrl(
          "Hola Diamante Azul, necesito ayuda con un paquete"
        )}
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
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
        <span className="hbr-chat-tab__label">¿Te ayudamos?</span>
      </a>
    </>
  )
}
