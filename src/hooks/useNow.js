import { useEffect, useState } from "react";
import { nowMsk } from "../utils/time.js";

/** Текущее московское время, обновляется раз в `interval` мс. */
export function useNow(interval = 60000) {
  const [now, setNow] = useState(nowMsk);
  useEffect(() => {
    const id = setInterval(() => setNow(nowMsk()), interval);
    return () => clearInterval(id);
  }, [interval]);
  return now;
}
