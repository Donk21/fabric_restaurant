import { CONFIG } from "../config.js";
import { fmtTime } from "../utils/time.js";

const DAYS = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];

export default function Schedule({ now }) {
  const today = (now.getDay() + 6) % 7;
  // The frame lives on a wrapper div: a border on a border-collapse table loses its
  // right/bottom edge on some phones when the table width lands on a fractional pixel.
  return (
    <div className="schedule">
      <table className="schedule__table">
        <caption className="visually-hidden">Часы работы по дням недели</caption>
        <tbody>
          {DAYS.map((d, i) => (
            <tr key={d} className={i === today ? "is-today" : undefined}>
              <td>{d}</td>
              <td>{fmtTime(CONFIG.open)} — {fmtTime(CONFIG.close)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
