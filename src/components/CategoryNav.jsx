import { useEffect, useRef } from "react";

// Sticky chip bar of menu categories. Chips are anchor links to the category sections;
// the active chip follows scrolling (scroll-spy) and is kept visible in the horizontal strip.
export default function CategoryNav({ categories, activeId }) {
  const listRef = useRef(null);

  useEffect(() => {
    const chip = listRef.current?.querySelector(`[data-id="${activeId}"]`);
    if (!chip) return;
    const list = listRef.current;
    const left = chip.offsetLeft - (list.clientWidth - chip.offsetWidth) / 2;
    list.scrollTo({ left, behavior: "smooth" });
  }, [activeId]);

  return (
    <nav className="cat-nav" aria-label="Категории меню">
      <ul className="cat-nav__list" ref={listRef}>
        {categories.map((c) => (
          <li key={c.id}>
            <a
              href={`#cat-${c.id}`}
              data-id={c.id}
              className="cat-nav__chip"
              aria-current={c.id === activeId ? "true" : undefined}
            >
              {c.title}
              <span className="cat-nav__count">{c.items.length}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
