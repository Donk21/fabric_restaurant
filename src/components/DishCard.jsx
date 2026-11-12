export default function DishCard({ dish, index, category }) {
  const [name, weight, price, hit] = dish;
  return (
    <article className="dish" style={{ animationDelay: `${Math.min(index, 14) * 25}ms` }}>
      <div className="dish__name">
        {name}
        {hit && <span className="dish__hit">хит</span>}
      </div>
      <div className="dish__price">{price.toLocaleString("ru-RU")} ₽</div>
      <div className="dish__weight">
        {weight}
        {category && <> · <span className="dish__cat">{category}</span></>}
      </div>
    </article>
  );
}
