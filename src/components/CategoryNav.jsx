import { useCallback, useEffect, useRef, useState } from "react";

const DRAG_THRESHOLD = 5;

// Sticky chip bar of menu categories. Chips are anchor links to the category sections;
// the active chip follows scrolling (scroll-spy) and is kept visible in the horizontal strip.
// On desktop the strip scrolls with the mouse wheel, by dragging, and with arrow buttons.
export default function CategoryNav({ categories, activeId, onSelect }) {
  const listRef = useRef(null);
  const busyUntil = useRef(0); // the user is scrolling the strip by hand: don't auto-center
  const [edges, setEdges] = useState({ start: false, end: false });

  const updateEdges = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const start = el.scrollLeft > 1;
    const end = el.scrollLeft < max - 1;
    setEdges((cur) => (cur.start === start && cur.end === end ? cur : { start, end }));
  }, []);

  // Keep the active chip in view
  useEffect(() => {
    const list = listRef.current;
    const chip = list?.querySelector(`[data-id="${activeId}"]`);
    if (!chip || Date.now() < busyUntil.current) return;
    const left = chip.offsetLeft - (list.clientWidth - chip.offsetWidth) / 2;
    list.scrollTo({ left, behavior: "smooth" });
  }, [activeId]);

  // Edge state for the arrows and fades
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    updateEdges();
    el.addEventListener("scroll", updateEdges, { passive: true });
    const ro = "ResizeObserver" in window ? new ResizeObserver(updateEdges) : null;
    ro?.observe(el);
    return () => {
      el.removeEventListener("scroll", updateEdges);
      ro?.disconnect();
    };
  }, [updateEdges, categories.length]);

  // Vertical mouse wheel scrolls the strip horizontally (until it hits an edge)
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const onWheel = (e) => {
      if (e.ctrlKey || Math.abs(e.deltaX) >= Math.abs(e.deltaY)) return;
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;
      if ((e.deltaY < 0 && el.scrollLeft <= 0) || (e.deltaY > 0 && el.scrollLeft >= max - 1)) return;
      e.preventDefault();
      const unit = e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? el.clientWidth : 1;
      el.scrollLeft += e.deltaY * unit;
      busyUntil.current = Date.now() + 800;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Drag to scroll with the mouse (touch already scrolls natively)
  const drag = useRef(null);
  const onPointerDown = (e) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    drag.current = { x: e.clientX, left: listRef.current.scrollLeft, moved: false, id: e.pointerId };
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d || e.pointerId !== d.id) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) < DRAG_THRESHOLD) return;
    if (!d.moved) {
      d.moved = true;
      listRef.current.setPointerCapture(d.id);
      listRef.current.classList.add("is-dragging");
    }
    listRef.current.scrollLeft = d.left - dx;
    busyUntil.current = Date.now() + 800;
  };
  const endDrag = () => {
    const d = drag.current;
    if (!d) return;
    listRef.current.classList.remove("is-dragging");
    // Swallow the click that follows a drag so it doesn't jump to a section
    if (d.moved) setTimeout(() => (drag.current = null), 0);
    else drag.current = null;
  };
  const onClickCapture = (e) => {
    if (drag.current?.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const page = (dir) => {
    const el = listRef.current;
    busyUntil.current = Date.now() + 800;
    el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: "smooth" });
  };

  return (
    <nav
      className="cat-nav"
      aria-label="Категории меню"
      data-start={edges.start || undefined}
      data-end={edges.end || undefined}
    >
      <button type="button" className="cat-nav__arrow cat-nav__arrow--prev" tabIndex={-1} aria-hidden="true" onClick={() => page(-1)}>
        ‹
      </button>
      <ul
        className="cat-nav__list"
        ref={listRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
      >
        {categories.map((c) => (
          <li key={c.id}>
            <a
              href={`#cat-${c.id}`}
              data-id={c.id}
              className="cat-nav__chip"
              draggable={false}
              aria-current={c.id === activeId ? "true" : undefined}
              onClick={() => onSelect?.(c.id)}
            >
              {c.title}
              <span className="cat-nav__count">{c.items.length}</span>
            </a>
          </li>
        ))}
      </ul>
      <button type="button" className="cat-nav__arrow cat-nav__arrow--next" tabIndex={-1} aria-hidden="true" onClick={() => page(1)}>
        ›
      </button>
    </nav>
  );
}
