import { useCallback, useEffect, useRef, useState } from "react";
import antesSrc from "@/assets/hero-antes.jpg";
import depoisSrc from "@/assets/hero-depois.jpg";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const IMG_W = 1792;
const IMG_H = 1024;

export function HeroCompare() {
  const [pos, setPos] = useState(50);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);
  const introRafRef = useRef<number | null>(null);
  const introDoneRef = useRef(false);

  const commitPos = useCallback((clientX: number) => {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const raw = ((clientX - rect.left) / rect.width) * 100;
    const clamped = Math.max(0, Math.min(100, raw));
    setPos(clamped);
  }, []);

  const cancelIntro = useCallback(() => {
    if (introRafRef.current !== null) {
      cancelAnimationFrame(introRafRef.current);
      introRafRef.current = null;
    }
    introDoneRef.current = true;
  }, []);

  // One-shot intro 35 -> 65 -> 50
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPos(50);
      introDoneRef.current = true;
      return;
    }
    const from = 35;
    const to = 65;
    const duration = 900;
    const start = performance.now();
    // ease: cubic-bezier(0.22, 1, 0.36, 1) — approximated with easeOutCubic
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    setPos(from);
    const tick = (now: number) => {
      if (introDoneRef.current) return;
      const t = Math.min(1, (now - start) / duration);
      setPos(from + (to - from) * ease(t));
      if (t < 1) {
        introRafRef.current = requestAnimationFrame(tick);
      } else {
        // settle at 50
        setPos(50);
        introDoneRef.current = true;
        introRafRef.current = null;
      }
    };
    introRafRef.current = requestAnimationFrame(tick);
    return () => {
      if (introRafRef.current !== null) cancelAnimationFrame(introRafRef.current);
    };
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    cancelIntro();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    draggingRef.current = true;
    if (stageRef.current) stageRef.current.style.willChange = "clip-path";
    commitPos(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    commitPos(e.clientX);
  };
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch { /* noop */ }
    if (stageRef.current) stageRef.current.style.willChange = "";
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    let next: number | null = null;
    switch (e.key) {
      case "ArrowLeft":
        next = Math.max(0, pos - 5);
        break;
      case "ArrowRight":
        next = Math.min(100, pos + 5);
        break;
      case "PageDown":
        next = Math.max(0, pos - 10);
        break;
      case "PageUp":
        next = Math.min(100, pos + 10);
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = 100;
        break;
      default:
        return;
    }
    e.preventDefault();
    cancelIntro();
    setPos(next);
  };

  const clip = `inset(0 ${100 - pos}% 0 0)`;

  return (
    <section
      aria-label="Fachada antes e depois"
      className="relative w-screen overflow-hidden"
      style={{
        height: "92vh",
        marginLeft: "calc(50% - 50vw)",
        marginRight: "calc(50% - 50vw)",
        backgroundColor: "var(--color-breu)",
        touchAction: "pan-y",
      }}
    >
      {/* Stage */}
      <div ref={stageRef} className="absolute inset-0 select-none">
        {/* Before (bottom) */}
        <img
          src={antesSrc}
          alt="Fachada antes: reboco manchado, tinta descascando."
          width={IMG_W}
          height={IMG_H}
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ userSelect: "none" }}
        />
        {/* After (top, clipped) */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ clipPath: clip, WebkitClipPath: clip }}
        >
          <img
            src={depoisSrc}
            alt=""
            width={IMG_W}
            height={IMG_H}
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ userSelect: "none" }}
          />
        </div>

        {/* Label chips */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-4 md:left-6 md:top-6"
          style={{
            fontFamily: "var(--font-mono)",
            fontWeight: 500,
            fontSize: "11px",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--color-cal)",
            padding: "6px 10px",
            backgroundColor: "color-mix(in oklab, var(--color-breu) 85%, transparent)",
            border: "1px solid var(--color-hairline)",
          }}
        >
          Antes

        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-4 md:right-6 md:top-6"
          style={{
            fontFamily: "var(--font-mono)",
            fontWeight: 500,
            fontSize: "11px",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--color-breu)",
            padding: "6px 10px",
            backgroundColor: "var(--color-laranja)",
          }}
        >
          Depois
        </span>

        {/* Slider divider + handle */}
        <div
          role="slider"
          tabIndex={0}
          aria-label="Comparar antes e depois"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          aria-orientation="vertical"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onKeyDown={onKeyDown}
          className="absolute inset-y-0 z-20 flex items-center justify-center"
          style={{
            left: `${pos}%`,
            transform: "translateX(-50%)",
            width: "44px",
            cursor: "ew-resize",
            touchAction: "none",
          }}
        >
          {/* vertical line */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0"
            style={{
              left: "50%",
              transform: "translateX(-50%)",
              width: "2px",
              backgroundColor: "var(--color-laranja)",
            }}
          />
          {/* handle */}
          <span
            aria-hidden="true"
            className="relative inline-flex items-center justify-center rounded-full"
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "var(--color-cal)",
              border: "2px solid var(--color-laranja)",
              boxShadow:
                "0 0 0 8px color-mix(in oklab, var(--color-breu) 40%, transparent), 0 6px 20px color-mix(in oklab, var(--color-breu) 60%, transparent)",
              color: "var(--color-breu)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 6l-5 6 5 6M15 6l5 6-5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />
            </svg>
          </span>
        </div>

        {/* Contrast gradient — AA safety over bottom two-thirds */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, color-mix(in oklab, var(--color-breu) 20%, transparent) 35%, color-mix(in oklab, var(--color-breu) 70%, transparent) 65%, color-mix(in oklab, var(--color-breu) 92%, transparent) 100%)",
          }}
        />
      </div>

      {/* Content — bottom third, container-aligned */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-30"
        style={{ paddingBlockEnd: "clamp(32px, 6vw, 72px)" }}
      >
        <div className="container-stckel">
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontWeight: 500,
              fontSize: "12px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "color-mix(in oklab, var(--color-cal) 85%, transparent)",
              marginBottom: "16px",
            }}
          >
            Curitiba · Região Metropolitana
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.75rem, 5vw + 1rem, 6rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              fontWeight: 600,
              color: "var(--color-cal)",
              maxWidth: "18ch",
              marginBottom: "20px",
              textShadow: "0 2px 24px color-mix(in oklab, var(--color-breu) 60%, transparent)",
            }}
          >
            A diferença está na preparação
          </h1>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 400,
              fontSize: "clamp(1.05rem, 0.9rem + 0.6vw, 1.25rem)",
              lineHeight: 1.45,
              color: "var(--color-cal)",
              maxWidth: "46ch",
              marginBottom: "28px",
            }}
          >
            Pintura, textura e revestimento com preparo de superfície feito do jeito
            certo. É por isso que o acabamento dura.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#obras"
              className="pointer-events-auto inline-flex items-center justify-center px-6 transition-colors"
              style={{
                height: "48px",
                backgroundColor: "var(--color-laranja)",
                color: "var(--color-breu)",
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                fontSize: "13px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-brasa)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--color-laranja)")}
            >
              Ver obras entregues
            </a>
            <a
              href={buildWhatsAppLink()}
              target="_blank"
              rel="noreferrer noopener"
              className="pointer-events-auto inline-flex items-center justify-center px-6 transition-colors"
              style={{
                height: "48px",
                backgroundColor: "transparent",
                color: "var(--color-cal)",
                border: "1px solid color-mix(in oklab, var(--color-cal) 55%, transparent)",
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                fontSize: "13px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--color-cal)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "color-mix(in oklab, var(--color-cal) 55%, transparent)";
              }}
            >
              Falar no WhatsApp
            </a>
          </div>

          <ul
            className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2"
            style={{
              fontFamily: "var(--font-mono)",
              fontWeight: 500,
              fontSize: "13px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "color-mix(in oklab, var(--color-cal) 90%, transparent)",
            }}
          >
            <li>26 Anos de ofício</li>
            <li aria-hidden="true" style={{ color: "color-mix(in oklab, var(--color-laranja) 60%, transparent)" }}>|</li>
            <li>830 Obras entregues</li>
            <li aria-hidden="true" style={{ color: "color-mix(in oklab, var(--color-laranja) 60%, transparent)" }}>|</li>
            <li>Equipe própria</li>
          </ul>

        </div>
      </div>
    </section>
  );
}
