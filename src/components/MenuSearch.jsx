export default function MenuSearch({ value, onChange }) {
  return (
    <label className="menu-search">
      <span className="visually-hidden">Поиск по меню</span>
      <input
        type="search"
        placeholder="Найти блюдо…"
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
