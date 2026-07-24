import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { servicos } from "@/data/servicos";

export function Servicos() {
  const [openId, setOpenId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  // Section reveal
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      el.setAttribute("data-revealed", "true");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.setAttribute("data-revealing", "true");
            io.disconnect();
            window.setTimeout(() => {
              el.removeAttribute("data-revealing");
              el.setAttribute("data-revealed", "true");
            }, 750);
            break;
          }
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();

  }, []);

  const onKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    const key = e.key;
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(key)) return;
    const list = listRef.current;
    if (!list) return;
    const triggers = Array.from(
      list.querySelectorAll<HTMLButtonElement>("button[id^='trigger-']"),
    );
    if (triggers.length === 0) return;
    const idx = triggers.indexOf(document.activeElement as HTMLButtonElement);
    e.preventDefault();
    let next = 0;
    if (key === "Home") next = 0;
    else if (key === "End") next = triggers.length - 1;
    else if (key === "ArrowDown") next = idx < 0 ? 0 : (idx + 1) % triggers.length;
    else next = idx <= 0 ? triggers.length - 1 : idx - 1;
    triggers[next]?.focus();
  };

  return (
    <section
      id="servicos"
      aria-labelledby="titulo-servicos"
      className="section-y"
      style={{ backgroundColor: "var(--color-concreto)", position: "relative" }}
    >
      <div ref={sectionRef} className="container-stckel section-reveal">
        <header style={{ marginBottom: "clamp(48px, 6vw, 80px)" }}>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              letterSpacing: "0.16em",
              color: "var(--color-grafite-strong)",
              textTransform: "uppercase",
              margin: 0,
              marginBottom: 16,
            }}
          >
            Pintura, textura grafiato e revestimentos · Curitiba/PR
          </p>
          <h2 id="titulo-servicos" style={{ color: "var(--color-cal)", maxWidth: "18ch", margin: 0 }}>
            O ACABAMENTO COMEÇA ANTES DA TINTA
          </h2>
        </header>

        <ul
          ref={listRef}
          role="list"
          className="stckel-servicos-list"
          onKeyDown={onKeyDown}
          style={{ listStyle: "none", margin: 0, padding: 0 }}
        >
          {servicos.map((s, i) => {
            const open = openId === s.id;
            const painelProps: { inert?: boolean } = open ? {} : { inert: true };
            const numero = String(i + 1).padStart(2, "0");
            return (
              <li
                key={s.id}
                data-servico-id={s.id}
                data-open={open ? "true" : "false"}
                className="linha"
              >
                <h3 className="linha-head">
                  <button
                    type="button"
                    id={`trigger-${s.id}`}
                    aria-expanded={open}
                    aria-controls={`painel-${s.id}`}
                    onClick={() => setOpenId(open ? null : s.id)}
                    className="linha-inner"
                  >
                    <span className="linha-num" aria-hidden="true">{numero}</span>
                    <span className="linha-txt">
                      <span className="nome">{s.nome}</span>
                      <span className="aplicacao">{s.aplicacao}</span>
                    </span>
                    <span className="linha-toggle" aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M6 9l6 6 6-6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>
                </h3>
                <div
                  id={`painel-${s.id}`}
                  role="region"
                  aria-labelledby={`trigger-${s.id}`}
                  className="painel"
                  data-open={open ? "true" : "false"}
                  {...painelProps}
                >
                  <div className="painel-inner">
                    <div className="painel-content">
                      <p>{s.paragrafos[0]}</p>
                      <p>{s.paragrafos[1]}</p>
                      <p className="sistemas">
                        SISTEMAS: {s.sistemas.join(" · ")}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
