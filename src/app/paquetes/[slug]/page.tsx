import { Suspense } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PACKAGES_DATA, getPackageBySlug } from "@/data/packages"
import { PackageDetailInteractive } from "@/components/packages/package-detail-interactive"

interface PackagePageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return PACKAGES_DATA.map((pkg) => ({
    slug: pkg.slug,
  }))
}

export async function generateMetadata({
  params,
}: PackagePageProps): Promise<Metadata> {
  "use cache"
  const { slug } = await params
  const pkg = getPackageBySlug(slug)

  if (!pkg) {
    return {
      title: "Paquete no encontrado | Diamante Azul",
    }
  }

  return {
    title: `${pkg.tierName}: ${pkg.title} | Alquiler de Inflables en Lima y Arequipa — Diamante Azul`,
    description: `${pkg.shortDescription} Medida: ${pkg.specs.minSpace}. Alquiler con montaje, desinfección y personal de apoyo en Lima Moderna (San Isidro, Miraflores, Surco, San Borja, Magdalena del Mar, Surquillo, San Luis) y en la ciudad de Arequipa.`,
  }
}

async function PackageDetailContent({ params }: PackagePageProps) {
  "use cache"
  const { slug } = await params
  const pkg = getPackageBySlug(slug)

  if (!pkg) {
    notFound()
  }

  return <PackageDetailInteractive pkg={pkg} />
}

export default function PackageDetailPage({ params }: PackagePageProps) {
  return (
    <main>
      <Suspense fallback={null}>
        <PackageDetailContent params={params} />
      </Suspense>
    </main>
  )
}

