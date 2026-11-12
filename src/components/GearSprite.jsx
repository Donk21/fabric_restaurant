// Шестерня — фирменный элемент логотипа. Определяется один раз как SVG-символ.
const TEETH = [0, 36, 72, 108, 144, 180, 216, 252, 288, 324];

export default function GearSprite() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <symbol id="gear" viewBox="-50 -50 100 100">
        <g fill="currentColor">
          {TEETH.map((deg) => (
            <rect key={deg} x="-7" y="-49" width="14" height="16" transform={`rotate(${deg})`} />
          ))}
        </g>
        <circle r="27" fill="none" stroke="currentColor" strokeWidth="13" />
        <circle r="7" fill="currentColor" />
      </symbol>
    </svg>
  );
}
