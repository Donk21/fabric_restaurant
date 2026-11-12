import { DISH_PLACEHOLDER } from "../api/menu.js";

const fallback = (e) => {
  if (!e.currentTarget.src.endsWith(DISH_PLACEHOLDER)) e.currentTarget.src = DISH_PLACEHOLDER;
};

export default function DishCard({ dish, category }) {
  const { name, weight, price, hit, image } = dish;
  return (
    <article className="dish">
      <div className="dish__photo">
        <img src={image || DISH_PLACEHOLDER} alt={image ? name : ""} loading="lazy" width="400" height="300" onError={fallback} />
        {hit && <span className="dish__hit">хит</span>}
      </div>
      <div className="dish__body">
        {category && <p className="dish__cat">{category}</p>}
        <h3 className="dish__name">{name}</h3>
        <p className="dish__meta">
          <span className="dish__weight">{weight}</span>
          <span className="dish__price">{price.toLocaleString("ru-RU")} ₽</span>
        </p>
      </div>
    </article>
  );
}
