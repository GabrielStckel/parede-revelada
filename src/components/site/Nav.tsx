import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import { lock, unlock } from "@/lib/scroll-lock";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const LINKS = [
  { href: "#servicos", label: "Serviços", id: "servicos" },
  { href: "#obras", label: "Obras", id: "obras" },
  { href: "#sobre", label: "A Stckel", id: "sobre" },
  { href: "#contato", label: "Contato", id: "contato" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const burgerRef = useRef<HTMLButtonElement | null>(null);

  // Scroll state — passive + rAF
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 80);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll spy
  useEffect(() => {
    const targets = LINKS
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  // Mobile menu: body lock + focus trap + esc
  useEffect(() => {
    if (!open) return;
    lock();

    const container = menuRef.current;
    const focusables = container
      ? Array.from(
          container.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled])',
          ),
        )
      : [];
    focusables[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      unlock();
      document.removeEventListener("keydown", onKey);
      burgerRef.current?.focus();
    };
  }, [open]);

  const desktopNavStyle: React.CSSProperties = scrolled
    ? {
        backgroundColor: "color-mix(in oklab, var(--color-breu) 92%, transparent)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--color-hairline)",
      }
    : { backgroundColor: "transparent", borderBottom: "1px solid transparent" };

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-40"
        style={{ transition: "background-color 250ms ease, backdrop-filter 250ms ease, border-color 250ms ease" }}
      >
        {/* Desktop bar */}
        <div className="hidden md:block" style={desktopNavStyle}>
          <div className="container-stckel flex h-16 items-center justify-between">
            <a href="#main" className="text-[color:var(--color-cal)]">
              <Logo height={22} />
            </a>

            <nav className="flex items-center gap-8" aria-label="Principal">
              {LINKS.map((l) => (
                <a
                  key={l.id}
                  href={l.href}
                  aria-current={active === l.id ? "true" : undefined}
                  className="text-[13px] uppercase tracking-[0.08em] text-[color:var(--color-cal)] transition-colors hover:text-[color:var(--color-laranja)] aria-[current=true]:text-[color:var(--color-laranja)]"
                  style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}
                >
                  {l.label}
                </a>
              ))}
              <a
                href={buildWhatsAppLink()}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex h-11 items-center justify-center px-5 text-[13px] uppercase tracking-[0.08em] text-[color:var(--color-breu)] transition-colors"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 600,
                  backgroundColor: "var(--color-laranja)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-brasa)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--color-laranja)")}
              >
                Pedir orçamento
              </a>
            </nav>
          </div>
        </div>

        {/* Mobile bar */}
        <div className="nav-mobile-bar md:hidden">
          <div className="container-stckel flex items-center gap-2" style={{ height: 56 }}>
            <a
              href="#main"
              className="text-[color:var(--color-cal)] mr-auto inline-flex items-center"
              aria-label="Ir para o topo"
            >
              <Logo height={20} />
            </a>

            <a
              href={buildWhatsAppLink()}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex h-9 items-center justify-center px-3 text-[11px] uppercase text-[color:var(--color-breu)]"
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                letterSpacing: "0.08em",
                backgroundColor: "var(--color-laranja)",
              }}
            >
              Orçamento
            </a>

            <button
              ref={burgerRef}
              type="button"
              aria-label="Abrir menu"
              aria-expanded={open}
              aria-controls="stckel-mobile-menu"
              onClick={() => setOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center text-[color:var(--color-cal)] -mr-2"
            >
              <svg width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden="true">
                <path d="M0 1h20M0 13h20" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile fullscreen menu */}
      {open && (
        <div
          id="stckel-mobile-menu"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu principal"
          className="fixed inset-0 z-50 md:hidden"
          style={{
            backgroundColor: "var(--color-breu)",
            paddingTop: "env(safe-area-inset-top)",
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
        >
          <div className="flex h-[100dvh] flex-col">
            {/* Menu header */}
            <div
              className="container-stckel flex items-center justify-between"
              style={{
                height: 56,
                borderBottom: "1px solid var(--color-hairline)",
              }}
            >
              <Logo height={20} />
              <button
                type="button"
                aria-label="Fechar menu"
                onClick={() => setOpen(false)}
                className="inline-flex h-11 w-11 items-center justify-center text-[color:var(--color-cal)] -mr-2"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.75" />
                </svg>
              </button>
            </div>

            {/* Nav list */}
            <nav
              className="container-stckel flex flex-1 flex-col pt-8"
              aria-label="Principal"
            >
              <span
                className="stckel-menu-item"
                style={{
                  ['--i' as string]: 0,
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--color-grafite-strong)",
                  marginBottom: 20,
                }}
              >
                Navegar
              </span>
              <ul className="flex flex-col" style={{ gap: 4, listStyle: "none", padding: 0, margin: 0 }}>
                {LINKS.map((l, i) => (
                  <li key={l.id}>
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      aria-current={active === l.id ? "true" : undefined}
                      className="stckel-menu-item group flex items-center justify-between text-[color:var(--color-cal)] aria-[current=true]:text-[color:var(--color-laranja)]"
                      style={{
                        ['--i' as string]: i + 1,
                        fontFamily: "var(--font-display)",
                        fontSize: "2rem",
                        lineHeight: 1,
                        paddingBlock: 10,
                        textTransform: "uppercase",
                        letterSpacing: "-0.01em",
                        fontWeight: 600,
                      }}
                    >
                      <span>{l.label}</span>
                      <span
                        aria-hidden="true"
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 16,
                          color: active === l.id ? "var(--color-laranja)" : "var(--color-grafite-strong)",
                        }}
                      >
                        →
                      </span>
                    </a>
                  </li>
                ))}
              </ul>

              {/* Footer contact block */}
              <div
                className="mt-auto"
                style={{
                  borderTop: "1px solid var(--color-hairline)",
                  paddingTop: 24,
                  paddingBottom: 24,
                }}
              >
                <span
                  className="stckel-menu-item block"
                  style={{
                    ['--i' as string]: LINKS.length + 1,
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "var(--color-grafite-strong)",
                    marginBottom: 12,
                  }}
                >
                  Fale com a Stckel
                </span>
                <a
                  href={buildWhatsAppLink()}
                  target="_blank"
                  rel="noreferrer noopener"
                  onClick={() => setOpen(false)}
                  className="stckel-menu-item flex h-12 w-full items-center justify-center text-[13px] uppercase text-[color:var(--color-breu)]"
                  style={{
                    ['--i' as string]: LINKS.length + 2,
                    backgroundColor: "var(--color-laranja)",
                    fontFamily: "var(--font-sans)",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                  }}
                >
                  Pedir orçamento
                </a>
                <div
                  className="stckel-menu-item"
                  style={{
                    ['--i' as string]: LINKS.length + 3,
                    marginTop: 16,
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--color-grafite-strong)",
                  }}
                >
                  <span>WhatsApp · (41) 99815-5076</span>
                  <span>Curitiba / PR · Seg–Sex 08–18</span>
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
