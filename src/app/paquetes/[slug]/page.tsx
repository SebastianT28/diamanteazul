import { Suspense } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { connection } from "next/server"
import { PACKAGES_DATA } from "@/data/packages"
import { getEffectivePackageBySlug } from "@/lib/admin-db"
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
  await connection()
  const { slug } = await params
  const pkg = await getEffectivePackageBySlug(slug)

  if (!pkg) {
    return {
      title: "Paquete no encontrado | Diamante Azul",
    }
  }

  const title = `${pkg.tierName}: ${pkg.title} | Alquiler de Inflables en Lima y Arequipa — Diamante Azul`
  const description = `${pkg.shortDescription} Medida: ${pkg.specs.minSpace}. Alquiler con montaje, desinfección y personal de apoyo en Lima Moderna (San Isidro, Miraflores, Surco, San Borja, Magdalena del Mar, Surquillo, San Luis) y en la ciudad de Arequipa.`

  return {
    title,
    description,
    alternates: {
      canonical: `/paquetes/${pkg.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/paquetes/${pkg.slug}`,
      type: "website",
      locale: "es_PE",
      images: [
        {
          url: pkg.image,
          alt: pkg.title,
        },
      ],
    },
  }
}

async function PackageDetailContent({ params }: PackagePageProps) {
  await connection()
  const { slug } = await params
  const pkg = await getEffectivePackageBySlug(slug)

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

