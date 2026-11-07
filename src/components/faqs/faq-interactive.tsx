"use client"

import { useState } from "react"
import Link from "next/link"
import { buildWhatsAppUrl } from "@/data/packages"

type FaqFilterId = "all" | "bounce" | "mini" | "ordering" | "safety"

interface FaqItemData {
  id: string
  question: string
  answer: React.ReactNode
}

interface FaqGroupData {
  id: "bounce" | "safety"
  title: string
  headingId: string
  items: FaqItemData[]
}

const FAQ_FILTERS: { id: FaqFilterId; label: string }[] = [
  { id: "all", label: "Todas las preguntas" },
  { id: "bounce", label: "Castillos Inflables" },
  { id: "mini", label: "Mini Inflables" },
  { id: "ordering", label: "Reservas y Entregas" },
  { id: "safety", label: "Seguridad y Uso" },
]

const FAQ_GROUPS: FaqGroupData[] = [
  {
    id: "bounce",
    title: "Castillos Inflables",
    headingId: "hbf-bounce",
    items: [
      {
        id: "bounce-1",
        question:
          "¿Se pueden instalar los castillos inflables tanto en interiores como en exteriores?",
        answer: (
          <p>
            Sí, nuestros castillos inflables pastel están diseñados para lucir
            hermosos tanto en salas amplias, cocheras y terrazas techadas como
            en jardines exteriores. Nuestro equipo evalúa la superficie al
            llegar e instala la protección y el sistema de anclaje ideal.
          </p>
        ),
      },
      {
        id: "bounce-2",
        question: "¿Cuánto tiempo toma dejar listo e inflado el castillo?",
        answer: (
          <p>
            ¡El inflado en sí toma apenas <strong>60 segundos</strong>! Nuestro
            equipo llega con anticipación antes del inicio de tu celebración
            para colocar los pisos microporosos, desinfectar cada superficie y
            dejar todo impecable.
          </p>
        ),
      },
      {
        id: "bounce-3",
        question:
          "¿Cómo garantizan la limpieza y desinfección de cada inflable?",
        answer: (
          <p>
            Cada castillo y cada pelota de la piscina pasan por un riguroso
            protocolo de higienización antes y después de cada evento utilizando
            productos seguros para niños, además de una segunda limpieza en
            sitio una vez instalado.
          </p>
        ),
      },
      {
        id: "bounce-4",
        question:
          "¿Es normal sentir una ligera salida de aire por las costuras del inflable?",
        answer: (
          <p>
            Sí, no te preocupes. Una leve salida de aire a través de las
            costuras es completamente normal y necesaria para mantener la
            presión elástica perfecta mientras los niños saltan sin que el
            material se sobretensione.
          </p>
        ),
      },
      {
        id: "bounce-5",
        question: "¿La turbina de aire hace mucho ruido?",
        answer: (
          <p>
            Nuestras turbinas de tono neutro son de bajo nivel sonoro —
            ¡probablemente las risas de los niños se escuchen más fuerte! En
            interiores el sonido se percibe ligeramente más que al aire libre en
            jardín.
          </p>
        ),
      },
      {
        id: "bounce-6",
        question:
          "¿Qué espacio libre necesito considerar alrededor del castillo?",
        answer: (
          <p>
            Recomendamos contar con al menos 60 cm libres alrededor de los lados
            y 1 metro en la parte posterior para ubicar la turbina con total
            comodidad, además de verificar la altura libre del techo si es en
            interior.
          </p>
        ),
      },
    ],
  },
  {
    id: "safety",
    title: "Seguridad y Uso",
    headingId: "hbf-safety",
    items: [
      {
        id: "safety-1",
        question: "¿Cuántos niños pueden saltar al mismo tiempo?",
        answer: (
          <>
            <p>
              Nuestros{" "}
              <strong>
                modelos compactos de 2.0m × 2.0m permiten de 2 a 3 niños
                simultáneamente
              </strong>
              , mientras que nuestros{" "}
              <strong>
                modelos medianos y grandes (2.5m a 3.5m) permiten de 4 a 6 niños
              </strong>{" "}
              según la edad.
            </p>
            <p>
              Recomendamos que los niños que ingresen juntos tengan edades y
              estaturas similares, siempre bajo la supervisión de un adulto
              responsable.
            </p>
          </>
        ),
      },
      {
        id: "safety-2",
        question:
          "¿Se puede utilizar el castillo inflable con agua o espuma?",
        answer: (
          <p>
            No. Nuestros castillos funcionan con turbinas eléctricas continuas y
            están confeccionados en lona mate premium para uso en seco. No deben
            mojarse ni usarse cerca de piscinas con agua, pintura, calzado o
            alimentos.
          </p>
        ),
      },
      {
        id: "safety-3",
        question:
          "¿La turbina debe permanecer encendida durante todo el alquiler?",
        answer: (
          <>
            <p>
              Sí. Al igual que todo castillo inflable profesional, requiere
              flujo de aire constante para mantenerse firme y seguro durante las
              horas de juego.
            </p>
            <p>
              Solo necesitas una toma de corriente doméstica estándar (220V) a
              menos de 15 metros; nosotros llevamos extensiones vulcanizadas
              seguras y protegidas.
            </p>
          </>
        ),
      },
      {
        id: "safety-4",
        question:
          "¿Los adultos pueden subir a saltar en los castillos inflables?",
        answer: (
          <p>
            Nuestros castillos están diseñados exclusivamente para niños de{" "}
            <strong>1 a 8 años</strong>. Un adulto puede apoyar desde la entrada
            o el borde acolchado para asistir a los más pequeños, pero no saltar
            dentro de la estructura.
          </p>
        ),
      },
      {
        id: "safety-5",
        question:
          "¿Cómo se fija el castillo si mi piso es de porcelanato, parquet o grass sintético?",
        answer: (
          <p>
            Si la instalación es sobre césped natural utilizamos estacas
            profundas. Si es sobre piso firme (porcelanato, madera, cemento o
            grass artificial) utilizamos pesas recubiertas en tonos suaves y
            pisos microporosos que no dejan ninguna marca.
          </p>
        ),
      },
    ],
  },
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

export function FaqInteractive() {
  const [activeFilter, setActiveFilter] = useState<FaqFilterId>("all")
  const [openItemId, setOpenItemId] = useState<string | null>("bounce-1")

  const visibleGroups = FAQ_GROUPS.filter(
    (g) => activeFilter === "all" || g.id === activeFilter
  )

  const totalQuestions = visibleGroups.reduce(
    (acc, g) => acc + g.items.length,
    0
  )

  const activeFilterObj =
    FAQ_FILTERS.find((f) => f.id === activeFilter) ?? FAQ_FILTERS[0]

  const statusText =
    totalQuestions > 0
      ? `${totalQuestions} ${totalQuestions === 1 ? "pregunta" : "preguntas"} · ${activeFilter === "all"
        ? "Castillos inflables estándar y seguridad"
        : activeFilterObj.label
      }`
      : `${activeFilterObj.label} · Escríbenos para atención inmediata`

  const handleFilterClick = (filterId: FaqFilterId) => {
    setActiveFilter(filterId)
    setOpenItemId(null)
  }

  const handleToggleItem = (itemId: string, isOpen: boolean) => {
    if (isOpen) {
      setOpenItemId(itemId)
    } else if (openItemId === itemId) {
      setOpenItemId(null)
    }
  }

  const waHelpUrl = buildWhatsAppUrl(
    "Hola Diamante Azul, tengo una consulta sobre el alquiler de castillos inflables."
  )

  return (
    <main
      className="hb-story hb-story--page hb-faq hb-story--full-width"
      data-hbf-root=""
      data-hbf-ready="true"
    >
      {/* 1. PORTADA HERO CON ONDA INFERIOR (.hb-story__hero--cover) */}
      <section
        className="hb-story__hero hb-story__hero--cover"
        aria-labelledby="hbf-title"
      >
        <figure className="hb-story__hero-backdrop" aria-hidden="true" />
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
          <span>Imagen Principal de Portada FAQs (Placeholder Gris)</span>
        </div>
        <div className="hb-story__inner hb-story__hero-content">
          <p className="hb-story__eyebrow">Un poco de ayuda, mucha alegría</p>
          <h1 id="hbf-title">
            Pequeñas dudas,
            <br />
            Respuestas rápidas.
          </h1>
          <div className="hb-story__copy">
            <p className="hb-story__lead">
              Desde tu primer salto hasta el recojo puntual al terminar la
              fiesta, encuentra aquí las respuestas a las preguntas más
              frecuentes.
            </p>
          </div>
        </div>
      </section>

      {/* 2. SECCIÓN DE PREGUNTAS FRECUENTES (.hb-faq__section) */}
      <section
        className="hb-story__inner hb-faq__section"
        aria-labelledby="hbf-heading"
      >
        <div className="hb-faq__intro">
          <p className="hb-story__eyebrow">Todo lo que necesitas saber</p>
          <h2 id="hbf-heading">¿Cómo podemos ayudarte?</h2>
          <p>
            Elige un tema y luego toca una pregunta para descubrir más detalles.
          </p>
        </div>

        {/* Barra de 5 Píldoras de Filtro Interactivas */}
        <div
          className="hb-faq__filters"
          data-hbf-filters=""
          role="group"
          aria-label="Filtrar preguntas frecuentes"
        >
          {FAQ_FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              className="hb-faq__filter"
              data-hbf-filter={filter.id}
              aria-pressed={activeFilter === filter.id}
              aria-controls="hbf-results"
              onClick={() => handleFilterClick(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Contador Dinámico de Preguntas */}
        <p
          className="hb-faq__status"
          data-hbf-status=""
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {statusText}
        </p>

        {/* Resultados: Grupos de Acordeones Exclusivos o Estado Vacío Contextual */}
        <div className="hb-faq__results" id="hbf-results">
          {visibleGroups.map((group) => (
            <section
              key={group.id}
              className="hb-faq__group"
              data-hbf-group={group.id}
              aria-labelledby={group.headingId}
            >
              <h3 id={group.headingId}>{group.title}</h3>

              {group.items.map((item) => {
                const isOpen = openItemId === item.id
                return (
                  <details
                    key={item.id}
                    className="hb-faq__item"
                    open={isOpen}
                    onToggle={(e) =>
                      handleToggleItem(item.id, e.currentTarget.open)
                    }
                  >
                    <summary
                      onClick={(e) => {
                        e.preventDefault()
                        handleToggleItem(item.id, !isOpen)
                      }}
                    >
                      <span>{item.question}</span>
                      <span className="hb-faq__icon" aria-hidden="true" />
                    </summary>
                    <div className="hb-faq__answer">{item.answer}</div>
                  </details>
                )
              })}
            </section>
          ))}

          {totalQuestions === 0 && (
            <div className="hb-faq__empty" data-hbf-empty="">
              <h3 data-hbf-empty-title="">
                {activeFilter === "mini"
                  ? "¿Tienes una consulta sobre el Mini Inflable?"
                  : "¿Tienes una consulta sobre tu reserva o entrega?"}
              </h3>
              <p data-hbf-empty-copy="">
                {activeFilter === "mini"
                  ? "Para asesoría personalizada sobre nuestros modelos Mini Blanco y Mini Arcoíris para interiores o departamentos, escríbenos directo a nuestro equipo."
                  : "Para ayuda con disponibilidad de fechas, cobertura por distrito en Lima o detalles de tu reserva, contáctanos por WhatsApp."}
              </p>
              <a
                className="hb-story__button"
                href={waHelpUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Hacer una consulta</span>
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          )}
        </div>

        {/* Tarjeta Inferior de Ayuda ("Still wondering about something?" -> .hb-faq__help) */}
        <aside className="hb-faq__help">
          <div>
            <p className="hb-story__eyebrow">Estamos aquí para ayudarte</p>
            <h3>¿Aún te queda alguna duda?</h3>
            <p>
              Pregúntanos sobre cómo elegir el castillo ideal para tu espacio,
              consultar disponibilidad de fechas o preparar todo para el gran
              día.
            </p>
          </div>
          <Link className="hb-story__button" href="/contactanos">
            <span>Contáctanos</span>
            <span aria-hidden="true">↗</span>
          </Link>
        </aside>
      </section>

      {/* 3. CONJUNTO DE IMÁGENES EN COLUMNAS (MOSAICO DE 10 IMÁGENES 5×2 / 2×5) */}
      <section
        className="hbs-home-mosaic-section"
        aria-label="Galería de momentos felices en casa"
      >
        <div className="hbs-home-mosaic-wrap">
          <div className="hbs-home-mosaic">
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

