import { CONFIG, PHONE_HREF } from "../config.js";
import { fmtTime } from "../utils/time.js";
import BookingForm from "./BookingForm.jsx";

export default function Booking({ onSubmitted }) {
  return (
    <section className="section section--steel" id="booking">
      <div className="wrap booking">
        <div className="booking__intro">
          <p className="eyebrow">Цех №3 · Бронирование</p>
          <h2 className="h2">Забронировать столик</h2>
          <p>Оставьте заявку, и администратор перезвонит для подтверждения. Если удобнее по телефону:</p>
          <a className="phone" href={PHONE_HREF}>{CONFIG.phoneDisplay}</a>
          <p className="muted small">Бронь держим 15 минут. Последняя бронь на {fmtTime(CONFIG.lastBooking)}.</p>
        </div>
        <BookingForm onSubmitted={onSubmitted} />
      </div>
    </section>
  );
}
