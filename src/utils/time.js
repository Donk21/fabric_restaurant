import { CONFIG } from "../config.js";

export const pad = (n) => String(n).padStart(2, "0");
export const fmtTime = (m) => `${pad(Math.floor(m / 60) % 24)}:${pad(m % 60)}`;

// Time in Rostov-on-Don (Moscow time, UTC+3) regardless of the visitor's time zone
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

/** Time without a leading zero in hours: 0:00, 9:30, 12:00. */
export const fmtClock = (m) => `${Math.floor(m / 60) % 24}:${pad(m % 60)}`;

/** Human-readable duration: "40 мин", "1 ч", "8 ч 20 мин". */
export function fmtDuration(totalMin) {
  const h = Math.floor(totalMin / 60), m = totalMin % 60;
  if (!h) return `${m} мин`;
  return m ? `${h} ч ${m} мин` : `${h} ч`;
}

/** Open/closed status at the moment `now`. */
export function getOpenStatus(now) {
  const mins = minutesOfDay(now);
  const open = mins >= CONFIG.open && mins < CONFIG.close;
  let text;
  if (open) {
    const left = CONFIG.close - mins;
    text = left <= 60 ? `Работаем ещё ${fmtDuration(left)}` : `Работаем до ${fmtClock(CONFIG.close)}`;
  } else {
    const until = mins < CONFIG.open ? CONFIG.open - mins : 24 * 60 - mins + CONFIG.open;
    text = `Откроемся через ${fmtDuration(until)}`;
  }
  return { open, text };
}

/** Available booking slots (in minutes) for the date `dateStr`. */
export function availableSlots(dateStr, now = nowMsk()) {
  const isToday = dateStr === isoDate(now);
  const earliest = isToday ? minutesOfDay(now) + CONFIG.leadTime : 0;
  const slots = [];
  for (let m = CONFIG.open; m <= CONFIG.lastBooking; m += CONFIG.slotStep) if (m >= earliest) slots.push(m);
  return slots;
}

/** Booking date bounds and the default date. */
export function bookingDateRange(now = nowMsk()) {
  const max = new Date(now);
  max.setDate(max.getDate() + CONFIG.bookingDaysAhead);
  const def = new Date(now);
  if (!availableSlots(isoDate(now), now).length) def.setDate(def.getDate() + 1);
  return { min: isoDate(now), max: isoDate(max), defaultDate: isoDate(def) };
}

/** Time selection: keep the previous one if available, otherwise 19:00, otherwise the first slot. */
export function pickTime(slots, prev) {
  const times = slots.map(fmtTime);
  if (times.includes(prev)) return prev;
  if (times.includes("19:00")) return "19:00";
  return times[0] || "";
}
