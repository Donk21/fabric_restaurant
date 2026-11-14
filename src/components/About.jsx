import { useLayoutEffect, useRef } from "react";
import { useYandexRating } from "../hooks/useYandexRating.js";
import { plural } from "../utils/time.js";
import { PHOTOS } from "../data/photos.js";
import PhotoStrip from "./PhotoStrip.jsx";

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

// With an odd count the last item spans the full row
const TAGS = [
  "Wi-Fi", "Кальяны", "Доставка и навынос", "Бесплатная парковка",
  "Спортивные трансляции", "Банкеты и корпоративы", "Можно с собаками до 35 см", "Отдельные VIP-комнаты"
];

// Scale "лофт" so it is exactly as wide as "Индустриальный". Both lines use the
// same font, so the ratio does not depend on the viewport: measure once at 1em
// and again after the web font loads.
function useFitWidth() {
  const topRef = useRef(null);
  const fitRef = useRef(null);
  useLayoutEffect(() => {
    const fit = () => {
      const top = topRef.current, word = fitRef.current;
      if (!top || !word) return;
      word.style.setProperty("--fit", "1");
      const ratio = top.getBoundingClientRect().width / word.getBoundingClientRect().width;
      word.style.setProperty("--fit", String(ratio));
    };
    fit();
    document.fonts?.ready.then(fit);
  }, []);
  return [topRef, fitRef];
}

export default function About() {
  const rating = useYandexRating();
  const [titleTopRef, titleFitRef] = useFitWidth();
  const facts = [ratingFact(rating), ...STATIC_FACTS];

  return (
    <section className="section" id="about">
      <div className="wrap about">
        <div className="about__text">
          <p className="eyebrow">Цех №1 · О нас</p>
          <h2 className="h2 about__title">
            <span ref={titleTopRef}>Индустриальный</span>{" "}
            <span ref={titleFitRef} className="about__title-fit">лофт</span>
          </h2>
          <p>
            «Фабрика» — ресторан и кальян-бар на Богданова, 86. Кирпичные стены, стальные балки, мотоцикл под потолком и мягкие диваны.
            Подходит для семейного ужина, дня рождения, деловой встречи или банкета.
          </p>
        </div>
        <div className="about__details">
          <ul className="facts">
            {facts.map((f, i) => (
              <li key={i}><b>{f.value}</b><span>{f.label}</span></li>
            ))}
          </ul>
          <ul className="tags" aria-label="Удобства">
            {TAGS.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </div>
        <div className="about__photos">
          <PhotoStrip photos={PHOTOS} />
        </div>
      </div>
    </section>
  );
}
