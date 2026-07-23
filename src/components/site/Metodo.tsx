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
              color: "var(--color-grafite)",
              textTransform: "uppercase",
              margin: 0,
              marginBottom: 16,
            }}
          >
            COMO TRABALHAMOS
          </p>
          <h2 style={{ color: "var(--color-cal)", maxWidth: "20ch", margin: 0 }}>
            ORDEM QUE APARECE NO ACABAMENTO
          </h2>
        </header>

        <ol className="metodo-timeline" role="list">
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
