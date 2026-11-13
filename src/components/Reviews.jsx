import { useYandexRating } from "../hooks/useYandexRating.js";
import { useYandexReviews } from "../hooks/useYandexReviews.js";
import { plural } from "../utils/time.js";

const dateFmt = new Intl.DateTimeFormat("ru-RU", { month: "long", year: "numeric" });

function Stars({ value }) {
  return (
    <span className="review__stars" role="img" aria-label={`Оценка ${value} из 5`}>
      {"★★★★★".slice(0, value)}
      <span className="review__stars-off">{"★★★★★".slice(value)}</span>
    </span>
  );
}

// Real guest reviews from Yandex Maps and a link to all of them.
export default function Reviews() {
  const reviews = useYandexReviews();
  const { ratingValue, reviewCount, url } = useYandexRating();

  return (
    <section className="section" id="reviews">
      <div className="wrap">
        <div className="section__head">
          <p className="eyebrow">Книга отзывов</p>
          <h2 className="h2">Что говорят гости</h2>
          <p className="muted">
            Отзывы с Яндекс Карт: {ratingValue.toFixed(1)} ★
            {reviewCount ? `, ${reviewCount} ${plural(reviewCount, "отзыв", "отзыва", "отзывов")}` : ""}.
          </p>
        </div>
        {reviews.length > 0 && (
          <ul className="reviews">
            {reviews.map((r) => (
              <li key={r.id} className="review">
                <Stars value={r.rating} />
                <p className="review__text">{r.text}</p>
                <footer className="review__meta">
                  <span className="review__avatar" aria-hidden="true">{r.author[0].toUpperCase()}</span>
                  <span>
                    <b className="review__author">{r.author}</b>
                    <time className="review__date" dateTime={r.date}>{dateFmt.format(new Date(r.date))}</time>
                  </span>
                </footer>
              </li>
            ))}
          </ul>
        )}
        <div className="section__cta">
          <a href={url} className="btn btn--ghost" target="_blank" rel="noopener">Посмотреть все отзывы</a>
        </div>
      </div>
    </section>
  );
}
