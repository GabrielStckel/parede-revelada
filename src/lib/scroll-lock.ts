// Contador compartilhado — Nav mobile e Lightbox convivem sem sobrescrever body.
let count = 0;
let prevOverflow: string | null = null;
let prevPaddingRight: string | null = null;

export function lock(): void {
  if (typeof document === "undefined") return;
  count += 1;
  if (count > 1) return;
  const html = document.documentElement;
  const body = document.body;
  const sbw = window.innerWidth - html.clientWidth;
  prevOverflow = body.style.overflow;
  prevPaddingRight = body.style.paddingRight;
  body.style.overflow = "hidden";
  if (sbw > 0) body.style.paddingRight = `${sbw}px`;
}

export function unlock(): void {
  if (typeof document === "undefined") return;
  count = Math.max(0, count - 1);
  if (count > 0) return;
  const body = document.body;
  body.style.overflow = prevOverflow ?? "";
  body.style.paddingRight = prevPaddingRight ?? "";
  prevOverflow = null;
  prevPaddingRight = null;
}
