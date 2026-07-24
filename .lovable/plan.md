
## Diagnóstico

1. **Hero mobile ruim / conteúdo coberto pela nav** — a `<section>` do hero começa em `top: 0` e o conteúdo fica em `bottom: 0`, mas o H1 usa `clamp(2.75rem, 5vw + 1rem, 6rem)` = ~2.75rem no 360px, e o bloco (eyebrow + H1 + parágrafo + 2 CTAs lado a lado + linha de métricas com separadores) ultrapassa a área visível e é sobreposto pela nav fixa no topo. As métricas em uma única linha com `|` também estouram.
2. **"O resultado na parede" desce dentro da própria caixa** — `.obras-scroll` usa `max-height: min(70vh, 720px); overflow-y: auto` no desktop, criando aquela sensação de "widget rolando dentro do site" em vez da página rolar naturalmente.
3. **Site grande demais** — a escala tipográfica fluida cresce rápido: `--text-h1` chega a 6.5rem, `--text-h2` a 4.5rem, `section-y` usa `padding-block: clamp(96px, 12vw, 160px)`. Em telas médias (o preview atual é 1023px) tudo fica superdimensionado.

## Mudanças

### Hero mobile (`src/components/site/HeroCompare.tsx` + `src/styles.css`)
- Reduzir `height` de `92vh` para `min(88svh, 760px)` no desktop e usar `svh` para não estourar com barra do mobile; em `<640px` usar `min(92svh, 680px)`.
- Adicionar `padding-top` no bloco de conteúdo em mobile (via classe `hero-content`) igual à altura da nav (~64px) mais folga, para nada ficar coberto quando o hero é curto.
- Reduzir H1: `clamp(2rem, 6vw + 0.5rem, 4.75rem)` e limitar `max-width: 16ch`.
- Parágrafo menor no mobile: `clamp(0.95rem, 0.85rem + 0.4vw, 1.125rem)`.
- CTAs empilhando em `<480px` (já existe `.hero-ctas`, ajustar para full-width nesse breakpoint e reduzir altura para 44px).
- Métricas: quebrar em duas linhas no mobile, esconder os `|` em `<640px` e usar `gap` maior; reduzir fonte para 11px.
- Chips "Antes/Depois" menores no mobile (10px, padding 4px 8px).

### Obras — rolagem natural (`src/styles.css` + `src/components/site/Obras.tsx`)
- Remover o container de scroll interno: tirar `max-height`, `overflow-y`, `mask-image` de `.obras-scroll` (manter só como wrapper neutro ou remover a classe do JSX).
- Manter grid mais denso (2/3/4 col) para a seção não ficar longa demais; opcionalmente limitar a 6 obras visíveis inicialmente com botão "Ver mais" — **fora do escopo aqui**, o pedido é só rolar naturalmente. Deixar todas visíveis.
- Ajustar `aspect-ratio` para `4/5` no mobile? Não — manter `4/3`, apenas remover scroll interno.

### Escala geral (`src/styles.css`)
- `--text-h1`: `clamp(2.5rem, 1.6rem + 3.2vw, 4.75rem)` (era até 6.5rem).
- `--text-h2`: `clamp(2rem, 1.4rem + 2.4vw, 3.25rem)` (era até 4.5rem).
- `--text-h3`: `clamp(1.25rem, 1rem + 1vw, 1.75rem)`.
- `--text-lead`: `clamp(1rem, 0.9rem + 0.4vw, 1.2rem)`.
- `section-y`: `padding-block: clamp(64px, 8vw, 112px)` (era até 160px).
- Reduzir margens grandes de header dentro das seções (`marginBottom: clamp(24px, 4vw, 40px)` em Obras/Serviços/Método).

### Nada mais muda
- Sem alterar cores, tokens, estrutura de seções, SEO, JSON-LD, formulários.
- Componentes desktop de Obras continuam com hover/grid existentes.

## Verificação
- Playwright em 360×780 e 1440×900: screenshot do hero (nada coberto pela nav, H1 legível, CTAs empilhados no 360), screenshot da seção Obras (página rola naturalmente, sem scroll interno), screenshot geral (fontes proporcionais).
