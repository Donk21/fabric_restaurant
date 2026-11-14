// Hookah smoke in the hero section.
// Puffs are blurred ellipses distorted by feTurbulence + feDisplacementMap noise.
// The filter is rasterized once (the SVG is static); only transform/opacity of the
// wrappers are animated, so the effect stays cheap even on phones.

const LAYERS = [
  {
    // Warm smoke lit by Edison bulbs — bottom of the screen
    color: "#f0c48e",
    freq: "0.009 0.016",
    seed: 4,
    scale: 170,
    puffs: [
      { cx: 180, cy: 470, rx: 260, ry: 120 },
      { cx: 520, cy: 520, rx: 300, ry: 110 },
      { cx: 760, cy: 430, rx: 180, ry: 140 },
    ],
  },
  {
    // Puff lit by yellow neon, rising on the right
    color: "#ffd23f",
    freq: "0.011 0.02",
    seed: 11,
    scale: 200,
    puffs: [
      { cx: 620, cy: 300, rx: 220, ry: 170 },
      { cx: 380, cy: 380, rx: 160, ry: 90 },
    ],
  },
  {
    // Thin wisps along the top edge
    color: "#ddd6cc",
    freq: "0.014 0.026",
    seed: 27,
    scale: 230,
    puffs: [
      { cx: 250, cy: 160, rx: 200, ry: 70 },
      { cx: 640, cy: 110, rx: 240, ry: 60 },
    ],
  },
];

function SmokeLayer({ layer, index }) {
  const gradId = `hero-smoke-grad-${index}`;
  const filterId = `hero-smoke-filter-${index}`;
  return (
    <div className={`hero-smoke__layer hero-smoke__layer--${index + 1}`}>
      <svg viewBox="0 0 900 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id={gradId}>
            <stop offset="0%" stopColor={layer.color} stopOpacity="0.9" />
            <stop offset="45%" stopColor={layer.color} stopOpacity="0.45" />
            <stop offset="100%" stopColor={layer.color} stopOpacity="0" />
          </radialGradient>
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency={layer.freq} numOctaves="4" seed={layer.seed} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={layer.scale} xChannelSelector="R" yChannelSelector="G" result="wisps" />
            <feGaussianBlur in="wisps" stdDeviation="5" />
          </filter>
        </defs>
        <g filter={`url(#${filterId})`}>
          {layer.puffs.map((p, i) => (
            <ellipse key={i} {...p} fill={`url(#${gradId})`} />
          ))}
        </g>
      </svg>
    </div>
  );
}

export default function HeroSmoke() {
  return (
    <div className="hero-smoke" aria-hidden="true">
      {LAYERS.map((layer, i) => (
        <SmokeLayer key={i} layer={layer} index={i} />
      ))}
    </div>
  );
}
