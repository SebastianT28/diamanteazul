"use client"

import * as React from "react"
import Link from "next/link"
import {
  MODEL_SWITCHER_ITEMS,
  buildWhatsAppUrl,
  type InflatablePackage,
} from "@/data/packages"

interface PackageDetailInteractiveProps {
  pkg: InflatablePackage
}

export function PackageDetailInteractive({
  pkg,
}: PackageDetailInteractiveProps) {
  const defaultSizeIdx = React.useMemo(() => {
    const idx = pkg.sizeOptions.findIndex((s) => s.isDefault)
    return idx >= 0 ? idx : 0
  }, [pkg.sizeOptions])

  const [selectedThumbIdx, setSelectedThumbIdx] = React.useState(0)
  const [selectedSizeIdx, setSelectedSizeIdx] = React.useState(defaultSizeIdx)
  const [activeSection, setActiveSection] = React.useState<
    "whats-included" | "customer-reviews" | "hbr-product-details"
  >("whats-included")
  const [stickyVisible, setStickyVisible] = React.useState(false)

  const mainCtaRef = React.useRef<HTMLAnchorElement>(null)

  React.useEffect(() => {
    setSelectedThumbIdx(0)
    setSelectedSizeIdx(defaultSizeIdx)
  }, [pkg.slug, defaultSizeIdx])

  React.useEffect(() => {
    const sectionIds: (
      | "whats-included"
      | "hbr-product-details"
      | "customer-reviews"
    )[] = ["whats-included", "hbr-product-details", "customer-reviews"]

    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(() => {
        ticking = false
        if (mainCtaRef.current) {
          const isBelow = mainCtaRef.current.getBoundingClientRect().bottom < 0
          setStickyVisible((prev) => (prev === isBelow ? prev : isBelow))
        }

        const threshold = 180
        let current:
          | "whats-included"
          | "hbr-product-details"
          | "customer-reviews" = "whats-included"
        for (const id of sectionIds) {
          const el = document.getElementById(id)
          if (!el) continue
          if (el.getBoundingClientRect().top <= threshold) {
            current = id
          }
        }
        setActiveSection((prev) => (prev === current ? prev : current))
      })
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const activeSize =
    pkg.sizeOptions[selectedSizeIdx] ??
    pkg.sizeOptions[0] ?? {
      id: "default",
      label: pkg.specs.minSpace,
      price: pkg.price,
      regularPrice: pkg.regularPrice,
    }

  const totalThumbs = Math.max(pkg.galleryPlaceholders.length, 5)
  const thumbIndices = Array.from({ length: 5 }, (_, i) => i)

  const handlePrevThumb = () => {
    setSelectedThumbIdx((prev) => (prev - 1 + 5) % 5)
  }

  const handleNextThumb = () => {
    setSelectedThumbIdx((prev) => (prev + 1) % 5)
  }

  const whatsappUrl = React.useMemo(() => {
    const customMessage = `Hola Diamante Azul, deseo reservar el paquete ${pkg.title} en medida ${activeSize.label} (${activeSize.price}).`
    return buildWhatsAppUrl({ customMessage })
  }, [pkg.title, activeSize.label, activeSize.price])

  return (
    <main className="hbr-pdp">
      {/* 1. BREADCRUMB BAR */}
      <nav className="breadcrumb-wrapper" aria-label="Breadcrumb">
        <div className="container">
          <ol className="breadcrumb">
            <li>
              <Link href="/" aria-label="Inicio">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 3l9 8h-3v9h-5v-6H11v6H6v-9H3l9-8z" />
                </svg>
              </Link>
            </li>
            <li className="breadcrumb-chevron">&gt;</li>
            <li>
              <Link href="/#hbr-home-range">Los Inflables</Link>
            </li>
            <li className="breadcrumb-chevron">&gt;</li>
            <li id="breadcrumbCurrentName">{pkg.title}</li>
          </ol>
        </div>
      </nav>

      {/* 2. MAIN PRODUCT BUY BOX (#mainProduct) */}
      <div id="mainProduct">
        <div className="product-buybox-grid">
          {/* Left Column: Main Media Cover + Interactive 5-Thumbnail Strip */}
          <section className="product-left-content">
            <div
              className="product-cover da-grey-placeholder"
              id="mainMediaCover"
            >
              {/* Top-right circular close/video toggle button */}
              <button
                type="button"
                className="product-cover__close-btn"
                aria-label="Cerrar vista de video"
                onClick={() => setSelectedThumbIdx(0)}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                >
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>

              {/* Bottom-left expand button */}
              <button
                type="button"
                className="product-cover__expand-btn"
                aria-label="Cambiar vista de imagen"
                onClick={handleNextThumb}
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <span className="product-cover__badge" id="mediaCounterBadge">
                Vista {selectedThumbIdx + 1} de {totalThumbs} · Placeholder
              </span>
            </div>

            <div className="thumbs-list-wrapper">
              <button
                type="button"
                className="thumbs-arrow"
                id="thumbPrevBtn"
                aria-label="Anterior"
                onClick={handlePrevThumb}
              >
                &lsaquo;
              </button>
              <ul className="product-images" id="thumbStrip">
                {thumbIndices.map((idx) => (
                  <li
                    key={idx}
                    className={`thumb-container ${
                      selectedThumbIdx === idx ? "is-active" : ""
                    }`}
                    onClick={() => setSelectedThumbIdx(idx)}
                  >
                    <div className="thumb-container__box da-grey-placeholder" />
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="thumbs-arrow"
                id="thumbNextBtn"
                aria-label="Siguiente"
                onClick={handleNextThumb}
              >
                &rsaquo;
              </button>
            </div>
          </section>

          {/* Right Column: Rounded White Card Panel */}
          <section className="product-right-content">
            {/* Social Proof Pill */}
            <div className="comments-note">
              <span className="comments-note__stars">★★★★★</span>
              <p className="comments-note__text">
                Amado por cientos de familias en Lima
              </p>
            </div>

            {/* Pastel Gradient Product Heading */}
            <h1 className="page-heading" id="productTitle">
              {pkg.title}
            </h1>

            {/* Prices */}
            <div className="product-prices">
              <span className="current-price-value" id="productPrice">
                {activeSize.price}
              </span>
              <span className="regular-price" id="productRegularPrice">
                {activeSize.regularPrice}
              </span>
            </div>

            {/* Short Description & 5 Emoji Bullets */}
            <div className="product-description-short">
              <p id="productShortDesc">{pkg.fullDescription}</p>
              <ul className="product-feature-bullets">
                {pkg.featureBullets.map((bullet, idx) => (
                  <li key={idx}>
                    <span className="product-feature-bullets__emoji">
                      {bullet.emoji}
                    </span>
                    {bullet.text}
                  </li>
                ))}
              </ul>
            </div>

            <div className="product-information-divider" />

            {/* Size Selector (Medida) */}
            <div
              className="product-variants-row"
              role="radiogroup"
              aria-label="Seleccionar medida"
            >
              <span className="product-variants-label">Medida</span>
              {pkg.sizeOptions.map((option, idx) => {
                const isActive = idx === selectedSizeIdx
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    className={`size-pill ${isActive ? "is-active" : ""}`}
                    onClick={() => setSelectedSizeIdx(idx)}
                  >
                    <span className="size-pill__radio">✓</span>
                    <span>{option.label}</span>
                  </button>
                )
              })}
            </div>

            {/* 7-Model Switcher Grid */}
            <nav
              className="hbr-models"
              aria-label="Cambiar paquete de inflable"
            >
              <ul className="hbr-models__grid" id="modelSwitcherGrid">
                {MODEL_SWITCHER_ITEMS.map((model) => {
                  const isCurrent = model.slug === pkg.modelKey
                  return (
                    <li
                      key={model.slug}
                      className={`hbr-models__item ${
                        isCurrent ? "is-current" : ""
                      }`}
                    >
                      <Link
                        href={`/paquetes/${model.slug}`}
                        className="hbr-models__link"
                        aria-current={isCurrent ? "page" : undefined}
                      >
                        <span className="hbr-models__image">
                          <span className="hbr-models__image-inner da-grey-placeholder" />
                        </span>
                        <span className="hbr-models__label">
                          {model.shortLines[0]}
                          <br />
                          {model.shortLines[1]}
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>

            {/* Sky-Tint Delivery & Setup Callout */}
            <div className="delivery-countdown-banner">
              <div className="delivery-countdown-banner__icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                >
                  <rect x="1" y="4" width="14" height="12" rx="2" />
                  <path d="M15 8h4l3 4v4h-7V8z" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </div>
              <div className="delivery-countdown-banner__text">
                <div className="delivery-countdown-banner__line1">
                  Traslado e instalación{" "}
                  <strong>GRATIS en Lima Metropolitana</strong>
                </div>
                <div className="delivery-countdown-banner__line2">
                  Reserva en los próximos <strong>23hrs 52mins</strong> para
                  prioridad de agenda
                </div>
              </div>
            </div>

            {/* Primary WhatsApp CTA Button */}
            <a
              ref={mainCtaRef}
              href={whatsappUrl}
              id="mainWhatsappCta"
              target="_blank"
              rel="noopener noreferrer"
              className="add-to-cart-whatsapp"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              <span>RESERVAR POR WHATSAPP</span>
            </a>

            {/* 3-Column Payment / Reassurance Panel */}
            <div className="hbr-payments">
              <div className="hbr-payments__column">
                <span className="hbr-payments__brand">Yape / Plin</span>
                <p className="hbr-payments__sub">Separa tu fecha con</p>
                <p className="hbr-payments__breakdown">50% de adelanto</p>
              </div>
              <div className="hbr-payments__column">
                <span className="hbr-payments__brand">Transferencia</span>
                <p className="hbr-payments__sub">BCP · Interbank · BBVA</p>
                <p className="hbr-payments__breakdown">50% al instalar</p>
              </div>
              <div className="hbr-payments__column">
                <span className="hbr-payments__brand">Garantía Total</span>
                <p className="hbr-payments__sub">100% Higienizado</p>
                <p className="hbr-payments__breakdown">5 horas de evento</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* 3. SECTION JUMP NAVIGATION PILL BAR (Only the 3 approved sections) */}
      <div className="hbr-section-nav-slot">
        <nav className="hbr-section-nav" aria-label="Secciones del paquete">
          <div className="hbr-section-nav__links">
            <a
              href="#whats-included"
              className={`hbr-section-nav__link ${
                activeSection === "whats-included" ? "is-active" : ""
              }`}
              onClick={() => setActiveSection("whats-included")}
            >
              ¿Qué incluye?
            </a>
            <a
              href="#hbr-product-details"
              className={`hbr-section-nav__link ${
                activeSection === "hbr-product-details" ? "is-active" : ""
              }`}
              onClick={() => setActiveSection("hbr-product-details")}
            >
              Los Detalles
            </a>
            <a
              href="#customer-reviews"
              className={`hbr-section-nav__link ${
                activeSection === "customer-reviews" ? "is-active" : ""
              }`}
              onClick={() => setActiveSection("customer-reviews")}
            >
              Reseñas
            </a>
          </div>
        </nav>
      </div>

      {/* 4. CURVED WAVE RIBBON MARQUEE */}
      <div className="hbr-pdp-banner" aria-hidden="true">
        <div className="hbr-pdp-banner__track">
          <span className="hbr-pdp-banner__item hbr-pdp-banner__item--rose">
            Hecho para grandes momentos.
          </span>
          <span className="hbr-pdp-banner__item hbr-pdp-banner__item--amber">
            Aventuras inolvidables.
          </span>
          <span className="hbr-pdp-banner__item hbr-pdp-banner__item--lavender">
            Juego seguro y estético.
          </span>
          <span className="hbr-pdp-banner__item hbr-pdp-banner__item--sky">
            Para interiores y jardines.
          </span>
          <span className="hbr-pdp-banner__item hbr-pdp-banner__item--sage">
            Listo en 2 minutos.
          </span>
          <span className="hbr-pdp-banner__item hbr-pdp-banner__item--rose">
            Hecho para grandes momentos.
          </span>
          <span className="hbr-pdp-banner__item hbr-pdp-banner__item--amber">
            Aventuras inolvidables.
          </span>
          <span className="hbr-pdp-banner__item hbr-pdp-banner__item--lavender">
            Juego seguro y estético.
          </span>
        </div>
      </div>

      {/* 5. SECTION 1: WHAT'S INCLUDED (#whats-included) + RESPONSIBLY MADE */}
      <section id="whats-included" className="hbr-included">
        <div className="hbr-included__inner">
          <header className="hbr-included__header">
            <span className="hbr-included__sparkle" aria-hidden="true">
              ✦
            </span>
            <p className="hbr-included__eyebrow">DESEMPAQUETA LA ALEGRÍA</p>
            <h2 className="hbr-included__title">¿Qué incluye?</h2>
            <p className="hbr-included__subtitle">
              Desde el primer salto hasta el desmontaje final, hemos pensado en
              cada pequeño detalle.
            </p>
          </header>

          <div className="hbr-included__grid">
            {/* Item 1 */}
            <article className="hbr-included__item">
              <div
                className="hbr-included__art"
                style={{ "--hbr-blob": "#E3F3F9" } as React.CSSProperties}
              >
                <svg viewBox="0 0 64 64" fill="none" stroke="currentColor">
                  <rect x="10" y="24" width="44" height="28" rx="3" />
                  <path d="M10 24l10-12h24l10 12M24 52V36h16v16" />
                  <path d="M16 24v28M48 24v28" />
                </svg>
              </div>
              <h3 className="hbr-included__name">El Castillo Inflable</h3>
              <p className="hbr-included__copy">
                El protagonista de la celebración, impecable y listo para
                cumpleaños, sesiones de fotos y tardes de juego.
              </p>
            </article>

            {/* Item 2 */}
            <article className="hbr-included__item">
              <div
                className="hbr-included__art"
                style={{ "--hbr-blob": "#FCE9EE" } as React.CSSProperties}
              >
                <svg viewBox="0 0 64 64" fill="none" stroke="currentColor">
                  <circle cx="28" cy="34" r="14" />
                  <circle cx="28" cy="34" r="5" />
                  <path d="M28 20h24v12H42M20 48h16l4 6H16l4-6z" />
                </svg>
              </div>
              <h3 className="hbr-included__name">Turbina Eléctrica</h3>
              <p className="hbr-included__copy">
                Mantiene la diversión inflada en menos de 2 minutos. Motor
                silencioso de flujo continuo certificado.
              </p>
            </article>

            {/* Item 3 */}
            <article className="hbr-included__item">
              <div
                className="hbr-included__art"
                style={{ "--hbr-blob": "#EAECF7" } as React.CSSProperties}
              >
                <svg viewBox="0 0 64 64" fill="none" stroke="currentColor">
                  <rect x="14" y="22" width="36" height="28" rx="4" />
                  <path d="M24 22v-6a8 8 0 0 1 16 0v6" />
                  <path d="M22 36h20" />
                </svg>
              </div>
              <h3 className="hbr-included__name">Pisos Acolchados</h3>
              <p className="hbr-included__copy">
                Tapetes de microporoso perimetrales en tonos neutros para un
                ingreso y salida suaves y seguros.
              </p>
            </article>

            {/* Item 4 */}
            <article className="hbr-included__item">
              <div
                className="hbr-included__art"
                style={{ "--hbr-blob": "#E8F4FA" } as React.CSSProperties}
              >
                <svg viewBox="0 0 64 64" fill="none" stroke="currentColor">
                  <path d="M20 18l24 24M36 14l14 14-6 6-14-14 6-6z" />
                  <path d="M14 48h36" />
                </svg>
              </div>
              <h3 className="hbr-included__name">6 Estacas de Jardín</h3>
              <p className="hbr-included__copy">
                Para anclar el castillo con total firmeza sobre césped natural o
                jardines exteriores durante todo el evento.
              </p>
            </article>

            {/* Item 5 */}
            <article className="hbr-included__item">
              <div
                className="hbr-included__art"
                style={{ "--hbr-blob": "#E3F3F9" } as React.CSSProperties}
              >
                <svg viewBox="0 0 64 64" fill="none" stroke="currentColor">
                  <rect x="14" y="14" width="26" height="26" rx="2" />
                  <rect
                    x="24"
                    y="24"
                    width="26"
                    height="26"
                    rx="2"
                    strokeDasharray="4 3"
                  />
                </svg>
              </div>
              <h3 className="hbr-included__name">Pelotas Pastel</h3>
              <p className="hbr-included__copy">
                Set de pelotas suaves en tonos blanco perla, celeste y rosa
                pastel para complementar la experiencia visual.
              </p>
            </article>

            {/* Item 6 */}
            <article className="hbr-included__item">
              <div
                className="hbr-included__art"
                style={{ "--hbr-blob": "#FCE9EE" } as React.CSSProperties}
              >
                <svg viewBox="0 0 64 64" fill="none" stroke="currentColor">
                  <path d="M36 14l14 14-8 8-14-14 8-8z" />
                  <path d="M32 26L14 44l6 6 18-18" />
                </svg>
              </div>
              <h3 className="hbr-included__name">Armado Profesional</h3>
              <p className="hbr-included__copy">
                Nuestro equipo técnico se encarga de la instalación completa
                antes de que lleguen tus invitados.
              </p>
            </article>

            {/* Item 7 */}
            <article className="hbr-included__item">
              <div
                className="hbr-included__art"
                style={{ "--hbr-blob": "#EAECF7" } as React.CSSProperties}
              >
                <svg viewBox="0 0 64 64" fill="none" stroke="currentColor">
                  <path d="M20 44c0-12 6-24 12-24s12 12 12 24H20z" />
                  <path d="M16 44h32" />
                </svg>
              </div>
              <h3 className="hbr-included__name">4 Pesas de Anclaje</h3>
              <p className="hbr-included__copy">
                Sacos lastrados de alta estabilidad para instalaciones en pisos
                interiores, terrazas o grass sintético.
              </p>
            </article>

            {/* Item 8 */}
            <article className="hbr-included__item">
              <div
                className="hbr-included__art"
                style={{ "--hbr-blob": "#E8F4FA" } as React.CSSProperties}
              >
                <svg viewBox="0 0 64 64" fill="none" stroke="currentColor">
                  <path d="M14 18l18 6 18-6v30l-18 6-18-6V18z" />
                  <path d="M32 24v30" />
                </svg>
              </div>
              <h3 className="hbr-included__name">Protocolo de Higiene</h3>
              <p className="hbr-included__copy">
                Sanitización certificada en sitio y guía de uso seguro para que
                disfrutes con total tranquilidad.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Responsibly Made Strip (#responsibly-made.hbr-made) */}
      <section id="responsibly-made" className="hbr-made">
        <div className="hbr-made__inner">
          <div className="hbr-made__header-rule">
            <div>
              <span className="hbr-made__eyebrow">DETALLES PENSADOS EN TI</span>
              <h3 className="hbr-made__title">Hecho con responsabilidad.</h3>
            </div>
          </div>

          <div className="hbr-made__grid">
            <div className="hbr-made__item">
              <svg
                viewBox="0 0 64 64"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M12 26l20-10 20 10-20 10-20-10z" />
                <path d="M12 34l20 10 20-10M12 42l20 10 20-10" />
              </svg>
              <p className="hbr-made__copy">
                Vinilo PVC recubierto de alta densidad y durabilidad
              </p>
            </div>
            <div className="hbr-made__item">
              <svg
                viewBox="0 0 64 64"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="20" y="14" width="18" height="32" rx="4" />
                <path d="M20 22h18M20 30h18M20 38h18M44 18l-8 28" />
              </svg>
              <p className="hbr-made__copy">
                Doble y cuádruple costura con uniones reforzadas
              </p>
            </div>
            <div className="hbr-made__item">
              <svg
                viewBox="0 0 64 64"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M32 14c8 10 14 18 14 26a14 14 0 0 1-28 0c0-8 6-16 14-26z" />
              </svg>
              <p className="hbr-made__copy">
                Libre de plomo, ftalatos y retardantes tóxicos
              </p>
            </div>
            <div className="hbr-made__item">
              <svg
                viewBox="0 0 64 64"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="16" y="12" width="28" height="36" rx="3" />
                <path d="M22 22h16M22 30h12" />
                <circle cx="42" cy="44" r="8" fill="#F7FAFC" />
                <path d="M39 44l2 2 4-4" />
              </svg>
              <p className="hbr-made__copy">
                Probado bajo estándares internacionales EN71
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SECTION 2: THE DETAILS (#hbr-product-details) */}
      <section id="hbr-product-details" className="hbr-product-details">
        <div className="hbr-product-details__inner">
          {/* Left Portrait Rounded Placeholder */}
          <div className="hbr-product-details__media da-grey-placeholder" />

          {/* Right Specifications & Accordions */}
          <div className="hbr-product-details__content">
            <p className="hbr-product-details__eyebrow">
              ESPACIO PARA SALTAR. DISEÑADO PARA JUGAR.
            </p>
            <h2 className="hbr-product-details__heading">
              {pkg.detailsHeading.line1}
              <span>{pkg.detailsHeading.line2}</span>
            </h2>
            <p className="hbr-product-details__intro">{pkg.detailsIntro}</p>

            <table className="hbr-product-details__specs">
              <tbody>
                {pkg.tableSpecs.map((row, idx) => (
                  <tr key={idx}>
                    <th>{row.label}</th>
                    <td>{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Expandable Accordions */}
            {pkg.accordions.map((acc, idx) => (
              <details
                key={idx}
                className="hbr-product-details__accordion"
              >
                <summary>
                  <span>{acc.title}</span>
                  <span
                    className="hbr-product-details__accordion-icon"
                    aria-hidden="true"
                  />
                </summary>
                <div className="hbr-product-details__accordion-body">
                  {acc.content}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 7. SECTION 3: CUSTOMER REVIEWS (#customer-reviews) */}
      <section id="customer-reviews" className="hbr-pdp-reviews">
        <div className="hbr-pdp-reviews__inner">
          <header className="hbr-pdp-reviews__header">
            <p className="hbr-pdp-reviews__eyebrow">RESEÑAS DE CLIENTES</p>
            <h2 className="hbr-pdp-reviews__heading">
              Pequeños momentos, compartidos por ti.
            </h2>
            <p className="hbr-pdp-reviews__intro">
              Lo que dicen las familias en Lima sobre {pkg.title}.
            </p>
          </header>

          <div className="hbr-pdp-reviews__viewport">
            <div className="hbr-pdp-reviews__columns">
              {pkg.reviewColumns.map((column, colIdx) => {
                const loopSegment = [...column, ...column]
                return (
                  <div key={colIdx} className="hbr-pdp-reviews__column">
                    <div className="hbr-pdp-reviews__group">
                      {loopSegment.map((rev, itemIdx) => (
                        <article
                          key={`${colIdx}-a-${itemIdx}`}
                          className="hbr-pdp-reviews__card"
                          aria-hidden={
                            itemIdx >= column.length ? "true" : undefined
                          }
                        >
                          <div className="hbr-pdp-reviews__stars">★★★★★</div>
                          <p className="hbr-pdp-reviews__quote">{rev.quote}</p>
                          <div className="hbr-pdp-reviews__person">
                            <span
                              className="hbr-pdp-reviews__avatar"
                              style={
                                rev.avatarBg
                                  ? {
                                      background: rev.avatarBg,
                                      color: rev.avatarColor,
                                    }
                                  : undefined
                              }
                            >
                              {rev.initials}
                            </span>
                            <div>
                              <p className="hbr-pdp-reviews__name">
                                {rev.name}
                              </p>
                              <p className="hbr-pdp-reviews__meta">
                                {rev.district}
                              </p>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                    <div
                      className="hbr-pdp-reviews__group"
                      aria-hidden="true"
                    >
                      {loopSegment.map((rev, itemIdx) => (
                        <article
                          key={`${colIdx}-b-${itemIdx}`}
                          className="hbr-pdp-reviews__card"
                        >
                          <div className="hbr-pdp-reviews__stars">★★★★★</div>
                          <p className="hbr-pdp-reviews__quote">{rev.quote}</p>
                          <div className="hbr-pdp-reviews__person">
                            <span
                              className="hbr-pdp-reviews__avatar"
                              style={
                                rev.avatarBg
                                  ? {
                                      background: rev.avatarBg,
                                      color: rev.avatarColor,
                                    }
                                  : undefined
                              }
                            >
                              {rev.initials}
                            </span>
                            <div>
                              <p className="hbr-pdp-reviews__name">
                                {rev.name}
                              </p>
                              <p className="hbr-pdp-reviews__meta">
                                {rev.district}
                              </p>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 8. FLOATING STICKY WHATSAPP BAR (#hbc-sticky-atc) */}
      <div
        id="hbc-sticky-atc"
        className={stickyVisible ? "is-visible" : ""}
      >
        <div className="hbc-sticky-atc__inner">
          <div className="hbc-sticky-atc__thumb da-grey-placeholder" />
          <div className="hbc-sticky-atc__info">
            <p className="hbc-sticky-atc__name" id="stickyName">
              {pkg.title} · {activeSize.label}
            </p>
            <div className="hbc-sticky-atc__meta">
              <span className="hbc-sticky-atc__price" id="stickyPrice">
                {activeSize.price}
              </span>
              <span className="hbc-sticky-atc__regular" id="stickyRegular">
                {activeSize.regularPrice}
              </span>
              <span className="hbc-sticky-atc__ship">
                · Instalación gratis en Lima
              </span>
            </div>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hbc-sticky-atc__btn"
          >
            <span>Reservar WhatsApp</span>
          </a>
        </div>
      </div>
    </main>
  )
}
