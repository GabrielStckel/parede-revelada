import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { servicos } from "@/data/servicos";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThumbFollower, type ThumbFollowerHandle } from "./ThumbFollower";

export function Servicos() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const thumbRef = useRef<ThumbFollowerHandle | null>(null);
  const isMobile = useIsMobile();
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
  }, []);

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

  const onPointerMove = (e: PointerEvent<HTMLUListElement>) => {
    if (!mountedRef.current || isMobile) return;
    if (e.pointerType !== "mouse") return;
    const target = e.target as HTMLElement | null;
    const li = target?.closest("[data-servico-id]") as HTMLElement | null;
    if (!li) {
      thumbRef.current?.hide();
      if (hoverId !== null) setHoverId(null);
      return;
    }
    const id = li.getAttribute("data-servico-id");
    if (!id) return;
    if (openId === id) {
      thumbRef.current?.hide();
      if (hoverId !== null) setHoverId(null);
      return;
    }
    thumbRef.current?.setTarget(e.clientX, e.clientY);
    if (hoverId !== id) setHoverId(id);
  };

  const onPointerLeave = () => {
    thumbRef.current?.hide();
    if (hoverId !== null) setHoverId(null);
  };

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
              color: "var(--color-grafite)",
              textTransform: "uppercase",
              margin: 0,
              marginBottom: 16,
            }}
          >
            SISTEMAS APLICADOS
          </p>
          <h2 style={{ color: "var(--color-cal)", maxWidth: "18ch", margin: 0 }}>
            O ACABAMENTO COMEÇA ANTES DA TINTA
          </h2>
        </header>

        <ul
          ref={listRef}
          role="list"
          className="stckel-servicos-list"
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          onKeyDown={onKeyDown}
          style={{ listStyle: "none", margin: 0, padding: 0 }}
        >
          {servicos.map((s) => {
            const open = openId === s.id;
            const painelProps = open ? {} : { inert: "" };
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
                    <span className="nome">{s.nome}</span>
                    <span className="aplicacao">{s.aplicacao}</span>
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
      <ThumbFollower ref={thumbRef} items={servicos} activeId={hoverId} />
    </section>
  );
}
