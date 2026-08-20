interface BrandMarkProps {
  size?: number;
}

// Two-tone bag icon — blue on the left half, silver on the right — with a
// dark rounded handle. Mirrors public/favicon.svg so the in-app logo and
// the browser tab icon match.
export default function BrandMark({ size = 28 }: BrandMarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <clipPath id="brandMarkBagClip">
          <path d="M12,17 L36,17 L38.6,40.2 a3.2,3.2 0 0 1 -3.2,3.6 H12.6 a3.2,3.2 0 0 1 -3.2,-3.6 L12,17 Z" />
        </clipPath>
      </defs>
      <g clipPath="url(#brandMarkBagClip)">
        <rect x="0" y="0" width="24" height="48" fill="#2F5EE8" />
        <rect x="24" y="0" width="24" height="48" fill="#C7CCD4" />
      </g>
      <path
        d="M17.5,17 v-3.2 a6.5,6.5 0 0 1 13,0 v3.2"
        fill="none"
        stroke="#14181F"
        strokeWidth={2.8}
        strokeLinecap="round"
      />
    </svg>
  );
}
