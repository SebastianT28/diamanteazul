import type { MetadataRoute } from "next"
import { PACKAGES_DATA } from "@/data/packages"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://diamanteazul.pe"

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/quienes-somos`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faqs`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contactanos`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/politica-de-privacidad`,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terminos-y-condiciones`,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ]

  const packageRoutes: MetadataRoute.Sitemap = PACKAGES_DATA.map((pkg) => ({
    url: `${baseUrl}/paquetes/${pkg.slug}`,
    changeFrequency: "weekly",
    priority: 0.9,
  }))

  return [...staticRoutes, ...packageRoutes]
}
