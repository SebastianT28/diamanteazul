import type { Metadata, Viewport } from "next"
import { Outfit } from "next/font/google"
import "./globals.css"
// Avance 3 Final: Catálogo 31 productos, SEO Multi-Ciudad (Lima Moderna y Arequipa), Core Web Vitals y Backend Admin MySQL
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { CityProvider } from "@/lib/city-context"

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F7FAFC",
}

export const metadata: Metadata = {
  metadataBase: new URL("https://diamanteazul.pe"),
  title:
    "Diamante Azul | Alquiler de Juegos Inflables en Lima Moderna y Arequipa",
  description:
    "Alquiler de juegos inflables en Lima Moderna (San Isidro, Miraflores, Surco, San Borja, Magdalena del Mar, Surquillo, San Luis y zonas cercanas) y en la ciudad de Arequipa.",
  keywords: [
    "alquiler de juegos inflables en Lima",
    "alquiler de castillos inflables Lima Moderna",
    "inflables para cumpleaños San Isidro",
    "inflables para fiestas Miraflores",
    "alquiler de inflables Surco",
    "alquiler de inflables San Borja",
    "alquiler de inflables Magdalena del Mar",
    "alquiler de inflables Surquillo",
    "alquiler de inflables San Luis",
    "alquiler de juegos inflables en Arequipa",
    "castillos inflables pastel Lima",
  ],
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`${outfit.variable} h-full antialiased`}
    >
      <body id="index" className="flex min-h-full flex-col font-sans">
        <CityProvider>
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </CityProvider>
      </body>
    </html>
  )
}
