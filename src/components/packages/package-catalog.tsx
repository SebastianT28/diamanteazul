"use client"

import * as React from "react"
import Link from "next/link"
import { PACKAGES_DATA, type InflatablePackage } from "@/data/packages"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ArrowRightLineIcon,
  CheckLineIcon,
  ClockLineIcon,
  RulerLineIcon,
  SparklesLineIcon,
  StarLineIcon,
  User2LineIcon,
} from "@/components/icons"
import { cn } from "@/lib/utils"

type FilterCategory = "all" | "casa" | "jardin"

function getAccentClasses(pkg: InflatablePackage) {
  switch (pkg.accent) {
    case "pink":
      return {
        badgeVariant: "pink" as const,
        buttonVariant: "pink" as const,
        surfaceTint: "bg-pastel-pink/20 border-pastel-pink",
        placeholderBorder: "border-pastel-pink bg-card",
      }
    case "lavender":
      return {
        badgeVariant: "lavender" as const,
        buttonVariant: "lavender" as const,
        surfaceTint: "bg-pastel-lavender/20 border-pastel-lavender",
        placeholderBorder: "border-pastel-lavender bg-card",
      }
    default:
      return {
        badgeVariant: "blue" as const,
        buttonVariant: "primary" as const,
        surfaceTint: "bg-pastel-blue/20 border-pastel-blue",
        placeholderBorder: "border-pastel-blue bg-card",
      }
  }
}

export function PackageCatalog() {
  const [activeFilter, setActiveFilter] = React.useState<FilterCategory>("all")

  const filteredPackages = React.useMemo(() => {
    if (activeFilter === "all") return PACKAGES_DATA
    return PACKAGES_DATA.filter((pkg) => pkg.categories.includes(activeFilter))
  }, [activeFilter])

  return (
    <section
      id="paquetes"
      className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16"
    >
      <div className="flex flex-col justify-between gap-6 pb-8 md:flex-row md:items-end">
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-foreground sm:text-3xl">
            Paquetes de inflables para tu evento
          </h2>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            Selecciona una tarjeta para revisar medidas requeridas, fotos y
            consultar disponibilidad directa por WhatsApp.
          </p>
        </div>

        {/* Barra de Filtros Tipo Píldora (con relleno activo en lugar de borde) */}
        <div
          role="group"
          aria-label="Filtrar paquetes por tipo de espacio"
          className="inline-flex flex-wrap items-center gap-1.5 rounded-full border border-border bg-secondary/60 p-1.5"
        >
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            aria-pressed={activeFilter === "all"}
            className={cn(
              "rounded-full px-4 py-2 text-xs font-semibold transition-colors duration-fast cursor-pointer",
              activeFilter === "all"
                ? "bg-primary text-primary-foreground [box-shadow:var(--shadow-s)]"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Todos ({PACKAGES_DATA.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("casa")}
            aria-pressed={activeFilter === "casa"}
            className={cn(
              "rounded-full px-4 py-2 text-xs font-semibold transition-colors duration-fast cursor-pointer",
              activeFilter === "casa"
                ? "bg-primary text-primary-foreground [box-shadow:var(--shadow-s)]"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Casas y Cocheras
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("jardin")}
            aria-pressed={activeFilter === "jardin"}
            className={cn(
              "rounded-full px-4 py-2 text-xs font-semibold transition-colors duration-fast cursor-pointer",
              activeFilter === "jardin"
                ? "bg-primary text-primary-foreground [box-shadow:var(--shadow-s)]"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Jardines, Colegios y Empresas
          </button>
        </div>
      </div>

      {/* Grilla de Tarjetas de Paquetes */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {filteredPackages.map((pkg) => {
          const styles = getAccentClasses(pkg)
          const mainPhoto = pkg.galleryPlaceholders[0]

          return (
            <Card
              key={pkg.slug}
              interactive
              className={cn(
                "flex flex-col justify-between overflow-hidden border-2",
                pkg.isFeatured ? "border-pastel-pink" : "border-border"
              )}
            >
              <div>
                {/* Cabecera Visual / Placeholder para Fotografía del Paquete */}
                <div className={cn("p-4", styles.surfaceTint)}>
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <Badge variant={styles.badgeVariant}>
                      {pkg.isFeatured ? (
                        <StarLineIcon className="size-3.5" />
                      ) : (
                        <SparklesLineIcon className="size-3.5" />
                      )}
                      <span>{pkg.tierName}</span>
                    </Badge>
                    <Badge variant="outline">
                      <User2LineIcon className="size-3.5" />
                      <span>{pkg.specs.recommendedAges}</span>
                    </Badge>
                  </div>

                  <Link
                    href={`/paquetes/${pkg.slug}`}
                    className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <div
                      className={cn(
                        "flex min-h-44 flex-col items-center justify-center rounded-2xl border-2 border-dashed p-4 text-center",
                        styles.placeholderBorder
                      )}
                    >
                      <span className="text-xs font-bold text-foreground">
                        {mainPhoto.label}
                      </span>
                      <span className="mt-1 text-xs text-muted-foreground">
                        {mainPhoto.aspectDescription}
                      </span>
                      <span className="mt-2 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                        Archivo sugerido: {mainPhoto.fileHint}
                      </span>
                    </div>
                  </Link>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-xl font-extrabold">
                    <Link
                      href={`/paquetes/${pkg.slug}`}
                      className="hover:underline focus-visible:outline-none"
                    >
                      {pkg.title}
                    </Link>
                  </CardTitle>
                  <CardDescription>{pkg.shortDescription}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Especificaciones Preliminares */}
                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div className="rounded-2xl bg-secondary/70 p-3">
                      <span className="flex items-center gap-1 font-semibold text-muted-foreground">
                        <RulerLineIcon className="size-3.5 text-foreground" />
                        <span>Espacio mín.</span>
                      </span>
                      <strong className="mt-0.5 block text-sm font-bold text-foreground">
                        {pkg.specs.minSpace}
                      </strong>
                    </div>
                    <div className="rounded-2xl bg-secondary/70 p-3">
                      <span className="flex items-center gap-1 font-semibold text-muted-foreground">
                        <ClockLineIcon className="size-3.5 text-foreground" />
                        <span>Tiempo de uso</span>
                      </span>
                      <strong className="mt-0.5 block text-sm font-bold text-foreground">
                        {pkg.specs.durationHours}
                      </strong>
                    </div>
                  </div>

                  {/* Puntos clave incluidos */}
                  <ul className="space-y-2 text-xs text-foreground">
                    {pkg.preliminaryHighlights.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckLineIcon className="mt-0.5 size-4 shrink-0 text-foreground" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </div>

              <CardFooter className="pt-2">
                <Link href={`/paquetes/${pkg.slug}`} className="w-full">
                  <Button
                    variant={styles.buttonVariant}
                    size="default"
                    className="w-full"
                  >
                    <span>Ver detalles del paquete</span>
                    <ArrowRightLineIcon className="size-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      {/* Pie de lista de catálogo para ayudar a decidir */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-border bg-secondary/50 px-5 py-4 text-xs text-muted-foreground">
        <span>
          Mostrando {filteredPackages.length} de {PACKAGES_DATA.length} paquetes
          disponibles. ¿No estás seguro de qué tamaño entra en tu espacio?
        </span>
        <Link
          href="/paquetes/medio"
          className="font-semibold text-foreground underline underline-offset-4"
        >
          Comparar medidas en la ficha detallada
        </Link>
      </div>
    </section>
  )
}

