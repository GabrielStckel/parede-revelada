## Etapa 3 (final) — Serviços: lista-acordeão editorial

Fundo `--concreto`, âncora `#servicos`. Sem grid de cards, sem sombras, sem opacidade em texto (`--grafite` sobre `--concreto` = 5,34:1, AA).

### Copy

- Eyebrow (JetBrains Mono 12px, tracking 0.16em, `--grafite`): `SISTEMAS APLICADOS`
- H2 (Anton, `--text-h2`, `--cal`): `O ACABAMENTO COMEÇA ANTES DA TINTA`

### Dados: `src/data/servicos.ts`

```ts
export type Servico = {
  id: string;
  nome: string;
  aplicacao: string;
  paragrafos: [string, string];
  sistemas: string[];
  thumb: string; // URL fixa images.unsplash.com/photo-{id}?w=400&h=280&fit=crop
};
```

Miniaturas: URLs **diretas e fixas** de `https://images.unsplash.com/photo-{id}?w=400&h=280&fit=crop&auto=format` — uma por slug, escolhidas manualmente, mesma imagem a cada build. Cada item recebe `// TODO: substituir por foto real da obra`.

Parágrafos com voz técnica: preparo (lixamento, remoção de partes soltas, tratamento de mofo com solução fungicida, massa PVA/acrílica, selador), sistema (produto + camadas + intervalo entre demãos), número de demãos e durabilidade em anos, onde faz sentido. Proibido: "soluções", "personalizadas", "alto padrão", "qualidade", "excelência".

### Revelação de seção — sem clip-path residual

Utilitário em `src/styles.css`:
```css
.section-reveal { clip-path: inset(0 0 100% 0); }
.section-reveal[data-revealing="true"] {
  clip-path: inset(0 0 0 0);
  transition: clip-path 700ms cubic-bezier(0.22, 1, 0.36, 1);
}
.section-reveal[data-revealed="true"] { clip-path: none; }
@media (prefers-reduced-motion: reduce) {
  .section-reveal { clip-path: none; }
}
```

Fluxo no componente:
1. `IntersectionObserver` (threshold 0.2), uma vez → `observer.disconnect()`; set `data-revealing="true"`.
2. `transitionend` (propriedade `clip-path`) → remove `data-revealing`, set `data-revealed="true"` (aplica `clip-path: none`, elimina o containing block).
3. `prefers-reduced-motion`: marca `data-revealed="true"` direto no mount, sem observer.

**Convenção do projeto** (documentar em `.lovable/plan.md` para etapas 4+): modal, lightbox e qualquer overlay **em portal no `document.body`**, nunca dentro de uma seção com `.section-reveal`.

### Componente `src/components/site/Servicos.tsx`

```
<section id="servicos" class="section-y" style="background: var(--color-concreto); position: relative">
  <div class="container-stckel section-reveal" ref={sectionRef}>
    <header>eyebrow + h2</header>
    <ul role="list" onPointerMove={onMove} onPointerLeave={hide}>
      {servicos.map(s => <ServicoLinha ... />)}
    </ul>
  </div>
  <ThumbFollower ref={thumbRef} items={servicos} activeId={hoverId} />
</section>
```

### Cada linha — semântica com heading

```
<li data-servico-id={id} class="linha">
  <h3 class="linha-head">
    <button aria-expanded={open} aria-controls={"painel-"+id} id={"trigger-"+id} class="linha-inner">
      <span class="nome">{nome}</span>
      <span class="aplicacao">{aplicacao}</span>
    </button>
  </h3>
  <div id={"painel-"+id} role="region" aria-labelledby={"trigger-"+id}
       class="painel" data-open={open} {...(!open && { inert: "" })}>
    <div class="painel-inner">
      <p>{p1}</p><p>{p2}</p>
      <p class="sistemas">SISTEMAS: {sistemas.join(" · ")}</p>
    </div>
  </div>
</li>
```

- `.linha-head`: `margin: 0; font: inherit; font-weight: inherit;` — só estrutura, sem estilo próprio. Hierarquia final: h2 (seção) → h3 (cada serviço).
- `<li>`: `border-top: 1px solid var(--color-hairline)`; último recebe `border-bottom`. Nunca transformado.
- `.linha-inner`: `<button>` largura total, grid `1fr auto` em ≥768px, padding-block 28px, text-align left, background transparente.
- `.nome`: Anton, `clamp(1.5rem, 6vw, 2rem)`, line-height 0.95, `--cal`, uppercase, letter-spacing -0.01em.
- `.aplicacao`: JetBrains Mono 12px, tracking 0.12em, `--grafite`, uppercase.
- **Mobile <768px**: `.linha-inner` vira flex column gap 6px — aplicação abaixo do nome.
- **Hover desktop** (`@media (hover: hover) and (pointer: fine)`):
  - `transform: translateX(8px)` só em `.linha-inner`, transição 220ms `cubic-bezier(0.22,1,0.36,1)`.
  - `.linha-inner:hover .nome`, `.linha[data-open="true"] .nome` → `color: var(--color-laranja)`.
  - Bordas do `<li>` ficam paradas.
- Sem `box-shadow` em nada.

### Painel — animação sem salto de fechamento

```css
.painel { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 320ms cubic-bezier(0.22,1,0.36,1); }
.painel[data-open="true"] { grid-template-rows: 1fr; }
.painel-inner {
  overflow: hidden;
  visibility: hidden;
  transition: visibility 0s linear 320ms;   /* fecha: só some após o colapso */
}
.painel[data-open="true"] .painel-inner {
  visibility: visible;
  transition: visibility 0s linear 0s;      /* abre: aparece imediatamente */
}
@media (prefers-reduced-motion: reduce) {
  .painel, .painel-inner { transition: none; }
}
```

Acessibilidade fora do fluxo quando fechado: atributo `inert` (spread condicional) + `visibility: hidden` como redundância para UAs sem suporte a `inert`.

Estado: `openId: string | null` (só um aberto). Setas ↑/↓ movem foco entre triggers (`onKeyDown` no `<ul>`); Home/End primeiro/último; `preventDefault` só nessas teclas.

Parágrafos: Barlow 400, ~1rem, `--grafite` (sem opacidade). Sistemas em JetBrains Mono 12px, `--grafite`.

### ThumbFollower — sem mismatch, ref+rAF, só mouse

`src/components/site/ThumbFollower.tsx`, montado **sempre** (nunca condicional por `useIsMobile()`, que causaria mismatch de hidratação):

- Estado interno: `const [mounted, setMounted] = useState(false); useEffect(() => setMounted(true), []);` — só ativa após montagem no cliente.
- CSS esconde definitivamente em toques/caneta: renderiza dentro de wrapper com `@media not all and (hover: hover) and (pointer: fine) { display: none; }`.
- Props: `items`, `activeId: string | null`. Único estado React na página de serviços: `hoverId`.
- Posição em `useRef`:
  ```ts
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);
  ```
- API imperativa via `useImperativeHandle`: `setTarget(x, y)`, `hide()`. Loop rAF: `current += (target - current) * 0.18`, escreve `node.style.transform = translate3d(x+20, y+20, 0)` direto no DOM. Cancela quando escondido.
- Listener em `Servicos.tsx`: `onPointerMove` no `<ul>`.
  - `if (!mounted || isMobile) return;` (guarda de listener; `useIsMobile` continua útil aqui, só não controla montagem).
  - `if (e.pointerType !== "mouse") return;` — ignora caneta e toque.
  - `const li = (e.target as HTMLElement).closest("[data-servico-id]"); if (!li) return;`
  - Chama `thumb.setTarget(e.clientX, e.clientY)`; atualiza `hoverId` só quando muda.
  - `onPointerLeave` do `<ul>` → `thumb.hide()` e `setHoverId(null)`.
- Elemento: `<img width={200} height={140} loading="lazy" decoding="async">` com `border: 1px solid var(--color-hairline)`. **Sem sombra**. `position: fixed; top: 0; left: 0; pointer-events: none; will-change: transform;` — fade opacity 160ms ao aparecer/sumir. Escondido se `activeId === openId`.

### Integração

`src/routes/index.tsx`: `<Servicos />` após `<HeroCompare />`. Nav já linka `#servicos`; `scroll-margin-top: 80px` global cuida do offset.

### Fora de escopo

Etapas 4–7. Sem fotos reais (Unsplash fixas marcadas TODO), sem CMS, sem filtro.
