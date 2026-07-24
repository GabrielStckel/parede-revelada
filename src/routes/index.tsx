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

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Stckel Pinturas — Pintura, texturas e revestimentos em Curitiba/PR" },
      {
        name: "description",
        content:
          "Stckel Pinturas: serviços de pintura, texturas e revestimentos para obras residenciais e comerciais em Curitiba e região metropolitana.",
      },
      { property: "og:title", content: "Stckel Pinturas — Curitiba/PR" },
      {
        property: "og:description",
        content:
          "Pintura, texturas e revestimentos com padrão de acabamento em Curitiba/PR.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
