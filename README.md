# Diamante Azul

Proyecto web desarrollado con **Next.js 16 (App Router)**, **React 19**, **TypeScript** y **Tailwind CSS v4**, preparado para despliegue continuo en **SiteGround (Plan GoGeek - Node.js Projects)**.

## Estructura del Proyecto

```text
├── public/                 # Recursos estáticos públicos
├── src/
│   ├── app/                # Rutas, layouts y páginas (Next.js App Router)
│   ├── components/         # Componentes de interfaz reutilizables
│   ├── config/             # Configuración global del sitio (SEO, constantes)
│   ├── lib/                # Funciones utilitarias y helpers
│   └── types/              # Definiciones de tipos TypeScript globales
├── .env.example            # Plantilla de variables de entorno
├── next.config.ts          # Configuración de Next.js 16
├── package.json            # Dependencias y scripts
└── tsconfig.json           # Configuración de TypeScript
```

## Desarrollo Local

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Copiar las variables de entorno:
   ```bash
   cp .env.example .env.local
   ```
3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## Despliegue en SiteGround (Plan GoGeek - Node.js)

Este repositorio está listo para conectarse directamente con la integración de GitHub en **SiteGround Site Tools > Node.js**:

- **Repositorio GitHub:** `https://github.com/SebastianT28/diamanteazul.git`
- **Rama principal:** `main`
- **Framework Preset:** `Next.js`
- **Versión de Node.js recomendada:** `22.x` o `24.x` (mínimo `>=20.0.0`)
- **Gestor de paquetes:** `npm`
- **Build Command:** `npm run build`
- **Start Command (SSR/Full-Stack):** `npm run start`
