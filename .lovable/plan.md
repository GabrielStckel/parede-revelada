# Trocar tipografia para padrão institucional

## Mudança

Substituir Anton / Barlow / JetBrains Mono por **Outfit** (títulos) + **Figtree** (corpo e mono/rótulos técnicos). Mantém legibilidade institucional, sem serifa, sem cara de "brutalist de obra".

## Arquivos

### `src/routes/__root.tsx`
Trocar o `<link>` de Google Fonts:
```
https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Figtree:wght@400;500;600&display=swap
```

### `src/styles.css`
Atualizar os tokens em `@theme`:
- `--font-display: "Outfit", ui-sans-serif, system-ui, sans-serif;`
- `--font-sans: "Figtree", ui-sans-serif, system-ui, sans-serif;`
- `--font-mono: "Figtree", ui-sans-serif, system-ui, sans-serif;` (rótulos técnicos continuam usando `var(--font-mono)` — mantém letter-spacing/uppercase existentes, só muda a família)

Ajustes finos no `@layer base`:
- `h1, h2`: manter `font-family: var(--font-display)` mas subir `font-weight` para `600` e `line-height: 1` (Outfit não tem o peso condensado do Anton, então precisa de mais weight para manter presença visual).
- Manter `text-transform: uppercase` e `letter-spacing: -0.01em` nos títulos.

Não mexer em nenhum outro token, layout, cor ou animação.

## Fora de escopo

- Nenhuma mudança em componentes, layouts, cores ou comportamento.
- Nada de instalar `@fontsource-*` — mantém carregamento via `<link>` como já está no root.
