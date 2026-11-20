type CraneIllustrationProps = {
  className?: string;
};

/**
 * Decorative line-art crane used on the right side of the hero.
 * The stroke uses `currentColor`, so set the colour with a `text-*` class.
 */
export function CraneIllustration({ className }: CraneIllustrationProps) {
  return (
    <svg
      viewBox="0 0 500 720"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {/* Horizontal boom */}
      <path d="M0 100H388" />

      {/* A-frame on top of the mast */}
      <path d="M310 55H430L370 100Z" />

      {/* Mast (runs off the bottom of the hero) */}
      <path d="M352 100V720M388 100V720" />
      <path d="M352 145H388M352 190H388M352 235H388M352 280H388M352 325H388M352 370H388M352 415H388M352 460H388M352 505H388M352 550H388M352 595H388M352 640H388M352 685H388" />

      {/* Hoist line and bucket */}
      <path d="M80 100V196" />
      <rect x="68" y="196" width="24" height="24" />
    </svg>
  );
}
