import { useEffect, useState } from "react";
import { CONFIG } from "../config.js";

const FALLBACK = {
  ...CONFIG.ratingFallback,
  url: `https://yandex.ru/maps/org/${CONFIG.yandexOrgId}/reviews/`,
};

/**
 * Рейтинг из Яндекс Карт. Файл rating.json обновляет scripts/fetch-yandex-rating.mjs
 * (автоматически перед сборкой или по cron). Пока файл грузится или если он
 * недоступен — показываем значения из CONFIG.ratingFallback.
 */
export function useYandexRating() {
  const [rating, setRating] = useState(FALLBACK);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch("rating.json", { cache: "no-cache", signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data) => {
        if (data?.ratingValue > 0 && data?.ratingCount > 0) setRating({ ...FALLBACK, ...data });
      })
      .catch(() => { /* остаёмся на запасных значениях */ });
    return () => ctrl.abort();
  }, []);

  return rating;
}
