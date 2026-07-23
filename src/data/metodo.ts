export type PassoMetodo = {
  indice: string;
  titulo: string;
  descricao: string;
};

export const metodo: PassoMetodo[] = [
  {
    indice: "01",
    titulo: "Visita e medição",
    descricao: "Avaliamos o estado da superfície no local.",
  },
  {
    indice: "02",
    titulo: "Orçamento fechado",
    descricao: "Escopo, material e prazo por escrito. Sem aditivo surpresa.",
  },
  {
    indice: "03",
    titulo: "Preparo",
    descricao:
      "Lixamento, correção, selagem. É a etapa que ninguém vê e que define o resultado.",
  },
  {
    indice: "04",
    titulo: "Aplicação e entrega",
    descricao: "Obra protegida, limpa e liberada no prazo.",
  },
];
