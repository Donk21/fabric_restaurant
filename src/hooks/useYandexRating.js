import { useEffect, useState } from "react";
import { CONFIG } from "../config.js";

const FALLBACK = {
  ...CONFIG.ratingFallback,
  url: `https://yandex.ru/maps/org/${CONFIG.yandexOrgId}/reviews/`,
};

/**
 * Rating from Yandex Maps. rating.json is refreshed by scripts/fetch-yandex-rating.mjs
 * (automatically before each build) or deploy/update-rating.php (daily via cron).
 * While the file is loading or if it is unavailable, CONFIG.ratingFallback is shown.
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
      .catch(() => { /* keep the fallback values */ });
    return () => ctrl.abort();
  }, []);

  return rating;
}
