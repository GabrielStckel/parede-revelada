import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import { lock, unlock } from "@/lib/scroll-lock";

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

  const navStyle: React.CSSProperties = scrolled
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
        <div style={navStyle}>
          <div className="container-stckel flex h-16 items-center justify-between">
            <a href="#main" className="text-[color:var(--color-cal)]">
              <Logo height={22} />
            </a>

            <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
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
                href="#contato"
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

            <button
              ref={burgerRef}
              type="button"
              aria-label="Abrir menu"
              aria-expanded={open}
              aria-controls="stckel-mobile-menu"
              onClick={() => setOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center text-[color:var(--color-cal)] md:hidden"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3 7h18M3 17h18" stroke="currentColor" strokeWidth="2" />
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
          style={{ backgroundColor: "var(--color-breu)" }}
        >
          <div className="container-stckel flex h-16 items-center justify-between">
            <Logo height={22} />
            <button
              type="button"
              aria-label="Fechar menu"
              onClick={() => setOpen(false)}
              className="inline-flex h-11 w-11 items-center justify-center text-[color:var(--color-cal)]"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </div>

          <nav
            className="container-stckel flex flex-col gap-4 pt-8"
            aria-label="Principal"
          >
            {LINKS.map((l, i) => (
              <a
                key={l.id}
                href={l.href}
                onClick={() => setOpen(false)}
                aria-current={active === l.id ? "true" : undefined}
                className="stckel-menu-item text-[color:var(--color-cal)] aria-[current=true]:text-[color:var(--color-laranja)]"
                style={{
                  ['--i' as string]: i,
                  fontFamily: "var(--font-display)",
                  fontSize: "2.5rem",
                  lineHeight: 0.92,
                  textTransform: "uppercase",
                  letterSpacing: "-0.01em",
                }}
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contato"
              onClick={() => setOpen(false)}
              className="stckel-menu-item mt-6 inline-flex h-12 items-center justify-center px-5 text-[13px] uppercase tracking-[0.08em] text-[color:var(--color-breu)]"
              style={{
                ['--i' as string]: LINKS.length,
                backgroundColor: "var(--color-laranja)",
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                alignSelf: "flex-start",
              }}
            >
              Pedir orçamento
            </a>
          </nav>
        </div>
      )}
    </>
  );
}
