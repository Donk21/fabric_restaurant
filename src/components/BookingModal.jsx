import { useEffect, useRef } from "react";
import { CONFIG, PHONE_HREF } from "../config.js";
import { humanDate, plural } from "../utils/time.js";
import Gear from "./Gear.jsx";

function whatsappLink(data) {
  const msg = [
    "Здравствуйте! Хочу забронировать столик.",
    `Дата: ${humanDate(data.date)}, ${data.time}`,
    `Гостей: ${data.guests}`,
    `Пожелание по месту: ${data.zone}`,
    data.hookah ? "Подготовить кальян к приходу." : "",
    data.comment ? `Комментарий: ${data.comment}` : "",
    `Имя: ${data.name}, тел.: ${data.phone}`,
  ].filter(Boolean).join("\n");
  return `https://wa.me/${CONFIG.phone}?text=${encodeURIComponent(msg)}`;
}

export default function BookingModal({ booking, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!booking) return;
    closeRef.current?.focus();
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [booking, onClose]);

  if (!booking) return null;
  const { data, sent } = booking;

  return (
    <div className="modal" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal__box" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
        <Gear className="modal__gear" />
        <h3 id="modalTitle">Заявка принята</h3>
        <p className="modal__summary">
          <b>Столик</b> на {data.guests} {plural(data.guests, "гостя", "гостей", "гостей")}
          <br />
          {humanDate(data.date)}, {data.time}
        </p>
        <p className="muted small">
          {sent
            ? "Администратор перезвонит в течение 15 минут для подтверждения."
            : "Чтобы бронь точно дошла до администратора, отправьте её в WhatsApp или позвоните."}
        </p>
        <div className="modal__actions">
          <a className="btn btn--accent" href={whatsappLink(data)} target="_blank" rel="noopener">Отправить в WhatsApp</a>
          <a className="btn btn--ghost" href={PHONE_HREF}>Позвонить</a>
        </div>
        <button className="modal__close" ref={closeRef} type="button" aria-label="Закрыть" onClick={onClose}>×</button>
      </div>
    </div>
  );
}
