"use client"

import * as React from "react"
import Link from "next/link"
import {
  COVERAGE_DISTRICTS,
  EVENT_TYPES,
  PACKAGES_DATA,
  buildWhatsAppUrl,
  type InflatablePackage,
} from "@/data/packages"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeftLineIcon,
  CheckLineIcon,
  ClockLineIcon,
  LocationLineIcon,
  RulerLineIcon,
  SafeShieldLineIcon,
  SparklesLineIcon,
  StarLineIcon,
  User2LineIcon,
  WhatsappLineIcon,
} from "@/components/icons"
import { cn } from "@/lib/utils"

interface PackageDetailInteractiveProps {
  pkg: InflatablePackage
}

export function PackageDetailInteractive({
  pkg,
}: PackageDetailInteractiveProps) {
  const [selectedSlideIndex, setSelectedSlideIndex] = React.useState(0)
  const [selectedDistrict, setSelectedDistrict] = React.useState<string>(
    COVERAGE_DISTRICTS[0]
  )
  const [selectedEventType, setSelectedEventType] = React.useState<string>(
    EVENT_TYPES[0]
  )

  const activePhoto =
    pkg.galleryPlaceholders[selectedSlideIndex] ?? pkg.galleryPlaceholders[0]

  const whatsappUrl = React.useMemo(
    () =>
      buildWhatsAppUrl({
        packageTitle: pkg.title,
        tierName: pkg.tierName,
        district: selectedDistrict,
        eventType: selectedEventType,
      }),
    [pkg.title, pkg.tierName, selectedDistrict, selectedEventType]
  )

  const badgeVariant =
    pkg.accent === "pink"
      ? "pink"
      : pkg.accent === "lavender"
        ? "lavender"
        : "blue"

  const buttonVariant =
    pkg.accent === "pink"
      ? "pink"
      : pkg.accent === "lavender"
        ? "lavender"
        : "primary"

  const gallerySurfaceClass =
    pkg.accent === "pink"
      ? "bg-pastel-pink/20 border-pastel-pink"
      : pkg.accent === "lavender"
        ? "bg-pastel-lavender/20 border-pastel-lavender"
        : "bg-pastel-blue/20 border-pastel-blue"

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 pb-24 sm:px-6 md:py-12 md:pb-16">
      {/* Barra Superior de Retorno y Conmutador Rápido de Paquetes */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
        <Link href="/#paquetes">
          <Button variant="secondary" size="sm">
            <ArrowLeftLineIcon className="size-4" />
            <span>Volver al inventario de paquetes</span>
          </Button>
        </Link>

        <nav
          aria-label="Cambiar de paquete"
          className="flex flex-wrap items-center gap-1.5 rounded-full border border-border bg-secondary/60 p-1"
        >
          {PACKAGES_DATA.map((item) => {
            const isActive = item.slug === pkg.slug
            return (
              <Link
                key={item.slug}
                href={`/paquetes/${item.slug}`}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors duration-fast",
                  isActive
                    ? "bg-primary text-primary-foreground [box-shadow:var(--shadow-s)]"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.tierName}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Grilla Principal de la Subpágina (Galería + Ficha Técnica vs Buy Box WhatsApp) */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Columna Izquierda: Galería Interactiva y Especificaciones */}
        <div className="space-y-6 lg:col-span-7">
          {/* Visor Principal de Fotografía */}
          <div
            className={cn(
              "rounded-3xl border-2 p-5 sm:p-6",
              gallerySurfaceClass
            )}
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <Badge variant={badgeVariant}>
                {pkg.isFeatured ? (
                  <StarLineIcon className="size-3.5" />
                ) : (
                  <SparklesLineIcon className="size-3.5" />
                )}
                <span>{pkg.tierName}</span>
              </Badge>
              <span className="text-xs font-semibold text-foreground">
                Vista {selectedSlideIndex + 1} de{" "}
                {pkg.galleryPlaceholders.length}
              </span>
            </div>

            <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card p-6 text-center sm:min-h-80">
              <p className="text-base font-extrabold text-foreground">
                {activePhoto.label}
              </p>
              <p className="mt-1 max-w-md text-xs text-muted-foreground">
                {activePhoto.aspectDescription}
              </p>
              <span className="mt-3 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                Ruta para imagen final: {activePhoto.fileHint}
              </span>
            </div>

            {/* Selector de Miniaturas de la Galería */}
            <div
              role="group"
              aria-label="Vistas de la galería del paquete"
              className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4"
            >
              {pkg.galleryPlaceholders.map((slide, idx) => {
                const isSelected = idx === selectedSlideIndex
                return (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setSelectedSlideIndex(idx)}
                    aria-pressed={isSelected}
                    className={cn(
                      "rounded-2xl px-3 py-2.5 text-left text-xs font-semibold transition-colors duration-fast cursor-pointer",
                      isSelected
                        ? "bg-primary text-primary-foreground [box-shadow:var(--shadow-s)]"
                        : "bg-card text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <span className="block font-bold">Vista {idx + 1}</span>
                    <span className="line-clamp-1 block text-xs opacity-90">
                      {slide.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Ficha Técnica de Instalación y Medidas */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>
                Especificaciones técnicas y espacio necesario
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-secondary/70 p-3.5">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                    <RulerLineIcon className="size-4 text-foreground" />
                    <span>Área mínima</span>
                  </span>
                  <strong className="mt-1 block text-base font-extrabold text-foreground">
                    {pkg.specs.minSpace}
                  </strong>
                </div>

                <div className="rounded-2xl bg-secondary/70 p-3.5">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                    <RulerLineIcon className="size-4 text-foreground" />
                    <span>Altura libre</span>
                  </span>
                  <strong className="mt-1 block text-base font-extrabold text-foreground">
                    {pkg.specs.heightClearance}
                  </strong>
                </div>

                <div className="rounded-2xl bg-secondary/70 p-3.5">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                    <User2LineIcon className="size-4 text-foreground" />
                    <span>Edades sugeridas</span>
                  </span>
                  <strong className="mt-1 block text-base font-extrabold text-foreground">
                    {pkg.specs.recommendedAges}
                  </strong>
                </div>

                <div className="rounded-2xl bg-secondary/70 p-3.5">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                    <User2LineIcon className="size-4 text-foreground" />
                    <span>Capacidad turno</span>
                  </span>
                  <strong className="mt-1 block text-base font-extrabold text-foreground">
                    {pkg.specs.simultaneousCapacity}
                  </strong>
                </div>

                <div className="rounded-2xl bg-secondary/70 p-3.5">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                    <ClockLineIcon className="size-4 text-foreground" />
                    <span>Tiempo de uso</span>
                  </span>
                  <strong className="mt-1 block text-base font-extrabold text-foreground">
                    {pkg.specs.durationHours}
                  </strong>
                </div>

                <div className="rounded-2xl bg-secondary/70 p-3.5">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                    <SafeShieldLineIcon className="size-4 text-foreground" />
                    <span>Montaje previo</span>
                  </span>
                  <strong className="mt-1 block text-base font-extrabold text-foreground">
                    {pkg.specs.setupAdvanceTime}
                  </strong>
                </div>
              </div>

              <div className="rounded-2xl bg-pastel-lavender/20 p-4 text-xs leading-relaxed text-foreground">
                <strong className="font-bold">Requerimiento eléctrico:</strong>{" "}
                {pkg.specs.powerRequirement}. Nuestro equipo lleva extensiones
                vulcanizadas seguras y protege las conexiones durante todo el
                evento.
              </div>
            </CardContent>
          </Card>

          {/* Ideal para qué tipo de celebraciones */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>¿Para qué eventos recomendamos este paquete?</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2.5 text-sm text-foreground">
                {pkg.idealFor.map((useCase) => (
                  <li key={useCase} className="flex items-start gap-2.5">
                    <CheckLineIcon className="mt-0.5 size-4 shrink-0 text-foreground" />
                    <span>{useCase}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Columna Derecha: Buy Box de Reserva y Llamada a la Acción a WhatsApp */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 rounded-3xl border-2 border-primary bg-card p-6 [box-shadow:var(--shadow-m)]">
            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">
                {pkg.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Badge variant={badgeVariant}>{pkg.tierName}</Badge>
                {pkg.featuredLabel && (
                  <Badge variant="outline">{pkg.featuredLabel}</Badge>
                )}
              </div>
              <p className="pt-1 text-sm leading-relaxed text-muted-foreground">
                {pkg.fullDescription}
              </p>
            </div>

            {/* Lista de Todo lo que Incluye */}
            <div className="mt-5 rounded-2xl bg-secondary/60 p-4">
              <h2 className="text-sm font-bold text-foreground">
                Todo lo incluido en tu alquiler
              </h2>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed text-foreground">
                {pkg.includedItems.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckLineIcon className="mt-0.5 size-4 shrink-0 text-foreground" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Personalizador Rápido para el Mensaje de WhatsApp */}
            <div className="mt-5 space-y-4">
              <div>
                <span className="block text-xs font-bold text-foreground">
                  1. Selecciona el tipo de celebración
                </span>
                <div
                  role="group"
                  aria-label="Tipo de celebración"
                  className="mt-2 grid grid-cols-2 gap-2"
                >
                  {EVENT_TYPES.map((type) => {
                    const active = selectedEventType === type
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setSelectedEventType(type)}
                        aria-pressed={active}
                        className={cn(
                          "rounded-xl px-3 py-2 text-left text-xs font-semibold transition-colors duration-fast cursor-pointer",
                          active
                            ? "bg-primary text-primary-foreground [box-shadow:var(--shadow-s)]"
                            : "bg-secondary text-secondary-foreground hover:bg-accent"
                        )}
                      >
                        {type}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <span className="block text-xs font-bold text-foreground">
                  2. Selecciona tu distrito en Lima
                </span>
                <div
                  role="group"
                  aria-label="Distrito del evento"
                  className="mt-2 flex flex-wrap gap-1.5"
                >
                  {COVERAGE_DISTRICTS.map((district) => {
                    const active = selectedDistrict === district
                    return (
                      <button
                        key={district}
                        type="button"
                        onClick={() => setSelectedDistrict(district)}
                        aria-pressed={active}
                        className={cn(
                          "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors duration-fast cursor-pointer",
                          active
                            ? "bg-pastel-lavender text-pastel-lavender-foreground [box-shadow:var(--shadow-s)]"
                            : "bg-secondary text-secondary-foreground hover:bg-accent"
                        )}
                      >
                        {district}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Vista Previa del Mensaje a Enviar */}
            <div className="mt-5 rounded-2xl bg-pastel-green/35 p-3.5 text-xs text-pastel-green-foreground">
              <span className="font-bold block">
                Mensaje listo para enviar a nuestro WhatsApp:
              </span>
              <p className="mt-1 leading-relaxed">
                &ldquo;Hola Diamante Azul, vi en su web el {pkg.tierName} (
                {pkg.title}) y me gustaría consultar disponibilidad y cotización
                para un {selectedEventType} en {selectedDistrict}.&rdquo;
              </p>
            </div>

            {/* Botón Principal de Conversión a WhatsApp */}
            <div className="mt-5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full"
              >
                <Button
                  variant={buttonVariant}
                  size="lg"
                  className="w-full font-bold"
                >
                  <WhatsappLineIcon className="size-5" />
                  <span>Cotizar este paquete por WhatsApp</span>
                </Button>
              </a>
            </div>

            {/* Garantía en el punto de decisión */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-muted-foreground">
              <span className="flex items-center gap-1">
                <SafeShieldLineIcon className="size-4 text-foreground" />
                <span>Equipos sanitizados</span>
              </span>
              <span className="flex items-center gap-1">
                <LocationLineIcon className="size-4 text-foreground" />
                <span>Puntualidad garantizada</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Barra Fija Inferior en Móviles para acceso inmediato a WhatsApp */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 p-3 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-md items-center justify-between gap-3">
          <div>
            <span className="block text-xs font-bold text-foreground">
              {pkg.title}
            </span>
            <span className="block text-xs text-muted-foreground">
              {pkg.tierName} · {pkg.specs.minSpace}
            </span>
          </div>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <Button variant={buttonVariant} size="default">
              <WhatsappLineIcon className="size-4" />
              <span>Reservar por WhatsApp</span>
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}

