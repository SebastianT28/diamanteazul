"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  PACKAGES_DATA,
  PRODUCT_CATEGORIES,
  type ProductCategorySlug,
} from "@/data/packages";

type FilterCategory = "all" | ProductCategorySlug;

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
      "Nuestros modelos compactos como Piscina de Pelotas, Soft Play y Castillos 3×3m se adaptan a interiores, cocheras y terrazas.",
    image: "/images/catalogo/soft-play.webp",
  },
  {
    title: "Sol y diversión en el jardín",
    description:
      "Lleva nuestros castillos Dreamy Pastel o circuitos de obstáculos al jardín y convierte una tarde soleada en un gran evento.",
    image: "/images/catalogo/castillo-de-ensueno.webp",
  },
  {
    title: "Tardes de amigos más felices",
    description:
      "Sus amigos favoritos, un espacio seguro con personal de apoyo y 5 horas continuas para saltar y reír juntos.",
    image: "/images/catalogo/arcoiris-magico.webp",
  },
  {
    title: "Días refrescantes de verano",
    description:
      "Sorprende a grandes y chicos con nuestro Aquaroller, Piscina con Botes Flotantes o una fiesta con Super Cañón de Espuma.",
    image: "/images/catalogo/aquaroller.webp",
  },
  {
    title: "Cumpleaños y eventos con estilo",
    description:
      "Desde la Bubble House con globos hasta nuestra línea White Trend que armoniza con cualquier decoración temática.",
    image: "/images/catalogo/bubble-house.webp",
  },
  {
    title: "Recuerdos en 360° y fotografía",
    description:
      "Captura cada sonrisa con nuestra Plataforma 360°, el Domo Overhead LED y la Estación de Fotos con impresiones al instante.",
    image: "/images/catalogo/plataforma-360.webp",
  },
];

interface ReviewItem {
  quote: string;
  name: string;
  product: string;
  image: string;
}

const REVIEW_COLUMNS: { direction: "up" | "down"; items: ReviewItem[] }[] = [
  {
    direction: "up",
    items: [
      {
        quote:
          "Alquilamos el Soft Play para el primer añito de mi hija y quedó hermoso. Los bebés jugaron seguros las 5 horas completas.",
        name: "Valeria Mendoza",
        product: "Soft Play",
        image: "/images/catalogo/soft-play.webp",
      },
      {
        quote:
          "El Castillo Blanco con Tobogán se vio precioso con la decoración de globos que incluyeron. Todas las fotos salieron de revista.",
        name: "Carolina Ríos",
        product: "Castillo Blanco con Tobogán",
        image: "/images/catalogo/castillo-blanco-con-tobogan.webp",
      },
      {
        quote:
          "La atención por WhatsApp fue inmediata. Nos recomendaron el Castillo 3 en 1 para nuestro espacio y los niños no pararon de saltar.",
        name: "Diego Garrido",
        product: "Castillo 3 en 1",
        image: "/images/catalogo/castillo-3-en-1.webp",
      },
    ],
  },
  {
    direction: "down",
    items: [
      {
        quote:
          "El Arcoíris Mágico de la línea Dreamy fue la sensación del cumpleaños. Los tonos pastel y la piscina de pelotas encantaron a todos.",
        name: "Andrea Salazar",
        product: "Arcoíris Mágico",
        image: "/images/catalogo/arcoiris-magico.webp",
      },
      {
        quote:
          "Contratamos la Gran Carrera de Obstáculos de 15 metros para el evento del colegio y compitieron tanto niños como papás. ¡Increíble!",
        name: "Rodrigo Paz",
        product: "Gran Carrera de Obstáculos",
        image: "/images/catalogo/gran-carrera-de-obstaculos.webp",
      },
      {
        quote:
          "La Bubble House con el arco de globos y el staff permanente fue el centro de todas las fotos. Súper puntuales y ordenados.",
        name: "Luciana Torres",
        product: "Bubble House",
        image: "/images/catalogo/bubble-house.webp",
      },
    ],
  },
  {
    direction: "up",
    items: [
      {
        quote:
          "El Castillo de Ensueño es aún más lindo en persona. Los niños subían y bajaban por el tobogán pastel felices toda la tarde.",
        name: "Camila Benavides",
        product: "Castillo de Ensueño",
        image: "/images/catalogo/castillo-de-ensueno.webp",
      },
      {
        quote:
          "La Plataforma 360° y el Domo Overhead hicieron que todos nuestros invitados se llevaran videos espectaculares al instante en su celular.",
        name: "Mariana Montes",
        product: "Domo Overhead 360",
        image: "/images/catalogo/domo-overhead-360.webp",
      },
      {
        quote:
          "El Reloj Demoledor y las Bumper Balls pusieron la adrenalina al máximo. El operador estuvo atento en todo momento.",
        name: "Sebastián Alarcón",
        product: "Reloj Demoledor",
        image: "/images/catalogo/reloj-demoledor-01.webp",
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
        <span>5 horas de alquiler por evento</span>
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
        <span>Montaje, desmontaje y personal de apoyo</span>
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
        <span>100% limpios, seguros y renovados</span>
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
        <span>Castillos, Acuáticos, 360° y Juegos</span>
      </li>
    </>
  );
}

export function HomeInteractive() {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");
  const [isMobileUsps, setIsMobileUsps] = useState(false);
  const [reviewColumnCount, setReviewColumnCount] = useState(3);

  const uspSectionRef = useRef<HTMLElement>(null);
  const uspPrimaryListRef = useRef<HTMLUListElement>(null);

  const ribbonBandRef = useRef<HTMLDivElement>(null);
  const ribbonGroupRef = useRef<HTMLDivElement>(null);

  const reviewTrackRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reviewGroupRefs = useRef<(HTMLDivElement | null)[]>([]);

  /* Sync Category Filter from URL Hash if navigated from Header Mega Menu */
  useEffect(() => {
    const syncCategoryFromHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith("#cat-")) {
        const catSlug = hash.replace("#cat-", "") as ProductCategorySlug;
        if (PRODUCT_CATEGORIES.some((c) => c.slug === catSlug)) {
          setActiveFilter(catSlug);
          const el = document.getElementById("hbr-home-range");
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }
      }
    };
    syncCategoryFromHash();
    window.addEventListener("hashchange", syncCategoryFromHash);
    return () => window.removeEventListener("hashchange", syncCategoryFromHash);
  }, []);

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
              Explorar Catálogo
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
          4. PRODUCT RANGE GRID WITH 5 SEGMENT FILTER PILLS (#hbr-home-range)
          ======================================================================== */}
      <section
        id="hbr-home-range"
        className="hbr-home-products"
        aria-label="Catálogo de productos por categoría"
      >
        <div className="hbr-home-range-heading">
          <h2>Encuentra su favorito.</h2>
          <p>
            Explora nuestros {PACKAGES_DATA.length} productos organizados por
            categoría para tu celebración.
          </p>
        </div>

        <div
          className="hbr-home-filters"
          role="toolbar"
          aria-label="Filtrar productos por tipo"
        >
          <button
            type="button"
            data-filter="all"
            aria-pressed={activeFilter === "all"}
            onClick={() => setActiveFilter("all")}
          >
            Todos ({PACKAGES_DATA.length})
          </button>
          {PRODUCT_CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              data-filter={cat.slug}
              aria-pressed={activeFilter === cat.slug}
              onClick={() => setActiveFilter(cat.slug)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="hbr-catalog-grid" id="da-catalog-grid">
          {PACKAGES_DATA.map((pkg) => {
            const isHidden =
              activeFilter !== "all" && pkg.category !== activeFilter;
            return (
              <article
                key={pkg.slug}
                className="hbr-catalog-card"
                data-tier={pkg.category}
                hidden={isHidden}
              >
                <Link
                  className="hbr-catalog-card__link"
                  href={`/paquetes/${pkg.slug}`}
                >
                  <div className="hbr-catalog-card__image">
                    {pkg.isNew && (
                      <div className="hbr-catalog-card__badge">
                        ★
                        <br />
                        NUEVO
                      </div>
                    )}
                    <div className="hbr-catalog-card__placeholder">
                      <Image
                        src={pkg.image}
                        alt={pkg.title}
                        fill
                        sizes="(max-width: 767px) 50vw, (max-width: 1100px) 33vw, 25vw"
                        className="hbr-catalog-card__img"
                      />
                    </div>
                  </div>
                  <div className="hbr-catalog-card__body">
                    <div className="hbr-catalog-card__title-row">
                      <h3 className="hbr-catalog-card__name">{pkg.title}</h3>
                    </div>
                    <p className="hbr-catalog-card__subtitle">{pkg.subtitle}</p>
                    <div className="hbr-catalog-card__sizes">
                      <span className="hbr-catalog-card__sizes-label">
                        {pkg.cardTagsLabel}
                      </span>
                      {pkg.cardTags.map((tag) => (
                        <span key={tag} className="hbr-catalog-card__size">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="hbr-catalog-card__bottom">
                      <div className="product-price-and-shipping">
                        <span className="price">{pkg.price}</span>
                        {pkg.regularPrice && (
                          <span className="regular-price">
                            {pkg.regularPrice}
                          </span>
                        )}
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
                            <div
                              className="hbr-reviews__stars"
                              aria-label="5 de 5 estrellas"
                            >
                              ★★★★★
                            </div>
                            <blockquote className="hbr-reviews__quote">
                              {rev.quote}
                            </blockquote>
                            <div className="hbr-reviews__person">
                              <div className="hbr-reviews__product-image">
                                <Image
                                  src={rev.image}
                                  alt={rev.product}
                                  width={44}
                                  height={44}
                                  className="hbr-reviews__product-thumb"
                                />
                              </div>
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
                              <div className="hbr-reviews__product-image">
                                <Image
                                  src={rev.image}
                                  alt={rev.product}
                                  width={44}
                                  height={44}
                                  className="hbr-reviews__product-thumb"
                                />
                              </div>
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
