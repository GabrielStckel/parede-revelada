## Etapa 5 — Método + A Stckel

Duas seções novas, sem tocar em hero, serviços ou obras.

### 1. `src/data/metodo.ts` (novo)

Tipado, 4 passos com `indice` ("01"–"04"), `titulo` e `descricao` exatamente como enviados.

### 2. `src/components/site/Metodo.tsx` (novo)

- `<section id="metodo">` fundo `--massa`, `section-y`, `container-stckel`.
- Header: eyebrow mono "COMO TRABALHAMOS" + h2 "Ordem que aparece no acabamento" (ou similar curto), mesmo padrão de Serviços.
- Timeline:
  - **Desktop (≥768px):** grid 4 colunas, régua hairline horizontal atrás dos pontos (linha absoluta 1px em `--hairline`, ponto 10px `--laranja` sobre a régua). Índice grande em `--laranja` Figtree mono (`clamp(2.5rem, 1.5rem+2vw, 3.5rem)`, `font-weight: 500`, `letter-spacing: -0.02em`). Título Outfit uppercase 14px letra travada. Descrição Figtree 15px `--cal` a 85%.
  - **Mobile:** vertical, régua vertical hairline à esquerda com pontos, mesmo conteúdo empilhado.
- Reveal: reusa `.section-reveal` + IO já existente (padrão de Serviços/Obras).

### 3. Imagem equipe

Gerar `src/assets/equipe-stckel.jpg` (fast tier, 1600×1200) — equipe de pintores em obra real em Curitiba, roupa de trabalho, andaime, fachada em preparo, foto documental, luz natural. Salva em cores; o duotone é aplicado via CSS.

### 4. `src/components/site/SobreStckel.tsx` (novo)

- `<section id="sobre">` fundo `--breu`, `section-y`, `container-stckel`.
- Grid 12 col: coluna esquerda `span 5`, direita `span 7`, gap `clamp(32px, 5vw, 80px)`. Mobile: coluna única, imagem primeiro.
- **Esquerda — foto duotone:**
  - `<figure>` com `<img>` da equipe + camada `::after` (via wrapper div) em `--laranja` a 15%, `mix-blend-mode: multiply`.
  - `<img>` com `filter: grayscale(1) contrast(1.05)` para o preto e branco.
  - Aspect ratio 4/5, borda hairline.
- **Direita:**
  - Eyebrow mono "A STCKEL".
  - h2 curto Outfit ("Ofício que se vê na parede" — marcador).
  - 2–3 parágrafos Figtree 17px `--cal` 85%, `max-width: 60ch`, `// TODO: texto real da empresa` no topo do arquivo.
  - Assinatura: hairline superior + `<Logo />` + linha mono `CURITIBA · PR · DESDE 2000` (marcador).
  - Todo o bloco de texto marcado com `// TODO: texto real da empresa`.

### 5. `src/routes/index.tsx`

Ordem final do `<main>`:
`HeroCompare → Servicos → Metodo → Obras → SobreStckel`.

Método entre Serviços e Obras (fluxo: o que fazemos → como fazemos → o que já entregamos → quem somos).

### 6. `src/styles.css`

Adicionar bloco `/* ===== Método ===== */` com a régua horizontal/vertical, pontos e estilos da timeline. Adicionar `/* ===== Sobre ===== */` com o wrapper duotone (`.sobre-foto` + `.sobre-foto::after`).

### Fora de escopo

- Nada de animação de contagem, ícones ou cards.
- Não mexer em nav/footer/hero/serviços/obras.
- Sem alterar tokens nem tipografia.
