import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { HeroCompare } from "@/components/site/HeroCompare";
import { Servicos } from "@/components/site/Servicos";
import { Metodo } from "@/components/site/Metodo";
import { Obras } from "@/components/site/Obras";
import { SobreStckel } from "@/components/site/SobreStckel";
import { Contato, WhatsAppFab } from "@/components/site/Contato";
import { Toaster } from "@/components/ui/sonner";
import heroDepois1600 from "@/assets/hero-depois-1600.webp";
import heroDepois800 from "@/assets/hero-depois-800.webp";

const SITE_URL = "https://stckelpinturas.com.br";
const OG_IMAGE = `${SITE_URL}${heroDepois1600}`;

const TITLE =
  "Stckel Pinturas em Curitiba — Fachada, textura grafiato e revestimentos";
const DESCRIPTION =
  "Pintor em Curitiba desde 2000. Pintura de fachada, textura grafiato e revestimentos com preparo de superfície feito do jeito certo.";

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "HousePainter",
  name: "Stckel Pinturas",
  url: SITE_URL,
  image: OG_IMAGE,
  telephone: "+55-41-99815-5076",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Curitiba",
    addressRegion: "PR",
    addressCountry: "BR",
  },
  areaServed: ["Curitiba", "Região Metropolitana de Curitiba"],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "18:00",
    },
  ],
  sameAs: ["https://instagram.com/stckelpinturas"],
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:image", content: OG_IMAGE },
      {
        property: "og:image:alt",
        content: "Fachada em Curitiba pintada pela Stckel Pinturas",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [
      { rel: "canonical", href: `${SITE_URL}/` },
      {
        rel: "preload",
        as: "image",
        href: heroDepoisUrl,
        fetchpriority: "high",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(JSON_LD),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Nav />
      <main id="main">
        <HeroCompare />
        <Servicos />
        <Metodo />
        <Obras />
        <SobreStckel />
        <Contato />
      </main>
      <Footer />
      <WhatsAppFab />
      <Toaster />
    </>
  );
}
