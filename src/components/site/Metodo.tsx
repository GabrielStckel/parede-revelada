import { useEffect, useRef } from "react";
import { metodo } from "@/data/metodo";

export function Metodo() {
  const sectionRef = useRef<HTMLDivElement | null>(null);

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
            const onEnd = (ev: TransitionEvent) => {
              if (ev.propertyName !== "clip-path") return;
              el.removeAttribute("data-revealing");
              el.setAttribute("data-revealed", "true");
              el.removeEventListener("transitionend", onEnd);
            };
            el.addEventListener("transitionend", onEnd);
            break;
          }
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="metodo"
      aria-labelledby="titulo-metodo"
      className="section-y"
      style={{ backgroundColor: "var(--color-massa)" }}
    >
      <div ref={sectionRef} className="container-stckel section-reveal">
        <header style={{ marginBottom: "clamp(48px, 6vw, 80px)" }}>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              letterSpacing: "0.16em",
              color: "var(--color-laranja)",
              textTransform: "uppercase",
              margin: 0,
              marginBottom: 16,
            }}
          >
            COMO TRABALHAMOS
          </p>
          <h2 id="titulo-metodo" style={{ color: "var(--color-cal)", maxWidth: "20ch", margin: 0 }}>
            ORDEM QUE APARECE NO ACABAMENTO
          </h2>
        </header>

        <ol className="metodo-timeline" role="list">
          <span className="metodo-trilha" aria-hidden="true" />
          <span className="metodo-pincel" aria-hidden="true">
            <svg viewBox="0 0 32 32" width="26" height="26" fill="none">
              <rect x="6" y="3" width="14" height="9" rx="1.5" fill="var(--color-grafite-strong)" />
              <rect x="4" y="10" width="18" height="5" rx="1" fill="var(--color-cal)" stroke="var(--color-grafite-strong)" strokeWidth="1" />
              <path d="M7 15 L21 15 L19 28 L9 28 Z" fill="var(--color-laranja)" />
              <path d="M11 28 L11 31 M15 28 L15 31 M17 28 L17 31" stroke="var(--color-laranja)" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </span>
          {metodo.map((p) => (
            <li key={p.indice} className="metodo-passo">
              <span className="metodo-ponto" aria-hidden="true" />
              <span className="metodo-indice">{p.indice}</span>
              <h3 className="metodo-titulo">{p.titulo}</h3>
              <p className="metodo-desc">{p.descricao}</p>
            </li>
          ))}
        </ol>

      </div>
    </section>
  );
}
