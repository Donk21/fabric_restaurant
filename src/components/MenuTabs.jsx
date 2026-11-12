export default function MenuTabs({ tabs, activeTab, highlight, onSelect }) {
  return (
    <div className="menu-tabs" role="tablist" aria-label="Категории меню">
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          type="button"
          aria-selected={highlight && t.id === activeTab}
          onClick={() => onSelect(t.id)}
        >
          {t.title}
        </button>
      ))}
    </div>
  );
}
