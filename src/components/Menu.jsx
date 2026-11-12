import { useMemo, useState } from "react";
import { MENU } from "../data/menu.js";
import MenuTabs from "./MenuTabs.jsx";
import MenuSearch from "./MenuSearch.jsx";
import DishCard from "./DishCard.jsx";

const HITS = "hits";
const TABS = [{ id: HITS, title: "★ Хиты" }, ...MENU.map(({ id, title }) => ({ id, title }))];
const TOTAL = MENU.reduce((n, c) => n + c.items.length, 0);

const normalize = (s) => s.toLowerCase().replace(/ё/g, "е");

function selectDishes(activeTab, query) {
  const q = normalize(query.trim());
  if (q) {
    return MENU.flatMap((c) =>
      c.items.filter((it) => normalize(it[0]).includes(q)).map((it) => ({ dish: it, category: c.title }))
    );
  }
  if (activeTab === HITS) {
    return MENU.flatMap((c) => c.items.filter((it) => it[3]).map((it) => ({ dish: it, category: c.title })));
  }
  return (MENU.find((c) => c.id === activeTab)?.items || []).map((it) => ({ dish: it, category: null }));
}

export default function Menu() {
  const [activeTab, setActiveTab] = useState(HITS);
  const [query, setQuery] = useState("");
  const list = useMemo(() => selectDishes(activeTab, query), [activeTab, query]);

  const selectTab = (id) => {
    setActiveTab(id);
    setQuery("");
  };

  return (
    <section className="section section--steel" id="menu">
      <div className="wrap">
        <div className="section__head">
          <p className="eyebrow">Цех №2 · Меню</p>
          <h2 className="h2">Что производим</h2>
          <p className="muted">Основное меню, {TOTAL} позиций. Цены даны по меню доставки и в зале могут немного отличаться.</p>
        </div>
        <div className="menu-tools">
          <MenuTabs tabs={TABS} activeTab={activeTab} highlight={!query} onSelect={selectTab} />
          <MenuSearch value={query} onChange={setQuery} />
        </div>
        {/* key restarts the card entrance animation when the tab or search changes */}
        <div className="menu-grid" role="tabpanel" aria-live="polite" key={`${activeTab}|${query}`}>
          {list.length ? (
            list.map(({ dish, category }, i) => (
              <DishCard key={`${category}-${dish[0]}`} dish={dish} index={i} category={category} />
            ))
          ) : (
            <p className="menu-empty">Ничего не нашлось. Спросите у официанта, может быть, это блюдо есть в сезонном меню.</p>
          )}
        </div>
      </div>
    </section>
  );
}
