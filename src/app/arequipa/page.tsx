import type { Metadata } from "next";
import { HomeInteractive } from "@/components/home/home-interactive";

export const metadata: Metadata = {
  title:
    "Diamante Azul — Alquiler de Juegos Inflables para Fiestas y Eventos en Arequipa",
  description:
    "Alquiler de juegos inflables pastel y a color, seguros y 100% sanitizados para cumpleaños infantiles y eventos en la ciudad de Arequipa, Arequipa. Montaje y personal de apoyo incluidos.",
  keywords: [
    "alquiler de juegos inflables en Arequipa",
    "alquiler de castillos inflables Arequipa",
    "inflables para cumpleaños en Arequipa",
    "juegos inflables para fiestas infantiles Arequipa",
    "alquiler de toboganes inflables Arequipa",
    "bubble house Arequipa",
    "plataforma 360 Arequipa",
  ],
  alternates: {
    canonical: "/arequipa",
  },
  openGraph: {
    title:
      "Diamante Azul — Alquiler de Juegos Inflables para Fiestas y Eventos en Arequipa",
    description:
      "Juegos inflables hermosos y seguros para cumpleaños y eventos inolvidables en la ciudad de Arequipa.",
    type: "website",
    locale: "es_PE",
  },
};

const AREQUIPA_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Diamante Azul — Arequipa",
  description:
    "Alquiler de juegos inflables en tonos pastel y a color, seguros y 100% desinfectados para fiestas infantiles y eventos familiares en la ciudad de Arequipa, Arequipa.",
  url: "https://diamanteazul.pe/arequipa",
  telephone: "+51948311603",
  email: "Diamanteazulaqp@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Arequipa",
    addressRegion: "Arequipa",
    addressCountry: "PE",
  },
  areaServed: {
    "@type": "City",
    name: "Arequipa",
  },
  priceRange: "S/ 45 - S/ 1,400",
};

export default async function ArequipaHomePage() {
  "use cache";
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(AREQUIPA_JSON_LD) }}
      />
      <HomeInteractive initialCity="arequipa" />
    </>
  );
}
