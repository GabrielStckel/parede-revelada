## Diagnóstico (mobile 390px)

- Header no topo do hero fica **transparente sobre imagem clara**, o wordmark "STCKEL" e o ícone de menu somem contra a parede/textura (só volta a ficar legível depois do scroll).
- Altura fixa `h-16` (64px) + logo centralizado verticalmente **sem folga para o notch** (`env(safe-area-inset-top)` ignorado).
- Não há CTA visível na barra em mobile — o usuário precisa abrir o menu para achar "Pedir orçamento". Num site cujo objetivo é lead, isso custa conversão.
- Menu aberto: só links + botão empilhados no topo esquerdo. Metade inferior fica vazia, sem telefone, WhatsApp direto, endereço ou rodapé de contato. Parece incompleto.
- Itens do menu com `gap-4` e `font-size 2.5rem` — no 390px ficam colados e o CONTATO encosta no CTA.
- Falta divisor/hairline entre header e o conteúdo do menu; a caixinha do logo continua igual à do header normal, sem sensação de "estou dentro do menu".
- Sem animação de entrada dos itens (o `--i` está definido mas nenhum keyframe consome).

## Mudanças (apenas mobile, `<md`)

### 1. Barra fixa (`src/components/site/Nav.tsx` + `src/styles.css`)
- Aplicar **fundo semi-opaco desde o topo em mobile**: no `<md`, mesmo com `scrolled=false`, usar `--color-breu` a 78% + `backdrop-filter: blur(10px)` + hairline inferior sutil. Desktop mantém transparente→sólido como está.
- Adicionar `padding-top: env(safe-area-inset-top)` no wrapper interno da nav (afeta iOS).
- Reduzir altura útil no mobile de 64→56px e usar logo `height=20` para dar mais leveza.
- Trocar o ícone de menu por um traço mais gráfico (duas linhas 18px, stroke 1.5) e aumentar hit-area para 44×44 mantendo o traço menor visualmente.

### 2. CTA mini na barra mobile
- Entre logo e burger, mostrar botão compacto **"Orçamento"** (h-9, px-3, texto 11px uppercase, `--color-laranja`) linkando para `buildWhatsAppLink()`. Fica sempre acessível sem abrir menu.
- Ordem: `[Logo] [spacer] [Orçamento] [Burger]` com `gap-2`.

### 3. Menu fullscreen (`Nav.tsx` mobile drawer)
- Header do menu: manter logo + X, mas adicionar **hairline abaixo** e `padding-top: env(safe-area-inset-top)`.
- Lista de links: aumentar `gap` para 20px, reduzir font para `2rem` (era 2.5), manter Outfit 600 uppercase, adicionar `padding-block: 8px` em cada link (hit-area confortável) e um chevron `→` sutil à direita em `--color-grafite-strong` que fica laranja no `aria-current`.
- Adicionar **eyebrow em mono** acima da lista: "NAVEGAR" em `--color-grafite-strong` 11px uppercase tracking 0.16em.
- Substituir o CTA solto por um **bloco de contato pé-do-menu** fixo na parte inferior do drawer (usando `mt-auto` num flex-col com `h-full`):
  - Eyebrow "FALE COM A STCKEL"
  - Botão laranja `PEDIR ORÇAMENTO` full-width h-12
  - Duas linhas em mono abaixo: `WHATSAPP · (41) 99815-5076` e `CURITIBA / PR · SEG–SEX 08–18`
- Animação de entrada dos itens: keyframe `@keyframes stckel-menu-in` (translateY 12px→0, opacity 0→1, 320ms, delay `calc(var(--i) * 40ms)`), respeitando `prefers-reduced-motion`.

### 4. Escala e detalhes
- Padronizar `letter-spacing: 0.08em` no CTA da barra mobile idêntico ao desktop.
- Garantir contraste AA: fundo do CTA `--laranja` sobre `--breu 78%` é seguro; texto do logo em `--cal` sobre a barra semi-opaca passa AA.
- Manter `focus-visible` outline (2px `--laranja`, offset 3px) em todos os alvos.

### 5. Nada muda
- Sem tocar em desktop nav (comportamento scroll-state, links, spy, CTA).
- Sem alterar tokens, roteamento, SEO, formulário ou hero.
- Área de laranja continua ≤4% (o CTA mini + o do drawer não somam nada perto disso).

## Verificação
- Playwright 390×844 e 360×780: screenshot da barra no topo do hero (logo legível, CTA visível), da barra scrolled (mantém consistência), do menu aberto (lista + bloco de contato inferior, sem overlap com safe-area), com foco no primeiro link para conferir outline. Comparar antes/depois lado a lado.
- Sanidade em 768px (desktop): garantir que nada do CTA/estilos mobile vaza.

## Detalhes técnicos
- CSS novo em `styles.css`: `.nav-mobile-bar { background: color-mix(in oklab, var(--color-breu) 78%, transparent); backdrop-filter: blur(10px); border-bottom: 1px solid var(--color-hairline); }` aplicado só via `@media (max-width: 767px)`.
- Keyframe `stckel-menu-in` já pode viver junto de `.stckel-menu-item` (que hoje só recebe `--i` sem consumir).
- Flex do drawer: `.container-stckel` do menu vira `flex flex-col h-[100dvh]` para o bloco inferior grudar no fim usando `mt-auto`.