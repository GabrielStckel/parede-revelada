import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import type { Servico } from "@/data/servicos";

export type ThumbFollowerHandle = {
  setTarget: (x: number, y: number) => void;
  hide: () => void;
};

type Props = {
  items: Servico[];
  activeId: string | null;
};

export const ThumbFollower = forwardRef<ThumbFollowerHandle, Props>(function ThumbFollower(
  { items, activeId },
  ref,
) {
  const [mounted, setMounted] = useState(false);
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const visibleRef = useRef(false);

  useEffect(() => setMounted(true), []);

  const stopLoop = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const loop = () => {
    const node = nodeRef.current;
    if (!node) {
      rafRef.current = null;
      return;
    }
    current.current.x += (target.current.x - current.current.x) * 0.18;
    current.current.y += (target.current.y - current.current.y) * 0.18;
    node.style.transform = `translate3d(${current.current.x + 20}px, ${current.current.y + 20}px, 0)`;
    rafRef.current = requestAnimationFrame(loop);
  };

  useImperativeHandle(ref, () => ({
    setTarget: (x, y) => {
      target.current.x = x;
      target.current.y = y;
      if (!visibleRef.current) {
        // snap on first show to avoid glide from origin
        current.current.x = x;
        current.current.y = y;
        visibleRef.current = true;
        const node = nodeRef.current;
        if (node) {
          node.style.opacity = "1";
          node.style.transform = `translate3d(${x + 20}px, ${y + 20}px, 0)`;
        }
      }
      if (rafRef.current === null) rafRef.current = requestAnimationFrame(loop);
    },
    hide: () => {
      visibleRef.current = false;
      const node = nodeRef.current;
      if (node) node.style.opacity = "0";
      stopLoop();
    },
  }));

  useEffect(() => stopLoop, []);

  if (!mounted) return null;

  return (
    <div
      ref={nodeRef}
      aria-hidden="true"
      className="stckel-thumb-follower"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        willChange: "transform",
        opacity: 0,
        transition: "opacity 160ms ease",
        zIndex: 30,
      }}
    >
      {items.map((s) => (
        <img
          key={s.id}
          src={s.thumb}
          alt=""
          width={200}
          height={140}
          loading="lazy"
          decoding="async"
          style={{
            display: activeId === s.id ? "block" : "none",
            width: 200,
            height: 140,
            objectFit: "cover",
            border: "1px solid var(--color-hairline)",
          }}
        />
      ))}
    </div>
  );
});
