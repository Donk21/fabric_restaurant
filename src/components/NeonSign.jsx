// Неоновая вывеска: светящаяся «трубка» с редким мерцанием.
// Мерцают отдельные буквы, как у настоящей неоновой вывески с уставшим участком трубки.
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
