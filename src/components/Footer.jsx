export default function Footer({ year }) {
  return (
    <footer className="footer">
      <div className="wrap footer__inner">
        <img src="assets/logo.jpg" alt="" className="logo-img footer__logo" width="72" height="72" />
        <p>© {year} Ресторан «Фабрика» · Ростов-на-Дону, Богданова, 86</p>
        <a href="#top">Наверх ↑</a>
      </div>
    </footer>
  );
}
