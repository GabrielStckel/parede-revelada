import { useMemo, useState } from "react";
import { toast } from "sonner";
import { servicos } from "@/data/servicos";
import { buildWhatsAppLink } from "@/lib/whatsapp";

type Campo = "nome" | "telefone" | "servico" | "mensagem";
type Errors = Partial<Record<Campo, string>>;

const CANAIS: Array<{ rotulo: string; valor: string; href?: string }> = [
  { rotulo: "WhatsApp", valor: "(41) 99815-5076", href: buildWhatsAppLink() },
  { rotulo: "E-mail", valor: "contato@stckelpinturas.com.br", href: "mailto:contato@stckelpinturas.com.br" },
  { rotulo: "Instagram", valor: "@stckelpinturas", href: "https://instagram.com/stckelpinturas" },
  { rotulo: "Atendimento", valor: "Curitiba e Região Metropolitana" },
  { rotulo: "Horário", valor: "Seg a Sex, 8h às 18h" },
];

function validar(campo: Campo, valor: string): string | undefined {
  const v = valor.trim();
  switch (campo) {
    case "nome":
      if (!v) return "Informe seu nome completo.";
      if (v.length < 2) return "Nome muito curto — informe seu nome completo.";
      if (v.length > 100) return "Nome longo demais — use até 100 caracteres.";
      return;
    case "telefone": {
      if (!v) return "Informe um telefone com DDD.";
      const digitos = v.replace(/\D/g, "");
      if (digitos.length < 10 || digitos.length > 11) return "Informe um telefone com DDD (10 ou 11 dígitos).";
      return;
    }
    case "servico":
      if (!v) return "Selecione o tipo de serviço.";
      return;
    case "mensagem":
      if (!v) return "Descreva brevemente o serviço desejado.";
      if (v.length > 1000) return "Mensagem longa demais — use até 1000 caracteres.";
      return;
  }
}

export function Contato() {
  const [valores, setValores] = useState<Record<Campo, string>>({
    nome: "",
    telefone: "",
    servico: "",
    mensagem: "",
  });
  const [erros, setErros] = useState<Errors>({});

  const servicoOptions = useMemo(
    () => servicos.map((s) => ({ id: s.id, nome: s.nome })),
    [],
  );

  const setCampo = (c: Campo, v: string) => {
    setValores((prev) => ({ ...prev, [c]: v }));
    if (erros[c]) setErros((prev) => ({ ...prev, [c]: undefined }));
  };

  const onBlur = (c: Campo) => {
    const msg = validar(c, valores[c]);
    setErros((prev) => ({ ...prev, [c]: msg }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const novos: Errors = {};
    (Object.keys(valores) as Campo[]).forEach((c) => {
      const msg = validar(c, valores[c]);
      if (msg) novos[c] = msg;
    });
    setErros(novos);
    if (Object.keys(novos).length > 0) {
      const primeiro = (Object.keys(novos) as Campo[])[0];
      document.getElementById(`campo-${primeiro}`)?.focus();
      return;
    }
    const nomeServico = servicoOptions.find((s) => s.id === valores.servico)?.nome ?? valores.servico;
    const link = buildWhatsAppLink({
      nome: valores.nome.trim(),
      telefone: valores.telefone.trim(),
      servico: nomeServico,
      mensagem: valores.mensagem.trim(),
    });
    window.open(link, "_blank", "noopener,noreferrer");
    toast.success("Enviado");
    setValores({ nome: "", telefone: "", servico: "", mensagem: "" });
  };

  const inputStyle: React.CSSProperties = {
    fontFamily: "var(--font-sans)",
    fontSize: "15px",
    backgroundColor: "transparent",
    border: "1px solid var(--color-hairline)",
    color: "var(--color-cal)",
    padding: "12px 14px",
    width: "100%",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: "11px",
    fontWeight: 500,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "var(--color-grafite-strong)",
  };

  return (
    <section
      id="contato"
      aria-labelledby="titulo-contato"
      className="section-y"
      style={{ backgroundColor: "var(--color-concreto)" }}
    >
      <div className="container-stckel">
        <header className="mb-14">
          <span style={labelStyle}>Contato</span>
          <h2
            id="titulo-contato"
            className="mt-3 text-[color:var(--color-cal)]"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-h2)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
              maxWidth: "20ch",
            }}
          >
            Vamos falar da sua obra
          </h2>
        </header>

        <div className="grid grid-cols-1 gap-16 md:grid-cols-12 md:gap-12">
          {/* Canais */}
          <ul className="md:col-span-5 flex flex-col gap-8">
            {CANAIS.map((c) => (
              <li key={c.rotulo} className="flex flex-col gap-2">
                <span style={labelStyle}>{c.rotulo}</span>
                {c.href ? (
                  <a
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel={c.href.startsWith("http") ? "noreferrer noopener" : undefined}
                    className="text-[color:var(--color-cal)] transition-colors hover:text-[color:var(--color-laranja)]"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(1.25rem, 0.9rem + 1.2vw, 1.75rem)",
                      lineHeight: 1.1,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {c.valor}
                  </a>
                ) : (
                  <span
                    className="text-[color:var(--color-cal)]"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(1.25rem, 0.9rem + 1.2vw, 1.75rem)",
                      lineHeight: 1.1,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {c.valor}
                  </span>
                )}
              </li>
            ))}
          </ul>

          {/* Formulário */}
          <form onSubmit={onSubmit} noValidate className="md:col-span-7 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="campo-nome" style={labelStyle}>Nome</label>
              <input
                id="campo-nome"
                name="nome"
                type="text"
                autoComplete="name"
                maxLength={100}
                value={valores.nome}
                onChange={(e) => setCampo("nome", e.target.value)}
                onBlur={() => onBlur("nome")}
                aria-invalid={erros.nome ? "true" : undefined}
                aria-describedby={erros.nome ? "erro-nome" : undefined}
                style={inputStyle}
              />
              {erros.nome && (
                <span id="erro-nome" style={{ ...labelStyle, color: "var(--color-laranja)" }}>
                  {erros.nome}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="campo-telefone" style={labelStyle}>Telefone</label>
              <input
                id="campo-telefone"
                name="telefone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                maxLength={20}
                placeholder="(41) 99999-9999"
                value={valores.telefone}
                onChange={(e) => setCampo("telefone", e.target.value)}
                onBlur={() => onBlur("telefone")}
                aria-invalid={erros.telefone ? "true" : undefined}
                aria-describedby={erros.telefone ? "erro-telefone" : undefined}
                style={inputStyle}
              />
              {erros.telefone && (
                <span id="erro-telefone" style={{ ...labelStyle, color: "var(--color-laranja)" }}>
                  {erros.telefone}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="campo-servico" style={labelStyle}>Tipo de serviço</label>
              <select
                id="campo-servico"
                name="servico"
                value={valores.servico}
                onChange={(e) => setCampo("servico", e.target.value)}
                onBlur={() => onBlur("servico")}
                aria-invalid={erros.servico ? "true" : undefined}
                aria-describedby={erros.servico ? "erro-servico" : undefined}
                style={inputStyle}
              >
                <option value="" style={{ backgroundColor: "var(--color-breu)" }}>
                  Selecione…
                </option>
                {servicoOptions.map((s) => (
                  <option key={s.id} value={s.id} style={{ backgroundColor: "var(--color-breu)" }}>
                    {s.nome}
                  </option>
                ))}
              </select>
              {erros.servico && (
                <span id="erro-servico" style={{ ...labelStyle, color: "var(--color-laranja)" }}>
                  {erros.servico}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="campo-mensagem" style={labelStyle}>Mensagem</label>
              <textarea
                id="campo-mensagem"
                name="mensagem"
                rows={5}
                maxLength={1000}
                value={valores.mensagem}
                onChange={(e) => setCampo("mensagem", e.target.value)}
                onBlur={() => onBlur("mensagem")}
                aria-invalid={erros.mensagem ? "true" : undefined}
                aria-describedby={erros.mensagem ? "erro-mensagem" : undefined}
                style={{ ...inputStyle, resize: "vertical", minHeight: "140px" }}
              />
              {erros.mensagem && (
                <span id="erro-mensagem" style={{ ...labelStyle, color: "var(--color-laranja)" }}>
                  {erros.mensagem}
                </span>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="inline-flex items-center justify-center px-6 transition-colors"
                style={{
                  height: "48px",
                  backgroundColor: "var(--color-laranja)",
                  color: "var(--color-breu)",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 600,
                  fontSize: "13px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-brasa)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--color-laranja)")}
              >
                Enviar pedido
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export function WhatsAppFab() {
  return (
    <a
      href={buildWhatsAppLink()}
      target="_blank"
      rel="noreferrer noopener"
      aria-label="Falar com a Stckel no WhatsApp"
      className="stckel-fab fixed z-30 inline-flex items-center justify-center transition-colors"
      style={{
        right: "clamp(16px, 3vw, 28px)",
        width: "56px",
        height: "56px",
        backgroundColor: "var(--color-laranja)",
        color: "var(--color-breu)",
        borderRadius: "9999px",
        boxShadow:
          "0 10px 30px color-mix(in oklab, var(--color-breu) 45%, transparent)",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-brasa)")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--color-laranja)")}
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.52 3.48A11.87 11.87 0 0 0 12.06 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.15 1.6 5.95L0 24l6.31-1.66a11.9 11.9 0 0 0 5.75 1.47h.01c6.56 0 11.9-5.34 11.9-11.9a11.84 11.84 0 0 0-3.45-8.43ZM12.07 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.38a9.87 9.87 0 0 1-1.52-5.26c0-5.46 4.44-9.9 9.9-9.9 2.65 0 5.13 1.03 7 2.9a9.85 9.85 0 0 1 2.9 7c0 5.46-4.44 9.9-9.9 9.9Zm5.43-7.42c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
      </svg>
    </a>
  );
}
