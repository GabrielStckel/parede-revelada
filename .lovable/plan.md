## Etapa 4 — Obras: grid assimétrico + filtros + lightbox (revisado)

Fundo `--breu`, âncora `#obras`. Reusa `.section-reveal` (etapa 3). Framer Motion para layout animation.

### Dependência

`bun add framer-motion`.

### Novo utilitário compartilhado — `src/lib/scroll-lock.ts`

Contador de referências para o menu mobile da Nav **e** o lightbox conviverem sem sobrescrever o estilo do `body`.

```ts
let count = 0;
let prevOverflow: string | null = null;
let prevPaddingRight: string | null = null;

export function lock() {
  if (typeof document === "undefined") return;
  count += 1;
  if (count > 1) return;
  const html = document.documentElement;
  const body = document.body;
  const sbw = window.innerWidth - html.clientWidth; // largura da scrollbar
  prevOverflow = body.style.overflow;
  prevPaddingRight = body.style.paddingRight;
  body.style.overflow = "hidden";
  if (sbw > 0) body.style.paddingRight = `${sbw}px`;
}

export function unlock() {
  if (typeof document === "undefined") return;
  count = Math.max(0, count - 1);
  if (count > 0) return;
  const body = document.body;
  body.style.overflow = prevOverflow ?? "";
  body.style.paddingRight = prevPaddingRight ?? "";
  prevOverflow = null;
  prevPaddingRight = null;
}
```

Adiciona `html { scrollbar-gutter: stable; }` em `src/styles.css` como cinto-e-suspensório (evita salto horizontal mesmo com o padding-compensation).

Refatora `src/components/site/Nav.tsx` (etapa 1): o `useEffect` do menu mobile passa a chamar `lock()`/`unlock()` em vez de mexer diretamente em `document.body.style.overflow`.

### Dados: `src/data/obras.ts`

```ts
// Todos os dados são placeholders. Substituir por obras reais antes de publicar.
// Regra de layout: itens com span "full" só encaixam no início de uma linha
// do grid de 2 colunas. Como o grid usa grid-auto-flow: dense, buracos
// são preenchidos automaticamente por half seguintes, mas manter fulls
// intercalados com pares half evita saltos visuais grandes.

export type CategoriaObra = "fachadas" | "texturas" | "cimento-queimado" | "interiores";

export type Obra = {
  id: string;
  titulo: string;                  // "OBRA EXEMPLO 01" etc.
  categoria: CategoriaObra;
  local: string;                   // "— a confirmar"
  sistema: string;                 // descrição técnica genérica marcada
  area: string;                    // "— a confirmar"
  prazo: string;                   // "— a confirmar"
  imagem: string;                  // Unsplash w=1600
  thumb: string;                   // Unsplash w=800
  alt: string;                     // descrição factual da imagem
  span: "full" | "half";
};
```

8 itens `OBRA EXEMPLO 01..08`, duas por categoria, cada um com `// TODO: dados reais`. Ordem/spans:

```
01 FULL fachadas          05 HALF interiores
02 HALF interiores        06 HALF texturas
03 HALF cimento-queimado  07 HALF cimento-queimado
04 FULL fachadas          08 HALF texturas
```

Sistema fica descritivo mas marcado: `"Textura projetada — sistema a confirmar"`, etc. Local/área/prazo: `"— a confirmar"`. `alt` descreve a foto Unsplash factualmente (não a obra fictícia).

Imagens: URLs Unsplash fixas `https://images.unsplash.com/photo-{id}?w=1600&h=1200&fit=crop&auto=format` e `?w=800&h=600&...`.

### Componente `src/components/site/Obras.tsx`

```
<section id="obras" class="section-y" style="background: var(--color-breu)">
  <div class="container-stckel section-reveal">
    <header>
      <p class="eyebrow">OBRAS ENTREGUES</p>
      <h2>O RESULTADO NA PAREDE</h2>
    </header>
    <Filtros value={cat} onChange={setCat} counts={counts} />
    <motion.ul class="obras-grid" layout>
      <AnimatePresence mode="popLayout">
        {filtered.map(o => <ObraCard key={o.id} obra={o} onOpen={openLightbox} />)}
      </AnimatePresence>
    </motion.ul>
  </div>
</section>
```

**Filtros** — `<div role="group" aria-label="Filtrar obras">`, botões `<button aria-pressed>`:
- Mono 12px, tracking 0.12em, uppercase. Rótulos: `TODAS (8) / FACHADAS (2) / TEXTURAS (2) / CIMENTO QUEIMADO (2) / INTERIORES (2)`.
- Ativo: cor `--laranja`, borda inferior 1px `--laranja`. Inativos `--grafite`, hover `--cal`.
- Sem fundo/pílula. `min-height: 44px`. Mobile: `overflow-x: auto`.

**Grid `.obras-grid`**:
```css
.obras-grid {
  display: grid;
  gap: clamp(16px, 2vw, 24px);
  grid-template-columns: 1fr;
}
@media (min-width: 1024px) {
  .obras-grid { grid-template-columns: repeat(2, 1fr); grid-auto-flow: dense; }
  .obras-grid > [data-span="full"] { grid-column: span 2; }
}
```

`grid-auto-flow: dense` cobre lacunas quando um filtro reduz a lista (item 4 da correção).

**Card (HTML válido — item 1 da correção)**:
```
<motion.li layout data-span={obra.span} class="obra-item">
  <button
    class="obra-cta"
    aria-label={`Ver obra ${obra.titulo} em detalhe`}
    onClick={e => onOpen(obra, e.currentTarget)}
  >
    <span class="obra-media">
      <img src={obra.thumb} alt={obra.alt} width={800} height={obra.span === "full" ? 450 : 600}
           loading="lazy" decoding="async" />
    </span>
  </button>
  <FichaTecnica obra={obra} />
</motion.li>
```

- `<button>` só envolve a mídia; `<dl>` da ficha fica **fora** do botão, irmã dentro do `<li>`.
- `aria-label` explícito impede que `alt` da imagem vire nome acessível.
- `.obra-cta { display: block; width: 100%; padding: 0; border: 0; background: transparent; cursor: pointer; }` (mantém aria-pressed offhand).
- `.obra-media { display: block; aspect-ratio: 16/9; overflow: hidden; border: 1px solid var(--color-hairline); }` — half sobrescreve para `4/3`. `img { width: 100%; height: 100%; object-fit: cover; transition: transform 500ms cubic-bezier(0.22,1,0.36,1); }`.
- Hover desktop: `.obra-cta:hover .obra-media img { transform: scale(1.03); }`.

**FichaTecnica** (`src/components/site/FichaTecnica.tsx`, reutilizada no card e no lightbox):
- `<dl>` com 4 pares LOCAL/SISTEMA/ÁREA/ENTREGA.
- `<dt>` mono 11px, tracking 0.14em, `--grafite`, uppercase.
- `<dd>` mono 12px, `--cal`, margin 0.
- Padding-block ~14px, `border-top: 1px solid var(--color-hairline)` sob a imagem.
- Prop `variant?: "card" | "lightbox"` só troca tamanhos/gap.

**Layout animation**:
- `layout` no `<motion.ul>` e nos `<motion.li>`. `AnimatePresence mode="popLayout"`. Transição `{ duration: 0.35, ease: [0.22,1,0.36,1] }`, initial/exit `{ opacity: 0 }`.
- `useReducedMotion()` desliga `layout` (lista estática).

### Lightbox — `src/components/site/ObraLightbox.tsx`, portal no `body`

```
<div role="dialog" aria-modal="true" aria-labelledby="lightbox-title" ref={rootRef} class="lightbox-root">
  <div class="lightbox-backdrop" onClick={close} />
  <div class="lightbox-panel">
    <button class="lightbox-close" aria-label="Fechar">×</button>
    <button class="lightbox-nav prev" aria-label="Obra anterior">‹</button>
    <button class="lightbox-nav next" aria-label="Próxima obra">›</button>
    <figure class="lightbox-media">
      <img src={obra.imagem} alt={obra.alt} loading="eager" fetchpriority="high" decoding="async" />
    </figure>
    <aside class="lightbox-info">
      <p class="eyebrow">{categoriaLabel}</p>
      <h3 id="lightbox-title" tabIndex={-1}>{obra.titulo}</h3>
      <FichaTecnica obra={obra} variant="lightbox" />
    </aside>
  </div>
</div>
```

- Confirmado: imagem grande usa `loading="eager"` e `fetchpriority="high"` (item extra da correção).
- Portal em `document.body` (convenção fixada na etapa 3).

**Scroll lock**: `useEffect` chama `lock()` no mount e `unlock()` no unmount — mesmo utilitário do menu mobile.

**Foco inicial**: no mount, foca `.lightbox-close`. Guarda o card originador em ref (`returnFocusRef` recebido de `Obras.tsx`) e restaura no unmount.

**Focus trap (item 5 da correção)** — sem `data-lightbox-focusable`. No `onKeyDown` do root, ao pressionar Tab consulta:

```ts
const nodes = rootRef.current!.querySelectorAll<HTMLElement>(
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
);
const focusables = Array.from(nodes).filter(el => {
  if (el.hasAttribute("disabled")) return false;
  const style = getComputedStyle(el);
  if (style.visibility === "hidden" || style.display === "none") return false;
  return el.offsetParent !== null || style.position === "fixed";
});
```

Aplica Tab/Shift+Tab circular sobre `focusables`. `#lightbox-title` (tabindex="-1") fica fora da lista porque o seletor exclui `tabindex="-1"`.

**Teclado**:
- `Esc` → fecha.
- `←` / `→` → `prev()` / `next()`, navegando sobre a **lista filtrada** vigente (com wrap-around).
- Tab/Shift+Tab → trap.

**Anúncio da troca (item 6 da correção)**:
- Sempre que `obra.id` mudar dentro do lightbox aberto, um `useEffect([obra.id])` chama `titleRef.current?.focus()` — o `<h3 id="lightbox-title" tabindex="-1">` recebe foco e o leitor de tela anuncia o novo título. Sem `aria-live` adicional (o foco já é o anúncio).
- No mesmo effect, pré-carrega vizinhos:
  ```ts
  const preload = (src: string) => { const i = new Image(); i.src = src; };
  preload(list[(idx + 1) % list.length].imagem);
  preload(list[(idx - 1 + list.length) % list.length].imagem);
  ```

**Layout visual do lightbox**:
- Desktop ≥1024px: `grid-template-columns: 1fr 360px`, altura 92vh, fundo `color-mix(var(--color-breu) 96%, transparent)`, painel lateral `--concreto`.
- Mobile: coluna única, imagem no topo (proporção original), painel rolável abaixo (`overflow-y: auto`).
- Botões 44×44, `--cal`, sem sombra, hairline. Nav lateral em `top: 50%` sobre a mídia em mobile.
- Sem `box-shadow` em nada.

### Integração

- `Obras.tsx`: `const [openIdx, setOpenIdx] = useState<number|null>(null)`, `returnFocusRef = useRef<HTMLElement|null>(null)`. `openLightbox(obra, buttonEl)` grava o botão e o índice **na lista filtrada**.
- `Obras` passa `list={filtered}`, `index={openIdx}`, `onClose`, `onIndexChange` ao lightbox.
- `src/routes/index.tsx`: `<Obras />` após `<Servicos />`.

### Acessibilidade / performance

- Todas as thumbs `loading="lazy"`, `decoding="async"`, `width/height` explícitos (anti-CLS).
- `useReducedMotion` cobre motion; `@media (prefers-reduced-motion: reduce)` cobre transforms residuais.
- Foco visível global (etapa 1) aplica-se a todos os `<button>`.

### Fora de escopo

Etapas 5–7. Sem carrossel de múltiplas fotos por obra, sem paginação, sem CMS.
