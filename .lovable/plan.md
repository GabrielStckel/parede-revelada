## Etapa 1 — Fundação (revisada)

Sem seções de conteúdo. Design system, nav, footer e `<main>` vazio.

### Arquivos

**`src/routes/__root.tsx`**
- `<html lang="pt-BR">`.
- `head().links` (antes do stylesheet do appCss):
  - `preconnect` → `https://fonts.googleapis.com`
  - `preconnect` → `https://fonts.gstatic.com` (crossOrigin `anonymous`)
  - `stylesheet` → `https://fonts.googleapis.com/css2?family=Anton&family=Barlow:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap`
- Meta título/description Stckel Pinturas — Curitiba/PR.
- No `RootShell`, adicionar como **primeiro filho do `<body>`** o skip-link:
  `<a href="#main" class="skip-link">Pular para o conteúdo</a>` — visualmente oculto até `:focus-visible`, aí aparece top-left, fundo `--laranja`, texto `--breu`, z-acima da nav.

**`src/styles.css`** (Tailwind v4, sem `tailwind.config`)
- Tokens em `@theme`:
  - Cores: `--color-breu #0B0B0C`, `--color-concreto #16161A`, `--color-massa #212126`, `--color-cal #F2EFEA`, `--color-grafite #8B8B93`, `--color-laranja #F57C1F`, `--color-brasa #C25A0C`.
  - **`--color-hairline: color-mix(in oklab, var(--color-cal) 8%, transparent)`** (novo token; usado na nav e footer).
  - Fontes: `--font-display "Anton"`, `--font-sans "Barlow"`, `--font-mono "JetBrains Mono"`.
  - Escala tipográfica fluida (clamp) para h1/h2/h3/lead/body/small/caption.
- Reset base:
  - `body { background: var(--color-breu); color: var(--color-cal); font-family: var(--font-sans); }`
  - `h1,h2 { font-family: var(--font-display); text-transform: uppercase; line-height: 0.92; letter-spacing: -0.01em; }`
  - `:focus-visible { outline: 2px solid var(--color-laranja); outline-offset: 2px; }`
  - `:focus:not(:focus-visible) { outline: none; }`
  - `@media (prefers-reduced-motion: no-preference) { html { scroll-behavior: smooth; } }`
  - `:target, [id] { scroll-margin-top: 80px; }`
  - `.skip-link` — sr-only por padrão; ao `:focus-visible` fica `fixed top-2 left-2 z-[100]`, padding 12px 16px, `background: var(--color-laranja)`, `color: var(--color-breu)`, Barlow 600 uppercase.
- Utilities:
  - `@utility container-stckel` — `max-width: 1240px; margin-inline: auto; padding-inline: clamp(20px, 4vw, 40px);`
  - `@utility section-y` — `padding-block: clamp(96px, 12vw, 160px);` (idêntico em todas as seções, confirmado).
- Manter mapeamentos shadcn existentes intactos (senão `border-border` do reset quebra).

**`src/components/site/Logo.tsx`** — SVG placeholder wordmark "STCKEL" em Anton, `currentColor`, altura ~28px.

**`src/components/site/Nav.tsx`** (client)
- `fixed top-0 inset-x-0 z-50`, transição `all 250ms ease`.
- Estado `scrolled`: listener `window.addEventListener('scroll', handler, { passive: true })`, dentro do handler `requestAnimationFrame(() => setScrolled(window.scrollY > 80))` com flag `ticking` para não empilhar frames.
- Quando `scrolled`: `background: color-mix(in oklab, var(--color-breu) 92%, transparent)`, `backdrop-blur(12px)`, `border-bottom: 1px solid var(--color-hairline)`.
- **Scroll-spy** com `IntersectionObserver` sobre `#servicos, #obras, #a-stckel, #contato`; link ativo recebe `aria-current="true"` (as seções ainda não existem nesta etapa — o observer só ativa quando os alvos aparecem, sem erro).
- Desktop (≥md): logo à esquerda; links Barlow 500 uppercase tracking-wide; botão sólido `--laranja` (hover `--brasa`) "Pedir orçamento" → `#contato`.
- Mobile: botão hambúrguer (`aria-label`, `aria-expanded`, `aria-controls`); overlay full-screen `--breu`, itens `<a>` em Anton 2.5rem com stagger 40ms (`style={{'--i': i}}` + `animation-delay: calc(var(--i) * 40ms)`); botão fechar `aria-label="Fechar menu"`; foco preso (loop Tab entre primeiro/último focáveis + `Esc` fecha + retorno de foco ao hambúrguer); `body` com `overflow:hidden` enquanto aberto.

**`src/components/site/Footer.tsx`**
- `background: var(--color-breu)`, borda topo `1px solid var(--color-hairline)`.
- Grid responsivo:
  - Col 1: logo + tagline curta neutra.
  - Col 2: menu resumido (mesmos 4 âncoras).
  - Col 3: Instagram (link com `aria-label`, ícone SVG inline).
  - Col 4: **linha estática** em JetBrains Mono, cor `--grafite`: `CNPJ 00.000.000/0000-00`. **Sem `<input>`, sem formulário.**
- Linha inferior: `© 2026 Stckel Pinturas · Curitiba/PR` em `--grafite`, mono.

**`src/routes/index.tsx`**
```tsx
<>
  <Nav />
  <main id="main" className="min-h-screen" />
  <Footer />
</>
```
Adicionar `head()` próprio (título/description Stckel).

### Anti-regressão (fica valendo daqui em diante)
- Nenhum componente pode remover as regras `:focus-visible` / `:focus:not(:focus-visible)`.
- `--hairline` sempre via token; nunca repetir o `color-mix` inline.
- `section-y` idêntico em todas as seções — não fazer overrides pontuais.

### Fora de escopo
Qualquer seção de conteúdo, animações de revelação clip-path, formulário funcional, i18n.
