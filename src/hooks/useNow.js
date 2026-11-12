import { useEffect, useState } from "react";
import { nowMsk } from "../utils/time.js";

/** Current Moscow time, refreshed every `interval` ms. */
export function useNow(interval = 60000) {
  const [now, setNow] = useState(nowMsk);
  useEffect(() => {
    const id = setInterval(() => setNow(nowMsk()), interval);
    return () => clearInterval(id);
  }, [interval]);
  return now;
}
