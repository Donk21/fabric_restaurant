import { CONFIG, PHONE_HREF } from "../config.js";

export default function Contacts() {
  return (
    <section className="section" id="contacts">
      <div className="wrap contacts">
        <div>
          <p className="eyebrow">Проходная</p>
          <h2 className="h2">Как нас найти</h2>
          <dl className="contacts__list">
            <dt>Адрес</dt>
            <dd>Ростов-на-Дону, Нахичевань,<br />ул. Богданова, 86, 2 этаж</dd>
            <dt>Телефон</dt>
            <dd><a href={PHONE_HREF}>{CONFIG.phoneDisplay}</a></dd>
            <dt>Режим работы</dt>
            <dd>Ежедневно 12:00–00:00</dd>
            <dt>Транспорт</dt>
            <dd>Остановка «Красный Аксай», 380 м</dd>
          </dl>
          <a className="btn btn--ghost" href="https://yandex.ru/maps/org/fabrika/178860656686/" target="_blank" rel="noopener">
            Открыть в Яндекс Картах
          </a>
        </div>
        <div className="map">
          <iframe
            title="Ресторан «Фабрика» на карте"
            src="https://yandex.ru/map-widget/v1/?ll=39.779034%2C47.227024&z=16&pt=39.779034%2C47.227024%2Cpm2rdl&oid=178860656686&ol=biz"
            loading="lazy"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
