import { useEffect, useRef, useState } from "react";
import { CONFIG } from "../config.js";
import { availableSlots, bookingDateRange, fmtTime, pickTime } from "../utils/time.js";
import { formatPhone, phoneDigits } from "../utils/phone.js";
import FormField from "./FormField.jsx";
import GuestStepper from "./GuestStepper.jsx";
import Checkbox from "./Checkbox.jsx";
import Gear from "./Gear.jsx";

const ZONES = ["Без разницы", "У панорамного окна", "Диванная зона", "Рядом с экраном (трансляции)"];

function initialState() {
  const range = bookingDateRange();
  return {
    range,
    values: {
      name: "",
      phone: "",
      date: range.defaultDate,
      time: pickTime(availableSlots(range.defaultDate), ""),
      guests: 2,
      zone: ZONES[0],
      hookah: false,
      comment: "",
      consent: false,
    },
  };
}

function validate(v, range) {
  const g = +v.guests;
  const errors = {
    name: v.name.trim().length < 2 ? "Укажите имя" : "",
    phone: phoneDigits(v.phone).length !== 11 ? "Введите номер полностью" : "",
    date: !v.date || v.date < range.min || v.date > range.max ? `Выберите дату в ближайшие ${CONFIG.bookingDaysAhead} дней` : "",
    time: !v.time ? "На эту дату время уже прошло, выберите другой день" : "",
    guests: !g || g < CONFIG.minGuests || g > CONFIG.maxGuests ? `От ${CONFIG.minGuests} до ${CONFIG.maxGuests} гостей` : "",
    consent: !v.consent ? "Нужно согласие" : "",
  };
  return Object.values(errors).some(Boolean) ? errors : null;
}

async function submitBooking(data) {
  let sent = false;
  if (CONFIG.endpoint) {
    try {
      const r = await fetch(CONFIG.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      sent = r.ok;
    } catch {
      sent = false;
    }
  }
  try {
    const all = JSON.parse(localStorage.getItem("fabrika-bookings") || "[]");
    all.push(data);
    localStorage.setItem("fabrika-bookings", JSON.stringify(all));
  } catch {
    /* хранилище недоступно — не критично */
  }
  return sent;
}

export default function BookingForm({ onSubmitted }) {
  const [{ range, values }, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [focusTick, setFocusTick] = useState(0);
  const formRef = useRef(null);

  const slots = availableSlots(values.date);

  // Фокус на первое поле с ошибкой после неудачной отправки
  useEffect(() => {
    if (focusTick) formRef.current?.querySelector(".has-error input, .has-error select")?.focus();
  }, [focusTick]);

  const set = (name, value) => {
    setForm((f) => {
      const next = { ...f.values, [name]: value };
      if (name === "date") next.time = pickTime(availableSlots(value), f.values.time);
      return { ...f, values: next };
    });
    if (errors[name]) setErrors((e) => ({ ...e, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(values, range);
    if (errs) {
      setErrors(errs);
      setFocusTick((t) => t + 1);
      return;
    }
    const data = {
      name: values.name.trim(),
      phone: values.phone,
      date: values.date,
      time: values.time,
      guests: +values.guests,
      zone: values.zone,
      hookah: values.hookah,
      comment: values.comment.trim(),
      createdAt: new Date().toISOString(),
    };
    setLoading(true);
    const sent = await submitBooking(data);
    setLoading(false);
    onSubmitted(data, sent);
    setForm(initialState());
    setErrors({});
  };

  return (
    <form className="form" ref={formRef} noValidate onSubmit={handleSubmit}>
      <div className="form__grid">
        <FormField label="Имя" htmlFor="f-name" error={errors.name || ""}>
          <input
            id="f-name" name="name" type="text" autoComplete="name" required minLength={2}
            placeholder="Как к вам обращаться"
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </FormField>

        <FormField label="Телефон" htmlFor="f-phone" error={errors.phone || ""}>
          <input
            id="f-phone" name="phone" type="tel" autoComplete="tel" required inputMode="tel"
            placeholder="+7 (___) ___-__-__"
            value={values.phone}
            onChange={(e) => set("phone", formatPhone(e.target.value))}
          />
        </FormField>

        <FormField label="Дата" htmlFor="f-date" error={errors.date || ""}>
          <input
            id="f-date" name="date" type="date" required
            min={range.min} max={range.max}
            value={values.date}
            onChange={(e) => set("date", e.target.value)}
          />
        </FormField>

        <FormField label="Время" htmlFor="f-time" error={errors.time || ""}>
          <select id="f-time" name="time" required value={values.time} onChange={(e) => set("time", e.target.value)}>
            {slots.length ? (
              slots.map((m) => <option key={m} value={fmtTime(m)}>{fmtTime(m)}</option>)
            ) : (
              <option value="">Нет свободного времени</option>
            )}
          </select>
        </FormField>

        <FormField label="Гостей" htmlFor="f-guests" error={errors.guests || ""}>
          <GuestStepper
            id="f-guests" name="guests"
            min={CONFIG.minGuests} max={CONFIG.maxGuests}
            value={values.guests}
            onChange={(v) => set("guests", v)}
          />
        </FormField>

        <FormField label="Где сесть" htmlFor="f-zone">
          <select id="f-zone" name="zone" value={values.zone} onChange={(e) => set("zone", e.target.value)}>
            {ZONES.map((z) => <option key={z}>{z}</option>)}
          </select>
        </FormField>

        <FormField full>
          <Checkbox name="hookah" checked={values.hookah} onChange={(v) => set("hookah", v)}>
            Подготовить кальян к приходу
          </Checkbox>
        </FormField>

        <FormField label="Пожелания" htmlFor="f-comment" full>
          <textarea
            id="f-comment" name="comment" rows={3}
            placeholder="Детский стул, торт, особые пожелания…"
            value={values.comment}
            onChange={(e) => set("comment", e.target.value)}
          />
        </FormField>

        <FormField full error={errors.consent || ""}>
          <Checkbox name="consent" checked={values.consent} onChange={(v) => set("consent", v)}>
            Согласен(на) на обработку персональных данных
          </Checkbox>
        </FormField>
      </div>

      <button className={`btn btn--accent btn--wide${loading ? " is-loading" : ""}`} type="submit" disabled={loading}>
        <Gear className="btn__gear" />
        <span>Отправить заявку</span>
      </button>
    </form>
  );
}
