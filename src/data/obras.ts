// Todos os dados são placeholders. Substituir por obras reais antes de publicar.
// Regra de layout: itens com span "full" só encaixam no início de uma linha
// do grid de 2 colunas. Como o grid usa grid-auto-flow: dense, buracos
// são preenchidos automaticamente por half seguintes, mas manter fulls
// intercalados com pares half evita saltos visuais grandes.

export type CategoriaObra =
  | "fachadas"
  | "texturas"
  | "cimento-queimado"
  | "interiores";

export const CATEGORIA_LABEL: Record<CategoriaObra, string> = {
  fachadas: "Fachadas",
  texturas: "Texturas",
  "cimento-queimado": "Cimento queimado",
  interiores: "Interiores",
};

export type Obra = {
  id: string;
  titulo: string;
  categoria: CategoriaObra;
  local: string;
  sistema: string;
  area: string;
  prazo: string;
  imagem: string;
  thumb: string;
  alt: string;
  span: "full" | "half";
};

const u = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;

export const OBRAS: Obra[] = [
  // TODO: dados reais
  {
    id: "obra-01",
    titulo: "OBRA EXEMPLO 01",
    categoria: "fachadas",
    local: "— a confirmar",
    sistema: "Fachada em altura — sistema a confirmar",
    area: "— a confirmar",
    prazo: "— a confirmar",
    imagem: u("1600585154340-be6161a56a0c", 1600, 900),
    thumb: u("1600585154340-be6161a56a0c", 1200, 675),
    alt: "Fachada de edifício residencial com revestimento claro",
    span: "full",
  },
  // TODO: dados reais
  {
    id: "obra-02",
    titulo: "OBRA EXEMPLO 02",
    categoria: "interiores",
    local: "— a confirmar",
    sistema: "Pintura acrílica interna — sistema a confirmar",
    area: "— a confirmar",
    prazo: "— a confirmar",
    imagem: u("1618221195710-dd6b41faaea6", 1200, 900),
    thumb: u("1618221195710-dd6b41faaea6", 800, 600),
    alt: "Interior residencial com paredes claras e mobiliário contemporâneo",
    span: "half",
  },
  // TODO: dados reais
  {
    id: "obra-03",
    titulo: "OBRA EXEMPLO 03",
    categoria: "cimento-queimado",
    local: "— a confirmar",
    sistema: "Cimento queimado — sistema a confirmar",
    area: "— a confirmar",
    prazo: "— a confirmar",
    imagem: u("1615873968403-89e068629265", 1200, 900),
    thumb: u("1615873968403-89e068629265", 800, 600),
    alt: "Parede em cimento queimado com textura irregular",
    span: "half",
  },
  // TODO: dados reais
  {
    id: "obra-04",
    titulo: "OBRA EXEMPLO 04",
    categoria: "fachadas",
    local: "— a confirmar",
    sistema: "Fachada comercial — sistema a confirmar",
    area: "— a confirmar",
    prazo: "— a confirmar",
    imagem: u("1503174971373-b1f69850bded", 1600, 900),
    thumb: u("1503174971373-b1f69850bded", 1200, 675),
    alt: "Fachada de prédio comercial em tons neutros",
    span: "full",
  },
  // TODO: dados reais
  {
    id: "obra-05",
    titulo: "OBRA EXEMPLO 05",
    categoria: "interiores",
    local: "— a confirmar",
    sistema: "Pintura interna acetinada — sistema a confirmar",
    area: "— a confirmar",
    prazo: "— a confirmar",
    imagem: u("1616486338812-3dadae4b4ace", 1200, 900),
    thumb: u("1616486338812-3dadae4b4ace", 800, 600),
    alt: "Sala ampla com parede pintada em tom neutro",
    span: "half",
  },
  // TODO: dados reais
  {
    id: "obra-06",
    titulo: "OBRA EXEMPLO 06",
    categoria: "texturas",
    local: "— a confirmar",
    sistema: "Textura projetada — sistema a confirmar",
    area: "— a confirmar",
    prazo: "— a confirmar",
    imagem: u("1600607687939-ce8a6c25118c", 1200, 900),
    thumb: u("1600607687939-ce8a6c25118c", 800, 600),
    alt: "Parede externa com textura rústica riscada",
    span: "half",
  },
  // TODO: dados reais
  {
    id: "obra-07",
    titulo: "OBRA EXEMPLO 07",
    categoria: "cimento-queimado",
    local: "— a confirmar",
    sistema: "Revestimento cimentício — sistema a confirmar",
    area: "— a confirmar",
    prazo: "— a confirmar",
    imagem: u("1560448204-e02f11c3d0e2", 1200, 900),
    thumb: u("1560448204-e02f11c3d0e2", 800, 600),
    alt: "Ambiente com parede em acabamento cimentício contínuo",
    span: "half",
  },
  // TODO: dados reais
  {
    id: "obra-08",
    titulo: "OBRA EXEMPLO 08",
    categoria: "texturas",
    local: "— a confirmar",
    sistema: "Grafiato — sistema a confirmar",
    area: "— a confirmar",
    prazo: "— a confirmar",
    imagem: u("1558618666-fcd25c85cd64", 1200, 900),
    thumb: u("1558618666-fcd25c85cd64", 800, 600),
    alt: "Fachada com acabamento em grafiato",
    span: "half",
  },
];
