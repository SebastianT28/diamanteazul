"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type FilterTier = "all" | "premium" | "medio" | "basico";

interface CatalogCardItem {
  id: string;
  name: string;
  subtitle: string;
  tier: Exclude<FilterTier, "all">;
  href: string;
  sizesLabel: string;
  sizes: string[];
  price: string;
  regularPrice: string;
  isNew?: boolean;
}

const CATALOG_CARDS: CatalogCardItem[] = [
  {
    id: "arcoiris-rosa",
    name: "Paquete Arcoíris Rosa",
    subtitle: "Nivel Premium · Con tobogán y piscina",
    tier: "premium",
    href: "/paquetes/arcoiris-rosa",
    sizesLabel: "Medidas",
    sizes: ["3×3m", "4×4m"],
    price: "S/ 450",
    regularPrice: "S/ 520",
  },
  {
    id: "clasico-blanco",
    name: "Paquete Clásico Blanco",
    subtitle: "Nivel Medio · Con resbaladera",
    tier: "medio",
    href: "/paquetes/clasico-blanco",
    sizesLabel: "Medidas",
    sizes: ["3×3m", "4×3m"],
    price: "S/ 350",
    regularPrice: "S/ 410",
  },
  {
    id: "arcoiris-lavanda",
    name: "Paquete Arcoíris Lavanda",
    subtitle: "Nivel Premium · Con tobogán y pelotas",
    tier: "premium",
    href: "/paquetes/arcoiris-lavanda",
    sizesLabel: "Medidas",
    sizes: ["3×3m", "4×4m"],
    price: "S/ 450",
    regularPrice: "S/ 520",
  },
  {
    id: "celeste-diamante",
    name: "Paquete Celeste Diamante",
    subtitle: "Nivel Medio · Con resbaladera",
    tier: "medio",
    href: "/paquetes/celeste-diamante",
    sizesLabel: "Medidas",
    sizes: ["3×3m", "4×3m"],
    price: "S/ 350",
    regularPrice: "S/ 410",
  },
  {
    id: "arcoiris-azul",
    name: "Paquete Arcoíris Azul",
    subtitle: "Nivel Premium · Circuito completo",
    tier: "premium",
    href: "/paquetes/arcoiris-azul",
    sizesLabel: "Medidas",
    sizes: ["4×4m", "5×4m"],
    price: "S/ 480",
    regularPrice: "S/ 550",
  },
  {
    id: "mini-blanco",
    name: "Paquete Mini Blanco",
    subtitle: "Nivel Básico · Compacto interior",
    tier: "basico",
    href: "/paquetes/mini-blanco",
    sizesLabel: "Medida",
    sizes: ["2.2×2.2m"],
    price: "S/ 250",
    regularPrice: "S/ 300",
  },
  {
    id: "mini-arcoiris",
    name: "Paquete Mini Arcoíris",
    subtitle: "Nivel Básico · Compacto interior",
    tier: "basico",
    href: "/paquetes/mini-arcoiris",
    sizesLabel: "Medida",
    sizes: ["2.5×2.5m"],
    price: "S/ 280",
    regularPrice: "S/ 330",
    isNew: true,
  },
];

const RIBBON_PHRASES = [
  "Pequeñas aventuras. Recuerdos eternos.",
  "Pensado al detalle desde el inicio.",
  "Diseñado para fiestas felices.",
  "Diversión segura en cada salto.",
];

const STORY_MOMENTS = [
  {
    title: "Tardes en sala o terraza",
    description:
      "Nuestros modelos compactos del Paquete Básico caben perfectamente en interiores y departamentos sin ocupar todo el espacio.",
  },
  {
    title: "Sol y diversión en el jardín",
    description:
      "Lleva uno de nuestros castillos con tobogán al jardín o parque del condominio y convierte una tarde soleada en un gran evento.",
  },
  {
    title: "Tardes de amigos más felices",
    description:
      "Sus amigos favoritos, un espacio seguro y acolchado, y una razón completamente nueva para saltar y reír juntos durante horas.",
  },
  {
    title: "Parrilladas y reuniones familiares",
    description:
      "Buena conversación para los adultos y un rincón propio y seguro donde los más pequeños disfrutan toda la reunión.",
  },
  {
    title: "Cumpleaños en casa con estilo",
    description:
      "Colores pastel que armonizan con tu decoración temática, arcos de globos y mesas dulces para fotos espectaculares.",
  },
  {
    title: "Nosotros instalamos y recogemos",
    description:
      "Llegamos puntuales antes de tu evento, dejamos todo desinfectado y listo en 15 minutos, y lo retiramos al terminar.",
  },
];

interface ReviewItem {
  quote: string;
  name: string;
  product: string;
}

const REVIEW_COLUMNS: { direction: "up" | "down"; items: ReviewItem[] }[] = [
  {
    direction: "up",
    items: [
      {
        quote:
          "Alquilamos el Paquete Básico para el primer añito de mi hija en departamento y quedó hermoso con la decoración pastel. Súper puntuales y limpios.",
        name: "Valeria Mendoza",
        product: "Paquete Mini Blanco",
      },
      {
        quote:
          "El color celeste diamante en persona es precioso. No queríamos los típicos inflables chillones y este hizo que todas las fotos del cumple salieran de revista.",
        name: "Carolina Ríos",
        product: "Paquete Celeste Diamante",
      },
      {
        quote:
          "La atención por WhatsApp fue inmediata. Nos recomendaron la medida exacta para nuestra cochera y los niños no pararon de saltar en toda la tarde.",
        name: "Diego Garrido",
        product: "Paquete Clásico Blanco",
      },
    ],
  },
  {
    direction: "down",
    items: [
      {
        quote:
          "Lo elegimos porque buscábamos colores suaves en tonos lavanda y rosa para el cumple de mellizas. La piscina de pelotas incluida fue el éxito total.",
        name: "Andrea Salazar",
        product: "Paquete Arcoíris Lavanda",
      },
      {
        quote:
          "Llegaron 45 minutos antes, desinfectaron todo frente a nosotros y lo dejaron impecable. Da muchísima tranquilidad alquilar con un equipo así.",
        name: "Rodrigo Paz",
        product: "Paquete Arcoíris Azul",
      },
      {
        quote:
          "Es la tercera vez que reservamos con Diamante Azul. Siempre impecables, puntuales y los inflables lucen como nuevos.",
        name: "Luciana Torres",
        product: "Paquete Mini Arcoíris",
      },
    ],
  },
  {
    direction: "up",
    items: [
      {
        quote:
          "El Paquete Arcoíris Rosa es aún más lindo en vivo. Lo armamos para un cumple de 3 años y ni siquiera miraron la mesa de dulces por seguir saltando.",
        name: "Camila Benavides",
        product: "Paquete Arcoíris Rosa",
      },
      {
        quote:
          "Nuestro hijo pequeño lo llama su castillo de nubes. Súper acolchado, mallas de seguridad transparentes para verlos todo el tiempo. 10/10.",
        name: "Mariana Montes",
        product: "Paquete Mini Arcoíris",
      },
      {
        quote:
          "Excelente relación calidad-precio en el Paquete Medio. Vino con alfombra protectora, motor silencioso y pelotas pastel.",
        name: "Sebastián Alarcón",
        product: "Paquete Celeste Diamante",
      },
    ],
  },
];

function renderCurvedPhrase(phrase: string) {
  const chars = Array.from(phrase);
  const len = chars.length;
  return chars.map((ch, idx) => {
    const t = len > 1 ? idx / (len - 1) : 0.5;
    const y = Math.sin(t * Math.PI * 2) * 5;
    const rot = Math.cos(t * Math.PI * 2) * 2.2;
    return (
      <span
        key={idx}
        className="hbr-ribbon-glyph"
        style={{
          transform: `translateY(${y.toFixed(1)}px) rotate(${rot.toFixed(1)}deg)`,
        }}
      >
        {ch}
      </span>
    );
  });
}

function UspItems() {
  return (
    <>
      <li>
        <svg
          viewBox="0 0 28 28"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.65"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4.5 13L14 5l9.5 8" />
          <path d="M7.5 11.5V22.5h13V11.5" />
          <path d="M12 22.5v-5.5h4v5.5" />
        </svg>
        <span>Para casa, jardín o local</span>
      </li>
      <li>
        <svg
          viewBox="0 0 28 28"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.65"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="2.5" y="7.5" width="14" height="10.5" rx="1.8" />
          <path d="M16.5 11h4.3l3.2 3.5V18h-7.5V11z" />
          <circle cx="7.5" cy="19.5" r="2.2" />
          <circle cx="20.5" cy="19.5" r="2.2" />
        </svg>
        <span>Transporte e instalación gratis</span>
      </li>
      <li>
        <svg
          viewBox="0 0 28 28"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.65"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="6" y="8.5" width="16" height="14" rx="2.4" />
          <path d="M10.5 8.5V7a3.5 3.5 0 0 1 7 0v1.5" />
          <path d="M11 14.5h6" />
        </svg>
        <span>100% sanitizados antes de cada evento</span>
      </li>
      <li>
        <svg
          viewBox="0 0 28 28"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.65"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="14" cy="14" r="9.5" />
          <path d="M10.3 15.5c1 1.7 2.2 2.5 3.7 2.5s2.7-.8 3.7-2.5" />
          <circle
            cx="10.8"
            cy="11.8"
            r="1"
            fill="currentColor"
            stroke="none"
          />
          <circle
            cx="17.2"
            cy="11.8"
            r="1"
            fill="currentColor"
            stroke="none"
          />
        </svg>
        <span>Diseños pastel &amp; accesorios incluidos</span>
      </li>
    </>
  );
}

export function HomeInteractive() {
  const [activeFilter, setActiveFilter] = useState<FilterTier>("all");
  const [isMobileUsps, setIsMobileUsps] = useState(false);
  const [reviewColumnCount, setReviewColumnCount] = useState(3);

  const uspSectionRef = useRef<HTMLElement>(null);
  const uspPrimaryListRef = useRef<HTMLUListElement>(null);

  const ribbonBandRef = useRef<HTMLDivElement>(null);
  const ribbonGroupRef = useRef<HTMLDivElement>(null);

  const reviewTrackRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reviewGroupRefs = useRef<(HTMLDivElement | null)[]>([]);

  /* Sync Mobile USP Horizontal Marquee Loop (<=767px) */
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handleMq = () => {
      setIsMobileUsps(mq.matches);
    };
    handleMq();
    mq.addEventListener("change", handleMq);
    return () => mq.removeEventListener("change", handleMq);
  }, []);

  useEffect(() => {
    if (!isMobileUsps) return;
    const section = uspSectionRef.current;
    const list = uspPrimaryListRef.current;
    if (!section || !list) return;

    let rafId = 0;
    const updateUspMetrics = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const w = list.offsetWidth;
        if (w > 0) {
          section.style.setProperty("--hbr-usp-loop-distance", `${w}px`);
          section.style.setProperty(
            "--hbr-usp-loop-duration",
            `${Math.max(18, Math.round(w / 28))}s`
          );
        }
      });
    };
    updateUspMetrics();
    window.addEventListener("resize", updateUspMetrics, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", updateUspMetrics);
    };
  }, [isMobileUsps]);

  /* Sync Curved Wave Ribbon Marquee (.hbr-play-banner) */
  useEffect(() => {
    const band = ribbonBandRef.current;
    const group = ribbonGroupRef.current;
    if (!band || !group) return;

    let rafId = 0;
    const updateRibbon = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const w = group.offsetWidth;
        if (w > 0) {
          band.style.setProperty("--hbr-banner-distance", `${w}px`);
          band.style.setProperty("--hbr-banner-duration", `${w / 45}s`);
        }
      });
    };
    updateRibbon();
    window.addEventListener("resize", updateRibbon, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", updateRibbon);
    };
  }, []);

  /* Sync 3-Column Vertical Alternating Review Wall & Responsive Column Count */
  useEffect(() => {
    let rafId = 0;
    const updateReviews = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const w = window.innerWidth;
        const cols = w < 600 ? 1 : w < 900 ? 2 : 3;
        setReviewColumnCount((prev) => (prev === cols ? prev : cols));
      });
    };

    updateReviews();
    window.addEventListener("resize", updateReviews, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", updateReviews);
    };
  }, []);

  return (
    <main id="main-content">
      {/* ========================================================================
          3. FULL-WIDTH VIDEO HERO (.video-hero.hbr-hero-v2) + WAVE + USPS
          ======================================================================== */}
      <section className="video-hero hbr-hero-v2">
        <div className="video-bg-placeholder" aria-hidden="true">
          <Image
            src="/images/home/home_hero_portada-02.webp"
            alt="Niños jugando felices en castillo inflable pastel de Diamante Azul"
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            quality={85}
            className="hbr-hero-bg-image"
          />
        </div>
        <div className="video-overlay">
          <div className="hbr-hero-copy">
            <h1>
              Pequeños momentos.
              <br />
              Gran felicidad.
            </h1>
            <p>
              Juegos inflables hermosos y seguros para cumpleaños y eventos
              inolvidables.
            </p>
            <a href="#hbr-home-range" className="hbr-hero-button">
              Explorar Paquetes
            </a>
          </div>
        </div>
      </section>

      <section
        ref={uspSectionRef}
        className={`hbr-home-usps${isMobileUsps ? " hbr-usps-loop" : ""}`}
        id="da-usps"
        aria-label="Beneficios principales"
      >
        {isMobileUsps ? (
          <div className="hbr-usps-loop__viewport">
            <div className="hbr-usps-loop__track">
              <ul
                ref={uspPrimaryListRef}
                className="hbr-home-usps__inner"
                id="da-usps-list"
              >
                <UspItems />
              </ul>
              <ul className="hbr-home-usps__inner" aria-hidden="true">
                <UspItems />
              </ul>
            </div>
          </div>
        ) : (
          <ul
            ref={uspPrimaryListRef}
            className="hbr-home-usps__inner"
            id="da-usps-list"
          >
            <UspItems />
          </ul>
        )}
      </section>

      {/* ========================================================================
          4. PRODUCT RANGE GRID WITH FILTER PILLS (#hbr-home-range)
          ======================================================================== */}
      <section
        id="hbr-home-range"
        className="hbr-home-products"
        aria-label="Catálogo de paquetes de inflables"
      >
        <div className="hbr-home-range-heading">
          <h2>Encuentra su favorito.</h2>
          <p>
            Elige el paquete, tamaño y combinación ideal para tu celebración.
          </p>
        </div>

        <div
          className="hbr-home-filters"
          role="toolbar"
          aria-label="Filtrar paquetes por nivel"
        >
          <button
            type="button"
            data-filter="all"
            aria-pressed={activeFilter === "all"}
            onClick={() => setActiveFilter("all")}
          >
            Todos los paquetes
          </button>
          <button
            type="button"
            data-filter="premium"
            aria-pressed={activeFilter === "premium"}
            onClick={() => setActiveFilter("premium")}
          >
            Paquete Premium
          </button>
          <button
            type="button"
            data-filter="medio"
            aria-pressed={activeFilter === "medio"}
            onClick={() => setActiveFilter("medio")}
          >
            Paquete Medio
          </button>
          <button
            type="button"
            data-filter="basico"
            aria-pressed={activeFilter === "basico"}
            onClick={() => setActiveFilter("basico")}
          >
            Paquete Básico
          </button>
        </div>

        <div className="hbr-catalog-grid" id="da-catalog-grid">
          {CATALOG_CARDS.map((card) => {
            const isHidden =
              activeFilter !== "all" && card.tier !== activeFilter;
            return (
              <article
                key={card.id}
                className="hbr-catalog-card"
                data-tier={card.tier}
                hidden={isHidden}
              >
                <Link className="hbr-catalog-card__link" href={card.href}>
                  <div className="hbr-catalog-card__image">
                    {card.isNew && (
                      <div className="hbr-catalog-card__badge">
                        ★
                        <br />
                        NUEVO
                      </div>
                    )}
                    <div className="hbr-catalog-card__placeholder da-grey-placeholder" />
                  </div>
                  <div className="hbr-catalog-card__body">
                    <div className="hbr-catalog-card__title-row">
                      <h3 className="hbr-catalog-card__name">{card.name}</h3>
                    </div>
                    <p className="hbr-catalog-card__subtitle">
                      {card.subtitle}
                    </p>
                    <div className="hbr-catalog-card__sizes">
                      <span className="hbr-catalog-card__sizes-label">
                        {card.sizesLabel}
                      </span>
                      {card.sizes.map((size) => (
                        <span key={size} className="hbr-catalog-card__size">
                          {size}
                        </span>
                      ))}
                    </div>
                    <div className="hbr-catalog-card__bottom">
                      <div className="product-price-and-shipping">
                        <span className="price">{card.price}</span>
                        <span className="regular-price">
                          {card.regularPrice}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      {/* ========================================================================
          5. CURVED WAVE RIBBON MARQUEE (.hbr-play-banner)
          ======================================================================== */}
      <aside
        className="hbr-play-banner is-ready"
        data-hbr-play-banner=""
        data-speed="45"
        aria-label="Promesa Diamante Azul"
      >
        <div
          ref={ribbonBandRef}
          className="hbr-play-banner__band hbr-wave-enabled"
        >
          <div className="hbr-wave-surface" aria-hidden="true">
            <svg viewBox="0 0 1000 180" preserveAspectRatio="none">
              <path d="M0 38 Q250 -16 500 38 T1000 38 L1000 142 Q750 196 500 142 T0 142 Z" />
            </svg>
          </div>
          <div className="hbr-play-banner__viewport">
            <div className="hbr-play-banner__track" id="da-ribbon-track">
              <div
                ref={ribbonGroupRef}
                className="hbr-play-banner__group"
                data-hbr-banner-original=""
              >
                {RIBBON_PHRASES.map((phrase, idx) => (
                  <span key={idx}>{renderCurvedPhrase(phrase)}</span>
                ))}
              </div>
              <div className="hbr-play-banner__group" aria-hidden="true">
                {RIBBON_PHRASES.map((phrase, idx) => (
                  <span key={idx}>{renderCurvedPhrase(phrase)}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ========================================================================
          6. EVERYDAY MOMENTS / OCCASIONS 6-CARD GRID (#hbs-everyday / #quienes-somos)
          ======================================================================== */}
      <section className="hb-story" id="hbs-everyday">
        <div id="quienes-somos" className="hb-story__inner">
          <div className="hb-story__heading">
            <p className="hb-story__eyebrow">VIDA REAL. DÍAS MÁS BRILLANTES.</p>
            <h2>Para los días que siempre recordarán.</h2>
            <p>
              Y aquellas tardes de cumpleaños que se transforman en
              extraordinarias.
            </p>
          </div>
          <div className="hb-story__moments">
            {STORY_MOMENTS.map((moment) => (
              <article key={moment.title} className="hb-story__moment">
                <div className="hb-story__photo da-grey-placeholder" />
                <h3>{moment.title}</h3>
                <p>{moment.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================
          7. CUSTOMER REVIEWS 3-COLUMN ALTERNATING WALL (.hbr-reviews / #faqs)
          ======================================================================== */}
      <section
        className="hbr-reviews hbr-reviews--ready hbr-reviews--running"
        id="da-reviews"
        aria-labelledby="hbr-reviews-heading"
      >
        <div id="faqs" className="hbr-reviews__inner">
          <div className="hbr-reviews__header">
            <div>
              <p className="hbr-reviews__eyebrow">RESEÑAS DE CLIENTES</p>
              <h2 className="hbr-reviews__title" id="hbr-reviews-heading">
                Pequeños momentos, compartidos por ti.
              </h2>
              <p className="hbr-reviews__intro">
                Lo que dicen las familias sobre su experiencia con Diamante
                Azul.
              </p>
            </div>
          </div>

          <div className="hbr-reviews__viewport" id="da-reviews-viewport">
            <div
              className="hbr-reviews__list"
              id="da-reviews-list"
              style={
                {
                  "--hbr-review-columns": reviewColumnCount,
                } as React.CSSProperties
              }
            >
              {REVIEW_COLUMNS.map((col, colIdx) => {
                const loopSegment = [...col.items, ...col.items];
                return (
                  <div
                    key={colIdx}
                    className="hbr-reviews__column"
                    hidden={colIdx >= reviewColumnCount}
                  >
                    <div
                      ref={(el) => {
                        reviewTrackRefs.current[colIdx] = el;
                      }}
                      className={`hbr-reviews__track${
                        col.direction === "down"
                          ? " hbr-reviews__track--down"
                          : ""
                      }`}
                    >
                      <div
                        ref={(el) => {
                          reviewGroupRefs.current[colIdx] = el;
                        }}
                        className="hbr-reviews__group"
                      >
                        {loopSegment.map((rev, revIdx) => (
                          <article
                            key={revIdx}
                            className="hbr-reviews__card"
                            aria-hidden={
                              revIdx >= col.items.length ? "true" : undefined
                            }
                          >
                            <div className="hbr-reviews__stars" aria-label="5 de 5 estrellas">
                              ★★★★★
                            </div>
                            <blockquote className="hbr-reviews__quote">
                              {rev.quote}
                            </blockquote>
                            <div className="hbr-reviews__person">
                              <div className="hbr-reviews__product-image da-grey-placeholder" />
                              <div>
                                <p className="hbr-reviews__name">{rev.name}</p>
                                <p className="hbr-reviews__location">
                                  {rev.product}
                                </p>
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                      <div
                        className="hbr-reviews__group hbr-reviews__clone"
                        aria-hidden="true"
                      >
                        {loopSegment.map((rev, revIdx) => (
                          <article key={revIdx} className="hbr-reviews__card">
                            <div className="hbr-reviews__stars">★★★★★</div>
                            <blockquote className="hbr-reviews__quote">
                              {rev.quote}
                            </blockquote>
                            <div className="hbr-reviews__person">
                              <div className="hbr-reviews__product-image da-grey-placeholder" />
                              <div>
                                <p className="hbr-reviews__name">{rev.name}</p>
                                <p className="hbr-reviews__location">
                                  {rev.product}
                                </p>
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
