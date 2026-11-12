import { CONFIG } from "../config.js";

export const pad = (n) => String(n).padStart(2, "0");
export const fmtTime = (m) => `${pad(Math.floor(m / 60) % 24)}:${pad(m % 60)}`;

// Время в Ростове-на-Дону (МСК, UTC+3) независимо от часового пояса посетителя
export const nowMsk = () => {
  const d = new Date();
  return new Date(d.getTime() + (d.getTimezoneOffset() + 180) * 60000);
};

export const isoDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const minutesOfDay = (d) => d.getHours() * 60 + d.getMinutes();

export const humanDate = (s) =>
  new Date(s + "T12:00:00").toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" });

export function plural(n, one, few, many) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}

/** Статус «открыто / закрыто» на момент `now`. */
export function getOpenStatus(now) {
  const mins = minutesOfDay(now);
  const open = mins >= CONFIG.open && mins < CONFIG.close;
  const left = CONFIG.close - mins;
  let text;
  if (open) text = left <= 60 ? `Открыто · закроемся через ${left} мин` : "Открыто сейчас · до 00:00";
  else text = `Закрыто · откроемся в ${fmtTime(CONFIG.open)}`;
  return { open, text };
}

/** Доступные слоты бронирования (в минутах) на дату `dateStr`. */
export function availableSlots(dateStr, now = nowMsk()) {
  const isToday = dateStr === isoDate(now);
  const earliest = isToday ? minutesOfDay(now) + CONFIG.leadTime : 0;
  const slots = [];
  for (let m = CONFIG.open; m <= CONFIG.lastBooking; m += CONFIG.slotStep) if (m >= earliest) slots.push(m);
  return slots;
}

/** Границы дат для брони и дата по умолчанию. */
export function bookingDateRange(now = nowMsk()) {
  const max = new Date(now);
  max.setDate(max.getDate() + CONFIG.bookingDaysAhead);
  const def = new Date(now);
  if (!availableSlots(isoDate(now), now).length) def.setDate(def.getDate() + 1);
  return { min: isoDate(now), max: isoDate(max), defaultDate: isoDate(def) };
}

/** Выбор времени: сохраняем прежнее, если оно доступно, иначе 19:00, иначе первый слот. */
export function pickTime(slots, prev) {
  const times = slots.map(fmtTime);
  if (times.includes(prev)) return prev;
  if (times.includes("19:00")) return "19:00";
  return times[0] || "";
}
