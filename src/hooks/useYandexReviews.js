import { useEffect, useState } from "react";

/**
 * Guest reviews from Yandex Maps. reviews.json is refreshed by scripts/fetch-yandex-reviews.mjs
 * (automatically before each build). Returns an empty list while loading or if the file is unavailable.
 */
export function useYandexReviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch("reviews.json", { cache: "no-cache", signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data) => {
        if (Array.isArray(data?.reviews)) setReviews(data.reviews.filter((r) => r?.text && r?.author));
      })
      .catch(() => { /* no reviews: the section shows only the link to Yandex Maps */ });
    return () => ctrl.abort();
  }, []);

  return reviews;
}
