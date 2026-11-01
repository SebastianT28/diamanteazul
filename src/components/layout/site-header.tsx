import Link from "next/link"
import { Button } from "@/components/ui/button"
import { WhatsappLineIcon, SparklesLineIcon, LocationLineIcon } from "@/components/icons"
import { buildWhatsAppUrl } from "@/data/packages"

export function SiteHeader() {
  const generalWaUrl = buildWhatsAppUrl({})

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Cinta Superior Lavanda (#9DA5D3) */}
      <div className="bg-pastel-lavender text-pastel-lavender-foreground px-4 py-2 text-xs font-medium">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2">
          <p className="flex items-center gap-1.5">
            <SparklesLineIcon className="size-4 shrink-0" />
            <span>
              Alquiler de inflables para fiestas infantiles: seguridad, limpieza y puntualidad.
            </span>
          </p>
          <p className="hidden items-center gap-1 sm:flex">
            <LocationLineIcon className="size-3.5 shrink-0" />
            <span>Surco · Miraflores · San Borja · San Isidro · Magdalena</span>
          </p>
        </div>
      </div>

      {/* Barra de Navegación Principal sobre Blanco (#FFFFFF) */}
      <div className="border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="flex size-10 items-center justify-center rounded-2xl bg-primary text-sm font-extrabold text-primary-foreground [box-shadow:var(--shadow-button)]">
              DA
            </span>
            <span className="flex flex-col">
              <span className="text-base font-extrabold leading-tight text-foreground">
                Diamante Azul
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                Creamos momentos felices
              </span>
            </span>
          </Link>

          <nav
            aria-label="Navegación principal"
            className="hidden items-center gap-1 md:flex"
          >
            <Link
              href="/#paquetes"
              className="rounded-full px-3.5 py-2 text-sm font-medium text-foreground transition-colors duration-fast hover:bg-accent hover:text-accent-foreground"
            >
              Paquetes de Inflables
            </Link>
            <Link
              href="/#experiencia"
              className="rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors duration-fast hover:bg-accent hover:text-accent-foreground"
            >
              Seguridad y Limpieza
            </Link>
            <Link
              href="/#corporativo"
              className="rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors duration-fast hover:bg-accent hover:text-accent-foreground"
            >
              Colegios y Empresas
            </Link>
            <Link
              href="/#preguntas"
              className="rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors duration-fast hover:bg-accent hover:text-accent-foreground"
            >
              Preguntas Frecuentes
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={generalWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Cotizar paquetes de inflables por WhatsApp"
            >
              <Button variant="primary" size="default">
                <WhatsappLineIcon className="size-4" />
                <span>Consultar por WhatsApp</span>
              </Button>
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}

