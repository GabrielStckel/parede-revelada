## Etapa 2 — Hero "A Revelação"

Único componente novo: comparador antes/depois full-bleed com conteúdo sobreposto no terço inferior.

### Imagens (via IA, salvas no projeto)

Gerar duas imagens **16:9** consistentes entre si (mesma fachada, mesmo enquadramento):
- `src/assets/hero-antes.jpg` (1792×1008) — fachada crua/desbotada: reboco manchado, tinta descascando, mofo em pontos, luz de fim de tarde, sem pessoas.
- `src/assets/hero-depois.jpg` (1792×1008) — mesma fachada acabada: pintura uniforme cor concreto claro, textura fina, esquadrias limpas, mesma luz.

Uso `imagegen--generate_image` (model `standard`) com prompts detalhados que garantem enquadramento idêntico. Importadas como ES module (`import antes from "@/assets/hero-antes.jpg"`) — dimensões explícitas no `<img width={1792} height={1008}>` para evitar CLS.

### Componente `src/components/site/HeroCompare.tsx`

Estrutura:
```
<section class="relative w-screen" style="height: 92vh">   ← full-bleed, sai do container
  <div class="absolute inset-0">                            ← palco do comparador
    <img antes />                                           ← camada inferior, object-cover
    <div style="clip-path: inset(0 calc(100% - X%) 0 0)">   ← camada superior
      <img depois />
    </div>
    <div role="slider" ...>                                  ← trilho + alça
      <div class="line" />                                   ← 2px --laranja
      <button class="handle" />                              ← alça circular
    </div>
    <div class="gradient" />                                ← --breu 0% → 85% (bottom)
  </div>
  <div class="content">…eyebrow, h1, sub, ações, faixa…</div>
</section>
```

Controle da posição `pos` (0–100, default 50):
- **Mouse**: `onPointerDown` no trilho/alça → `setPointerCapture` → `pointermove` calcula `pos` a partir do `getBoundingClientRect` do palco. `pointerup`/`pointercancel` liberam.
- **Toque**: mesmo handler (`pointer` events cobrem touch). Alça e trilho recebem `touch-action: none` para não bloquear scroll fora e não brigar com pan-y do restante da página. O resto da section fica com `touch-action: pan-y` (scroll normal).
- **Teclado**: `role="slider"`, `tabIndex=0`, `aria-label="Comparar antes e depois"`, `aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pos)}`. Setas ←/→ movem 5%, Home/End vão para 0/100, PageUp/PageDown movem 10%. `preventDefault` só nessas teclas.

Animação de entrada (uma única vez):
- Estado `intro` inicia `true`. Em `useEffect`:
  - Se `matchMedia('(prefers-reduced-motion: reduce)').matches` → `pos = 50`, `intro = false`, sem animação.
  - Senão: `pos = 35`, dispara `requestAnimationFrame` com easing `cubic-bezier(0.22,1,0.36,1)` durante 900ms até 65%, depois `pos = 50` estabilizado e `intro = false`. Se o usuário interage antes, cancelamos o rAF e mantemos onde ele largou.
  - Interação após intro nunca reativa. Sem loop.

Alça circular:
- 40×40, fundo `--cal`, borda 2px `--laranja`, sombra sutil (`box-shadow: 0 0 0 8px color-mix(in oklab, var(--color-breu) 40%, transparent)`), ícone `‹ ›` interno em SVG. `min-h-11 min-w-11` respeitado.
- Linha vertical 2px `--laranja` ligada à alça, ocupa 100% da altura.

Gradiente de contraste (garantia AA):
- `background: linear-gradient(to bottom, transparent 0%, transparent 30%, color-mix(in oklab, var(--color-breu) 85%, transparent) 100%)` — cobre toda a área, `pointer-events: none`, `z-index` acima das imagens e abaixo da alça.

Conteúdo sobreposto (terço inferior, alinhado à esquerda):
- Wrapper `.container-stckel absolute inset-x-0 bottom-0` com `padding-block-end: clamp(32px, 6vw, 72px)`, `pointer-events: none` no wrapper e `pointer-events: auto` só nos links/botões (para não roubar arrasto do slider).
- Eyebrow: `CURITIBA · REGIÃO METROPOLITANA` em `--font-mono`, 12px, tracking 0.16em, cor `--grafite`.
- H1: `A DIFERENÇA ESTÁ NA PREPARAÇÃO` — Anton, `clamp(2.75rem, 5vw + 1rem, 6rem)`, line-height 0.92, `--cal`, max ~18ch.
- Sub: `Pintura, textura e revestimento com preparo de superfície feito do jeito certo. É por isso que o acabamento dura.` — Barlow 400, 1.375rem, `--grafite`, `max-width: 46ch`.
- Ações (flex, gap 12px, wrap):
  - `Ver obras entregues` → `<a href="#obras">`, sólido `--laranja` (hover `--brasa`), texto `--breu`, altura 48px, uppercase Barlow 600 tracking 0.08em.
  - `Falar no WhatsApp` → `<a href="https://wa.me/5541998155076" target="_blank" rel="noreferrer noopener">`, fantasma, `border: 1px solid color-mix(in oklab, var(--color-cal) 24%, transparent)`, texto `--cal`, mesmas dimensões.
- Faixa inferior (mt 32px, `--font-mono`, 12px, tracking 0.12em, cor `--grafite`), separadores `|` com 12px de margem:
  `26 ANOS DE OFÍCIO  |  830 OBRAS ENTREGUES  |  EQUIPE PRÓPRIA`
  Números estáticos, sem contador.

Anti-CLS / anti-scroll-lock:
- Section com `height: 92vh` fixo (não `min-height`).
- `<img>` sempre com `width`/`height` explícitos + `object-cover` + `absolute inset-0 h-full w-full`.
- Somente a alça e a linha carregam `touch-action: none`; a section carrega `touch-action: pan-y`. Isso permite scroll vertical no mobile em qualquer área que não seja a alça.
- `will-change: clip-path` só durante interação (setado no pointerdown, removido no pointerup).

### Integração

`src/routes/index.tsx`:
```tsx
<Nav />
<main id="main">
  <HeroCompare />
</main>
<Footer />
```
Remover `min-h-screen` do `<main>` (agora o hero preenche 92vh; abaixo virá o resto nas próximas etapas).

Nav já tem scroll-state a partir de 80px — o hero começa transparente sob a nav, logo o `pt-16` é dispensável porque a section é full-bleed e o gradiente inferior é onde mora o conteúdo (o topo pertence à imagem).

### Fora de escopo (etapa 2)

Seções seguintes (serviços, obras, sobre, contato), formulário real, i18n, animação de revelação clip-path das próximas seções.
