import { useState } from "react";

const NAV_LINKS = [
  { href: "#about", label: "О нас" },
  { href: "#menu", label: "Меню" },
  { href: "#hours", label: "Режим работы" },
  { href: "#contacts", label: "Контакты" },
];

export default function Header() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <header className="topbar" id="top">
      <div className="wrap topbar__inner">
        <a href="#top" className="brand" aria-label="Фабрика — на главную">
          <img src="assets/logo.jpg" alt="Логотип ресторана «Фабрика»" className="logo-img brand__logo" width="48" height="48" />
          <span className="brand__name">Фабрика</span>
        </a>
        <nav className={`nav${navOpen ? " is-open" : ""}`} id="nav" aria-label="Основная навигация">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setNavOpen(false)}>{l.label}</a>
          ))}
        </nav>
        <a href="#booking" className="btn btn--accent btn--sm topbar__cta">Забронировать</a>
        <button
          className="burger"
          type="button"
          aria-label="Открыть меню"
          aria-expanded={navOpen}
          aria-controls="nav"
          onClick={() => setNavOpen((v) => !v)}
        >
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>
  );
}
