# Melhorar legibilidade do hero

Todos os textos sobre a imagem estão com contraste fraco: subtítulo e métricas em `--grafite` (#8B8B93), gradiente cobrindo só o terço inferior e H1 em uppercase muito apertado no Outfit.

## Ajustes em `src/components/site/HeroCompare.tsx`

**Gradiente de contraste (linha ~250):** ampliar a área escurecida e intensificar o breu no rodapé, para dar base sólida ao texto.
- de: `transparent 0% → transparent 30% → breu 55% @65% → breu 85% @100%`
- para: `transparent 0% → breu 20% @35% → breu 70% @65% → breu 92% @100%`

**Eyebrow "Curitiba · Região Metropolitana":** trocar `color: --grafite` por `--cal` com opacidade 85% (`color-mix(in oklab, var(--color-cal) 85%, transparent)`).

**H1:** manter Outfit mas
- remover `textTransform: uppercase` (Outfit institucional lê melhor em Title Case),
- trocar texto para Title Case: "A diferença está na preparação",
- `line-height: 1.05`, `font-weight: 600`, `letter-spacing: -0.02em`,
- adicionar leve `text-shadow: 0 2px 24px color-mix(in oklab, var(--color-breu) 60%, transparent)` para descolar da imagem.

**Parágrafo lead:** trocar `--grafite` por `--cal` puro, `font-weight: 400`, `font-size: clamp(1.05rem, 0.9rem + 0.6vw, 1.25rem)` (estava fixo em 1.375rem, grande demais em telas médias e cansando a leitura).

**Métricas do rodapé (ul):** trocar `--grafite` por `--cal` a 90%, aumentar `font-size` para 13px, e trocar o separador `|` de `--hairline` (quase invisível) para `--laranja` a 60%.

**Chips "Antes/Depois":** aumentar o fundo do chip "Antes" de 70% para 85% de breu para não sumir sobre a foto clara.

**Botão secundário WhatsApp:** subir a borda de 24% para 55% de cal, para o CTA secundário parar de desaparecer.

## Fora de escopo

- Não mexer no comparador, nas imagens, no slider, nas animações nem no layout geral.
- Sem trocar fontes (Outfit + Figtree já aprovadas).
