import type { Metadata } from "next";
import { HomeInteractive } from "@/components/home/home-interactive";

export const metadata: Metadata = {
  title:
    "Diamante Azul — Alquiler de Juegos Inflables para Fiestas y Eventos en Lima Moderna",
  description:
    "Alquiler de juegos inflables pastel y a color, seguros y 100% sanitizados para cumpleaños y eventos en Lima Moderna: San Isidro, Miraflores, Surco, San Borja, Magdalena del Mar, Surquillo, San Luis y zonas cercanas.",
  keywords: [
    "alquiler de juegos inflables en Lima",
    "castillos inflables Lima Moderna",
    "alquiler de inflables San Isidro",
    "alquiler de inflables Miraflores",
    "alquiler de inflables Santiago de Surco",
    "alquiler de inflables San Borja",
    "alquiler de inflables Magdalena del Mar",
    "alquiler de inflables Surquillo",
    "alquiler de inflables San Luis",
    "inflables pastel para cumpleaños Lima",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title:
      "Diamante Azul — Alquiler de Juegos Inflables para Fiestas y Eventos en Lima",
    description:
      "Juegos inflables hermosos y seguros para cumpleaños y eventos en Lima Moderna (San Isidro, Miraflores, Surco, San Borja, Magdalena del Mar, Surquillo, San Luis y zonas cercanas).",
    type: "website",
    locale: "es_PE",
  },
};

const HOME_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Diamante Azul — Lima",
  description:
    "Alquiler de juegos inflables en tonos pastel y a color, seguros y 100% desinfectados para fiestas infantiles y eventos en Lima Moderna (San Isidro, Miraflores, Santiago de Surco, San Borja, Magdalena del Mar, Surquillo, San Luis y zonas cercanas).",
  url: "https://diamanteazul.pe",
  telephone: "+51948311603",
  email: "hola@diamanteazul.pe",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lima",
    addressRegion: "Lima",
    addressCountry: "PE",
  },
  areaServed: [
    { "@type": "City", name: "Lima" },
    { "@type": "AdministrativeArea", name: "San Isidro, Lima" },
    { "@type": "AdministrativeArea", name: "Miraflores, Lima" },
    { "@type": "AdministrativeArea", name: "Santiago de Surco, Lima" },
    { "@type": "AdministrativeArea", name: "San Borja, Lima" },
    { "@type": "AdministrativeArea", name: "Magdalena del Mar, Lima" },
    { "@type": "AdministrativeArea", name: "Surquillo, Lima" },
    { "@type": "AdministrativeArea", name: "San Luis, Lima" },
  ],
  priceRange: "S/ 45 - S/ 1,400",
};

export default async function HomePage() {
  "use cache";
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(HOME_JSON_LD) }}
      />
      <HomeInteractive initialCity="lima" />
    </>
  );
}
