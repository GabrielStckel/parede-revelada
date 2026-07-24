import { Logo } from "./Logo";

const LINKS = [
  { href: "#servicos", label: "Serviços" },
  { href: "#obras", label: "Obras" },
  { href: "#a-stckel", label: "A Stckel" },
  { href: "#contato", label: "Contato" },
];

export function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "var(--color-breu)",
        borderTop: "1px solid var(--color-hairline)",
      }}
    >
      <div className="container-stckel py-12 md:py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-5 text-[color:var(--color-cal)]">
            <Logo height={22} />
            <p
              className="mt-3 max-w-sm text-[color:var(--color-grafite)]"
              style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-small)", lineHeight: 1.5 }}
            >
              Pintura, texturas e revestimentos. Curitiba, Paraná.
            </p>
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Instagram da Stckel Pinturas"
              className="mt-4 inline-flex h-10 w-10 items-center justify-center rounded-full border text-[color:var(--color-cal)] transition-colors hover:text-[color:var(--color-laranja)] hover:border-[color:var(--color-laranja)]"
              style={{ borderColor: "var(--color-hairline)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
              </svg>
            </a>
          </div>

          {/* Navegação */}
          <div className="md:col-span-4">
            <span
              className="block text-[11px] uppercase tracking-[0.12em] text-[color:var(--color-grafite)]"
              style={{ fontFamily: "var(--font-mono)", fontWeight: 500 }}
            >
              Navegação
            </span>
            <nav aria-label="Rodapé" className="mt-3 grid grid-cols-2 gap-y-2 gap-x-6">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="text-[13px] uppercase tracking-[0.08em] text-[color:var(--color-cal)] transition-colors hover:text-[color:var(--color-laranja)]"
                  style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}
                >
                  {l.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Empresa */}
          <div className="md:col-span-3">
            <span
              className="block text-[11px] uppercase tracking-[0.12em] text-[color:var(--color-grafite)]"
              style={{ fontFamily: "var(--font-mono)", fontWeight: 500 }}
            >
              Empresa
            </span>
            <p
              className="mt-3 text-[color:var(--color-cal)]"
              style={{ fontFamily: "var(--font-mono)", fontWeight: 500, fontSize: "var(--text-small)" }}
            >
              CNPJ 60.119.236/0001-73
            </p>
            <p
              className="mt-1 text-[color:var(--color-grafite)]"
              style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-small)" }}
            >
              Curitiba/PR
            </p>
          </div>
        </div>

        <div
          className="mt-10 flex flex-col items-start justify-between gap-2 border-t pt-5 md:flex-row md:items-center"
          style={{ borderColor: "var(--color-hairline)" }}
        >
          <p
            className="text-[color:var(--color-grafite)]"
            style={{ fontFamily: "var(--font-mono)", fontWeight: 500, fontSize: "var(--text-caption)" }}
          >
            © 2026 Stckel Pinturas · Todos os direitos reservados
          </p>
          <p
            className="text-[color:var(--color-grafite)]"
            style={{ fontFamily: "var(--font-mono)", fontWeight: 500, fontSize: "var(--text-caption)" }}
          >
            Curitiba · Paraná · Brasil
          </p>
        </div>
      </div>
    </footer>
  );
}
