type LogoProps = {
  className?: string;
  height?: number;
};

export function Logo({ className, height = 22 }: LogoProps) {
  return (
    <span
      className={className}
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: `${height}px`,
        lineHeight: 1,
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
        color: 'currentColor',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5ch',
      }}
      aria-label="Stckel Pinturas"
    >
      <svg
        width={height}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <rect x="2" y="2" width="20" height="20" fill="var(--color-laranja)" />
        <path d="M6 18 L18 6" stroke="var(--color-breu)" strokeWidth="2.5" />
      </svg>
      Stckel
    </span>
  );
}
