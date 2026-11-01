import Link from "next/link"
import { COVERAGE_DISTRICTS, FAQ_ITEMS, buildWhatsAppUrl } from "@/data/packages"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { PackageCatalog } from "@/components/packages/package-catalog"
import {
  ArrowRightLineIcon,
  CheckLineIcon,
  ClockLineIcon,
  LocationLineIcon,
  SafeShieldLineIcon,
  SparklesLineIcon,
  User2LineIcon,
  WhatsappLineIcon,
} from "@/components/icons"

export default function HomePage() {
  const corporateWaUrl = buildWhatsAppUrl({
    eventType: "Colegio o Evento Corporativo",
    customMessage:
      "Hola Diamante Azul, nos gustaría cotizar el alquiler de inflables para un evento institucional / colegio / empresa en Lima.",
  })

  return (
    <main>
      {/* Hero Section: Titular y acción al lado de la fotografía del producto */}
      <section className="border-b border-border bg-secondary/30">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 py-10 sm:px-6 md:grid-cols-12 md:py-16">
          <div className="space-y-5 md:col-span-7">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Inflables seguros y limpios en Lima Moderna
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
              Traslado, desinfección previa y montaje anticipado con personal
              uniformado para fiestas infantiles.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Badge variant="pink">
                <SparklesLineIcon className="size-3.5" />
                <span>Niños de 2 a 12 años</span>
              </Badge>
              <Badge variant="lavender">
                <LocationLineIcon className="size-3.5" />
                <span>Surco · Miraflores · San Borja · San Isidro</span>
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="#paquetes">
                <Button variant="primary" size="lg">
                  <span>Ver paquetes de inflables</span>
                  <ArrowRightLineIcon className="size-4" />
                </Button>
              </Link>
            </div>

            {/* Indicadores Reales de Servicio (Sin cajas repetitivas artificiales) */}
            <div className="flex flex-wrap items-center gap-6 pt-3 text-xs font-semibold text-foreground">
              <span className="flex items-center gap-1.5">
                <SafeShieldLineIcon className="size-4 text-foreground" />
                <span>Equipos nuevos y desinfectados</span>
              </span>
              <span className="flex items-center gap-1.5">
                <ClockLineIcon className="size-4 text-foreground" />
                <span>Montaje 60 min antes de tu fiesta</span>
              </span>
              <span className="flex items-center gap-1.5">
                <User2LineIcon className="size-4 text-foreground" />
                <span>Personal capacitado y uniformado</span>
              </span>
            </div>
          </div>

          {/* Contenedor Fotográfico del Producto (40% del Hero) */}
          <div className="md:col-span-5">
            <div className="rounded-3xl border-2 border-pastel-blue bg-pastel-blue/15 p-4 [box-shadow:var(--shadow-m)]">
              <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-pastel-blue bg-card p-6 text-center">
                <Badge variant="blue">Espacio reservado para imagen Hero</Badge>
                <p className="mt-3 text-sm font-bold text-foreground">
                  Fotografía o video principal de inflable Diamante Azul en evento
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Proporción recomendada 4:3 horizontal · Ruta sugerida:{" "}
                  <code>/public/images/hero-diamante-azul.webp</code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catálogo Principal de Paquetes (Básico, Medio, Premium) */}
      <PackageCatalog />

      {/* Sección de Confianza Operativa: Seguridad, Limpieza y Puntualidad */}
      <section
        id="experiencia"
        className="border-y border-border bg-secondary/40 py-12 md:py-16"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-2xl font-extrabold text-foreground sm:text-3xl">
              Un servicio formal y puntual pensado para tu tranquilidad
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Cuidamos cada detalle técnico e higiénico antes, durante y después
              del evento para que los padres no tengan que preocuparse por nada.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card className="border-pastel-blue">
              <CardHeader className="pb-3">
                <div className="mb-2 flex size-10 items-center justify-center rounded-2xl bg-pastel-blue text-pastel-blue-foreground">
                  <SafeShieldLineIcon className="size-5" />
                </div>
                <CardTitle>Limpieza antes de cada servicio</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Nuestros inflables se renuevan frecuentemente y pasan por
                  desinfección completa antes de que los niños ingresen a jugar,
                  incluyendo lona base y alfombra de recepción.
                </p>
              </CardContent>
            </Card>

            <Card className="border-pastel-pink">
              <CardHeader className="pb-3">
                <div className="mb-2 flex size-10 items-center justify-center rounded-2xl bg-pastel-pink text-pastel-pink-foreground">
                  <ClockLineIcon className="size-5" />
                </div>
                <CardTitle>Llegada e instalación anticipada</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Llegamos entre 60 y 90 minutos antes del inicio de tu fiesta para
                  instalar y verificar el motor soplador sin descontar un solo
                  minuto de tus horas de alquiler.
                </p>
              </CardContent>
            </Card>

            <Card className="border-pastel-lavender">
              <CardHeader className="pb-3">
                <div className="mb-2 flex size-10 items-center justify-center rounded-2xl bg-pastel-lavender text-pastel-lavender-foreground">
                  <User2LineIcon className="size-5" />
                </div>
                <CardTitle>Personal uniformado y respetuoso</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Nuestro equipo asiste correctamente uniformado y capacitado para
                  realizar un montaje seguro tanto en césped como en pisos firmes
                  de cocheras, terrazas o salones.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sección para Público Secundario: Colegios, Nidos y Eventos Corporativos */}
      <section
        id="corporativo"
        className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16"
      >
        <div className="grid grid-cols-1 items-center gap-8 rounded-3xl border-2 border-pastel-lavender bg-pastel-lavender/15 p-6 sm:p-8 md:grid-cols-12">
          <div className="space-y-4 md:col-span-7">
            <h2 className="text-2xl font-extrabold text-foreground sm:text-3xl">
              Atención para colegios, nidos y eventos corporativos
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Contamos con capacidad logística para atender múltiples servicios en
              un mismo día, kermesses escolares, aniversarios institucionales y
              actividades familiares para colaboradores.
            </p>
            <ul className="grid grid-cols-1 gap-2 text-xs font-medium text-foreground sm:grid-cols-2">
              <li className="flex items-center gap-2">
                <CheckLineIcon className="size-4 shrink-0" />
                <span>Diamante Azul Servicios EIRL (facturación formal)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckLineIcon className="size-4 shrink-0" />
                <span>Personal uniformado de supervisión en turno</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckLineIcon className="size-4 shrink-0" />
                <span>Coordinación con productoras y colegios</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckLineIcon className="size-4 shrink-0" />
                <span>Cobertura en Lima Moderna y distritos cercanos</span>
              </li>
            </ul>
            <div className="pt-2">
              <a
                href={corporateWaUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="lavender" size="default">
                  <WhatsappLineIcon className="size-4" />
                  <span>Cotizar evento institucional por WhatsApp</span>
                </Button>
              </a>
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-border bg-card p-5 md:col-span-5">
            <h3 className="text-sm font-bold text-foreground">
              Distritos de atención prioritaria en Lima
            </h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Programamos entregas puntuales en toda Lima Moderna:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {COVERAGE_DISTRICTS.slice(0, 7).map((district, index) => {
                const variant =
                  index % 3 === 0
                    ? "blue"
                    : index % 3 === 1
                      ? "pink"
                      : "lavender"
                return (
                  <Badge key={district} variant={variant}>
                    {district}
                  </Badge>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Preguntas Frecuentes (FAQ) */}
      <section
        id="preguntas"
        className="mx-auto max-w-4xl px-4 pb-16 pt-4 sm:px-6"
      >
        <div className="space-y-2 pb-6">
          <h2 className="text-2xl font-extrabold text-foreground sm:text-3xl">
            Preguntas frecuentes antes de reservar
          </h2>
          <p className="text-sm text-muted-foreground">
            Resolvemos las dudas más habituales sobre espacio, limpieza e
            instalación eléctrica.
          </p>
        </div>

        <Card>
          <CardContent className="pt-4">
            <Accordion>
              {FAQ_ITEMS.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
