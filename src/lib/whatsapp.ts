// Número de contato oficial da Stckel Pinturas
export const WHATSAPP_NUMBER = "5541998155076";

export type WhatsAppPayload = {
  nome?: string;
  telefone?: string;
  servico?: string;
  mensagem?: string;
};

export function buildWhatsAppLink(payload?: WhatsAppPayload): string {
  const linhas: string[] = [];
  if (payload?.nome) linhas.push(`Nome: ${payload.nome}`);
  if (payload?.telefone) linhas.push(`Telefone: ${payload.telefone}`);
  if (payload?.servico) linhas.push(`Serviço: ${payload.servico}`);
  if (payload?.mensagem) {
    linhas.push("");
    linhas.push(payload.mensagem);
  }
  const texto =
    linhas.length > 0
      ? `Olá, Stckel. Gostaria de um orçamento.\n\n${linhas.join("\n")}`
      : "Olá, Stckel. Gostaria de um orçamento.";
  const encoded = encodeURIComponent(texto);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}
