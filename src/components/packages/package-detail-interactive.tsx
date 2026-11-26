"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  MODEL_SWITCHER_ITEMS,
  buildWhatsAppUrl,
  type InflatablePackage,
} from "@/data/packages"
import { useCity } from "@/lib/city-context"
import { trackProductClick } from "@/lib/track-click"

interface PackageDetailInteractiveProps {
  pkg: InflatablePackage
}

export function PackageDetailInteractive({
  pkg: initialPkg,
}: PackageDetailInteractiveProps) {
  const { city, cityConfig, catalogProducts } = useCity()
  const pkg = React.useMemo(
    () => catalogProducts.find((p) => p.slug === initialPkg.slug) ?? initialPkg,
    [catalogProducts, initialPkg]
  )

  const defaultSizeIdx = React.useMemo(() => {
    const idx = pkg.sizeOptions.findIndex((s) => s.isDefault)
    return idx >= 0 ? idx : 0
  }, [pkg.sizeOptions])

  const [selectedThumbIdx, setSelectedThumbIdx] = React.useState(0)
  const [selectedSizeIdx, setSelectedSizeIdx] = React.useState(defaultSizeIdx)
  const [lightboxOpen, setLightboxOpen] = React.useState(false)
  const [siteOrigin, setSiteOrigin] = React.useState("https://diamanteazul.pe")
  const [activeSection, setActiveSection] = React.useState<
    "whats-included" | "customer-reviews" | "hbr-product-details"
  >("whats-included")
  const [stickyVisible, setStickyVisible] = React.useState(false)

  const mainCtaRef = React.useRef<HTMLAnchorElement>(null)

  React.useEffect(() => {
    if (typeof window !== "undefined" && window.location.origin) {
      setSiteOrigin(window.location.origin)
    }
  }, [])

  React.useEffect(() => {
    setSelectedThumbIdx(0)
    setSelectedSizeIdx(defaultSizeIdx)
    setLightboxOpen(false)
    trackProductClick(pkg.slug, "view", city)
  }, [pkg.slug, defaultSizeIdx, city])

  React.useEffect(() => {
    if (!lightboxOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false)
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [lightboxOpen])

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

  const galleryImages = pkg.images && pkg.images.length > 0 ? pkg.images : [pkg.image]
  const activeImage = galleryImages[selectedThumbIdx] ?? galleryImages[0]
  const hasMultipleImages = galleryImages.length > 1

  const relatedCategoryModels = React.useMemo(() => {
    const inCat = catalogProducts.filter((m) => m.category === pkg.category)
    if (inCat.length === 0) {
      return MODEL_SWITCHER_ITEMS.filter((m) => m.category === pkg.category)
    }
    return inCat.map((item) => {
      const clean = item.title.replace(/\s*\(.*?\)\s*/g, "").trim()
      const words = clean.split(/\s+/)
      const shortLines: [string, string] =
        words.length === 1
          ? [words[0], ""]
          : words.length === 2
            ? [words[0], words[1]]
            : [
                words.slice(0, Math.ceil(words.length / 2)).join(" "),
                words.slice(Math.ceil(words.length / 2)).join(" "),
              ]
      return {
        slug: item.slug,
        title: item.title,
        shortLines,
        price: item.price,
        regularPrice: item.regularPrice,
        category: item.category,
        image: item.image,
      }
    })
  }, [pkg.category, catalogProducts])

  const handlePrevThumb = () => {
    setSelectedThumbIdx(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
    )
  }

  const handleNextThumb = () => {
    setSelectedThumbIdx((prev) => (prev + 1) % galleryImages.length)
  }

  const whatsappUrl = React.useMemo(() => {
    const productPageUrl = `${siteOrigin}/paquetes/${pkg.slug}`
    const customMessage = `Buen día, quisiera consultar disponibilidad para alquilar ${pkg.title} en ${cityConfig.whatsappCityLabel}.\n${productPageUrl}`
    return buildWhatsAppUrl({ customMessage })
  }, [pkg.slug, pkg.title, cityConfig.whatsappCityLabel, siteOrigin])

  return (
    <main className="hbr-pdp">
      {/* 1. BREADCRUMB BAR */}
      <nav className="breadcrumb-wrapper" aria-label="Breadcrumb">
        <div className="container">
          <ol className="breadcrumb">
            <li>
              <Link href={cityConfig.homePath} aria-label="Inicio">
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
              <Link href={`${cityConfig.homePath}#cat-${pkg.category}`}>
                {pkg.categoryName}
              </Link>
            </li>
            <li className="breadcrumb-chevron">&gt;</li>
            <li id="breadcrumbCurrentName">{pkg.title}</li>
          </ol>
        </div>
      </nav>

      {/* 2. MAIN PRODUCT BUY BOX (#mainProduct) */}
      <div id="mainProduct">
        <div className="product-buybox-grid">
          {/* Left Column: Main Media Cover + Optional Thumbnail Strip */}
          <section className="product-left-content">
            <div className="product-cover" id="mainMediaCover">
              <Image
                src={activeImage}
                alt={pkg.title}
                fill
                priority
                sizes="(max-width: 991px) 100vw, 55vw"
                className="product-cover__img"
              />

              <button
                type="button"
                className="product-cover__expand-btn"
                aria-label="Ampliar imagen del producto"
                onClick={() => setLightboxOpen(true)}
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
                {hasMultipleImages
                  ? `Vista ${selectedThumbIdx + 1} de ${galleryImages.length} · ${pkg.collectionName}`
                  : `${pkg.categoryName} · ${pkg.collectionName}`}
              </span>
            </div>

            {hasMultipleImages && (
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
                  {galleryImages.map((imgUrl, idx) => (
                    <li
                      key={imgUrl}
                      className={`thumb-container ${
                        selectedThumbIdx === idx ? "is-active" : ""
                      }`}
                      onClick={() => setSelectedThumbIdx(idx)}
                    >
                      <div className="thumb-container__box">
                        <Image
                          src={imgUrl}
                          alt={`${pkg.title} vista ${idx + 1}`}
                          width={84}
                          height={84}
                          className="thumb-container__img"
                        />
                      </div>
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
            )}
          </section>

          {/* Right Column: Rounded White Card Panel */}
          <section className="product-right-content">
            {/* Category & Collection Pill */}
            <div className="comments-note">
              <span className="comments-note__stars">★★★★★</span>
              <p className="comments-note__text">
                {pkg.categoryName} · {pkg.collectionName}
              </p>
            </div>

            {/* Product Heading */}
            <h1 className="page-heading" id="productTitle">
              {pkg.title}
            </h1>

            {/* Prices */}
            <div className="product-prices">
              <span className="current-price-value" id="productPrice">
                {activeSize.price}
              </span>
              {activeSize.regularPrice && (
                <span className="regular-price" id="productRegularPrice">
                  {activeSize.regularPrice}
                </span>
              )}
            </div>

            {/* Short Description & Bullets from Catalog */}
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

            {/* Separated Medida & Tiempo Selector Pills */}
            <div
              className="product-variants-row"
              role="group"
              aria-label={`${pkg.variantLabel} y Tiempo`}
            >
              {pkg.slug === "plataforma-360" ? (
                <>
                  <div className="product-variants-group">
                    <span className="product-variants-label">Medida</span>
                    <span className="size-pill is-active">
                      <span className="size-pill__radio">✓</span>
                      <span>2.5m × 2.5m</span>
                    </span>
                  </div>
                  <div
                    className="product-variants-group"
                    role="radiogroup"
                    aria-label="Tiempo"
                  >
                    <span className="product-variants-label">Tiempo</span>
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
                </>
              ) : (
                <>
                  <div
                    className="product-variants-group"
                    role="radiogroup"
                    aria-label={pkg.variantLabel}
                  >
                    <span className="product-variants-label">
                      {pkg.variantLabel}
                    </span>
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
                  <div className="product-variants-group">
                    <span className="product-variants-label">Tiempo</span>
                    <span className="size-pill is-active">
                      <span className="size-pill__radio">✓</span>
                      <span>{pkg.rentalDurationPill}</span>
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Same-Category Switcher Grid */}
            <nav
              className="hbr-models"
              aria-label={`Otros productos en ${pkg.categoryName}`}
            >
              <p className="hbr-models__caption">
                Más en <strong>{pkg.categoryName}</strong>:
              </p>
              <ul className="hbr-models__grid" id="modelSwitcherGrid">
                {relatedCategoryModels.map((model) => {
                  const isCurrent = model.slug === pkg.slug
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
                          <span className="hbr-models__image-inner">
                            <Image
                              src={model.image}
                              alt={model.title}
                              width={64}
                              height={64}
                              sizes="64px"
                              loading="lazy"
                              className="hbr-models__thumb-img"
                            />
                          </span>
                        </span>
                        <span className="hbr-models__label">
                          {model.shortLines[0]}
                          {model.shortLines[1] ? (
                            <>
                              <br />
                              {model.shortLines[1]}
                            </>
                          ) : null}
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>

            {/* Sky-Tint Service & Booking Callout */}
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
                  Incluye{" "}
                  <strong>montaje, desinfección y personal de apoyo</strong> en{" "}
                  <strong>
                    {city === "lima" ? "Lima Moderna" : "Arequipa"}
                  </strong>
                </div>
                <div className="delivery-countdown-banner__line2">
                  Separa tu fecha con el <strong>50% de adelanto</strong> vía
                  WhatsApp o Yape
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
              onClick={() => trackProductClick(pkg.slug, "whatsapp", city)}
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
                <span className="hbr-payments__brand">Yape 948 311 603</span>
                <p className="hbr-payments__sub">Separa tu fecha con</p>
                <p className="hbr-payments__breakdown">50% de adelanto</p>
              </div>
              <div className="hbr-payments__column">
                <span className="hbr-payments__brand">Cuenta BCP</span>
                <p className="hbr-payments__sub">Saldo restante</p>
                <p className="hbr-payments__breakdown">50% al instalar</p>
              </div>
              <div className="hbr-payments__column">
                <span className="hbr-payments__brand">Garantía Total</span>
                <p className="hbr-payments__sub">100% Higienizado</p>
                <p className="hbr-payments__breakdown">
                  {pkg.specs.durationHours}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* 3. SECTION JUMP NAVIGATION PILL BAR */}
      <div className="hbr-section-nav-slot">
        <nav className="hbr-section-nav" aria-label="Secciones del producto">
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
            Puntualidad y limpieza.
          </span>
          <span className="hbr-pdp-banner__item hbr-pdp-banner__item--sage">
            Diversión asegurada.
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

      {/* 5. SECTION 1: WHAT'S INCLUDED (#whats-included) */}
      <section id="whats-included" className="hbr-included">
        <div className="hbr-included__inner">
          <header className="hbr-included__header">
            <span className="hbr-included__sparkle" aria-hidden="true">
              ✦
            </span>
            <p className="hbr-included__eyebrow">SERVICIO DIAMANTE AZUL</p>
            <h2 className="hbr-included__title">¿Qué incluye tu reserva?</h2>
            <p className="hbr-included__subtitle">
              Todo lo que viene incluido al reservar {pkg.title} para tu evento.
            </p>
          </header>

          <div className="hbr-included__grid">
            {pkg.includedCards.map((item, idx) => (
              <article key={idx} className="hbr-included__item">
                <div
                  className="hbr-included__art"
                  style={
                    { "--hbr-blob": item.blobColor } as React.CSSProperties
                  }
                >
                  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor">
                    {idx % 4 === 0 && (
                      <>
                        <rect x="10" y="24" width="44" height="28" rx="3" />
                        <path d="M10 24l10-12h24l10 12M24 52V36h16v16" />
                      </>
                    )}
                    {idx % 4 === 1 && (
                      <>
                        <circle cx="32" cy="32" r="16" />
                        <path d="M24 32l5 5 11-11" />
                      </>
                    )}
                    {idx % 4 === 2 && (
                      <>
                        <circle cx="32" cy="22" r="8" />
                        <path d="M18 48c0-8 6-14 14-14s14 6 14 14" />
                      </>
                    )}
                    {idx % 4 === 3 && (
                      <>
                        <path d="M14 18l18 6 18-6v30l-18 6-18-6V18z" />
                        <path d="M32 24v30" />
                      </>
                    )}
                  </svg>
                </div>
                <h3 className="hbr-included__name">{item.title}</h3>
                <p className="hbr-included__copy">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 6. SECTION 2: THE DETAILS (#hbr-product-details) */}
      <section id="hbr-product-details" className="hbr-product-details">
        <div className="hbr-product-details__inner">
          {/* Left Product Image */}
          <div className="hbr-product-details__media">
            <Image
              src={pkg.images[pkg.images.length - 1] ?? pkg.image}
              alt={`Detalles de ${pkg.title}`}
              fill
              sizes="(max-width: 991px) 100vw, 45vw"
              className="hbr-product-details__img"
            />
          </div>

          {/* Right Specifications & Accordions */}
          <div className="hbr-product-details__content">
            <p className="hbr-product-details__eyebrow">
              FICHA TÉCNICA Y CONDICIONES
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
              <details key={idx} className="hbr-product-details__accordion">
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
              Lo que dicen las familias sobre su experiencia con Diamante Azul.
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
                            <div className="hbr-pdp-reviews__avatar">
                              <Image
                                src={rev.image ?? pkg.image}
                                alt={rev.district}
                                width={56}
                                height={56}
                                sizes="56px"
                                loading="lazy"
                                className="hbr-pdp-reviews__thumb"
                              />
                            </div>
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
                            <div className="hbr-pdp-reviews__avatar">
                              <Image
                                src={rev.image ?? pkg.image}
                                alt={rev.district}
                                width={56}
                                height={56}
                                sizes="56px"
                                loading="lazy"
                                className="hbr-pdp-reviews__thumb"
                              />
                            </div>
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
          <div className="hbc-sticky-atc__thumb">
            <Image
              src={pkg.image}
              alt={pkg.title}
              width={48}
              height={48}
              className="hbc-sticky-atc__thumb-img"
            />
          </div>
          <div className="hbc-sticky-atc__info">
            <p className="hbc-sticky-atc__name" id="stickyName">
              {pkg.title} · {activeSize.label}
            </p>
            <div className="hbc-sticky-atc__meta">
              <span className="hbc-sticky-atc__price" id="stickyPrice">
                {activeSize.price}
              </span>
              {activeSize.regularPrice && (
                <span className="hbc-sticky-atc__regular" id="stickyRegular">
                  {activeSize.regularPrice}
                </span>
              )}
              <span className="hbc-sticky-atc__ship">
                · Reserva con 50% de adelanto
              </span>
            </div>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hbc-sticky-atc__btn"
            onClick={() => trackProductClick(pkg.slug, "whatsapp", city)}
          >
            <span>Reservar WhatsApp</span>
          </a>
        </div>
      </div>

      {/* 9. FULLSCREEN PRODUCT IMAGE LIGHTBOX MODAL */}
      {lightboxOpen && (
        <div
          className="hbr-pdp-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Vista ampliada de ${pkg.title}`}
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="hbr-pdp-lightbox__box"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="hbr-pdp-lightbox__close"
              aria-label="Cerrar vista ampliada"
              onClick={() => setLightboxOpen(false)}
            >
              ×
            </button>
            {hasMultipleImages && (
              <button
                type="button"
                className="hbr-pdp-lightbox__nav hbr-pdp-lightbox__nav--prev"
                aria-label="Imagen anterior"
                onClick={handlePrevThumb}
              >
                ‹
              </button>
            )}
            <div className="hbr-pdp-lightbox__media">
              <Image
                src={activeImage}
                alt={pkg.title}
                fill
                sizes="90vw"
                className="hbr-pdp-lightbox__img"
              />
            </div>
            {hasMultipleImages && (
              <button
                type="button"
                className="hbr-pdp-lightbox__nav hbr-pdp-lightbox__nav--next"
                aria-label="Imagen siguiente"
                onClick={handleNextThumb}
              >
                ›
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
