import logoAsset from "@/assets/stckel-logo-transparent.png.asset.json";

type LogoProps = {
  className?: string;
  height?: number;
};

export function Logo({ className, height = 22 }: LogoProps) {
  // proporção da imagem: 1589 x 480 ≈ 3.31
  const width = Math.round(height * (1589 / 480));
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
