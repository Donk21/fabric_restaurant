import Gear from "./Gear.jsx";
import OpenStatus from "./OpenStatus.jsx";
import HeroSmoke from "./HeroSmoke.jsx";
import NeonSign from "./NeonSign.jsx";

export default function Hero({ now }) {
  return (
    <section className="hero">
      <div className="hero__bg" aria-hidden="true"></div>
      <HeroSmoke />
      <Gear className="hero__gear hero__gear--1" />
      <Gear className="hero__gear hero__gear--2" />
      <div className="wrap hero__inner">
        <div className="hero__logo-wrap">
          <div className="smoke" aria-hidden="true"><i></i><i></i><i></i></div>
          <img src="assets/logo.jpg" alt="Фабрика — ресторан" className="logo-img hero__logo" width="420" height="420" />
        </div>
        <div className="hero__text">
          <p className="eyebrow">Ресторан · Нахичевань</p>
          <NeonSign flickerAt={[2, 3]}>кальян-бар</NeonSign>
          <h1 className="hero__title">Производим<br /><span>вкусные вечера</span></h1>
          <p className="hero__lead">
            Лофт с панорамными окнами, кирпичом и тёплым светом ламп Эдисона. Рёбра в 13 соусах, гриль, сеты на компанию и кальяны.
          </p>
          <OpenStatus now={now} live />
          <div className="hero__actions">
            <a href="#booking" className="btn btn--accent">Забронировать столик</a>
            <a href="menu.html" className="btn btn--ghost">Меню</a>
          </div>
        </div>
      </div>
    </section>
  );
}
