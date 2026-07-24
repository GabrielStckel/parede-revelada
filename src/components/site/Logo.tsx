import logoAsset from "@/assets/stckel-logo-transparent.png.asset.json";

type LogoProps = {
  className?: string;
  height?: number;
};

export function Logo({ className, height = 22 }: LogoProps) {
  // proporção da imagem: 1695 x 514 ≈ 3.297
  const width = Math.round(height * (1695 / 514));
  return (
    <img
      src={logoAsset.url}
      alt="Stckel Pinturas"
      className={className}
      width={width}
      height={height}
      style={{ height: `${height}px`, width: "auto", display: "block" }}
      loading="eager"
      decoding="async"
    />
  );
}
