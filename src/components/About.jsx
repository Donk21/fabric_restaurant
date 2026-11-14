import { useYandexRating } from "../hooks/useYandexRating.js";
import { plural } from "../utils/time.js";

const STATIC_FACTS = [
  { value: "2026", label: "«Хорошее место» по версии Яндекса" },
  { value: "1000–2500 ₽", label: "средний чек" },
];

function ratingFact({ ratingValue, ratingCount, reviewCount, url }) {
  const counts = [`${ratingCount} ${plural(ratingCount, "оценка", "оценки", "оценок")}`];
  if (reviewCount) counts.push(`${reviewCount} ${plural(reviewCount, "отзыв", "отзыва", "отзывов")}`);
  return {
    value: ratingValue.toFixed(1),
    label: <>рейтинг на <a href={url} target="_blank" rel="noopener">Яндекс Картах</a>, {counts.join(" и ")}</>,
  };
}

// Odd count: the last item spans the full row
const TAGS = [
  "Wi-Fi", "Кальяны", "Доставка и навынос", "Бесплатная парковка",
  "Спортивные трансляции", "Банкеты и корпоративы", "Можно с собаками до 35 см", "Есть отдельные VIP-комнаты"
];

const PHOTOS = [
  { src: "assets/photo4.jpg", alt: "Интерьер ресторана: стальные балки, лампы Эдисона и мотоцикл под потолком", tall: true },
  { src: "assets/interior2.jpg", alt: "Рёбра, мясная нарезка и пиво на деревянных досках" },
  { src: "assets/photo3.jpg", alt: "Капучино и салат из свежих овощей" },
];

export default function About() {
  const rating = useYandexRating();
  const facts = [ratingFact(rating), ...STATIC_FACTS];

  return (
    <section className="section" id="about">
      <div className="wrap about">
        <div className="about__text">
          <p className="eyebrow">Цех №1 · О нас</p>
          <h2 className="h2">Индустриальный лофт <br />на втором этаже</h2>
          <p>
            «Фабрика» — ресторан и кальян-бар на Богданова, 86. Кирпичные стены, стальные балки, мотоцикл под потолком и мягкие диваны.
            Подходит для семейного ужина, дня рождения, деловой встречи или банкета.
          </p>
          <ul className="facts">
            {facts.map((f, i) => (
              <li key={i}><b>{f.value}</b><span>{f.label}</span></li>
            ))}
          </ul>
          <ul className="tags" aria-label="Удобства">
            {TAGS.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </div>
        <div className="about__gallery">
          {PHOTOS.map((p) => (
            <figure key={p.src} className={`plate${p.tall ? " plate--tall" : ""}`}>
              <img src={p.src} alt={p.alt} loading="lazy" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
