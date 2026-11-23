"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  PACKAGES_DATA,
  PRODUCT_CATEGORIES,
  buildWhatsAppUrl,
} from "@/data/packages"
import { useCity } from "@/lib/city-context"

const TICKER_ITEMS = [
  { label: "Castillos Dreamy Pastel y a Color", color: "#5CC2DE" },
  { label: "Inflables Acuáticos y Cañón de Espuma", color: "#9DA5D3" },
  { label: "Plataforma 360° y Domo Overhead LED", color: "#F4AEBC" },
  { label: "Montaje, Desinfección y Personal de Apoyo", color: "#5CC2DE" },
  { label: "Reserva Rápida por WhatsApp 948 311 603", color: "#9DA5D3" },
]

export function SiteHeader() {
  const [megaOpen, setMegaOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false)
  const [headerHidden, setHeaderHidden] = useState(false)
  const { city, cityConfig, switchCity } = useCity()

  const bannerRef = useRef<HTMLDivElement>(null)
  const tickerTrackRef = useRef<HTMLDivElement>(null)
  const tickerGroupRef = useRef<HTMLDivElement>(null)
  const cityDropdownRef = useRef<HTMLDivElement>(null)

  const generalWaUrl = buildWhatsAppUrl({
    district: cityConfig.whatsappCityLabel,
  })
  const catalogAnchorHref = `${cityConfig.homePath}#hbr-home-range`

  const handleCategorySelect = (catSlug: string) => {
    setMegaOpen(false)
    setDrawerOpen(false)
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("da-select-category", { detail: catSlug })
      )
    }
  }

  // 1. Measure Top Announcement Ticker for smooth infinite scroll
  useEffect(() => {
    let rafId = 0
    const updateTicker = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        const group = tickerGroupRef.current
        const track = tickerTrackRef.current
        if (!group || !track) return
        const w = group.offsetWidth
        if (w > 0) {
          track.style.setProperty("--hbr-ticker-distance", `-${w}px`)
          track.style.setProperty(
            "--hbr-ticker-duration",
            `${Math.max(w / 38, 14)}s`
          )
        }
      })
    }
    updateTicker()
    window.addEventListener("resize", updateTicker, { passive: true })
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener("resize", updateTicker)
    }
  }, [])

  // 2. Auto-hiding header on scroll down (48px) and reveal on scroll up (12px)
  useEffect(() => {
    let lastY = window.scrollY
    let dirY = lastY
    let lastDir = 0
    let bannerHeight = bannerRef.current?.offsetHeight ?? 40
    let lastOffset = -1
    let ticking = false

    const applyOffset = (y: number) => {
      const visible = Math.max(0, Math.round(bannerHeight - y))
      if (visible !== lastOffset) {
        lastOffset = visible
        document.documentElement.style.setProperty(
          "--hbr-announcement-offset",
          `${visible}px`
        )
      }
    }

    const onResize = () => {
      bannerHeight = bannerRef.current?.offsetHeight ?? 40
      applyOffset(Math.max(0, window.scrollY))
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        ticking = false
        const y = Math.max(0, window.scrollY)
        applyOffset(y)

        const delta = y - lastY
        lastY = y

        if (y <= 24) {
          setHeaderHidden((prev) => (prev ? false : prev))
          dirY = y
          lastDir = 0
          return
        }
        if (Math.abs(delta) < 4) return
        const dir = delta > 0 ? 1 : -1
        if (dir !== lastDir) {
          dirY = y
          lastDir = dir
        }
        const travel = Math.abs(y - dirY)
        if (dir > 0 && y > 130 && travel >= 48 && !megaOpen) {
          setHeaderHidden((prev) => (prev ? prev : true))
        } else if (dir < 0 && travel >= 12) {
          setHeaderHidden((prev) => (prev ? false : prev))
        }
      })
    }

    onResize()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onResize, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onResize)
    }
  }, [megaOpen])

  // 3. Sync Mobile Drawer class on <html> and Escape key handler
  useEffect(() => {
    document.documentElement.classList.toggle(
      "hbr-mobile-menu-open",
      drawerOpen
    )
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMegaOpen(false)
        setDrawerOpen(false)
        setCityDropdownOpen(false)
      }
    }
    const onPointerDownOutside = (e: MouseEvent | TouchEvent) => {
      if (
        cityDropdownRef.current &&
        !cityDropdownRef.current.contains(e.target as Node)
      ) {
        setCityDropdownOpen(false)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("mousedown", onPointerDownOutside)
    document.addEventListener("touchstart", onPointerDownOutside, {
      passive: true,
    })
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("mousedown", onPointerDownOutside)
      document.removeEventListener("touchstart", onPointerDownOutside)
      document.documentElement.classList.remove("hbr-mobile-menu-open")
    }
  }, [drawerOpen])

  const renderTickerGroup = (ariaHidden?: boolean) => (
    <div
      ref={ariaHidden ? undefined : tickerGroupRef}
      className="hbr-announcement__group"
      aria-hidden={ariaHidden ? "true" : undefined}
    >
      {TICKER_ITEMS.map((item, idx) => (
        <span key={idx} className="inline-flex items-center">
          <span className="hbr-announcement__item">
            <span
              className="hbr-announcement__icon"
              style={{ background: item.color }}
            />
            {item.label}
          </span>
          <span className="hbr-announcement__dot" aria-hidden="true">
            •
          </span>
        </span>
      ))}
    </div>
  )

  return (
    <>
      {/* 1. TOP ANNOUNCEMENT MARQUEE (.header-event-banner.hbr-announcement) */}
      <div
        ref={bannerRef}
        className="header-event-banner hbr-announcement"
        role="region"
        aria-label="Destacados de Diamante Azul"
      >
        <div className="hbr-announcement__viewport">
          <div ref={tickerTrackRef} className="hbr-announcement__track">
            {renderTickerGroup(false)}
            {renderTickerGroup(true)}
            {renderTickerGroup(true)}
            {renderTickerGroup(true)}
          </div>
        </div>
      </div>

      {/* 2. FIXED HEADER (.hbr-header) + MEGA DROPDOWN + MOBILE DRAWER */}
      <div className="hbr-header-space" />
      <header
        id="da-header"
        className={`hbr-header hbr-ready ${headerHidden ? "hbr-is-hidden" : ""}`}
      >
        <div className="hbr-header__pill">
          {/* Left Navigation (Desktop >=1200px) / Burger Button (<=1199px) */}
          <div className="hbr-header__left">
            <button
              id="da-burger-btn"
              type="button"
              className="hbr-header__toggle"
              aria-label="Abrir menú"
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen(true)}
            >
              <span className="hbr-header__burger" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              <span className="hbr-header__toggle-label">Menu</span>
            </button>

            <nav className="hbr-header__nav" aria-label="Navegación principal">
              <ul className="anav-top">
                <li
                  id="da-mega-item"
                  className={`amegamenu-item ${megaOpen ? "hbr-sub-open" : ""}`}
                >
                  <Link
                    href={catalogAnchorHref}
                    onClick={() => setMegaOpen(false)}
                  >
                    Catálogo
                  </Link>
                  <button
                    id="da-mega-toggle"
                    type="button"
                    className="hbr-header__submenu-toggle"
                    aria-label="Desplegar catálogo de productos"
                    aria-expanded={megaOpen}
                    onClick={() => setMegaOpen((prev) => !prev)}
                  >
                    <svg
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2.5 4.5L6 8l3.5-3.5" />
                    </svg>
                  </button>

                  {/* Desktop Mega Dropdown (.adropdown) */}
                  <div
                    className="adropdown"
                    role="region"
                    aria-label="Catálogo de productos por categoría"
                  >
                    <div className="hbr-mega">
                      <div className="hbr-mega__top">
                        <p className="hbr-mega__title">
                          Explora nuestros productos por categoría.
                        </p>
                        <Link
                          className="hbr-mega__all"
                          href={catalogAnchorHref}
                          onClick={() => setMegaOpen(false)}
                        >
                          Ver los {PACKAGES_DATA.length} productos{" "}
                          <span aria-hidden="true">→</span>
                        </Link>
                      </div>
                      <div className="hbr-mega__groups hbr-mega__groups--five">
                        {PRODUCT_CATEGORIES.map((cat) => {
                          const catProducts = PACKAGES_DATA.filter(
                            (p) => p.category === cat.slug
                          )
                          const previewItems = catProducts.slice(0, 3)
                          return (
                            <section key={cat.slug} className="hbr-mega__group">
                              <Link
                                href={`${cityConfig.homePath}#cat-${cat.slug}`}
                                className="hbr-mega__group-head"
                                onClick={() => handleCategorySelect(cat.slug)}
                              >
                                <span className="hbr-mega__eyebrow">
                                  {cat.label.toUpperCase()} ({catProducts.length})
                                </span>
                                <span className="hbr-mega__note">
                                  {cat.note}
                                </span>
                              </Link>
                              <div className="hbr-mega__products">
                                {previewItems.map((prod) => (
                                  <Link
                                    key={prod.slug}
                                    className="hbr-mega__card"
                                    href={`/paquetes/${prod.slug}`}
                                    onClick={() => setMegaOpen(false)}
                                  >
                                    <div className="hbr-mega__media">
                                      <Image
                                        src={prod.image}
                                        alt={prod.title}
                                        width={110}
                                        height={110}
                                        className="hbr-mega__img"
                                      />
                                    </div>
                                    <span className="hbr-mega__name">
                                      {prod.title}
                                    </span>
                                  </Link>
                                ))}
                              </div>
                            </section>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </li>
                <li className="amegamenu-item">
                  <Link
                    href="/quienes-somos"
                    onClick={() => setMegaOpen(false)}
                  >
                    Quiénes Somos
                  </Link>
                </li>
                <li className="amegamenu-item">
                  <Link
                    href="/faqs"
                    onClick={() => setMegaOpen(false)}
                  >
                    FAQs
                  </Link>
                </li>
                <li className="amegamenu-item">
                  <Link
                    href="/contactanos"
                    onClick={() => setMegaOpen(false)}
                  >
                    Contáctanos
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Center Brand Logo */}
          <div className="hbr-header__logo">
            <Link
              href={cityConfig.homePath}
              className="hbr-header__logo-link"
              aria-label={`Diamante Azul — Ir al inicio (${cityConfig.name})`}
              onClick={() => setMegaOpen(false)}
            >
              <Image
                src="/images/home/logo_diamante_azul.webp"
                alt="Diamante Azul"
                width={172}
                height={58}
                priority
                className="hbr-header__logo-img"
              />
            </Link>
          </div>

          {/* Right Action Capsule: City Switcher (Desktop horizontal / Mobile pin icon + vertical dropdown) + WhatsApp */}
          <div className="hbr-header__right">
            {/* Desktop Horizontal City Switcher (>=992px) */}
            <div
              className="hbr-city-switcher"
              role="group"
              aria-label="Seleccionar ciudad"
            >
              <span className="hbr-city-switcher__pin" aria-hidden="true">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </span>
              <button
                type="button"
                className={`hbr-city-switcher__btn ${
                  city === "lima" ? "is-active" : ""
                }`}
                aria-pressed={city === "lima"}
                onClick={() => {
                  setMegaOpen(false)
                  switchCity("lima")
                }}
              >
                Lima
              </button>
              <button
                type="button"
                className={`hbr-city-switcher__btn ${
                  city === "arequipa" ? "is-active" : ""
                }`}
                aria-pressed={city === "arequipa"}
                onClick={() => {
                  setMegaOpen(false)
                  switchCity("arequipa")
                }}
              >
                Arequipa
              </button>
            </div>

            {/* Mobile & Tablet Vertical Interactive City Dropdown (<=991px): Pin Icon Trigger -> Vertical List */}
            <div
              ref={cityDropdownRef}
              className={`hbr-city-dropdown ${
                cityDropdownOpen ? "is-open" : ""
              }`}
            >
              <button
                type="button"
                className="hbr-city-dropdown__trigger"
                aria-label={`Ciudad seleccionada: ${cityConfig.name}. Cambiar ciudad`}
                aria-expanded={cityDropdownOpen}
                aria-haspopup="listbox"
                onClick={() => setCityDropdownOpen((prev) => !prev)}
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </button>

              <div
                className="hbr-city-dropdown__menu"
                role="listbox"
                aria-label="Seleccionar ciudad"
              >
                <button
                  type="button"
                  role="option"
                  aria-selected={city === "lima"}
                  className={`hbr-city-dropdown__option ${
                    city === "lima" ? "is-active" : ""
                  }`}
                  onClick={() => {
                    switchCity("lima")
                    setCityDropdownOpen(false)
                  }}
                >
                  <span className="hbr-city-dropdown__dot" aria-hidden="true" />
                  <span>Lima</span>
                </button>
                <button
                  type="button"
                  role="option"
                  aria-selected={city === "arequipa"}
                  className={`hbr-city-dropdown__option ${
                    city === "arequipa" ? "is-active" : ""
                  }`}
                  onClick={() => {
                    switchCity("arequipa")
                    setCityDropdownOpen(false)
                  }}
                >
                  <span className="hbr-city-dropdown__dot" aria-hidden="true" />
                  <span>Arequipa</span>
                </button>
              </div>
            </div>

            <div className="cart-header">
              <a
                className="cart-link"
                href={generalWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Cotizar por WhatsApp"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
                <span className="cart-products-count">WA</span>
                <span className="cart-label">WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Mega Menu Blur Backdrop */}
      <div
        id="da-mega-backdrop"
        className={`hbr-mega-backdrop ${megaOpen ? "is-visible" : ""}`}
        onClick={() => setMegaOpen(false)}
      />

      {/* Mobile Left Slide-Out Drawer (#hbr-mobile-drawer) */}
      <div
        id="da-mobile-backdrop"
        className="hbr-mobile-backdrop"
        hidden={!drawerOpen}
        onClick={() => setDrawerOpen(false)}
      />
      <aside
        id="hbr-mobile-drawer"
        className="hbr-mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="hbr-mobile-drawer-title"
        aria-hidden={!drawerOpen}
      >
        <div className="hbr-mobile-drawer__heading">
          <h2 id="hbr-mobile-drawer-title">Menu</h2>
          <button
            id="da-drawer-close"
            type="button"
            className="hbr-mobile-drawer__close"
            aria-label="Cerrar menú"
            onClick={() => setDrawerOpen(false)}
          >
            ×
          </button>
        </div>
        <div className="hbr-mobile-drawer__content">
          <nav className="hbr-mnav" aria-label="Catálogo móvil">
            <div className="hbr-mnav__city-box">
              <p className="hbr-mnav__eyebrow">CIUDAD DE ATENCIÓN</p>
              <div
                className="hbr-mnav__city-pills"
                role="group"
                aria-label="Seleccionar ciudad"
              >
                <button
                  type="button"
                  className={`hbr-mnav__city-btn ${
                    city === "lima" ? "is-active" : ""
                  }`}
                  aria-pressed={city === "lima"}
                  onClick={() => {
                    switchCity("lima")
                    setDrawerOpen(false)
                  }}
                >
                  Lima (Principal)
                </button>
                <button
                  type="button"
                  className={`hbr-mnav__city-btn ${
                    city === "arequipa" ? "is-active" : ""
                  }`}
                  aria-pressed={city === "arequipa"}
                  onClick={() => {
                    switchCity("arequipa")
                    setDrawerOpen(false)
                  }}
                >
                  Arequipa
                </button>
              </div>
            </div>

            <p className="hbr-mnav__eyebrow">PRODUCTOS POR TIPO</p>
            <h3 className="hbr-mnav__title">
              Explora nuestras categorías
            </h3>
            <div className="hbr-mnav__models">
              {PRODUCT_CATEGORIES.map((cat) => {
                const firstProd = PACKAGES_DATA.find(
                  (p) => p.category === cat.slug
                )
                return (
                  <Link
                    key={cat.slug}
                    className="hbr-mnav__model"
                    href={`${cityConfig.homePath}#cat-${cat.slug}`}
                    onClick={() => handleCategorySelect(cat.slug)}
                  >
                    <span className="hbr-mnav__thumb">
                      {firstProd && (
                        <Image
                          src={firstProd.image}
                          alt={cat.label}
                          width={46}
                          height={46}
                          className="hbr-mnav__thumb-img"
                        />
                      )}
                    </span>
                    <span className="hbr-mnav__name">{cat.label}</span>
                    <span className="hbr-mnav__chevron" aria-hidden="true">
                      ›
                    </span>
                  </Link>
                )
              })}
            </div>
            <Link
              className="hbr-mnav__all"
              href={catalogAnchorHref}
              onClick={() => setDrawerOpen(false)}
            >
              <span>Ver los {PACKAGES_DATA.length} productos del catálogo</span>
              <span aria-hidden="true">→</span>
            </Link>

            <div className="hbr-mnav__links">
              <p className="hbr-mnav__eyebrow">MÁS DE DIAMANTE AZUL</p>
              <Link href={cityConfig.homePath} onClick={() => setDrawerOpen(false)}>
                Inicio ({cityConfig.name}) <span aria-hidden="true">↗</span>
              </Link>
              <Link
                href="/quienes-somos"
                onClick={() => setDrawerOpen(false)}
              >
                Quiénes Somos <span aria-hidden="true">↗</span>
              </Link>
              <Link href="/faqs" onClick={() => setDrawerOpen(false)}>
                FAQs <span aria-hidden="true">↗</span>
              </Link>
              <Link href="/contactanos" onClick={() => setDrawerOpen(false)}>
                Contáctanos <span aria-hidden="true">↗</span>
              </Link>
            </div>

            <a
              className="hbr-mnav__help"
              href={generalWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setDrawerOpen(false)}
            >
              <span className="hbr-mnav__eyebrow">
                ¿NECESITAS AYUDA PARA ELEGIR?
              </span>
              <strong className="hbr-mnav__help-title">
                Asesoría directa por WhatsApp
              </strong>
              <p className="hbr-mnav__help-copy">
                Te ayudamos a elegir el inflable o servicio ideal según tu
                espacio y tipo de evento.
              </p>
              <span className="hbr-mnav__help-cta">
                <span>Escribir al 948 311 603</span>
                <span aria-hidden="true">↗</span>
              </span>
            </a>
          </nav>
        </div>
      </aside>
    </>
  )
}
