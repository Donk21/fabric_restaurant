export default function GuestStepper({ id, name, value, min, max, onChange }) {
  const step = (delta) => onChange(Math.min(max, Math.max(min, (+value || 0) + delta)));
  return (
    <div className="stepper">
      <button type="button" aria-label="Меньше гостей" onClick={() => step(-1)}>−</button>
      <input
        id={id}
        name={name}
        type="number"
        min={min}
        max={max}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button type="button" aria-label="Больше гостей" onClick={() => step(1)}>+</button>
    </div>
  );
}
