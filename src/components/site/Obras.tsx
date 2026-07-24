import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  OBRAS,
  CATEGORIA_LABEL,
  type CategoriaObra,
  type Obra,
} from "@/data/obras";
import { FichaTecnica } from "./FichaTecnica";
import { ObraLightbox } from "./ObraLightbox";

type Filtro = "todas" | CategoriaObra;

const FILTROS: { key: Filtro; label: string }[] = [
  { key: "todas", label: "Todas" },
  { key: "fachadas", label: CATEGORIA_LABEL.fachadas },
  { key: "texturas", label: CATEGORIA_LABEL.texturas },
  { key: "cimento-queimado", label: CATEGORIA_LABEL["cimento-queimado"] },
  { key: "interiores", label: CATEGORIA_LABEL.interiores },
];

export function Obras() {
  const [cat, setCat] = useState<Filtro>("todas");
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLUListElement | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateNav = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateNav();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateNav, { passive: true });
    window.addEventListener("resize", updateNav);
    return () => {
      el.removeEventListener("scroll", updateNav);
      window.removeEventListener("resize", updateNav);
    };
  }, []);

  const scrollByDir = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const first = el.querySelector<HTMLElement>(".obra-item");
    const step = first ? first.getBoundingClientRect().width + 20 : el.clientWidth * 0.9;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };


  const filtered = useMemo(
    () => (cat === "todas" ? OBRAS : OBRAS.filter((o) => o.categoria === cat)),
    [cat],
  );

  const counts = useMemo(() => {
    const c: Record<Filtro, number> = {
      todas: OBRAS.length,
      fachadas: 0,
      texturas: 0,
      "cimento-queimado": 0,
      interiores: 0,
    };
    OBRAS.forEach((o) => (c[o.categoria] += 1));
    return c;
  }, []);

  const open = (obra: Obra, btn: HTMLElement) => {
    const i = filtered.findIndex((o) => o.id === obra.id);
    if (i < 0) return;
    returnFocusRef.current = btn;
    setOpenIdx(i);
  };
  const close = () => {
    setOpenIdx(null);
    returnFocusRef.current?.focus();
    returnFocusRef.current = null;
  };

  return (
    <section
      id="obras"
      aria-labelledby="titulo-obras"
      className="section-y"
      style={{ backgroundColor: "var(--color-breu)" }}
    >
      <SectionReveal>
        <div className="container-stckel">
          <header style={{ marginBottom: "clamp(32px, 5vw, 56px)" }}>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--color-laranja)",
              }}
            >
              OBRAS ENTREGUES
            </p>
            <h2
              id="titulo-obras"
              style={{
                marginTop: 12,
                color: "var(--color-cal)",
                maxWidth: "14ch",
              }}
            >
              O resultado na parede
            </h2>
          </header>

          <div
            role="group"
            aria-label="Filtrar obras"
            className="obras-filtros"
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 20px" }}>
              {FILTROS.map((f) => {
                const active = cat === f.key;
                return (
                  <button
                    key={f.key}
                    type="button"
                    aria-pressed={active}
                    onClick={() => { setCat(f.key); requestAnimationFrame(() => { trackRef.current?.scrollTo({ left: 0 }); updateNav(); }); }}
                    className="obras-filtro"
                    data-active={active}
                  >
                    <span>{f.label}</span>
                    <span className="obras-filtro-count">({counts[f.key]})</span>
                  </button>
                );
              })}
            </div>
            <div className="obras-nav" aria-label="Navegar obras">
              <button
                type="button"
                className="obras-nav-btn"
                onClick={() => scrollByDir(-1)}
                disabled={!canPrev}
                aria-label="Obra anterior"
              >
                <ChevronLeft size={20} strokeWidth={1.5} />
              </button>
              <button
                type="button"
                className="obras-nav-btn"
                onClick={() => scrollByDir(1)}
                disabled={!canNext}
                aria-label="Próxima obra"
              >
                <ChevronRight size={20} strokeWidth={1.5} />
              </button>
            </div>
          </div>


          <div className="obras-carousel">
            <motion.ul
              ref={trackRef}
              className="obras-track"
              layout={!reduce}
              aria-live="polite"
              onAnimationComplete={updateNav}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {filtered.map((obra) => (
                  <motion.li
                    key={obra.id}
                    layout={!reduce}
                    className="obra-item"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <button
                      type="button"
                      className="obra-cta"
                      aria-label={`Ver obra ${obra.titulo} em detalhe`}
                      onClick={(e) => open(obra, e.currentTarget)}
                    >
                      <span className="obra-media">
                        <img
                          src={obra.thumb}
                          alt={obra.alt}
                          width={400}
                          height={300}
                          loading="lazy"
                          decoding="async"
                        />
                      </span>
                    </button>
                    <FichaTecnica obra={obra} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          </div>
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <button
                      type="button"
                      className="obra-cta"
                      aria-label={`Ver obra ${obra.titulo} em detalhe`}
                      onClick={(e) => open(obra, e.currentTarget)}
                    >
                      <span className="obra-media">
                        <img
                          src={obra.thumb}
                          alt={obra.alt}
                          width={400}
                          height={300}
                          loading="lazy"
                          decoding="async"
                        />
                      </span>
                    </button>
                    <FichaTecnica obra={obra} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          </div>
        </div>
      </SectionReveal>

      {openIdx !== null && (
        <ObraLightbox
          list={filtered}
          index={openIdx}
          onClose={close}
          onIndexChange={setOpenIdx}
        />
      )}
    </section>
  );
}

// Reveal wrapper (mesma convenção da etapa 3)
function SectionReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useMemo(() => {
    if (typeof window === "undefined") return;
  }, []);

  return (
    <div
      ref={(el) => {
        ref.current = el;
        if (!el) return;
        if (el.dataset.revealInit) return;
        el.dataset.revealInit = "1";
        if (
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
          el.dataset.revealed = "true";
          return;
        }
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) {
                el.dataset.revealing = "true";
                const onEnd = (ev: TransitionEvent) => {
                  if (ev.propertyName !== "clip-path") return;
                  el.dataset.revealed = "true";
                  delete el.dataset.revealing;
                  el.removeEventListener("transitionend", onEnd);
                };
                el.addEventListener("transitionend", onEnd);
                io.disconnect();
              }
            });
          },
          { rootMargin: "-10% 0px -10% 0px" },
        );
        io.observe(el);
      }}
      className="section-reveal"
    >
      {children}
    </div>
  );
}
