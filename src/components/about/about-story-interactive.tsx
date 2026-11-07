"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"

interface JourneySlide {
  id: string
  year: string
  title: string
  description: string
  badgeTitle: string
  badgeSub: string
  ariaLabel: string
}

const JOURNEY_SLIDES: JourneySlide[] = [
  {
    id: "hbs-journey-2022",
    year: "2022",
    title: "Donde todo comenzó.",
    description:
      "Nuestra colección original presentó nuestro amor por los tonos suaves, con diseños en blanco neutro, celeste, rosa y arcoíris pensados para jugar en casa.",
    badgeTitle: "Colección Clásica 2022",
    badgeSub: "Placeholder Gris · El Rebote Neutro",
    ariaLabel: "2022: Donde todo comenzó. — 1 de 4",
  },
  {
    id: "hbs-journey-2023",
    year: "2023",
    title: "El arcoíris, reimaginado.",
    description:
      "Nuestra colección creció con los modelos Arcoíris Neutro y Arcoíris Celeste: más formas de encontrar un castillo que armonice con tu espacio.",
    badgeTitle: "Línea Arcoíris Pastel 2023",
    badgeSub: "Placeholder Gris · El Arcoíris Reimaginado",
    ariaLabel: "2023: El arcoíris, reimaginado. — 2 de 4",
  },
  {
    id: "hbs-journey-2025",
    year: "2025",
    title: "Espacios pequeños. Grandes sonrisas.",
    description:
      "Presentamos el Mini Inflable, llevando nuestra estética limpia y pastel a un diseño compacto hecho para aventuras cotidianas en interiores.",
    badgeTitle: "Línea Mini Bounce 2025",
    badgeSub: "Placeholder Gris · Formato Compacto",
    ariaLabel: "2025: Espacios pequeños. Grandes sonrisas. — 3 de 4",
  },
  {
    id: "hbs-journey-2026",
    year: "2026",
    title: "Hola, Mini Arcoíris.",
    description:
      "Un nuevo capítulo con el lanzamiento de nuestro Mini Arcoíris: un diseño encantador pensado para llevar aún más alegría a las celebraciones dentro de casa.",
    badgeTitle: "Lanzamiento Mini Arcoíris 2026",
    badgeSub: "Placeholder Gris · Nueva Colección",
    ariaLabel: "2026: Hola, Mini Arcoíris. — 4 de 4",
  },
]

const NAV_SECTIONS = [
  { id: "hbs-purpose", label: "Nuestro propósito" },
  { id: "hbs-timeline", label: "Nuestro recorrido" },
  { id: "hbs-finer-details", label: "Los pequeños detalles" },
  { id: "hbs-home-use", label: "Hecho para casa" },
]

const RIBBON_PHRASES = [
  "Pequeñas aventuras. Recuerdos para siempre.",
  "Pensado desde el primer detalle.",
  "Hermoso en tu propio hogar.",
  "Espacio para la imaginación.",
  "Un poquito más de alegría.",
]

interface MosaicTile {
  label: string
  sub?: string
  corner?: string
  quote?: string
}

const MOSAIC_TILES: MosaicTile[] = [
  { label: "Arcoíris Blanco", sub: "Sala familiar · Placeholder" },
  { label: "Arcoíris Rosa", sub: "Tarde de juegos · Placeholder" },
  { label: "Clásico con Globos", sub: "Cumpleaños en casa · Placeholder" },
  { label: "Fiesta Temática", sub: "Mini en sala · Placeholder" },
  { label: "Diversión entre Amigos", sub: "Tobogán pastel · Placeholder" },
  { label: "Mini Blanco", sub: "Primer añito · Placeholder" },
  { label: "Mini Arcoíris", sub: "Rincón infantil · Placeholder" },
  {
    label: "Reel en Casa",
    corner: "▶",
    quote: "El tipo de alegría... que querrías guardar para siempre 🤍",
  },
  {
    label: "Pequeños Saltos",
    sub: "Galería familiar · Placeholder",
    corner: "❐",
  },
  {
    label: "Diseño Residencial",
    sub: "Hogar moderno · Placeholder",
    corner: "❐",
  },
]

export function AboutStoryInteractive() {
  // 1. Jump Navigation Pill Bar state
  const [navPinned, setNavPinned] = useState(false)
  const [activeSection, setActiveSection] = useState("hbs-purpose")
  const navSlotRef = useRef<HTMLDivElement>(null)

  // 2. Our Journey Card Deck state (starts on index 1 = 2023 as in reference)
  const [journeyIndex, setJourneyIndex] = useState(1)
  const [journeyStatus, setJourneyStatus] = useState("")
  const [journeyPaused, setJourneyPaused] = useState(false)
  const touchStartRef = useRef<{ x: number; y: number; id: number } | null>(
    null
  )

  // 3. Wave Phrase Ribbon refs
  const ribbonBandRef = useRef<HTMLDivElement>(null)
  const ribbonTrackRef = useRef<HTMLDivElement>(null)
  const ribbonGroupRef = useRef<HTMLDivElement>(null)

  // Sync Jump Navigation fixed state & Scroll-Spy
  useEffect(() => {
    let ticking = false
    let lastPinned = false

    const updateScrollSpy = () => {
      ticking = false
      const slot = navSlotRef.current
      if (slot) {
        const topGap = window.innerWidth <= 650 ? 10 : 18
        const shouldPin = slot.getBoundingClientRect().top <= topGap
        if (shouldPin !== lastPinned) {
          lastPinned = shouldPin
          setNavPinned(shouldPin)
          document.documentElement.classList.toggle("hbs-pill-fixed", shouldPin)
        }
      }

      let current = NAV_SECTIONS[0].id
      const offset = 150
      for (const sec of NAV_SECTIONS) {
        const el = document.getElementById(sec.id)
        if (el && el.getBoundingClientRect().top <= offset) {
          current = sec.id
        }
      }
      if (
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 10
      ) {
        current = NAV_SECTIONS[NAV_SECTIONS.length - 1].id
      }
      setActiveSection((prev) => (prev === current ? prev : current))
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(updateScrollSpy)
    }

    updateScrollSpy()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      document.documentElement.classList.remove("hbs-pill-fixed")
    }
  }, [])

  // Auto-rotation for "Our Journey" card deck (5s interval when not paused)
  useEffect(() => {
    if (journeyPaused) return
    const timer = window.setTimeout(() => {
      setJourneyIndex((prev) => (prev + 1) % JOURNEY_SLIDES.length)
    }, 5000)
    return () => window.clearTimeout(timer)
  }, [journeyIndex, journeyPaused])

  const selectJourneySlide = (nextIdx: number, announce = true) => {
    const total = JOURNEY_SLIDES.length
    const normalized = ((nextIdx % total) + total) % total
    setJourneyIndex(normalized)
    if (announce) {
      setJourneyStatus(JOURNEY_SLIDES[normalized].ariaLabel)
    }
  }

  const getSlidePosition = (i: number) => {
    const total = JOURNEY_SLIDES.length
    const distance = (i - journeyIndex + total) % total
    if (distance === 0) return "active"
    if (distance === 1) return "next"
    if (distance === total - 1) return "prev"
    return "behind"
  }

  // Wave-lettering animation for the 5-color phrase ribbon (.hbr-play-banner)
  useEffect(() => {
    const band = ribbonBandRef.current
    const track = ribbonTrackRef.current
    const group1 = ribbonGroupRef.current
    if (!band || !track || !group1) return

    let glyphs: { node: HTMLElement; x: number }[] = []
    let rafId = 0
    let isVisible = false
    let cachedWidth = window.innerWidth
    let cachedAmplitude = window.innerWidth <= 650 ? 18 : 28
    let bannerDistance = 1200
    const startTime = performance.now()

    const applyWaveFrame = (originOffset: number) => {
      const width = cachedWidth
      const amplitude = cachedAmplitude
      for (let i = 0; i < glyphs.length; i++) {
        const item = glyphs[i]
        const x = originOffset + item.x
        if (x < -120 || x > width + 120) continue
        const phase = (((x / width) % 1) + 1) % 1
        const sign = phase < 0.5 ? -1 : 1
        const t = phase < 0.5 ? phase * 2 : (phase - 0.5) * 2
        const y = sign * 4 * amplitude * t * (1 - t)
        const slope = sign * 8 * (amplitude / width) * (1 - 2 * t)
        const deg = (Math.atan(slope) * 180) / Math.PI
        item.node.style.transform = `translateY(${y.toFixed(
          2
        )}px) rotate(${deg.toFixed(2)}deg)`
      }
    }

    const measureRibbon = () => {
      cachedWidth = band.offsetWidth || window.innerWidth
      cachedAmplitude = window.innerWidth <= 650 ? 18 : 28
      const w = group1.offsetWidth
      if (w > 0) {
        bannerDistance = w
        band.style.setProperty("--hbr-banner-distance", `${w}px`)
        band.style.setProperty(
          "--hbr-banner-duration",
          `${(w / 45).toFixed(2)}s`
        )
      }
      glyphs = Array.from(
        track.querySelectorAll<HTMLElement>(".hbr-ribbon-glyph")
      ).map((node) => {
        const phrase = node.parentElement as HTMLElement | null
        const group = phrase?.parentElement as HTMLElement | null
        const x =
          (group?.offsetLeft || 0) +
          (phrase?.offsetLeft || 0) +
          node.offsetLeft +
          node.offsetWidth / 2
        return { node, x }
      })
      applyWaveFrame(0)
    }

    const drawWave = (now: number) => {
      if (!isVisible) return
      const elapsedSec = (now - startTime) / 1000
      const origin = -((elapsedSec * 45) % bannerDistance)
      applyWaveFrame(origin)
      rafId = window.requestAnimationFrame(drawWave)
    }

    measureRibbon()
    window.addEventListener("resize", measureRibbon, { passive: true })

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        isVisible = Boolean(entry?.isIntersecting)
        window.cancelAnimationFrame(rafId)
        if (isVisible) {
          rafId = window.requestAnimationFrame(drawWave)
        }
      },
      { rootMargin: "150px 0px" }
    )
    observer.observe(band)

    return () => {
      observer.disconnect()
      window.removeEventListener("resize", measureRibbon)
      window.cancelAnimationFrame(rafId)
    }
  }, [])

  const renderRibbonGroup = (isPrimary: boolean) => (
    <div
      ref={isPrimary ? ribbonGroupRef : undefined}
      className="hbr-play-banner__group"
      aria-hidden={isPrimary ? undefined : "true"}
    >
      {RIBBON_PHRASES.map((phrase, pIdx) => (
        <span key={pIdx} aria-label={phrase}>
          {Array.from(phrase).map((ch, cIdx) => (
            <span
              key={cIdx}
              className="hbr-ribbon-glyph"
              aria-hidden="true"
            >
              {ch}
            </span>
          ))}
        </span>
      ))}
    </div>
  )

  return (
    <main className="hb-story hb-story--page hb-story--full-width">
      {/* 1. IMAGEN PRINCIPAL DE ENTRADA CON EL TEXTO CENTRAL (.hb-story__hero--cover) */}
      <section
        className="hb-story__hero hb-story__hero--cover"
        aria-labelledby="hbs-title"
      >
        <figure
          className="hb-story__photo hb-story__hero-backdrop"
          aria-hidden="true"
        />
        <div className="hb-story__hero-placeholder-tag" aria-hidden="true">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <span>Imagen Principal de Portada (Placeholder Gris)</span>
        </div>
        <div className="hb-story__inner hb-story__hero-content">
          <p className="hb-story__eyebrow">Nuestra historia</p>
          <h1 id="hbs-title">
            Grandes sonrisas.
            <br />
            Diseñadas con cariño.
          </h1>
          <div className="hb-story__copy">
            <p className="hb-story__lead">
              Castillos inflables modernos en tonos pastel para pequeñas
              aventuras, recuerdos cotidianos y hogares como el tuyo.
            </p>
          </div>
        </div>
      </section>

      {/* 2. BARRA DE NAVEGACIÓN DE SECCIONES (JUMP NAVIGATION PILL BAR) */}
      <div className="hb-story-nav-slot" ref={navSlotRef}>
        <nav
          className={`hbr-section-nav hb-story-nav ${
            navPinned ? "hb-story-nav--fixed" : ""
          }`}
          aria-label="Explorar nuestra historia"
          data-hbs-nav=""
        >
          <div className="hbr-section-nav__links">
            {NAV_SECTIONS.map((sec) => {
              const isActive = activeSection === sec.id
              return (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  data-hbs-section={sec.id}
                  className={`hbr-section-nav__link ${
                    isActive ? "is-active" : ""
                  }`}
                  aria-current={isActive ? "location" : undefined}
                >
                  {sec.label}
                </a>
              )
            })}
          </div>
        </nav>
      </div>

      {/* 3. APARTADO: OUR PURPOSE / NUESTRO PROPÓSITO (#hbs-purpose) */}
      <section
        className="hb-story__inner"
        aria-labelledby="hbs-purpose-heading"
        id="hbs-purpose"
        data-hbs-target=""
      >
        <div className="hb-story__mission">
          <p className="hb-story__eyebrow">Más juego. Más posibilidades.</p>
          <h2 id="hbs-purpose-heading">
            Hecho para sus momentos más felices.
            <br />
            Diseñado para tu hogar.
          </h2>
          <p>
            En Diamante Azul creemos que el juego en la infancia debe sentirse
            mágico y, al mismo tiempo, verse hermoso dentro de casa. Creamos
            experiencias con castillos inflables en tonos pastel pensadas para
            la vida familiar moderna.
          </p>
          <p>
            Suaves a la vista, llenos de alegría para ellos y cuidados de
            principio a fin, nuestros paquetes convierten cumpleaños, reuniones
            en el jardín y tardes en familia en recuerdos que perduran.
          </p>
          <div
            className="hb-story__swatches"
            aria-label="Paleta de colores pastel Diamante Azul"
          >
            <span title="Celeste Diamante (#5CC2DE)" />
            <span title="Rosa Pastel (#F4AEBC)" />
            <span title="Lavanda Pastel (#9DA5D3)" />
            <span title="Blanco Hielo (#D6EEF8)" />
          </div>
        </div>
      </section>

      {/* 4. APARTADO: OUR JOURNEY — BARAJA DE IMÁGENES INTERACTIVA (#hbs-timeline) */}
      <section
        className="hb-story__section hb-story__inner"
        aria-labelledby="hbs-journey"
        id="hbs-timeline"
        data-hbs-target=""
      >
        <div className="hb-story__heading">
          <p className="hb-story__eyebrow">Nuestro recorrido</p>
          <h2 id="hbs-journey">Un pequeño salto a través del tiempo.</h2>
          <p>
            Nuevas formas. Nuevos colores. El mismo amor por el diseño bien
            pensado.
          </p>
        </div>

        <div
          className="hbs-journey hbs-journey--ready"
          data-hbs-journey=""
          role="region"
          aria-roledescription="carrusel"
          aria-label="Nuestro recorrido desde 2022 hasta 2026"
          data-hbs-ready="true"
          onPointerEnter={() => setJourneyPaused(true)}
          onPointerLeave={() => setJourneyPaused(false)}
          onFocus={() => setJourneyPaused(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
              setJourneyPaused(false)
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
              e.preventDefault()
              selectJourneySlide(
                journeyIndex + (e.key === "ArrowLeft" ? -1 : 1),
                true
              )
            }
          }}
        >
          <div
            className="hbs-journey__stage"
            aria-label="Tarjetas de recorrido. Usa las flechas izquierda y derecha para navegar."
            tabIndex={0}
            onPointerDown={(e) => {
              if (e.pointerType !== "touch" && e.pointerType !== "pen") return
              touchStartRef.current = {
                x: e.clientX,
                y: e.clientY,
                id: e.pointerId,
              }
              setJourneyPaused(true)
            }}
            onPointerUp={(e) => {
              const start = touchStartRef.current
              if (!start || e.pointerId !== start.id) return
              const dx = e.clientX - start.x
              const dy = e.clientY - start.y
              touchStartRef.current = null
              setJourneyPaused(false)
              if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) {
                selectJourneySlide(journeyIndex + (dx < 0 ? 1 : -1), true)
              }
            }}
          >
            {JOURNEY_SLIDES.map((slide, idx) => {
              const position = getSlidePosition(idx)
              const isActive = idx === journeyIndex
              return (
                <article
                  key={slide.id}
                  className="hbs-journey__card"
                  id={slide.id}
                  data-hbs-slide=""
                  role="group"
                  aria-roledescription="slide"
                  aria-label={slide.ariaLabel}
                  data-position={position}
                  aria-hidden={isActive ? "false" : "true"}
                  onClick={() => {
                    if (!isActive) selectJourneySlide(idx, true)
                  }}
                >
                  <div className="hbs-journey__image da-grey-placeholder">
                    <div className="da-grey-placeholder__badge">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="3" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>
                      <span className="da-grey-placeholder__title">
                        {slide.badgeTitle}
                      </span>
                      <span className="da-grey-placeholder__sub">
                        {slide.badgeSub}
                      </span>
                    </div>
                  </div>
                  <div className="hbs-journey__body">
                    <p className="hbs-journey__year">{slide.year}</p>
                    <h3>{slide.title}</h3>
                    <p>{slide.description}</p>
                  </div>
                </article>
              )
            })}
          </div>

          <div className="hbs-journey__controls" data-hbs-controls="">
            <button
              className="hbs-journey__arrow"
              type="button"
              data-hbs-prev=""
              aria-label="Tarjeta anterior"
              onClick={() => selectJourneySlide(journeyIndex - 1, true)}
            >
              <span aria-hidden="true">←</span>
            </button>
            <div
              className="hbs-journey__dots"
              role="group"
              aria-label="Elegir un año"
            >
              {JOURNEY_SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  className="hbs-journey__dot"
                  type="button"
                  data-hbs-dot=""
                  aria-label={`Mostrar ${slide.year}`}
                  aria-controls={slide.id}
                  aria-pressed={idx === journeyIndex ? "true" : "false"}
                  onClick={() => selectJourneySlide(idx, true)}
                />
              ))}
            </div>
            <button
              className="hbs-journey__arrow"
              type="button"
              data-hbs-next=""
              aria-label="Tarjeta siguiente"
              onClick={() => selectJourneySlide(journeyIndex + 1, true)}
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
          <p
            className="hbs-journey__status"
            data-hbs-status=""
            aria-live="polite"
            aria-atomic="true"
          >
            {journeyStatus}
          </p>
        </div>
      </section>

      {/* 5A. APARTADO: THE LITTLE DETAILS — "IT'S IN THE DETAILS" (#hbs-finer-details) */}
      <section
        className="hb-story__section hb-story__wave"
        aria-labelledby="hbs-details"
        id="hbs-finer-details"
        data-hbs-target=""
      >
        <div className="hb-story__inner hb-story__split">
          <div className="hb-story__detail-photos">
            <figure className="hb-story__photo da-grey-placeholder">
              <div className="da-grey-placeholder__badge">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="3" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
                <span className="da-grey-placeholder__title">
                  Fotografía de Detalle y Costuras Pastel
                </span>
                <span className="da-grey-placeholder__sub">
                  Placeholder Gris 1:1 · Acabados y material premium
                </span>
              </div>
            </figure>
          </div>
          <div>
            <p className="hb-story__eyebrow">Está en los detalles</p>
            <h2 id="hbs-details">
              Son las pequeñas cosas
              <br />
              las que nos hacen únicos.
            </h2>
            <div className="hb-story__copy">
              <p>
                Creemos que la magia está en los detalles, incluso en los más
                pequeños.
              </p>
              <p>
                Cada accesorio mantiene tonos neutros y pastel suaves. Así toda
                la instalación luce impecable en tus fotos y en tu hogar.
              </p>
            </div>
            <p className="hb-story__small">
              Cada accesorio e implemento de seguridad se instala siguiendo
              estrictos protocolos de desinfección y anclaje según la superficie
              de tu evento.
            </p>
          </div>
        </div>
      </section>

      {/* 5B. APARTADO: THE LITTLE DETAILS — "CONSIDERED FROM START TO FINISH" (#whats-included) */}
      <section
        id="whats-included"
        className="hbr-included hb-story__values hbr-jump-target"
        aria-labelledby="hbs-values-title"
      >
        <div className="hbr-included__inner">
          <header className="hbr-included__header">
            <p className="hbr-included__eyebrow">Pensado de principio a fin</p>
            <h2 className="hbr-included__title" id="hbs-values-title">
              Cuidado en cada detalle.
            </h2>
            <p className="hbr-included__intro">
              Los pequeños extras también son parte de la historia.
            </p>
            <span className="hbr-included__sparkle" aria-hidden="true">
              ✦
            </span>
          </header>

          <div className="hbr-included__grid">
            <article className="hbr-included__card">
              <div className="hbr-included__art" aria-hidden="true">
                <svg
                  viewBox="0 0 64 64"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="28" cy="34" r="14" />
                  <circle cx="28" cy="34" r="5" />
                  <path d="M36 22 H52 V32 H41" />
                  <path d="M18 48 H38" />
                  <path d="M22 48 V53 M34 48 V53" />
                </svg>
              </div>
              <h3 className="hbr-included__name">Turbina en tono neutro</h3>
              <p className="hbr-included__copy">
                Olvídate de los motores industriales de colores chillones.
                Nuestras turbinas silenciosas mantienen una estética limpia y
                discreta.
              </p>
            </article>

            <article className="hbr-included__card">
              <div className="hbr-included__art" aria-hidden="true">
                <svg
                  viewBox="0 0 64 64"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="20" y="14" width="24" height="14" rx="4" />
                  <path d="M32 28 V52" />
                  <path d="M29 52 H35" />
                </svg>
              </div>
              <h3 className="hbr-included__name">Mazo de goma blanco</h3>
              <p className="hbr-included__copy">
                Nuestro equipo utiliza herramientas limpias y delicadas en color
                blanco para un montaje rápido, seguro y sin marcas.
              </p>
            </article>

            <article className="hbr-included__card">
              <div className="hbr-included__art" aria-hidden="true">
                <svg
                  viewBox="0 0 64 64"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M24 18 A6 6 0 1 1 36 18 C36 21 30 22 30 26 V50" />
                  <path d="M38 22 L46 46" />
                  <circle cx="41" cy="20" r="3" />
                </svg>
              </div>
              <h3 className="hbr-included__name">Anclajes en tonos suaves</h3>
              <p className="hbr-included__copy">
                Estacas para césped o pesas recubiertas en tonos pastel para
                fijar el castillo con total firmeza sin romper la estética.
              </p>
            </article>

            <article className="hbr-included__card">
              <div className="hbr-included__art" aria-hidden="true">
                <svg
                  viewBox="0 0 64 64"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="16" y="24" width="32" height="24" rx="6" />
                  <path d="M24 24 V20 A8 8 0 0 1 40 20 V24" />
                  <path d="M16 34 H48" />
                </svg>
              </div>
              <h3 className="hbr-included__name">
                Listo para la siguiente aventura
              </h3>
              <p className="hbr-included__copy">
                Traslado en fundas higienizadas, alfombra protectora de ingreso
                y recojo puntual incluido al finalizar tu celebración.
              </p>
            </article>
          </div>

          <p className="hb-story__small">
            El sistema de fijación e implementos varía según el tamaño del
            castillo y si el montaje se realiza en interior o exterior.
          </p>
        </div>
      </section>

      {/* 6. CINTA INFINITA DE FRASES EN CURVA DE COLORES (.hbr-play-banner) */}
      <div className="hb-story__ribbon-bridge">
        <section
          className="hbr-play-banner is-ready"
          data-hbr-play-banner=""
          data-speed="45"
          aria-label="Diseñado con cariño para la alegría cotidiana"
        >
          <div
            className="hbr-play-banner__band hbr-wave-enabled"
            ref={ribbonBandRef}
          >
            <div className="hbr-wave-surface" aria-hidden="true">
              <svg
                viewBox="0 0 1000 220"
                preserveAspectRatio="none"
                focusable="false"
              >
                <path d="M0 44 C250 -10 500 98 750 44 S1000 -10 1000 44 L1000 176 C750 122 500 230 250 176 S0 122 0 176 Z" />
              </svg>
            </div>
            <div className="hbr-play-banner__viewport">
              <div className="hbr-play-banner__track" ref={ribbonTrackRef}>
                {renderRibbonGroup(true)}
                {renderRibbonGroup(false)}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 7. ÚLTIMA SECCIÓN: "THEIR NEXT HAPPY MEMORY STARTS AT HOME" + MOSAICO DE 10 IMÁGENES (#hbs-home-use) */}
      <section
        className="hb-story__section hb-story__final"
        aria-labelledby="hbs-next"
        id="hbs-home-use"
        data-hbs-target=""
      >
        <div className="hb-story__inner">
          <p className="hb-story__eyebrow">Por más pequeños grandes momentos</p>
          <h2 id="hbs-next">
            Su próximo recuerdo feliz
            <br />
            empieza en casa.
          </h2>
          <p className="hb-story__copy">
            Encuentra el castillo inflable perfecto para tu mundo.
          </p>
          <div className="hb-story__actions">
            <Link className="hb-story__button" href="/#hbr-home-range">
              <span>Explorar los inflables</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Mosaico de 10 pequeñas imágenes (5 columnas × 2 filas en Desktop, 2 columnas en Móvil) */}
        <div className="hbs-home-mosaic-wrap">
          <div
            className="hbs-home-mosaic"
            role="region"
            aria-label="Galería de momentos felices en casa"
          >
            {MOSAIC_TILES.map((tile, idx) => (
              <div key={idx} className="hbs-home-mosaic__tile">
                {tile.corner && (
                  <span className="hbs-home-mosaic__corner" aria-hidden="true">
                    {tile.corner}
                  </span>
                )}
                <div className="hbs-home-mosaic__pill">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                  <span className="hbs-home-mosaic__label">{tile.label}</span>
                  {tile.sub && (
                    <span className="hbs-home-mosaic__sub">{tile.sub}</span>
                  )}
                </div>
                {tile.quote && (
                  <div className="hbs-home-mosaic__quote">{tile.quote}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

