# AVANCE 3 FINAL — Catálogo Oficial de 31 Productos, Imágenes IA, SEO Multi-Ciudad (Lima Moderna y Arequipa), Core Web Vitals y Panel Administrador (`/admin`) con MySQL

**Proyecto:** Diamante Azul — Alquiler de Juegos Inflables para Fiestas y Eventos  
**Stack Tecnológico:** Next.js 16.4.6 (App Router / Turbopack) · React 19 · TypeScript · MySQL (`mysql2`)  
**Repositorio GitHub:** `https://github.com/SebastianT28/diamanteazul.git` (Rama: `main`)  
**Hosting Objetivo:** SiteGround Plan GoGeek (Proyectos Node.js + Base de Datos MySQL)

---

## 1. Resumen Ejecutivo del Avance 3 Final

En este tercer y último avance se completó la integración integral del catálogo real de **31 productos en 5 categorías**, la identidad de marca oficial, las **24 fotografías lifestyle generadas con Inteligencia Artificial en formato `.webp`**, el efecto interactivo de **burbujas festivas flotantes que revientan al clic/toque**, la arquitectura **SEO Multi-Ciudad (Lima Moderna como opción principal y Arequipa con su ruta propia `/arequipa`)**, la estandarización de todos los canales de **WhatsApp (`+51 948 311 603`) y correo personalizado (`mailto:Diamanteazulaqp@gmail.com`)**, la optimización de **Google PageSpeed Insights** y el desarrollo del **Panel Administrador (`/admin`) conectado a MySQL** para editar cualquiera de las 58 imágenes del sitio y gestionar (crear, editar, eliminar y restaurar) productos del catálogo en vivo.

---

## 2. Identidad Visual, Portada Hero y Burbujas Interactivas

- **Logo Oficial (`public/images/home/logo_diamante_azul.webp`):** Formato WebP (`520 × 176 px`) con fondo transparente, medallón celeste degradado con diamante blanco y tipografía *Fredoka SemiBold*. Eliminación de SVGs residuales de plantilla.
- **Portada Principal Hero (`public/images/home/home_hero_portada-02.webp`):** Imagen `1920 × 1080 px` (`16:9`) recomprimida a **`238.9 KB`** (reducción del `77.4%` para máximo puntaje LCP) con encuadre adaptativo (`center 22%` en desktop y `73% 22%` en móvil).
- **Efecto de Burbujas Festivas Interactivas (`src/components/home/home-interactive.tsx` y `src/app/globals.css`):** 14 burbujas iridiscentes pastel que ascienden suavemente por la portada y **revientan al hacer clic o pulsar sobre ellas**, liberando un anillo expansivo y 8 gotitas pastel antes de regenerarse desde la base.

---

## 3. Catálogo Oficial Completo (31 Productos en 5 Categorías)

Descarga desde Google Drive, recorte cuadrado `1:1` (`1000 × 1000 px`) y optimización a `.webp` de las **32 imágenes de productos** en `public/images/catalogo/` (`37.84 MB` → `~4.5 MB`), estructurando los **31 productos oficiales** (descartando *Cabina Espejada*):

1. **Castillos y Toboganes (`16 productos`):** *Arcoíris Mágico, Castillo de Ensueño, Tobogán de Ensueño, Mega Circuito Encanto, Castillo Blanco Clásico, Castillo Blanco con Piscina de Pelotas, Castillo Blanco con Tobogán, Piscina Inflable de Pelotas, Castillo 3 en 1, Castillo con Tobogán, Castillo Pequeño, Castillo con Piscina de Pelotas, Tobogán Inflable de Bloques, Tobogán Inflable con Obstáculos, Super Slide, Lego en Acción*.
2. **Inflables Acuáticos (`3 productos`):** *Aquaroller (Pelota Acuática), Super Cañón de Espuma, Piscina con Botes Flotantes*.
3. **Juegos y Entretenimiento (`6 productos`):** *Bubble House, Soft Play, Gran Carrera de Obstáculos (15m × 3m), Reloj Demoledor (2 vistas), Bumper Balls, Futbolín Humano, Camas Saltarinas*.
4. **Sesiones de Fotos (`3 productos`):** *Plataforma 360° (2 y 3 horas), Domo Overhead 360, Estación de Fotos*.
5. **Complementos y Extras (`3 productos`):** *Sillas Metálicas Tapizadas, Generador Eléctrico 3600W, Generador Eléctrico 8500W*.

---

## 4. Mejoras UX en Tarjetas, Fichas de Producto e Imágenes con IA

- **Tarjetas del Catálogo en Home:** Alineación a la misma altura de **`Medidas [...]`** y **`Alquiler [5 hrs / 3 hrs / Por evento]`**.
- **Fichas de Producto (`/paquetes/[slug]`):** Separación en píldoras independientes de **`Medida`** y **`Tiempo`**, inclusión de **miniaturas reales del inflable (`56 × 56 px`)** en cada tarjeta de reseñas y **visor Lightbox a pantalla completa** en los 31 productos.
- **24 Imágenes Generadas con IA en Formato `.webp`:**
  - `6` imágenes lifestyle en `public/images/home/` para *«Para los días que siempre recordarán»*.
  - `18` imágenes en `public/images/pages/`: portadas de *Quiénes Somos*, *FAQs* y *Contáctanos*, las 4 tarjetas de *Nuestro Recorrido (2022–2026)*, *Está en los detalles* y las 10 fotos del *Mosaico Inferior* (sin íconos decorativos en las esquinas).

---

## 5. Estrategia SEO Multi-Ciudad (Lima Moderna y Arequipa)

- **Lima como Ciudad Principal por defecto en `/` (`src/app/page.tsx`):** Metadatos SEO y `Schema.org LocalBusiness` enfocados en **Lima Moderna**, priorizando **San Isidro, Miraflores, Santiago de Surco, San Borja, Magdalena del Mar, Surquillo y San Luis**, además de zonas cercanas.
- **Arequipa con Ruta Propia Indexable en `/arequipa` (`src/app/arequipa/page.tsx`):** Metadatos propios, `canonical: "/arequipa"`, `Schema.org LocalBusiness` para la **ciudad de Arequipa** e inclusión en `src/app/sitemap.ts`.
- **Selector de Ciudad en Cabecera (`src/components/layout/site-header.tsx` y `src/lib/city-context.tsx`):** Cápsula horizontal (`📍 Lima | Arequipa`) en escritorio y botón compacto con **ícono de localización y barra desplegable vertical** en móvil (`<= 991px`). Encabezado dinámico *"Encuentra tu inflable favorito en Lima / Arequipa"*.

---

## 6. Canales de Contacto, WhatsApp, Correo Personalizado y FAQs

- **WhatsApp Oficial (`+51 948 311 603`):** Todos los mensajes predeterminados comienzan con **`"Buen día, ..."`** en lenguaje puntual y neutro en género. En las páginas de producto menciona solo el nombre del producto en texto estándar e incluye la URL de la ficha (`/paquetes/[slug]`) con etiquetas OpenGraph para vista previa automática.
- **Correo Oficial (`mailto:Diamanteazulaqp@gmail.com`):** Asociado en todo el sitio web, textos legales y JSON-LD. El botón **`"Enviar"`** del formulario de Contáctanos y el formulario del pie de página abren un correo completamente personalizado hacia `mailto:Diamanteazulaqp@gmail.com`.
- **Preguntas Frecuentes (`src/components/faqs/faq-interactive.tsx`):** 4 categorías y 16 preguntas reformuladas con los datos reales de los catálogos (reserva con `50%` vía Yape `948 311 603` o BCP y `50%` al instalar, decoración de 100 globos, inflables acuáticos, cabinas 360° con QR/AirDrop, sillas metálicas y generador eléctrico).

---

## 7. Panel Administrador (`/admin`) y Backend con Base de Datos MySQL

- **Credenciales iniciales:** Usuario `admin` | Contraseña `diamanteazul26_$`.
- **Seguridad (`src/lib/admin-auth.ts`):** Encriptación `crypto.scrypt` con *salt*, sesión firmada en cookie `HttpOnly` (`HMAC-SHA256`), bloqueo anti-fuerza bruta (5 intentos fallidos bloquean la IP por 15 minutos), bloqueo en `robots.txt` y ventana **"Cambiar usuario / contraseña"** que exige confirmar la **Contraseña Actual**.
- **Módulo 1 — Imágenes del Sitio (`58 imágenes`):** Todas las tarjetas enfatizan debajo de **`Medida sugerida`** la etiqueta **`Formato: Webp`**, con conversión automática a `.webp` al subir y botón para restaurar la imagen original.
- **Módulo 2 — Productos del Catálogo (`CRUD completo`):** Visualización de los productos actuales, botón **`+ Agregar nuevo producto`**, edición completa (`✏️ Editar / Modificar`), eliminación (`Eliminar`) y restauración de productos base, respaldado en las tablas MySQL `admin_users`, `site_images` y `site_products` (`database/diamante_azul_mysql.sql`).

---

## 8. Guía Paso a Paso para Subir el Proyecto a SiteGround (Plan GoGeek — Node.js)

1. **Crear Base de Datos MySQL en SiteGround:** En *Site Tools → Sitio → MySQL → Bases de Datos y Usuarios*, crea la base de datos, crea el usuario con contraseña y asígnale todos los privilegios (*All Privileges*).
2. **Importar SQL Inicial (Opcional):** En *Site Tools → MySQL → phpMyAdmin*, puedes importar `database/diamante_azul_mysql.sql` (aunque el backend también crea las tablas `admin_users`, `site_images` y `site_products` automáticamente al iniciar).
3. **Crear Proyecto Node.js conectado a GitHub:** En *Client Area → Websites → Node.js Projects → New Project*, elige **Import Git Repository**, selecciona `SebastianT28/diamanteazul` y la rama `main`.
4. **Parámetros de Compilación:** Node.js `20.x` o `22.x`, Install Command `npm install`, Build Command `npm run build`, Start Command `npm run start`.
5. **Variables de Entorno en SiteGround:** Configura `MYSQL_HOST=localhost`, `MYSQL_PORT=3306`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE` y `ADMIN_SESSION_SECRET`.
6. **Vincular Dominio, SSL y Verificar `/admin`:** Asigna tu dominio oficial, activa el certificado SSL Let's Encrypt e ingresa a `https://tudominio.com/admin` con `admin` / `diamanteazul26_$`.
