export type Servico = {
  id: string;
  nome: string;
  aplicacao: string;
  paragrafos: [string, string];
  sistemas: string[];
  thumb: string;
};

const U = (id: string) =>
  `https://images.unsplash.com/${id}?w=400&h=280&fit=crop&auto=format&q=70`;

export const servicos: Servico[] = [
  {
    // TODO: substituir por foto real da obra
    id: "pintura-residencial",
    nome: "PINTURA RESIDENCIAL",
    aplicacao: "INTERIORES E ÁREAS COMUNS",
    paragrafos: [
      "Preparo começa por lixamento integral, remoção de partes soltas e tratamento pontual de mofo com solução fungicida. Trincas abertas com espátula, preenchidas com massa acrílica em duas passagens e novo lixamento até nivelamento total.",
      "Sistema com selador acrílico pigmentado e duas demãos de látex premium acetinado, intervalo mínimo de quatro horas entre demãos. Acabamento com durabilidade esperada de seis a oito anos em áreas internas com ventilação adequada.",
    ],
    sistemas: [
      "Massa acrílica + selador acrílico",
      "2 demãos de látex acetinado premium",
      "Fita crepe automotiva no recorte de rodapé e teto",
    ],
    thumb: U("photo-1562259949-e8e7689d7828"),
  },
  {
    // TODO: substituir por foto real da obra
    id: "pintura-predial",
    nome: "PINTURA PREDIAL",
    aplicacao: "CONDOMÍNIOS E FACHADAS EM ALTURA",
    paragrafos: [
      "Lavagem da fachada com hidrojato e solução biocida, remoção de pintura solta com raspagem mecânica e recomposição de reboco em pontos comprometidos. Trincas estruturais tratadas com selante poliuretânico antes de qualquer massa.",
      "Aplicação em balancim ou cadeira suspensa com NR-35, fundo preparador de paredes e duas a três demãos de tinta acrílica premium para fachada com proteção UV. Durabilidade de sete a dez anos dependendo da exposição.",
    ],
    sistemas: [
      "Hidrojato + biocida",
      "Fundo preparador acrílico",
      "3 demãos de acrílica premium fachada com filtro UV",
    ],
    thumb: U("photo-1487958449943-2429e8be8625"),
  },
  {
    // TODO: substituir por foto real da obra
    id: "textura-grafiato",
    nome: "TEXTURA E GRAFIATO",
    aplicacao: "ACABAMENTO RÚSTICO E RISCADO",
    paragrafos: [
      "Superfície regularizada com massa acrílica, selador para uniformizar absorção e proteção de esquadrias com fita e lona. Grafiato aplicado com desempenadeira plástica em movimento contínuo para não marcar emenda entre paços.",
      "Camada única de 2 a 3 mm, riscado feito imediatamente antes da secagem inicial. Sobre a textura curada, duas demãos de tinta acrílica fosca para fachada. Durabilidade de oito a doze anos em fachada externa.",
    ],
    sistemas: [
      "Selador acrílico",
      "Grafiato riscado 2–3 mm",
      "2 demãos de acrílica fosca fachada",
    ],
    thumb: U("photo-1615529162924-f8605388461d"),
  },
  {
    // TODO: substituir por foto real da obra
    id: "textura-projetada",
    nome: "TEXTURA PROJETADA",
    aplicacao: "APLICAÇÃO MECANIZADA, ALTA PRODUTIVIDADE",
    paragrafos: [
      "Indicada para grandes áreas contínuas — fachadas de galpão, muros e blocos residenciais — onde a projeção mecânica reduz tempo de obra em até 60% frente à aplicação manual. Superfície precisa estar íntegra, selada e sem pó.",
      "Textura acrílica projetada com compressor e pistola de caneca, granulometria fina a média conforme especificação, camada única. Secagem ao toque em duas horas, cura total em sete dias, com duas demãos de tinta acrílica fachada.",
    ],
    sistemas: [
      "Selador acrílico",
      "Textura acrílica projetada — granulometria fina/média",
      "2 demãos de acrílica premium fachada",
    ],
    thumb: U("photo-1503387762-592deb58ef4e"),
  },
  {
    // TODO: substituir por foto real da obra
    id: "efeito-cimento-queimado",
    nome: "EFEITO CIMENTO QUEIMADO",
    aplicacao: "REVESTIMENTO CONTEMPORÂNEO",
    paragrafos: [
      "Base regularizada com massa cimentícia para eliminar imperfeições grosseiras, sem exigir contrapiso novo. Primer específico para argamassa mineral em uma demão, secagem de quatro horas antes da aplicação do revestimento.",
      "Duas a três camadas finas de massa cimentícia com desempenadeira de aço inox, deixando marcas de espátula controladas para o efeito mesclado. Selagem final com verniz acrílico fosco para resistência a manchas. Durabilidade de dez anos em uso residencial.",
    ],
    sistemas: [
      "Primer para argamassa mineral",
      "3 camadas de massa cimentícia desempenada",
      "Verniz acrílico fosco selador",
    ],
    thumb: U("photo-1600607687939-ce8a6c25118c"),
  },
  {
    // TODO: substituir por foto real da obra
    id: "pintura-comercial",
    nome: "PINTURA COMERCIAL",
    aplicacao: "LOJAS, SALAS E GALPÕES",
    paragrafos: [
      "Execução programada em turnos noturnos ou fins de semana para não interromper operação. Preparo inclui isolamento de mobiliário e equipamentos, lixamento e tratamento de manchas de infiltração com selador pigmentado anti-mancha.",
      "Sistema com tinta acrílica premium lavável em ambientes de circulação e epóxi bi-componente em áreas técnicas e cozinhas industriais. Duas demãos com intervalo de quatro horas, entrega em até 72 horas para lojas de rua.",
    ],
    sistemas: [
      "Selador anti-mancha",
      "2 demãos de acrílica lavável fosca",
      "Epóxi bi-componente em áreas técnicas",
    ],
    thumb: U("photo-1497366216548-37526070297c"),
  },
];
