/**
 * Inline SVG for the landing hero — abstract houses and exchange paths,
 * editorial line-art style (no external assets).
 */
export function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 440 360"
      className="h-auto w-full max-w-md text-[var(--brand)]"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="dabble-hero-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.08" />
        </linearGradient>
      </defs>
      <rect width="440" height="360" rx="24" fill="url(#dabble-hero-grad)" />
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      >
        <path d="M60 260 L120 200 L180 260 Z" />
        <path d="M120 200 L120 150 L180 150 L180 200" />
        <path d="M200 270 L280 190 L360 270 Z" />
        <path d="M280 190 L280 130 L340 130 L340 190" />
        <path d="M100 290 L340 290" strokeOpacity="0.4" />
        <circle cx="220" cy="120" r="36" strokeOpacity="0.5" />
        <path d="M196 120 L214 138 L252 100" strokeOpacity="0.6" />
        <path d="M140 120 Q220 60 300 120" strokeOpacity="0.35" />
        <path d="M160 200 Q220 240 280 200" strokeOpacity="0.3" />
      </g>
    </svg>
  );
}
