export default function Checkbox({ name, checked, onChange, children }) {
  return (
    <label className="check">
      <input type="checkbox" name={name} checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{children}</span>
    </label>
  );
}
