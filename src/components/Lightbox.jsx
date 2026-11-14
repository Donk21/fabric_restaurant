import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const SWIPE_PX = 50;

// Full-screen photo viewer: arrows / keyboard / swipe to navigate, Esc or backdrop to close.
export default function Lightbox({ photos, index, onChange, onClose }) {
  const closeRef = useRef(null);
  const touchX = useRef(null);
  const count = photos.length;
  const photo = photos[index];
  const go = (dir) => onChange((index + dir + count) % count);

  useEffect(() => {
    const prevFocus = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus?.({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  // Preload neighbours so switching is instant
  useEffect(() => {
    if (count < 2) return;
    [index - 1, index + 1].forEach((i) => { new Image().src = photos[(i + count) % count].src; });
  }, [index, count, photos]);

  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > SWIPE_PX) go(dx < 0 ? 1 : -1);
  };

  return createPortal(
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Просмотр фотографий"
      onClick={(e) => { if (e.target === e.currentTarget || e.target.classList.contains("lightbox__stage")) onClose(); }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="lightbox__stage">
        <img key={photo.src} className="lightbox__img" src={photo.src} alt={photo.alt} />
      </div>
      <p className="lightbox__caption">
        <span className="lightbox__count">{index + 1} / {count}</span>
        {photo.alt}
      </p>
      {count > 1 && (
        <>
          <button type="button" className="lightbox__arrow lightbox__arrow--prev" onClick={() => go(-1)} aria-label="Предыдущее фото">‹</button>
          <button type="button" className="lightbox__arrow lightbox__arrow--next" onClick={() => go(1)} aria-label="Следующее фото">›</button>
        </>
      )}
      <button type="button" className="lightbox__close" ref={closeRef} onClick={onClose} aria-label="Закрыть">×</button>
    </div>,
    document.body
  );
}
