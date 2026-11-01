import Link from "next/link"
import {
  COVERAGE_DISTRICTS,
  PACKAGES_DATA,
  SOCIAL_LINKS,
  WHATSAPP_CONFIG,
  buildWhatsAppUrl,
} from "@/data/packages"
import { LocationLineIcon, WhatsappLineIcon } from "@/components/icons"

export function SiteFooter() {
  const generalWaUrl = buildWhatsAppUrl({})

  return (
    <footer className="border-t border-border bg-secondary/40 text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* Identidad de Marca */}
          <div className="space-y-3 md:col-span-5">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-2xl bg-primary text-xs font-extrabold text-primary-foreground">
                DA
              </span>
              <span className="text-lg font-extrabold text-foreground">
                {WHATSAPP_CONFIG.businessName}
              </span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Alquiler profesional de juegos inflables para cumpleaños infantiles,
              reuniones familiares, colegios y eventos corporativos en Lima Moderna.
            </p>
            <p className="text-xs font-medium text-muted-foreground">
              Razón social: {WHATSAPP_CONFIG.legalName} · Atención 100% virtual con
              despacho e instalación a domicilio.
            </p>
          </div>

          {/* Enlaces a Paquetes */}
          <div className="space-y-3 md:col-span-3">
            <h2 className="text-sm font-bold text-foreground">
              Inventario de Paquetes
            </h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {PACKAGES_DATA.map((pkg) => (
                <li key={pkg.slug}>
                  <Link
                    href={`/paquetes/${pkg.slug}`}
                    className="transition-colors duration-fast hover:text-foreground"
                  >
                    {pkg.tierName}: {pkg.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cobertura y Redes Sociales */}
          <div className="space-y-3 md:col-span-4">
            <h2 className="text-sm font-bold text-foreground">
              Cobertura y Contacto Directo
            </h2>
            <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
              <LocationLineIcon className="mt-0.5 size-4 shrink-0 text-foreground" />
              <span>
                {COVERAGE_DISTRICTS.slice(0, 7).join(", ")} y zonas cercanas.
              </span>
            </p>

            <div className="pt-1">
              <a
                href={generalWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground [box-shadow:var(--shadow-primary)] transition-[box-shadow,transform] duration-fast hover:[box-shadow:var(--shadow-primary-hover)]"
              >
                <WhatsappLineIcon className="size-4" />
                <span>Reservar fecha por WhatsApp</span>
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold text-muted-foreground">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border bg-card px-3 py-1.5 text-foreground transition-colors duration-fast hover:bg-accent"
              >
                Instagram
              </a>
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border bg-card px-3 py-1.5 text-foreground transition-colors duration-fast hover:bg-accent"
              >
                Facebook
              </a>
              <a
                href={SOCIAL_LINKS.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border bg-card px-3 py-1.5 text-foreground transition-colors duration-fast hover:bg-accent"
              >
                TikTok
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Botón flotante de acceso rápido a WhatsApp */}
      <div className="fixed bottom-5 right-5 z-40">
        <a
          href={generalWaUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Abrir chat de WhatsApp con Diamante Azul"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-xs font-bold text-primary-foreground [box-shadow:var(--shadow-l)] transition-transform duration-fast active:translate-y-px"
        >
          <WhatsappLineIcon className="size-5" />
          <span className="hidden sm:inline">WhatsApp Directo</span>
        </a>
      </div>
    </footer>
  )
}

