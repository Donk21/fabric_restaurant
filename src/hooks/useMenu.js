import { useEffect, useState } from "react";
import { fetchMenu } from "../api/menu.js";

/** Loads the menu once. status: "loading" | "ready" | "error". */
export function useMenu() {
  const [state, setState] = useState({ status: "loading", categories: [] });

  useEffect(() => {
    let alive = true;
    fetchMenu()
      .then((categories) => alive && setState({ status: "ready", categories }))
      .catch(() => alive && setState({ status: "error", categories: [] }));
    return () => { alive = false; };
  }, []);

  return state;
}
