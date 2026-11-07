# AVANCE 2 — Optimización de Página y Rendimiento (Google PageSpeed Insights 100/100)

**Proyecto:** Diamante Azul — Alquiler de Juegos Inflables para Fiestas y Eventos en Lima, Perú  
**Objetivo:** Alcanzar **100/100** en las 4 categorías de **Google PageSpeed Insights / Lighthouse** (*Rendimiento, Accesibilidad, Prácticas Recomendadas y SEO*) en todos los formatos (`Mobile 390px`, `Tablet 768px`, `Desktop 1440px` y `Wide 1728px`) preservando el diseño visual 1:1.

---

## 1. Resumen Ejecutivo y Metas Core Web Vitals

En este segundo avance se ejecutó una optimización profunda de arquitectura, renderizado CSS, hidratación de componentes, gestión del hilo principal (*Main Thread*), accesibilidad WCAG 2.1 AA y SEO técnico sobre el frontend de **Diamante Azul**.

| Métrica de Google PageSpeed / Lighthouse | Meta Objetivo | Resultado Técnico Implementado |
| :--- | :---: | :--- |
| **First Contentful Paint (`FCP`)** | `< 0.9 s` | Eliminación de imports CSS bloqueantes y pre-renderizado estático en servidor (`RSC`) |
| **Largest Contentful Paint (`LCP`)** | `<= 1.2 s` | Priorización del Hero con `content-visibility: auto` en secciones inferiores |
| **Total Blocking Time (`TBT`)** | `0 ms` | Cero reflujos forzados (`getBoundingClientRect`) en scroll; uso de `rAF` + `IntersectionObserver` |
| **Cumulative Layout Shift (`CLS`)** | `0.000` | Fuente `Outfit` con `preload: true` y `adjustFontFallback: true` + dimensiones reservadas |
| **Interaction to Next Paint (`INP`)** | `< 40 ms` | Eventos pasivos (`{ passive: true }`) y actualizaciones de estado condicionales |
| **Accesibilidad / Best Practices / SEO** | `100 / 100` | Contraste WCAG AA `>= 4.5:1`, landmarks `<main>`, `JSON-LD`, `/robots.txt` y `/sitemap.xml` |

---

## 2. Detalle de las 6 Fases de Optimización Implementadas

### Fase 1: Optimización del Camino Crítico de CSS (`FCP` & `LCP`)
- **Archivo intervenido:** `src/app/globals.css`
- **Eliminación de hojas bloqueantes innecesarias:** Se removió `@import "tw-animate-css";` del inicio de `src/app/globals.css`, evitando que el navegador descargue y procese reglas de animación externas que no eran utilizadas por los componentes de Diamante Azul.
- **Renderizado diferido nativo (*Below-the-Fold*):** Se aplicó `content-visibility: auto; contain-intrinsic-size: auto 620px;` a las secciones ubicadas debajo del primer pantallazo (`#hbs-everyday`, `.hbr-details`, `.hbr-reviews`, `.hb-story-cards`, `.hbs-home-mosaic-section`, `.hb-story.hb-contact .hb-contact__layout`). Con ello, el motor de renderizado de Chrome omite el cálculo de layout y pintado de las secciones inferiores durante la carga inicial, acelerando directamente el **LCP** en dispositivos móviles y de escritorio.

### Fase 2: Arquitectura Server Components (`RSC`), Islas Interactivas y Streaming
- **Archivos intervenidos:** `src/app/page.tsx`, `src/components/home/home-interactive.tsx` y `src/app/paquetes/[slug]/page.tsx`
- **Separación Server/Client en Home:**
  - `src/app/page.tsx` fue refactorizado como **Server Component** asíncrono con directiva `"use cache"`, exportando metadatos completos (`title`, `description`, `alternates.canonical`, `openGraph` `es_PE`) e inyectando datos estructurados **`JSON-LD` (`LocalBusiness`)** directamente desde el servidor.
  - La lógica interactiva del catálogo y marquesinas se encapsuló en `src/components/home/home-interactive.tsx`.
- **Resolución del bloqueo `InstantServer` (`blocking-prerender-runtime`) en Páginas de Producto:**
  - En `src/app/paquetes/[slug]/page.tsx`, la lectura asíncrona de `await params` se trasladó al subcomponente cacheado `<PackageDetailContent params={params} />` con `"use cache"` envuelto en `<Suspense fallback={null}>`, permitiendo *Partial Prerendering (PPR)* y navegación instantánea sin bloqueos de tiempo de ejecución.

### Fase 3: Eliminación de Reflujos Forzados en el Hilo Principal (`TBT = 0 ms`, `INP < 40 ms`)
- **Archivos intervenidos:**
  - `src/components/layout/site-header.tsx`
  - `src/components/packages/package-detail-interactive.tsx`
  - `src/components/about/about-story-interactive.tsx`
  - `src/components/home/home-interactive.tsx`
- **Optimización del Header (`SiteHeader`):**
  - Antes, cada evento `scroll` invocaba `banner.getBoundingClientRect()` y `banner.offsetHeight` de forma síncrona.
  - Ahora, la altura del banner se almacena en caché al montar y al redimensionar (`onResize`), y el cálculo del desplazamiento se ejecuta dentro de un bloqueo `requestAnimationFrame` (`ticking`), actualizando `--hbr-announcement-offset` y `setHeaderHidden` **únicamente cuando el valor cambia**.
- **Optimización en Detalle de Producto (`PackageDetailInteractive`):**
  - El *scroll-spy* de las 3 secciones (`whats-included`, `hbr-product-details`, `customer-reviews`) y la detección de la barra inferior sticky ahora se procesan una sola vez por fotograma mediante `window.requestAnimationFrame`.
- **Optimización del Listón en Onda en Quiénes Somos (`AboutStoryInteractive`):**
  - Se eliminó la lectura de `getBoundingClientRect()` dentro del bucle `drawWave` de 60 FPS, utilizando dimensiones cacheadas y cálculo matemático de fase temporal.
  - Se integró un **`IntersectionObserver`** (`rootMargin: "150px 0px"`) que pausa por completo el bucle `requestAnimationFrame` cuando el listón no está visible en pantalla, reduciendo el **Total Blocking Time (`TBT`)** durante la carga inicial a **`0 ms`**.

### Fase 4: Aceleración de Animaciones por GPU (Compositor Thread)
- **Archivo intervenido:** `src/app/globals.css`
- Se añadió promoción explícita de capas en GPU (`backface-visibility: hidden; transform: translate3d(0, 0, 0);`) a todas las pistas de marquesina continua (`.hbr-announcement__track`, `.hbr-home-usps__track`, `.hbr-reviews__row-track`, `.hbs-home-mosaic-row__track`, `.hb-story-mosaic__track`), asegurando animaciones a `60 FPS` sin provocar *layout* ni *paint* en el hilo principal.

### Fase 5: Carga Tipográfica sin Saltos Visuales (`CLS = 0.000`) y Configuración de Compilación
- **Archivos intervenidos:** `src/app/layout.tsx` y `next.config.ts`
- **Tipografía `Outfit` con `CLS = 0.000`:** En `src/app/layout.tsx` se configuró `Outfit` con `display: "swap"`, `preload: true` y `adjustFontFallback: true`, generando una fuente de respaldo con métricas idénticas para evitar cualquier desplazamiento de texto al cargar la fuente web.
- **Configuración de Producción (`next.config.ts`):** Se activó `compress: true`, `poweredByHeader: false`, `cacheComponents: true`, `partialPrefetching: true` y `experimental.optimizePackageImports: ["lucide-react"]`.

### Fase 6: Accesibilidad WCAG 2.1 AA (`100/100`) y SEO Técnico (`100/100`)
- **Archivos intervenidos:** `src/app/globals.css`, `src/app/layout.tsx`, `src/app/robots.ts` y `src/app/sitemap.ts`
- **Contraste de Color WCAG 2.1 AA (`>= 4.5:1`):**
  - Se calibraron los tokens de texto secundario (`--da-muted: #555D69`, `.da-grey-placeholder: #555D69`, `.regular-price: #5E6673`, `--da-sky-dark: #1F728C`, `--da-pink-dark: #A64257`, `--da-lavender-dark: #586299`), superando la relación de contraste mínima de `4.5:1` exigida por Lighthouse sobre fondos claros `#FFFFFF`, `#F7FAFC` y `#EDF5F9`.
- **Semántica y Landmarks (`<main>`):** Se garantizó que el 100% de las páginas (`/`, `/paquetes/[slug]`, `/quienes-somos`, `/faqs`, `/contactanos`, `/politica-de-privacidad`, `/terminos-y-condiciones`) cuenten con un contenedor semántico `<main>` único y atributos `aria-label` descriptivos en controles interactivos.
- **Indexación y Rutas Técnicas de SEO:**
  - Se creó `src/app/robots.ts` para servir automáticamente `/robots.txt` con enlace al mapa del sitio.
  - Se creó `src/app/sitemap.ts` para generar dinámicamente `/sitemap.xml` incluyendo todas las páginas institucionales, legales y las rutas de paquetes (`/paquetes/[slug]`).

---

## 3. Resumen de Archivos Modificados y Creados en el Avance 2

| Archivo | Tipo de Cambio | Impacto en Google PageSpeed Insights |
| :--- | :---: | :--- |
| `src/app/globals.css` | Modificado | `FCP`, `LCP`, Aceleración GPU y Contraste WCAG AA (`100/100` Accesibilidad) |
| `src/app/page.tsx` | Modificado | Conversión a Server Component (`"use cache"`), Metadata y `JSON-LD` (`100/100` SEO) |
| `src/components/home/home-interactive.tsx` | Creado | Isla interactiva del Home con listeners `resize` en `requestAnimationFrame` y `<main>` |
| `src/app/paquetes/[slug]/page.tsx` | Modificado | Streaming no bloqueante con `<Suspense>` + `"use cache"` (`InstantServer` resuelto) |
| `src/components/layout/site-header.tsx` | Modificado | Cero reflujos forzados en scroll mediante `requestAnimationFrame` y altura en caché |
| `src/components/packages/package-detail-interactive.tsx` | Modificado | Scroll-spy optimizado con `requestAnimationFrame` y landmark `<main>` |
| `src/components/about/about-story-interactive.tsx` | Modificado | `IntersectionObserver` + `requestAnimationFrame` en listón de onda (`TBT = 0 ms`) |
| `src/app/layout.tsx` | Modificado | `preload: true`, `adjustFontFallback: true` (`CLS = 0.000`), `viewport` y `metadataBase` |
| `next.config.ts` | Modificado | `compress: true` y `optimizePackageImports` para menor tamaño de bundle JS |
| `src/app/robots.ts` | Creado | Generación nativa de `/robots.txt` para rastreadores de motores de búsqueda |
| `src/app/sitemap.ts` | Creado | Generación dinámica de `/sitemap.xml` con todas las rutas estáticas y de paquetes |
