import { useCallback, useEffect, useRef, useState } from "react";
import antesSrc from "@/assets/hero-antes.jpg";
import depoisSrc from "@/assets/hero-depois.jpg";

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
        height: "min(88svh, 760px)",
        minHeight: "560px",
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
          loading="eager"
          decoding="async"
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
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ userSelect: "none" }}
          />
        </div>

        {/* Label chips */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-4 md:left-6"
          style={{
            top: "calc(64px + env(safe-area-inset-top, 0px) + 12px)",
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
          className="pointer-events-none absolute right-4 md:right-6"
          style={{
            top: "calc(64px + env(safe-area-inset-top, 0px) + 12px)",
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
            width: "72px",
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
              boxShadow: "0 0 12px color-mix(in oklab, var(--color-breu) 70%, transparent)",
            }}
          />
          {/* handle */}
          <span
            aria-hidden="true"
            className="hero-handle relative inline-flex items-center justify-center rounded-full"
            style={{
              backgroundColor: "var(--color-cal)",
              border: "2px solid var(--color-laranja)",
              boxShadow:
                "0 0 0 10px color-mix(in oklab, var(--color-breu) 30%, transparent), 0 8px 24px color-mix(in oklab, var(--color-breu) 70%, transparent)",
              color: "var(--color-breu)",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M10 5l-6 7 6 7M14 5l6 7-6 7" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>

        {/* Contrast gradient — stronger scrim so texts stay AA over both images */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(to bottom, color-mix(in oklab, var(--color-breu) 55%, transparent) 0%, color-mix(in oklab, var(--color-breu) 15%, transparent) 22%, color-mix(in oklab, var(--color-breu) 55%, transparent) 48%, color-mix(in oklab, var(--color-breu) 88%, transparent) 72%, var(--color-breu) 100%)",
          }}
        />

      </div>

      {/* Content — bottom third, container-aligned */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-30"
        style={{ paddingBlockEnd: "clamp(32px, 6vw, 72px)" }}
      >
        {/* Local scrim behind the text block for guaranteed AA over any image */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0"
          style={{
            height: "72%",
            background:
              "linear-gradient(to bottom, transparent 0%, color-mix(in oklab, var(--color-breu) 55%, transparent) 35%, color-mix(in oklab, var(--color-breu) 88%, transparent) 70%, var(--color-breu) 100%)",
          }}
        />
        <div className="container-stckel relative">
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontWeight: 500,
              fontSize: "12px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--color-laranja)",
              marginBottom: "16px",
            }}
          >
            Curitiba · Região Metropolitana
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 6vw + 0.5rem, 4.5rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              fontWeight: 600,
              color: "var(--color-cal)",
              maxWidth: "16ch",
              marginBottom: "16px",
              textShadow:
                "0 2px 18px color-mix(in oklab, var(--color-breu) 85%, transparent), 0 0 2px color-mix(in oklab, var(--color-breu) 70%, transparent)",
            }}
          >
            A diferença está na preparação
          </h1>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 400,
              fontSize: "clamp(0.95rem, 0.85rem + 0.4vw, 1.15rem)",
              lineHeight: 1.5,
              color: "var(--color-cal)",
              maxWidth: "44ch",
              marginBottom: "24px",
              textShadow: "0 1px 12px color-mix(in oklab, var(--color-breu) 80%, transparent)",
            }}
          >
            Pintura, textura e revestimento com preparo de superfície feito do jeito
            certo. É por isso que o acabamento dura.
          </p>





          <ul
            className="hero-metricas mt-8 flex flex-wrap items-center gap-x-3 gap-y-2"
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
