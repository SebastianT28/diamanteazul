"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { buildWhatsAppUrl } from "@/data/packages"

const TICKER_ITEMS = [
  { label: "Uso Interior y Exterior", color: "#5CC2DE" },
  { label: "100% Desinfectados y Seguros", color: "#9DA5D3" },
  { label: "+1,000 Familias Felices en Lima", color: "#F4AEBC" },
  { label: "Instalación y Recojo Puntual Gratis", color: "#5CC2DE" },
  { label: "Reserva Rápida por WhatsApp", color: "#9DA5D3" },
]

export function SiteHeader() {
  const [megaOpen, setMegaOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [headerHidden, setHeaderHidden] = useState(false)

  const bannerRef = useRef<HTMLDivElement>(null)
  const tickerTrackRef = useRef<HTMLDivElement>(null)
  const tickerGroupRef = useRef<HTMLDivElement>(null)

  const generalWaUrl = buildWhatsAppUrl({})

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
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
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
                    href="/#hbr-home-range"
                    onClick={() => setMegaOpen(false)}
                  >
                    Los Inflables
                  </Link>
                  <button
                    id="da-mega-toggle"
                    type="button"
                    className="hbr-header__submenu-toggle"
                    aria-label="Desplegar catálogo de paquetes"
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
                    aria-label="Catálogo de paquetes"
                  >
                    <div className="hbr-mega">
                      <div className="hbr-mega__top">
                        <p className="hbr-mega__title">
                          Encuentra su paquete ideal.
                        </p>
                        <Link
                          className="hbr-mega__all"
                          href="/#hbr-home-range"
                          onClick={() => setMegaOpen(false)}
                        >
                          Ver todos los paquetes <span aria-hidden="true">→</span>
                        </Link>
                      </div>
                      <div className="hbr-mega__groups">
                        <section className="hbr-mega__group">
                          <div className="hbr-mega__group-head">
                            <span className="hbr-mega__eyebrow">
                              PAQUETES BÁSICO
                            </span>
                            <span className="hbr-mega__note">
                              Ideales para casa o departamento
                            </span>
                          </div>
                          <div className="hbr-mega__products">
                            <Link
                              className="hbr-mega__card"
                              href="/paquetes/mini-blanco"
                              onClick={() => setMegaOpen(false)}
                            >
                              <div className="hbr-mega__media da-grey-placeholder" />
                              <span className="hbr-mega__name">
                                El Mini Blanco
                              </span>
                            </Link>
                            <Link
                              className="hbr-mega__card"
                              href="/paquetes/mini-arcoiris"
                              onClick={() => setMegaOpen(false)}
                            >
                              <div className="hbr-mega__media da-grey-placeholder" />
                              <span className="hbr-mega__name">
                                Mini Arcoíris
                              </span>
                            </Link>
                          </div>
                        </section>

                        <section className="hbr-mega__group">
                          <div className="hbr-mega__group-head">
                            <span className="hbr-mega__eyebrow">
                              PAQUETES MEDIO
                            </span>
                            <span className="hbr-mega__note">
                              Los favoritos para cumpleaños
                            </span>
                          </div>
                          <div className="hbr-mega__products">
                            <Link
                              className="hbr-mega__card"
                              href="/paquetes/clasico-blanco"
                              onClick={() => setMegaOpen(false)}
                            >
                              <div className="hbr-mega__media da-grey-placeholder" />
                              <span className="hbr-mega__name">
                                El Clásico Blanco
                              </span>
                            </Link>
                            <Link
                              className="hbr-mega__card"
                              href="/paquetes/celeste-diamante"
                              onClick={() => setMegaOpen(false)}
                            >
                              <div className="hbr-mega__media da-grey-placeholder" />
                              <span className="hbr-mega__name">
                                Celeste Diamante
                              </span>
                            </Link>
                          </div>
                        </section>

                        <section className="hbr-mega__group hbr-mega__group--rainbows">
                          <div className="hbr-mega__group-head">
                            <span className="hbr-mega__eyebrow">
                              PAQUETES PREMIUM
                            </span>
                            <span className="hbr-mega__note">
                              Máxima magia con piscina de pelotas
                            </span>
                          </div>
                          <div className="hbr-mega__products">
                            <Link
                              className="hbr-mega__card"
                              href="/paquetes/arcoiris-rosa"
                              onClick={() => setMegaOpen(false)}
                            >
                              <div className="hbr-mega__media da-grey-placeholder" />
                              <span className="hbr-mega__name">
                                Arcoíris Rosa
                              </span>
                            </Link>
                            <Link
                              className="hbr-mega__card"
                              href="/paquetes/arcoiris-lavanda"
                              onClick={() => setMegaOpen(false)}
                            >
                              <div className="hbr-mega__media da-grey-placeholder" />
                              <span className="hbr-mega__name">
                                Arcoíris Lavanda
                              </span>
                            </Link>
                            <Link
                              className="hbr-mega__card"
                              href="/paquetes/arcoiris-azul"
                              onClick={() => setMegaOpen(false)}
                            >
                              <div className="hbr-mega__media da-grey-placeholder" />
                              <span className="hbr-mega__name">
                                Arcoíris Azul
                              </span>
                            </Link>
                          </div>
                        </section>
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

          {/* Center Empty Grey Logo Placeholder */}
          <div className="hbr-header__logo">
            <Link
              href="/"
              className="hbr-header__logo-placeholder da-grey-placeholder"
              aria-label="Logo Diamante Azul"
            />
          </div>

          {/* Right Action Capsule */}
          <div className="hbr-header__right">
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
            <p className="hbr-mnav__eyebrow">ENCUENTRA SU FAVORITO</p>
            <h3 className="hbr-mnav__title">
              Explora los paquetes de inflables
            </h3>
            <div className="hbr-mnav__models">
              <Link
                className="hbr-mnav__model"
                href="/paquetes/mini-blanco"
                onClick={() => setDrawerOpen(false)}
              >
                <span className="hbr-mnav__thumb da-grey-placeholder" />
                <span className="hbr-mnav__name">
                  Paquete Básico — El Mini Blanco
                </span>
                <span className="hbr-mnav__chevron" aria-hidden="true">
                  ›
                </span>
              </Link>
              <Link
                className="hbr-mnav__model"
                href="/paquetes/mini-arcoiris"
                onClick={() => setDrawerOpen(false)}
              >
                <span className="hbr-mnav__thumb da-grey-placeholder" />
                <span className="hbr-mnav__name">
                  Paquete Básico — Mini Arcoíris
                </span>
                <span className="hbr-mnav__chevron" aria-hidden="true">
                  ›
                </span>
              </Link>
              <Link
                className="hbr-mnav__model"
                href="/paquetes/clasico-blanco"
                onClick={() => setDrawerOpen(false)}
              >
                <span className="hbr-mnav__thumb da-grey-placeholder" />
                <span className="hbr-mnav__name">
                  Paquete Medio — El Clásico Blanco
                </span>
                <span className="hbr-mnav__chevron" aria-hidden="true">
                  ›
                </span>
              </Link>
              <Link
                className="hbr-mnav__model"
                href="/paquetes/celeste-diamante"
                onClick={() => setDrawerOpen(false)}
              >
                <span className="hbr-mnav__thumb da-grey-placeholder" />
                <span className="hbr-mnav__name">
                  Paquete Medio — Celeste Diamante
                </span>
                <span className="hbr-mnav__chevron" aria-hidden="true">
                  ›
                </span>
              </Link>
              <Link
                className="hbr-mnav__model"
                href="/paquetes/arcoiris-rosa"
                onClick={() => setDrawerOpen(false)}
              >
                <span className="hbr-mnav__thumb da-grey-placeholder" />
                <span className="hbr-mnav__name">
                  Paquete Premium — Arcoíris Rosa
                </span>
                <span className="hbr-mnav__chevron" aria-hidden="true">
                  ›
                </span>
              </Link>
              <Link
                className="hbr-mnav__model"
                href="/paquetes/arcoiris-lavanda"
                onClick={() => setDrawerOpen(false)}
              >
                <span className="hbr-mnav__thumb da-grey-placeholder" />
                <span className="hbr-mnav__name">
                  Paquete Premium — Arcoíris Lavanda
                </span>
                <span className="hbr-mnav__chevron" aria-hidden="true">
                  ›
                </span>
              </Link>
              <Link
                className="hbr-mnav__model"
                href="/paquetes/arcoiris-azul"
                onClick={() => setDrawerOpen(false)}
              >
                <span className="hbr-mnav__thumb da-grey-placeholder" />
                <span className="hbr-mnav__name">
                  Paquete Premium — Arcoíris Azul
                </span>
                <span className="hbr-mnav__chevron" aria-hidden="true">
                  ›
                </span>
              </Link>
            </div>
            <Link
              className="hbr-mnav__all"
              href="/#hbr-home-range"
              onClick={() => setDrawerOpen(false)}
            >
              <span>Ver todos los paquetes</span>
              <span aria-hidden="true">→</span>
            </Link>

            <div className="hbr-mnav__links">
              <p className="hbr-mnav__eyebrow">MÁS DE DIAMANTE AZUL</p>
              <Link href="/" onClick={() => setDrawerOpen(false)}>
                Inicio <span aria-hidden="true">↗</span>
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
                Te ayudamos a elegir el inflable ideal según el espacio y la
                edad de los niños.
              </p>
              <span className="hbr-mnav__help-cta">
                <span>Escribir a WhatsApp</span>
                <span aria-hidden="true">→</span>
              </span>
            </a>
          </nav>
        </div>
      </aside>
    </>
  )
}
