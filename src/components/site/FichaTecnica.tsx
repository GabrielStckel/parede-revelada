import type { Obra } from "@/data/obras";

type Props = {
  obra: Obra;
  variant?: "card" | "lightbox";
};

const ROWS: { label: string; key: "local" | "sistema" | "area" | "prazo" }[] = [
  { label: "LOCAL", key: "local" },
  { label: "SISTEMA", key: "sistema" },
  { label: "ÁREA", key: "area" },
  { label: "ENTREGA", key: "prazo" },
];

export function FichaTecnica({ obra, variant = "card" }: Props) {
  const isLightbox = variant === "lightbox";
  return (
    <dl
      className="ficha"
      style={{
        margin: 0,
        display: "grid",
        gridTemplateColumns: "88px 1fr",
        rowGap: isLightbox ? 10 : 6,
        columnGap: 16,
        paddingBlock: isLightbox ? 0 : 14,
        borderTop: isLightbox
          ? "none"
          : "1px solid var(--color-hairline)",
      }}
    >
      {ROWS.map((r) => (
        <div key={r.key} style={{ display: "contents" }}>
          <dt
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--color-grafite)",
              margin: 0,
            }}
          >
            {r.label}
          </dt>
          <dd
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "var(--color-cal)",
              margin: 0,
              lineHeight: 1.45,
            }}
          >
            {obra[r.key]}
          </dd>
        </div>
      ))}
    </dl>
  );
}
