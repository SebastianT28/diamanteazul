import type { Metadata } from "next"
import { Outfit } from "next/font/google"
import "./globals.css"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Diamante Azul | Alquiler de Juegos Inflables para Fiestas en Lima",
  description:
    "Alquiler profesional de inflables para cumpleaños infantiles, reuniones familiares, colegios y empresas en Lima Moderna. Seguridad, limpieza y puntualidad.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${outfit.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  )
}
