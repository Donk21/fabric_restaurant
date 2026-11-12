import OpenStatus from "./OpenStatus.jsx";
import Schedule from "./Schedule.jsx";

export default function Hours({ now }) {
  return (
    <section className="section section--brick" id="hours">
      <div className="wrap hours">
        <div>
          <p className="eyebrow">График смены</p>
          <h2 className="h2">Режим работы</h2>
          <p className="hours__big">Ежедневно<br /><span>12:00 — 00:00</span></p>
          <OpenStatus now={now} block />
        </div>
        <Schedule now={now} />
      </div>
    </section>
  );
}
