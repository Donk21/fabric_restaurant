import { useCallback, useEffect, useRef, useState } from "react";
import Lightbox from "./Lightbox.jsx";

// One photo in view at a time, snap-scrolling to the others; a click opens the full-screen viewer.
export default function PhotoStrip({ photos }) {
  const listRef = useRef(null);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(null);
  const count = photos.length;

  // Active card = the one whose left edge is closest to the list's snap edge
  const updateActive = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    const edge = el.getBoundingClientRect().left + (parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0);
    const dist = [...el.children].map((item) => Math.abs(item.getBoundingClientRect().left - edge));
    setActive(dist.indexOf(Math.min(...dist)));
  }, []);

  useEffect(() => {
    const el = listRef.current;
    updateActive();
    el.addEventListener("scroll", updateActive, { passive: true });
    const ro = new ResizeObserver(updateActive);
    ro.observe(el);
    return () => { el.removeEventListener("scroll", updateActive); ro.disconnect(); };
  }, [updateActive]);

  const goTo = (i) => {
    const el = listRef.current;
    const item = el?.children[i];
    if (item) el.scrollTo({ left: item.offsetLeft - el.firstElementChild.offsetLeft, behavior: "smooth" });
  };

  // Keep the strip in sync with the viewer so closing lands on the last viewed photo
  const show = (i) => { setOpen(i); goTo(i); };

  return (
    <div className="strip">
      <div className="strip__viewport">
        <ul className="strip__list" ref={listRef} aria-label="Фотографии ресторана">
          {photos.map((p, i) => (
            <li key={p.src} className="strip__item">
              <button type="button" className="plate strip__btn" onClick={() => show(i)} aria-label={`Открыть фото: ${p.alt}`}>
                {/* Blurred copy fills the sides of the wide desktop frame */}
                <img className="strip__bg" src={p.src} alt="" aria-hidden="true" loading="lazy" />
                <img className="strip__img" src={p.src} alt={p.alt} loading="lazy" width="768" height="1024" />
                <span className="strip__zoom" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>
                </span>
              </button>
            </li>
          ))}
        </ul>
        {count > 1 && (
          <>
            <button type="button" className="strip__arrow strip__arrow--prev" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Предыдущее фото">‹</button>
            <button type="button" className="strip__arrow strip__arrow--next" onClick={() => goTo(active + 1)} disabled={active === count - 1} aria-label="Следующее фото">›</button>
          </>
        )}
      </div>
      {count > 1 && (
        <div className="strip__dots">
          {photos.map((p, i) => (
            <button
              key={p.src}
              type="button"
              className={`strip__dot${i === active ? " is-active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Фото ${i + 1} из ${count}`}
              aria-current={i === active || undefined}
            />
          ))}
        </div>
      )}
      {open !== null && (
        <Lightbox photos={photos} index={open} onChange={show} onClose={() => setOpen(null)} />
      )}
    </div>
  );
}
