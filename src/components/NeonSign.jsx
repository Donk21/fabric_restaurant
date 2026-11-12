// Neon sign: a glowing "tube" with an occasional flicker.
// Only selected letters flicker, like a real neon sign with a worn-out tube section.
export default function NeonSign({ children, flickerAt = [] }) {
  const text = String(children);
  return (
    <p className="neon-sign" aria-label={text}>
      <span aria-hidden="true">
        {[...text].map((ch, i) => (
          <span key={i} className={flickerAt.includes(i) ? "neon-sign__flicker" : undefined}>{ch}</span>
        ))}
      </span>
    </p>
  );
}
