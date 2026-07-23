import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { CATEGORIA_LABEL, type Obra } from "@/data/obras";
import { FichaTecnica } from "./FichaTecnica";
import { lock, unlock } from "@/lib/scroll-lock";

type Props = {
  list: Obra[];
  index: number;
  onClose: () => void;
  onIndexChange: (i: number) => void;
};

export function ObraLightbox({ list, index, onClose, onIndexChange }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const [mounted, setMounted] = useState(false);

  const obra = list[index];

  const prev = useCallback(() => {
    onIndexChange((index - 1 + list.length) % list.length);
  }, [index, list.length, onIndexChange]);
  const next = useCallback(() => {
    onIndexChange((index + 1) % list.length);
  }, [index, list.length, onIndexChange]);

  // Portal ready + scroll lock
  useEffect(() => {
    setMounted(true);
    lock();
    return () => unlock();
  }, []);

  // Foco inicial no botão fechar
  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  // Ao trocar de obra: foco no título + preload dos vizinhos
  useEffect(() => {
    if (!obra) return;
    titleRef.current?.focus();
    const preload = (src: string) => {
      const img = new Image();
      img.src = src;
    };
    if (list.length > 1) {
      preload(list[(index + 1) % list.length].imagem);
      preload(list[(index - 1 + list.length) % list.length].imagem);
    }
  }, [obra?.id, index, list]);

  // Teclado: Esc, setas, Tab trap
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
        return;
      }
      if (e.key !== "Tab") return;
      const root = rootRef.current;
      if (!root) return;
      const nodes = root.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      const focusables = Array.from(nodes).filter((el) => {
        if (el.hasAttribute("disabled")) return false;
        const style = getComputedStyle(el);
        if (style.visibility === "hidden" || style.display === "none") return false;
        return el.offsetParent !== null || style.position === "fixed";
      });
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (active === first || !root.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, prev, next]);

  if (!mounted || !obra) return null;

  const node = (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
      className="lightbox-root"
    >
      <div
        className="lightbox-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="lightbox-panel">
        <button
          ref={closeRef}
          type="button"
          className="lightbox-close"
          aria-label="Fechar"
          onClick={onClose}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
        <button
          type="button"
          className="lightbox-nav prev"
          aria-label="Obra anterior"
          onClick={prev}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
        <button
          type="button"
          className="lightbox-nav next"
          aria-label="Próxima obra"
          onClick={next}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
        <figure className="lightbox-media">
          <img
            key={obra.id}
            src={obra.imagem}
            alt={obra.alt}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </figure>
        <aside className="lightbox-info">
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--color-laranja)",
            }}
          >
            {CATEGORIA_LABEL[obra.categoria]}
          </p>
          <h3
            id="lightbox-title"
            ref={titleRef}
            tabIndex={-1}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.01em",
              textTransform: "uppercase",
              color: "var(--color-cal)",
              margin: "12px 0 20px",
              outline: "none",
            }}
          >
            {obra.titulo}
          </h3>
          <FichaTecnica obra={obra} variant="lightbox" />
          <p
            style={{
              marginTop: 24,
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--color-grafite)",
            }}
          >
            {index + 1} / {list.length}
          </p>
        </aside>
      </div>
    </div>
  );

  return createPortal(node, document.body);
}
