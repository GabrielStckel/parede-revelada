## Etapa 7 — SEO, A11y, Performance, Consistência, Autocrítica

Sem seções novas. Só rigor sobre o que já existe.

### 1. SEO (`src/routes/__root.tsx` + `src/routes/index.tsx`)

**Root** — só defaults sitewide: viewport, charSet, theme-color, `og:type: website`, `og:site_name: Stckel Pinturas`, `og:locale: pt_BR`, favicon. Remover title/description do root (para não competir com o leaf).

**Index** (`/`) — leaf com foco em Curitiba:
- `title`: "Stckel Pinturas em Curitiba — Fachada, textura grafiato e revestimentos" (≤60c).
- `description`: menciona pintor em Curitiba, textura grafiato e pintura de fachada em uma frase natural (≤160c).
- `og:title`, `og:description`, `og:url` (`https://stckelpinturas.com.br/`), `og:image` = URL absoluta da hero-depois (usar `new URL('@/assets/hero-depois.jpg', ...)` resolvido no build via `import`), `og:image:alt`.
- `twitter:card: summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image`.
- `links`: `<link rel="canonical" href="https://stckelpinturas.com.br/">`.
- `scripts`: JSON-LD `LocalBusiness` subtipo `HousePainter`:
  ```json
  {
    "@context": "https://schema.org",
    "@type": "HousePainter",
    "name": "Stckel Pinturas",
    "url": "https://stckelpinturas.com.br",
    "image": "https://stckelpinturas.com.br/<hero>",
    "telephone": "+55 41 99815-5076",
    "address": { "@type": "PostalAddress", "addressLocality": "Curitiba", "addressRegion": "PR", "addressCountry": "BR" },
    "areaServed": ["Curitiba", "Região Metropolitana de Curitiba"],
    "openingHoursSpecification": [{ "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "08:00", "closes": "18:00" }],
    "sameAs": ["https://www.instagram.com/stckelpinturas"],
    "priceRange": "$$"
  }
  ```

**Ajustes de copy** (leves, sem repetição forçada) — inserir os termos-chave 1× cada:
- Hero H1/parágrafo: manter, mas o subtítulo passa a citar "pintura de fachada em Curitiba".
- Serviços eyebrow: "Pintura, textura grafiato e revestimentos · Curitiba/PR".
- Sobre: primeiro parágrafo cita "pintor em Curitiba desde 2000".
Termos naturais, sem stuffing.

**`public/robots.txt`** e **`public/sitemap.xml`**: criar com uma entrada `/` e o `Sitemap:` apontando para `https://stckelpinturas.com.br/sitemap.xml`. Rodar `seo--trigger_scan` no fim.

### 2. Acessibilidade

**Landmarks:** cada `<section>` recebe `aria-labelledby` apontando para o id do próprio `<h2>` (adicionar `id="titulo-servicos"`, `titulo-obras`, `titulo-metodo`, `titulo-sobre`, `titulo-contato`). Hero já usa `aria-label`. `<main>` já é único.

**Skip-link:** já existe e funcional; conferir que aparece antes de qualquer conteúdo interativo (está).

**Hierarquia:** hoje temos h1 (hero) → h2 (seções) → h3 (linhas de Serviços via `linha-head`). Ficha técnica das obras usa texto solto — sem novos headings, ok. Auditar se algum h4 pulou; não vi nenhum, só confirmar.

**Contraste AA (verificar par a par):**
- `--cal` sobre `--breu`: passa (F2EFEA em 0B0B0C ~17:1).
- `--grafite` sobre `--concreto`/`--breu`: 8B8B93 em 16161A ≈ 3.6:1 — **falha** para texto normal (<4.5). Corrigir subindo para `#A6A6AC` só para uso de corpo (parágrafos de Serviços, filtros inativos, `aplicacao`). Manter `--grafite` original como token, criar `--color-grafite-strong` para texto.
- `--laranja` sobre `--breu`: F57C1F em 0B0B0C ≈ 5.4:1 — passa AA para texto normal.
- `--breu` sobre `--laranja` (botão): passa 5.4:1.
- Botão outline do hero: borda em `--cal 55%` — ok visualmente; label em `--cal` 100% passa.

**Foco visível:** `:focus-visible` global 2px laranja + 2px offset já existe. Verificar que nenhum componente sobrescreve (`.linha-inner`, `.obras-filtro`, `.obra-cta`, FAB do WhatsApp). Adicionar `outline-offset: 4px` para o slider do hero (senão colide com o handle).

**Teclado:** revalidar sequência Nav → Hero (slider, CTAs) → filtros de Obras (setas ↔ opcional; foco tab OK) → cards (button) → Contato (form) → FAB. Lightbox já tem focus-trap. Slider do hero tem setas/Home/End. Menu mobile tem trap. Adicionar `aria-label` na região de scroll de Obras (`.obras-scroll` recebe `role="region"` + `aria-label="Rolar galeria de obras"` + `tabindex="0"` para poder rolar por teclado).

### 3. Performance

**Fontes:** `preconnect` já configurado para `fonts.googleapis.com` e `fonts.gstatic.com`; `display=swap` já na URL. OK.

**Preload LCP:** adicionar em `head().links` da rota `/`: `{ rel: "preload", as: "image", href: heroDepoisUrl, fetchpriority: "high" }` (o "depois" é o que aparece mais em tela).

**Lazy + dimensões:** auditar todos os `<img>`:
- Hero antes/depois: **eager** com `width`/`height` explícitos (já tem). Adicionar `fetchpriority="high"` no `hero-depois`.
- Serviços thumbs (ThumbFollower): garantir `loading="lazy"` + `width/height`.
- Obras thumbs: já `loading="lazy"` + `width/height`.
- Lightbox: `loading="eager"` só no ativo (já feito).
- Sobre (foto equipe): `loading="lazy"` + `width/height` + `decoding="async"`.

**O que ainda pesa (honesto):**
- 2 JPGs de fachada no hero (~1.8k×1k cada) — impacto real no LCP mobile. Sem imagetools instalado, ficam JPG. Anotar como próximo passo real: converter para AVIF/WebP com `vite-imagetools` (fora do escopo desta etapa, mas apontado).
- `framer-motion` no bundle só para os filtros de Obras — pesa ~40KB gzip. Vale a pena, mas é o maior peso JS do site.
- Google Fonts com 4 pesos de Outfit + 3 de Figtree. Reduzir Outfit para 500/600 e Figtree para 400/500 corta ~30% do CSS de fontes.

### 4. Auditoria de consistência

**Hex fora dos tokens:** só encontrei `#000` no `mask-image` de `.obras-scroll` (obrigatório — máscara é luminância, precisa opaco) e `#0B0B0C` no `theme-color` meta (aceitável, mas trocar por leitura do token via style não vale a pena aqui). Nenhum hex ilegítimo em componentes. ✅

**Padding de seção:** todas as seções usam `section-y` (Serviços, Obras, Método, Sobre, Contato, Footer). ✅ Hero é exceção intencional (92vh full-bleed).

**Box-shadow:**
- `HeroCompare` handle: box-shadow duplo em cores derivadas do token — vale (feedback visual do handle). Manter.
- `Contato.tsx:311` FAB do WhatsApp: `rgba(0,0,0,0.35)` — **corrigir** para `color-mix(in oklab, var(--color-breu) 45%, transparent)`. Único uso de rgba cru.
- Toda a família `src/components/ui/*`: shadcn defaults, não usadas nas seções do site — não tocar (não renderizam no site).

**Área de laranja:** contabilizar em cada tela:
- Hero: divisor 2px + handle 40px + chip "Depois" (~110×28) + CTA primário (~180×48) + separadores mono (2 barrinhas finas) = ~1.5% da tela.
- Serviços: nomes ficam laranja **só quando abertos ou hover** — no estado default 0%. Um aberto = 1 título laranja ≈ 0.4%.
- Obras: eyebrow + filtro ativo (~1 pill) = ~0.5%.
- Método: 4 índices "01–04" grandes em laranja — **~3.5%** no desktop, encostando no limite. Aceitável, é o único uso decorativo forte.
- Sobre: nenhum. Contato: eyebrow + botão Enviar + labels de canais em mono laranja (5 curtos). ~1.2%.
- FAB fixo: 56×56 sempre — ~0.4% em desktop, ~1.5% em mobile.
Total por viewport fica ≤4%, exceto na dobra do Método (~4.5% se somar FAB). Manter, mas remover o `background` mono laranja das labels de canais em Contato (trocar para `--grafite-strong`), o que traz a média para ~3.8%.

### 5. Autocrítica — o que eu mudaria

**Em 360px:**
1. Hero está denso demais: H1 + parágrafo + 2 CTAs + 3 métricas empilhadas no terço inferior consome ~55vh sobre o gradiente. Remover a linha de métricas no mobile (mover para depois do hero ou para a seção Sobre).
2. Botões do hero quebram em duas linhas de largura desigual — dar `width: 100%` a ambos em `<640px` e empilhar sem `flex-wrap`.
3. Chips "Antes/Depois" ficam pequenos demais (11px) e colam nas margens em telas estreitas — subir para 12px e afastar para `left/right: 12px`.
4. Filtros de Obras somam 5 pills em `flex-wrap` e passam a duas linhas — assumir scroll horizontal com `snap` e `-webkit-overflow-scrolling`, sem quebrar linha.
5. Grid de Obras em 2 colunas × 8 cards + ficha técnica embaixo de cada uma torna a rolagem interna de 70vh sufocante. Em mobile, virar 1 coluna e desligar o `.obras-scroll` (deixar a seção expandir).
6. Método vertical funciona, mas os números "01–04" em ~40px + título + descrição sem separador visual entre passos vira massa. Adicionar régua vertical mais explícita e `gap` maior entre passos.
7. Sobre: foto 4/5 + parágrafos empilhados = seção comprida demais. Cortar para 3 parágrafos e reduzir altura da foto para 3/4.
8. FAB do WhatsApp cobre o botão "Enviar" do formulário quando o teclado abre — dar `bottom: calc(1rem + env(safe-area-inset-bottom))` e ocultar quando `.contato-form` estiver em foco (via `:focus-within` no ancestral).

**Em 1440px:**
1. Container 1240px + hero full-bleed cria salto ótico brusco entre hero e Serviços (borda invisível). Adicionar hairline no topo de Serviços.
2. H1 do hero em `clamp(..., 6rem)` fica gigante e sobra espaço vazio à direita — travar em `max-width: 22ch` e reduzir para `5rem`.
3. Método com timeline horizontal em 4 colunas: descrições curtas deixam a régua com muito ar. Aumentar `letter-spacing` do título e alinhar descrições em `max-width: 24ch`.
4. Obras em 4 colunas × cards `aspect 4/3` + scroll interno faz a seção parecer um "widget" e não uma galeria. Ou remove o scroll no desktop, ou aumenta `max-height` para 85vh e deixa 3 colunas.
5. Sobre em 5/7 col deixa a coluna direita com linha de 80ch — encurtar para `max-width: 58ch` para ritmo de leitura.
6. Contato: form ocupa 6 col enquanto lista de canais fica com 4 col e muito ar vertical. Balancear em 5/7 com canais em 5.
7. Footer com CNPJ + copyright + menu resumido tem 4 blocos que ficam com espaçamento genérico. Voltar para 3 colunas com hairline vertical entre elas.
8. Consistência de eyebrow: alguns em `--laranja`, outros em `--grafite`. Padronizar: laranja só onde é âncora forte (Obras, Método, Contato); Serviços e Sobre em `--grafite-strong`.

### Fora de escopo (registrado, não feito nesta etapa)

- Conversão de JPG para AVIF/WebP via `vite-imagetools`.
- Redução do bundle removendo `framer-motion` das transições de filtro (substituir por CSS `View Transitions API` quando estável).
- Trocar Google Fonts por self-host via `@fontsource-variable/outfit`/`figtree` para eliminar 3rd-party DNS.

### Arquivos que serão tocados

- `src/routes/__root.tsx` — head enxuto, remover title/description globais.
- `src/routes/index.tsx` — head completo com meta + JSON-LD + preload LCP.
- `src/styles.css` — novo token `--color-grafite-strong`, focus-offset do slider, ajustes de filtros mobile, `.obras-scroll` desligado <768px, ajustes de eyebrow.
- `src/components/site/{Servicos,Obras,Metodo,SobreStckel,Contato}.tsx` — `<h2 id>` + `aria-labelledby` no `<section>`, eyebrow padronizado, copy com termos-chave.
- `src/components/site/Contato.tsx` — box-shadow do FAB via token, labels de canais sem fundo laranja, `:focus-within` para esconder FAB, ajuste bottom com safe-area.
- `src/components/site/HeroCompare.tsx` — subtítulo com termo-chave, botões 100% no mobile, remover métricas no mobile, chips maiores, `fetchpriority` no depois.
- `public/robots.txt`, `public/sitemap.xml` — criar.
- Rodar `seo--trigger_scan` ao final.
