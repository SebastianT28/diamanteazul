# AVANCE 1 — Diseño Frontend de Diamante Azul

**Proyecto:** Diamante Azul — Alquiler de Juegos Inflables para Fiestas y Eventos en Lima, Perú  
**Tecnologías:** Next.js 16 (App Router) · React 19 · TypeScript · CSS Variables & Responsive Grid  
**Formatos soportados:** Desktop (`1440px` / `1728px`), Tablet (`768px` – `991px`) y Mobile (`390px` – `575px`)

---

## 1. Resumen Ejecutivo

En este primer avance se desarrolló de principio a fin la arquitectura visual e interactiva del **Frontend de Diamante Azul**, replicando con fidelidad 1:1 la experiencia editorial, animaciones suaves, estructura de navegación y componentes interactivos de referencia, adaptados íntegramente a la identidad visual pastel de **Diamante Azul** y al flujo comercial de reserva directa vía **WhatsApp** para el mercado de Lima, Perú.

---

## 2. Sistema de Diseño y Paleta Cromática

Se estructuró un sistema de tokens CSS en `src/app/globals.css` basado en tonos pastel luminosos y tipografía geométrica redondeada (`Outfit`):

| Token CSS | Valor Hex | Uso Principal en la Interfaz |
| :--- | :--- | :--- |
| `--da-sky` | `#5CC2DE` | Color primario de acento (botones principales, enlaces activos, focos de formulario) |
| `--da-sky-dark` | `#1F728C` | Estados `:hover`, textos destacados sobre fondos celeste hielo y encabezados técnicos |
| `--da-sky-tint` | `#EBF7FB` | Superficies suaves de contraste, tarjetas informativas y cabeceras de sección |
| `--da-pink` | `#F4AEBC` | Acento secundario rosa pastel (etiquetas, detalles de marca, gradientes e íconos) |
| `--da-pink-dark` | `#A64257` | Precios de oferta, insignias destacadas y enlaces legales |
| `--da-lavender` | `#9DA5D3` | Acento terciario lavanda (píldoras de filtro activas, insignias «Nuevo», barra superior) |
| `--da-canvas` | `#F7FAFC` | Fondo general de página limpio y luminoso |
| `--da-white` | `#FFFFFF` | Superficie principal de tarjetas, píldora de navegación, acordeones y paneles |
| `--da-ink` | `#1F242C` | Color principal de titulares y textos de lectura |

---

## 3. Páginas y Módulos Desarrollados

### 3.1. Cabecera Global (`src/components/layout/site-header.tsx`) y Pie de Página (`src/components/layout/site-footer.tsx`)
- **Barra de Anuncio Superior (`.header-event-banner.hbr-announcement`):** Marquesina horizontal infinita con puntos de color pastel y pausa automática al pasar el cursor.
- **Header Flotante Tipo Píldora (`#da-header.hbr-header`):**
  - Auto-ocultamiento inteligente al desplazar hacia abajo y reaparición inmediata al subir.
  - **Mega-Menú Desplegable (`.adropdown / .hbr-mega`):** Organizado en 3 columnas (*Paquetes Básico*, *Paquetes Medio* y *Paquetes Premium*) con miniaturas y acceso directo a los 7 modelos.
  - **Menú Lateral Móvil (`.hbr-mobile-drawer`):** Navegación táctil con sub-acordeón para *«Los Inflables»*, tarjetas de productos y botón directo a WhatsApp.
- **Footer Integral (`footer.hbf-footer`) y Botón Flotante (`#hbr-chat-tab`):**
  - Tarjeta superior de suscripción / contacto rápido (*«Únete a nuestra familia feliz»*) con ícono de sobre animado (`hbf-mail-bounce`).
  - Fila de enlaces de navegación, botones circulares de redes sociales (`IG`, `TK`, `FB`), sello de seguridad infantil (`CE · EN71 · SAFE`) y enlaces legales.
  - Pestaña flotante **`¿Te ayudamos?`** fija en la esquina inferior derecha en Desktop y vertical en el borde derecho en Celular.

### 3.2. Página Principal — Home (`src/app/page.tsx` & `src/components/home/home-interactive.tsx`)
1. **Hero Principal (`.video-hero.hbr-hero-v2`):** Portada a ancho completo con máscara inferior en onda SVG, titular *«Pequeños momentos. Gran felicidad.»* y CTA hacia el catálogo.
2. **Franja de Beneficios USP (`#da-usps`):** 4 pilares del servicio con íconos animados en grilla de 4 columnas en Desktop y carrusel continuo en Celular.
3. **Catálogo Filtrable de Paquetes (`#hbr-home-range`):**
   - Filtro instantáneo por nivel (*Todos los paquetes*, *Paquete Premium*, *Paquete Medio*, *Paquete Básico*).
   - 7 tarjetas de producto con insignia *«★ NUEVO»*, medidas disponibles, precio promocional y precio regular tachado.
4. **Listón Curvo en Movimiento (`.hbr-play-banner`):** Banda ondulada con frases de marca cuyos caracteres siguen una trayectoria sinusoidal continua.
5. **Momentos Cotidianos (`#hbs-everyday`):** Grilla editorial de 6 tarjetas (*«Para los días que siempre recordarán»*) adaptada a 3 columnas en Desktop, 2 en Tablet y 1 en Celular.
6. **Muro de Reseñas de Clientes (`#da-reviews`):** 3 columnas verticales con desplazamiento infinito alternado (arriba / abajo / arriba) y pausa al interactuar.

### 3.3. Páginas de Detalle de Producto — «Los Inflables» (`src/app/paquetes/[slug]/page.tsx` & `src/components/packages/package-detail-interactive.tsx`)
- **Catálogo completo de rutas dinámicas (`src/data/packages.ts`):** Soporta los 7 modelos individuales (`arcoiris-rosa`, `clasico-blanco`, `arcoiris-lavanda`, `celeste-diamante`, `arcoiris-azul`, `mini-blanco`, `mini-arcoiris`) y los 3 niveles (`basico`, `medio`, `premium`).
- **Buy-Box Interactivo (`#mainProduct`):**
  - Galería principal con controles de vista, tira de 5 miniaturas interactivas y navegación anterior/siguiente.
  - Selector de medidas (`3×3m`, `4×4m`, etc.) que actualiza en vivo el precio, el precio regular tachado y el mensaje personalizado de reserva por WhatsApp.
  - Selector visual de modelos (*Model Switcher*) con miniaturas para cambiar entre los 7 inflables con un clic.
  - Acordeón de información rápida (*Medidas y Capacidad*, *Instalación y Superficies*, *Política de Lluvia y Cambios*).
- **Orden de Secciones Estandarizado:**
  1. **1ra Sección — `Qué incluye` (`#whats-included`):** Grilla de 4 tarjetas detallando el equipamiento incluido en el alquiler.
  2. **2da Sección — `Los detalles` (`#hbr-product-details`):** Ficha técnica de especificaciones y preguntas frecuentes específicas del modelo.
  3. **3ra Sección — `Reseñas` (`#customer-reviews`):** Resumen de calificación `5.0 ★` y carrusel horizontal de testimonios verificados.
- **Barra Inferior Sticky de Reserva (`.hbc-sticky-atc`):** Aparece suavemente cuando el botón principal de compra sale de la vista al hacer scroll.

### 3.4. Página «Quiénes Somos» (`src/app/quienes-somos/page.tsx` & `src/components/about/about-story-interactive.tsx`)
- **Hero de Historia (`.hb-story__hero--cover`):** Portada con titular *«Creado para días más felices en casa.»* y botón hacia la historia.
- **Barra de Navegación Rápida Sticky (`.hb-story__jump`):** Se fija en la parte superior durante el recorrido por las 4 secciones (`Nuestro propósito`, `Nuestro recorrido`, `Los pequeños detalles`, `Hecho para casa`) con *scroll-spy* activo.
- **Baraja Interactiva 3D «Nuestro Recorrido» (`.hb-story-deck`):** Tarjetas apiladas por año (`2022`, `2023`, `2025`, `2026`) con rotación automática, soporte táctil (*swipe*), teclado y píldoras selectoras de año.
- **Listón de Letras en Onda + Grilla de Detalles + Mosaico Doble:** Secciones editoriales con mosaico final de 2 filas en movimiento opuesto.

### 3.5. Página de Preguntas Frecuentes — «FAQs» (`src/app/faqs/page.tsx` & `src/components/faqs/faq-interactive.tsx`)
- **Encabezado Principal (`#hbf-title`):** Con el título actualizado **«Pequeñas dudas, Respuestas rápidas.»**.
- **Buscador Instantáneo y Filtros por Categoría:** Filtrado en vivo sobre 21 preguntas frecuentes organizadas en 7 categorías (*Reservas y Pagos*, *Entrega e Instalación*, *Espacio y Superficies*, *Seguridad e Higiene*, *Clima y Garantía*, *Durante tu Evento*, *Paquetes y Medidas*) con resaltado automático `<mark>` de los términos buscados y sincronización con el hash de la URL.

### 3.6. Página «Contáctanos» (`src/app/contactanos/page.tsx` & `src/components/contact/contact-interactive.tsx`)
- **Encabezado Principal (`#hbc-title`):** Con el título actualizado **«Estamos a un mensaje de distancia.»**.
- **3 Tarjetas de Acceso Rápido (`.hb-contact__links`):** *Explorar preguntas frecuentes*, *Escribir por WhatsApp* y *Ver todos los inflables*.
- **Panel de Soporte + Formulario Interactivo (`.hb-contact__layout`):** Formulario validado (Nombre, Correo, Teléfono, Fecha/Distrito y Mensaje) que estructura los datos y abre automáticamente la conversación lista en WhatsApp.

### 3.7. Páginas Legales Adaptadas a la Normativa Peruana
- **Política de Privacidad (`src/app/politica-de-privacidad/page.tsx`):** Diseño editorial `.hb-legal` con tipografía `Outfit`, adaptado a la **Ley N° 29733 (Ley de Protección de Datos Personales del Perú)**, su Reglamento (**D.S. N° 003-2013-JUS**) y la **Autoridad Nacional de Protección de Datos Personales (ANPDP — MINJUSDH)** para el ejercicio de derechos ARCO.
- **Términos y Condiciones (`src/app/terminos-y-condiciones/page.tsx`):** Estructurado en 16 cláusulas adaptadas a la operativa de **Diamante Azul** en Lima y al marco legal peruano (**Código de Protección y Defensa del Consumidor — Ley N° 29571 / INDECOPI**, **SUNAT**, **Código Civil Peruano** y Libro de Reclamaciones).

---

## 4. Estructura de Archivos del Avance 1

```text
src/
├── app/
│   ├── globals.css                         # Sistema de diseño, componentes y responsive (Desktop/Tablet/Mobile)
│   ├── layout.tsx                          # Layout raíz con SiteHeader y SiteFooter
│   ├── page.tsx                            # Página Principal (Home)
│   ├── paquetes/[slug]/page.tsx            # Páginas dinámicas de detalle de producto (Los Inflables)
│   ├── quienes-somos/page.tsx              # Página Quiénes Somos
│   ├── faqs/page.tsx                       # Página de Preguntas Frecuentes (FAQs)
│   ├── contactanos/page.tsx                # Página Contáctanos
│   ├── politica-de-privacidad/page.tsx     # Página de Política de Privacidad (Ley N° 29733 Perú)
│   └── terminos-y-condiciones/page.tsx     # Página de Términos y Condiciones (INDECOPI / Perú)
├── components/
│   ├── layout/
│   │   ├── site-header.tsx                 # Header flotante, marquesina superior, Mega-Menú y Drawer móvil
│   │   └── site-footer.tsx                 # Footer con caja de suscripción, redes, seguridad y botón flotante
│   ├── packages/
│   │   └── package-detail-interactive.tsx  # Galería, selector de medidas, switcher y secciones de producto
│   ├── about/
│   │   └── about-story-interactive.tsx     # Barra sticky, baraja 3D por años, listón en onda y mosaico
│   ├── faqs/
│   │   └── faq-interactive.tsx             # Buscador en tiempo real, filtros y acordeón de 21 preguntas
│   └── contact/
│       └── contact-interactive.tsx         # Accesos rápidos y formulario conectado a WhatsApp
└── data/
    └── packages.ts                         # Base de datos tipada de paquetes, medidas, precios y WhatsApp builder
```
