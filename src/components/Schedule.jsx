import { CONFIG } from "../config.js";
import { fmtTime } from "../utils/time.js";

const DAYS = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];

export default function Schedule({ now }) {
  const today = (now.getDay() + 6) % 7;
  return (
    <table className="schedule">
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
  );
}
