import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMenu } from "../hooks/useMenu.js";
import GearSprite from "./GearSprite.jsx";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import CategoryNav from "./CategoryNav.jsx";
import MenuSearch from "./MenuSearch.jsx";
import DishCard from "./DishCard.jsx";
import MobileBookingBar from "./MobileBookingBar.jsx";

const normalize = (s) => s.toLowerCase().replace(/ё/g, "е");

function filterMenu(categories, query) {
  const q = normalize(query.trim());
  if (!q) return categories;
  return categories
    .map((c) => ({ ...c, items: c.items.filter((d) => normalize(d.name).includes(q)) }))
    .filter((c) => c.items.length);
}

/**
 * Tracks which category section is currently under the sticky toolbar.
 * select(id) marks a chip active right away and pauses the scroll-spy until the
 * page stops scrolling, so the bar doesn't flick through every section on the way.
 */
function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  const locked = useRef(false);
  const key = ids.join("|");

  const select = useCallback((id) => {
    setActive(id);
    locked.current = true;
    let timer;
    const release = () => {
      locked.current = false;
      window.removeEventListener("scroll", onScroll);
    };
    const onScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(release, 150);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    timer = setTimeout(release, 400); // in case the page doesn't need to scroll at all
  }, []);

  useEffect(() => {
    if (!ids.length) return;
    setActive((cur) => (ids.includes(cur) ? cur : ids[0]));
    if (!("IntersectionObserver" in window)) return;
    const visible = new Set();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target.dataset.id) : visible.delete(e.target.dataset.id)));
        if (locked.current) return;
        const first = ids.find((id) => visible.has(id));
        if (first) setActive(first);
      },
      // A thin band just below the header + category bar
      { rootMargin: "-150px 0px -65% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(`cat-${id}`);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [active, select];
}

export default function MenuPage() {
  const { status, categories } = useMenu();
  const [query, setQuery] = useState("");
  const shown = useMemo(() => filterMenu(categories, query), [categories, query]);
  const [active, selectSection] = useActiveSection(shown.map((c) => c.id));
  const total = categories.reduce((n, c) => n + c.items.length, 0);

  return (
    <>
      <GearSprite />
      <Header page="menu" />
      <main className="menu-page">
        <section className="menu-page__head">
          <div className="wrap">
            <p className="eyebrow">Цех №2 · Меню</p>
            <h1 className="h2">Что производим</h1>
            <p className="muted">
              {status === "ready" ? `Основное меню, ${total} позиций. ` : ""}
              Цены даны по меню доставки и в зале могут немного отличаться.
            </p>
          </div>
        </section>

        <div className="menu-bar">
          <div className="wrap menu-bar__inner">
            <CategoryNav categories={shown} activeId={active} onSelect={selectSection} />
            <MenuSearch value={query} onChange={setQuery} />
          </div>
        </div>

        <div className="wrap menu-page__body" aria-live="polite">
          {status === "loading" && <p className="menu-empty">Загружаем меню…</p>}
          {status === "error" && <p className="menu-empty">Не удалось загрузить меню. Обновите страницу или позвоните нам.</p>}
          {status === "ready" && !shown.length && (
            <p className="menu-empty">Ничего не нашлось. Спросите у официанта, может быть, это блюдо есть в сезонном меню.</p>
          )}
          {shown.map((c) => (
            <section key={c.id} id={`cat-${c.id}`} data-id={c.id} className="menu-cat" aria-labelledby={`cat-${c.id}-title`}>
              <h2 className="menu-cat__title" id={`cat-${c.id}-title`}>
                {c.title}
                <span className="menu-cat__count">{c.items.length}</span>
              </h2>
              <div className="dish-grid">
                {c.items.map((d) => <DishCard key={d.id} dish={d} />)}
              </div>
            </section>
          ))}
        </div>
      </main>
      <Footer year={new Date().getFullYear()} />
      <MobileBookingBar href="./#booking" />
    </>
  );
}
