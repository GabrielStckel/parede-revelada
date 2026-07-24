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
      <div className="container-stckel section-y">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="text-[color:var(--color-cal)]">
            <Logo height={24} />
            <p
              className="mt-4 max-w-xs text-[color:var(--color-grafite)]"
              style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-small)", lineHeight: 1.5 }}
            >
              Pintura, texturas e revestimentos. Curitiba, Paraná.
            </p>
          </div>

          <nav aria-label="Rodapé" className="flex flex-col gap-3">
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

          <div className="flex flex-col gap-3">
            <span
              className="text-[11px] uppercase tracking-[0.12em] text-[color:var(--color-grafite)]"
              style={{ fontFamily: "var(--font-mono)", fontWeight: 500 }}
            >
              Social
            </span>
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Instagram da Stckel Pinturas"
              className="inline-flex h-11 w-11 items-center justify-center text-[color:var(--color-cal)] transition-colors hover:text-[color:var(--color-laranja)]"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
              </svg>
            </a>
          </div>

          <div className="flex flex-col gap-3">
            <span
              className="text-[11px] uppercase tracking-[0.12em] text-[color:var(--color-grafite)]"
              style={{ fontFamily: "var(--font-mono)", fontWeight: 500 }}
            >
              Empresa
            </span>
            <p
              className="text-[color:var(--color-grafite)]"
              style={{ fontFamily: "var(--font-mono)", fontWeight: 500, fontSize: "var(--text-small)" }}
            >
              CNPJ 60.119.236/0001-73
            </p>
          </div>
        </div>

        <div
          className="mt-16 flex flex-col items-start justify-between gap-4 border-t pt-6 md:flex-row md:items-center"
          style={{ borderColor: "var(--color-hairline)" }}
        >
          <p
            className="text-[color:var(--color-grafite)]"
            style={{ fontFamily: "var(--font-mono)", fontWeight: 500, fontSize: "var(--text-caption)" }}
          >
            © 2026 Stckel Pinturas · Curitiba/PR
          </p>
        </div>
      </div>
    </footer>
  );
}
