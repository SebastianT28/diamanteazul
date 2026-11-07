import type { Metadata } from "next";
import { HomeInteractive } from "@/components/home/home-interactive";

export const metadata: Metadata = {
  title: "Diamante Azul — Alquiler de Juegos Inflables para Fiestas y Eventos en Lima",
  description:
    "Alquiler de juegos inflables pastel, seguros y 100% sanitizados para cumpleaños infantiles y eventos en Lima, Perú. Transporte e instalación incluidos.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Diamante Azul — Alquiler de Juegos Inflables para Fiestas y Eventos en Lima",
    description:
      "Juegos inflables hermosos y seguros en tonos pastel para cumpleaños y eventos inolvidables en Lima Metropolitana.",
    type: "website",
    locale: "es_PE",
  },
};

const HOME_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Diamante Azul",
  description:
    "Alquiler de juegos inflables en tonos pastel, seguros y 100% desinfectados para fiestas infantiles y eventos familiares en Lima, Perú.",
  url: "https://diamanteazul.pe",
  telephone: "+51999999999",
  email: "hola@diamanteazul.pe",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lima",
    addressRegion: "Lima",
    addressCountry: "PE",
  },
  areaServed: "Lima Metropolitana y Callao",
  priceRange: "S/ 250 - S/ 550",
};

export default async function HomePage() {
  "use cache";
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(HOME_JSON_LD) }}
      />
      <HomeInteractive />
    </>
  );
}
