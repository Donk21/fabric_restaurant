import { useMenu } from "../hooks/useMenu.js";
import DishCard from "./DishCard.jsx";

const PREVIEW_COUNT = 8;

// Landing-page teaser: a few bestsellers and a link to the full menu page.
export default function Menu() {
  const { status, categories } = useMenu();
  const hits = categories
    .flatMap((c) => c.items.filter((d) => d.hit).map((d) => ({ dish: d, category: c.title })))
    .slice(0, PREVIEW_COUNT);
  const total = categories.reduce((n, c) => n + c.items.length, 0);

  return (
    <section className="section section--steel" id="menu">
      <div className="wrap">
        <div className="section__head">
          <p className="eyebrow">Цех №2 · Меню</p>
          <h2 className="h2">Что производим</h2>
          <p className="muted">Хиты нашей кухни. Полное меню{status === "ready" ? ` на ${total} позиций` : ""} — с категориями и фото блюд.</p>
        </div>
        {hits.length > 0 && (
          <div className="dish-grid">
            {hits.map(({ dish, category }) => <DishCard key={dish.id} dish={dish} category={category} />)}
          </div>
        )}
        <div className="menu-cta">
          <a href="menu.html" className="btn btn--accent">Открыть всё меню</a>
        </div>
      </div>
    </section>
  );
}
