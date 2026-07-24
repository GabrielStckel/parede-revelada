## Objetivo
Reduzir peso e tempo de LCP sem trocar nenhuma imagem. Converter para WebP, servir variante mobile, priorizar corretamente e self-host das fontes.

## 1. Conversão de imagens (src/assets)
Usar `sharp` via `bunx` para gerar, a partir dos originais:
- `hero-depois.jpg` (na verdade PNG 1376×768) → `hero-depois-1600.webp` q80 + `hero-depois-800.webp` q80
- `hero-antes.jpg` (JPEG 1792×1024) → `hero-antes-1600.webp` q76 + `hero-antes-800.webp` q76
- `equipe-stckel.jpg` (JPEG 1600×1200) → `equipe-stckel-1400.webp` q80

Deletar os três `.jpg` originais após confirmar os `.webp`. Nenhum arquivo fica com extensão incoerente com o formato real.

## 2. HeroCompare.tsx
Trocar imports para os `.webp` 1600 e usar `<img srcset sizes="100vw">`:
- **Depois** (LCP): `loading="eager"`, `fetchpriority="high"`, `decoding="async"`, `srcset="…-800.webp 800w, …-1600.webp 1600w"`, `width/height` explícitos (1600×900 mantendo aspect do container atual).
- **Antes**: `loading="lazy"`, `fetchpriority="low"`, mesmo `srcset/sizes`.
Manter `aspect-ratio` já usado no palco.

## 3. SobreStckel.tsx
Import passa a `equipe-stckel-1400.webp`. Manter `loading="lazy"`, `decoding="async"`, `width={1400} height={1050}`; `<figure>` já tem `aspect-ratio` via CSS — confirmar.

## 4. Preload no head (routes/index.tsx)
Substituir o `rel="preload"` atual pelo arquivo `.webp` correto e adicionar responsive hints:
```
{ rel: "preload", as: "image",
  href: heroDepois1600,
  imagesrcset: `${heroDepois800} 800w, ${heroDepois1600} 1600w`,
  imagesizes: "100vw",
  fetchpriority: "high" }
```
Remover qualquer preload apontando para arquivo inexistente.

## 5. Self-host das fontes
Baixar via `curl` da Google Fonts API os `.woff2` latin + latin-ext para os pesos realmente usados:
- Outfit 500, 600
- Figtree 400, 500, 600

Salvar em `public/fonts/`. Em `src/styles.css`, adicionar blocos `@font-face` (com `font-display: swap`, `unicode-range` latin/latin-ext) no topo, antes de `@theme` — respeitando a regra de ordem do Tailwind v4 (imports/at-rules antes de `@theme`; `@font-face` pode ficar após os `@import` iniciais).

Em `src/routes/__root.tsx`:
- Remover os 2 `preconnect` do Google e o `<link>` para `fonts.googleapis.com/css2`.
- Adicionar um único `rel="preload" as="font" type="font/woff2" crossorigin` para o peso usado no H1 do hero (Outfit 600 latin).

JetBrains Mono não é mais usado (`--font-mono` = Figtree), então nada a baixar dele.

## 6. Layout shift
- HeroCompare já usa `IMG_W`/`IMG_H` em `width/height` — manter, atualizar para as novas dimensões (1600×900 ou reais do WebP gerado).
- SobreStckel `figure` já tem aspect-ratio no CSS — confirmar em `styles.css` e ajustar `width/height` do `<img>` para as novas 1400×1050.

## 7. Verificação
Após build:
- `ls -l` das novas `.webp` para reportar peso individual.
- Somar: 1× hero-depois-1600 + 1× hero-antes-1600 (lazy, mas conta primeira visita se logo entra em viewport pela reveal? Não entra até drag/scroll — mas na visita mobile deve carregar a 800). Reportar total realista da primeira visita mobile (hero-depois-800 + fontes + JS/CSS) e desktop (hero-depois-1600).

## Detalhes técnicos
- Ferramenta: `bunx sharp-cli` ou `node -e "const sharp=require('sharp')…"` (sharp já disponível via bunx). Fallback: `nix run nixpkgs#libwebp -- cwebp -q 80 -resize 1600 0 …`.
- Ordem no `styles.css`: `@import` primeiro, depois `@font-face`, depois `@theme` (regra do prompt sobre `@import` no topo permanece; `@font-face` não é `@import`).
- `crossorigin` obrigatório no preload de fonte mesmo same-origin.
- Não mexer em nenhum outro componente/imagem.

## Saída final
Mensagem com tabela: arquivo → peso, e soma "transferido na primeira visita" (mobile 390px e desktop).