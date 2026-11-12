// Single entry point for menu data. Today it serves the static seed from src/data/menu.js;
// when the database/API is ready, replace the body of fetchMenu() with a request, e.g.
//   const res = await fetch(`${CONFIG.apiBase}/menu`); return res.json();
// and keep the same shape: [{ id, title, items: [{ id, name, weight, price, hit, image }] }].
import { MENU } from "../data/menu.js";

export async function fetchMenu() {
  return MENU;
}

/** Shown when a dish has no photo yet or its photo fails to load. */
export const DISH_PLACEHOLDER = "assets/dishes/placeholder.svg";
