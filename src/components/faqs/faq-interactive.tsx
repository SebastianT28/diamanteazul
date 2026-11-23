"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { buildWhatsAppUrl } from "@/data/packages"
import { useCity } from "@/lib/city-context"

type FaqFilterId = "all" | "bounce" | "experiences" | "ordering" | "safety"

interface FaqItemData {
  id: string
  question: string
  answer: React.ReactNode
}

interface FaqGroupData {
  id: "bounce" | "experiences" | "ordering" | "safety"
  title: string
  headingId: string
  items: FaqItemData[]
}

const FAQ_FILTERS: { id: FaqFilterId; label: string }[] = [
  { id: "all", label: "Todas las preguntas" },
  { id: "bounce", label: "Castillos y Toboganes" },
  { id: "experiences", label: "Acuáticos, Juegos y 360°" },
  { id: "ordering", label: "Reservas, Pagos y Cobertura" },
  { id: "safety", label: "Seguridad, Espacio y Luz" },
]

const FAQ_GROUPS: FaqGroupData[] = [
  {
    id: "bounce",
    title: "Castillos y Toboganes",
    headingId: "hbf-bounce",
    items: [
      {
        id: "bounce-1",
        question:
          "¿Qué líneas de castillos y toboganes inflables ofrece Diamante Azul?",
        answer: (
          <p>
            Contamos con tres colecciones principales en nuestro catálogo:{" "}
            <strong>Línea Dreamy Pastel</strong> (como{" "}
            <em>Arcoíris Mágico, Castillo de Ensueño, Tobogán de Ensueño</em> y{" "}
            <em>Mega Circuito Encanto</em>),{" "}
            <strong>Línea White Trend</strong> (castillos blancos elegantes que
            incluyen decoración con 100 globos a elección) y{" "}
            <strong>Diversión a Color</strong> (castillos clásicos, toboganes,
            circuitos de obstáculos y piscina de pelotas en colores vibrantes).
          </p>
        ),
      },
      {
        id: "bounce-2",
        question: "¿Cuántas horas dura el alquiler y qué incluye el servicio?",
        answer: (
          <p>
            El alquiler estándar de nuestros castillos, toboganes, juegos e
            inflables acuáticos es de <strong>5 horas por evento</strong>. El
            servicio incluye el{" "}
            <strong>
              montaje y desmontaje, desinfección completa y personal de apoyo
            </strong>{" "}
            para supervisar el uso adecuado. Si deseas extender la diversión,
            puedes solicitar <strong>horas adicionales</strong> (desde S/ 50 a
            S/ 150 por hora según el modelo elegido).
          </p>
        ),
      },
      {
        id: "bounce-3",
        question:
          "¿Se pueden instalar los inflables tanto en interiores como en jardines exteriores?",
        answer: (
          <p>
            Sí. Contamos con modelos compactos ideales para salas amplias,
            cocheras, terrazas o departamentos —como la{" "}
            <strong>Piscina Inflable de Pelotas (2.4m × 2.4m)</strong>, el{" "}
            <strong>Soft Play (3m × 3m)</strong>, las{" "}
            <strong>Camas Saltarinas</strong> y los{" "}
            <strong>Castillos de 3m × 3m</strong>—, así como castillos medianos y
            grandes circuitos de hasta <strong>15 metros de largo</strong> para
            jardines, parques, condominios y colegios.
          </p>
        ),
      },
      {
        id: "bounce-4",
        question:
          "¿Qué incluye la decoración con globos en la Línea White Trend y en la Bubble House?",
        answer: (
          <p>
            Tanto nuestros castillos de la <strong>Línea White Trend</strong>{" "}
            (<em>Castillo Blanco Clásico, Castillo Blanco con Piscina de Pelotas</em>{" "}
            y <em>Castillo Blanco con Tobogán</em>) como la{" "}
            <strong>Bubble House</strong> incluyen una decoración con{" "}
            <strong>100 globos de 2 a 3 colores a elección del cliente</strong>,
            además de pelotas internas y personal de apoyo permanente para que
            armonicen con la temática de tu fiesta.
          </p>
        ),
      },
    ],
  },
  {
    id: "experiences",
    title: "Inflables Acuáticos, Juegos y Sesiones 360°",
    headingId: "hbf-experiences",
    items: [
      {
        id: "exp-1",
        question:
          "¿Cómo funcionan los Inflables Acuáticos (Aquaroller, Piscina con Botes y Cañón de Espuma)?",
        answer: (
          <p>
            Son nuestras opciones favoritas para días soleados y verano por{" "}
            <strong>5 horas de alquiler</strong> con personal de supervisión.
            Tanto el <strong>Aquaroller (Pelota Acuática)</strong> como la{" "}
            <strong>Piscina con Botes Flotantes</strong> incluyen una piscina
            inflable de <strong>7m × 6m</strong> (el suministro de agua para el
            llenado corre por cuenta del cliente). El{" "}
            <strong>Super Cañón de Espuma</strong> incluye insumos de espuma,
            música, luces y operador durante el evento.
          </p>
        ),
      },
      {
        id: "exp-2",
        question:
          "¿Qué incluyen la Plataforma 360°, el Domo Overhead 360 y la Estación de Fotos?",
        answer: (
          <p>
            Nuestras estaciones fotográficas y de video 360° incluyen{" "}
            <strong>
              operador en sitio, iluminación LED y accesorios divertidos
            </strong>{" "}
            (pistolas de burbujas, billetes falsos, pelucas, lentes y cotillón).
            Los videos y fotografías se entregan al instante en el celular de
            cada invitado mediante <strong>código QR o AirDrop</strong> listos
            para compartir en redes sociales. La Plataforma 360° está disponible
            en paquetes de 2 o 3 horas, y el Domo Overhead y la Estación de Fotos
            por 5 horas.
          </p>
        ),
      },
      {
        id: "exp-3",
        question:
          "¿Tienen juegos para bebés pequeños y también para jóvenes o adultos?",
        answer: (
          <p>
            ¡Sí! Para bebés y niños pequeños de <strong>0 a 5 años</strong>{" "}
            tenemos el circuito <strong>Soft Play</strong> y la{" "}
            <strong>Piscina Inflable de Pelotas</strong>. Para niños contamos con
            más de 16 modelos de castillos y toboganes. Y para niños grandes,
            jóvenes y adultos ofrecemos juegos de competencia y adrenalina como
            la <strong>Gran Carrera de Obstáculos (15m × 3m)</strong>, el{" "}
            <strong>Reloj Demoledor</strong>, las <strong>Bumper Balls</strong>,
            el <strong>Futbolín Humano</strong> y la <strong>Bubble House</strong>.
          </p>
        ),
      },
      {
        id: "exp-4",
        question:
          "¿Cuentan con alquiler de sillas u otros complementos para el evento?",
        answer: (
          <p>
            Sí, en nuestra categoría de <strong>Complementos y Extras</strong>{" "}
            disponemos de <strong>Sillas Metálicas Tapizadas</strong> a{" "}
            <strong>S/ 45 por docena</strong> para todo el evento, además de{" "}
            <strong>Generadores Eléctricos</strong> en caso tu locación no cuente
            con punto de corriente cercano.
          </p>
        ),
      },
    ],
  },
  {
    id: "ordering",
    title: "Reservas, Pagos y Cobertura",
    headingId: "hbf-ordering",
    items: [
      {
        id: "ord-1",
        question: "¿Cómo reservo una fecha y cuáles son las modalidades de pago?",
        answer: (
          <p>
            La fecha y horario de tu evento se separan con el{" "}
            <strong>50% de adelanto</strong> mediante{" "}
            <strong>Yape al 948 311 603</strong> o transferencia a nuestra{" "}
            <strong>cuenta bancaria BCP</strong>. El{" "}
            <strong>50% restante</strong> se cancela el mismo día del evento en
            cuanto el juego queda instalado en tu locación. Los precios del
            catálogo no incluyen IGV.
          </p>
        ),
      },
      {
        id: "ord-2",
        question:
          "¿En qué distritos de Lima y zonas de Arequipa brindan el servicio?",
        answer: (
          <p>
            En <strong>Lima</strong> nos enfocamos principalmente en{" "}
            <strong>Lima Moderna</strong>, priorizando distritos como{" "}
            <strong>
              San Isidro, Miraflores, Santiago de Surco, San Borja, Magdalena
              del Mar, Surquillo y San Luis
            </strong>
            , además de zonas cercanas donde sea viable brindar el servicio.
            Asimismo, contamos con cobertura completa de alquiler e instalación
            en toda la ciudad de <strong>Arequipa</strong>.
          </p>
        ),
      },
      {
        id: "ord-3",
        question:
          "¿El traslado tiene costo adicional y con cuánta anticipación llegan a instalar?",
        answer: (
          <p>
            Todos nuestros paquetes incluyen el montaje y desmontaje del equipo.
            La movilidad tiene un costo referencial de <strong>S/ 30</strong>{" "}
            (sujeto a la ubicación exacta del evento). Nuestro personal llega con
            anticipación antes de la hora de inicio pactada para instalar y
            desinfectar todo, de modo que disfrutes tus{" "}
            <strong>5 horas completas</strong> de juego.
          </p>
        ),
      },
      {
        id: "ord-4",
        question: "¿Con cuánta anticipación debo realizar mi reserva?",
        answer: (
          <p>
            Recomendamos separar tu inflable con{" "}
            <strong>1 a 2 semanas de anticipación</strong>, especialmente si tu
            celebración será en fin de semana. Si tienes un evento de último
            minuto, escríbenos por WhatsApp al <strong>948 311 603</strong> para
            confirmarte los modelos disponibles en tu fecha.
          </p>
        ),
      },
    ],
  },
  {
    id: "safety",
    title: "Seguridad, Espacio y Electricidad",
    headingId: "hbf-safety",
    items: [
      {
        id: "safety-1",
        question:
          "¿Qué requisitos eléctricos necesitan los inflables y qué hago si mi evento es en un parque sin luz?",
        answer: (
          <p>
            Para funcionar, cada juego inflable requiere contar con un{" "}
            <strong>punto de luz estándar (tomacorriente 220V)</strong> cercano a
            la zona de instalación. El alquiler del inflable no incluye
            generador eléctrico; sin embargo, si tu evento es en un parque o
            jardín sin acceso a corriente, puedes agregar nuestro{" "}
            <strong>Generador Eléctrico por S/ 200</strong>, que incluye la
            gasolina para las 5 horas, puesta en marcha y recojo.
          </p>
        ),
      },
      {
        id: "safety-2",
        question:
          "¿Cómo sé qué espacio libre necesito para el inflable que quiero alquilar?",
        answer: (
          <p>
            En la tarjeta y ficha de cada uno de nuestros{" "}
            <strong>31 productos</strong> encontrarás sus medidas exactas de{" "}
            <strong>largo, ancho y alto</strong> (o diámetro). Recomendamos
            contar con al menos 60 cm adicionales libres alrededor y 1 metro en
            la parte posterior para ubicar la turbina de aire con total
            comodidad, así como verificar la altura del techo si se instalará en
            interior.
          </p>
        ),
      },
      {
        id: "safety-3",
        question:
          "¿Cómo garantizan la limpieza, desinfección y seguridad durante las horas de juego?",
        answer: (
          <p>
            Cada inflable, pieza de Soft Play y pelota pasa por un protocolo de
            limpieza y desinfección antes de cada evento y un repaso en sitio una
            vez instalado. Además, nuestros alquileres cuentan con{" "}
            <strong>personal de apoyo / operador</strong> encargado de velar por
            el ingreso ordenado según la edad y aforo de cada juego.
          </p>
        ),
      },
      {
        id: "safety-4",
        question:
          "¿Cómo se asegura el inflable sobre césped, cemento, porcelanato o grass sintético?",
        answer: (
          <p>
            Si la instalación es sobre césped natural utilizamos estacas de
            anclaje firme; si es sobre superficie dura (porcelanato, parquet,
            cemento o grass sintético) empleamos bases protectoras y contrapesos
            seguros que mantienen estable la estructura sin rayar ni marcar tu
            piso.
          </p>
        ),
      },
    ],
  },
]

interface MosaicTile {
  label: string
  image: string
  quote?: string
}

const MOSAIC_TILES: MosaicTile[] = [
  { label: "Soft Play en Casa", image: "/images/pages/mosaico_1.webp" },
  { label: "Castillo de Ensueño", image: "/images/pages/mosaico_2.webp" },
  { label: "Arcoíris Mágico", image: "/images/pages/mosaico_3.webp" },
  { label: "Aquaroller en Verano", image: "/images/pages/mosaico_4.webp" },
  { label: "Bubble House Pastel", image: "/images/pages/mosaico_5.webp" },
  { label: "Tobogán de Ensueño", image: "/images/pages/mosaico_6.webp" },
  { label: "Castillo 3 en 1", image: "/images/pages/mosaico_7.webp" },
  {
    label: "Bloques a tu Medida",
    image: "/images/pages/mosaico_8.webp",
    quote: "El tipo de alegría... que querrías guardar para siempre 🤍",
  },
  {
    label: "Piscina con Botes",
    image: "/images/pages/mosaico_9.webp",
  },
  {
    label: "Camas Saltarinas",
    image: "/images/pages/mosaico_10.webp",
  },
]

export function FaqInteractive() {
  const [activeFilter, setActiveFilter] = useState<FaqFilterId>("all")
  const [openItemId, setOpenItemId] = useState<string | null>("bounce-1")
  const { city, cityConfig } = useCity()

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
      ? `${totalQuestions} ${totalQuestions === 1 ? "pregunta" : "preguntas"} · ${
          activeFilter === "all"
            ? "Catálogo completo, reservas, cobertura y seguridad"
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
    `Buen día, tengo una consulta sobre el alquiler de inflables en ${cityConfig.name}.`
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
        <figure className="hb-story__hero-backdrop" aria-hidden="true">
          <Image
            src="/images/pages/faqs_portada.webp"
            alt="Castillo inflable blanco con globos pastel instalado en jardín por Diamante Azul"
            fill
            priority
            sizes="100vw"
            className="hb-story__hero-img"
          />
        </figure>
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
                ¿Tienes una consulta adicional sobre tu evento?
              </h3>
              <p data-hbf-empty-copy="">
                {city === "lima"
                  ? "Para ayuda con disponibilidad de fechas, cobertura en Lima Moderna (San Isidro, Miraflores, Surco, San Borja, Magdalena del Mar, Surquillo, San Luis y zonas cercanas) o detalles de tu reserva, contáctanos por WhatsApp."
                  : "Para ayuda con disponibilidad de fechas, cobertura en la ciudad de Arequipa o detalles de tu reserva, contáctanos por WhatsApp."}
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
                <Image
                  src={tile.image}
                  alt={tile.label}
                  fill
                  sizes="(max-width: 767px) 50vw, 20vw"
                  className="hbs-home-mosaic__img"
                />
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

