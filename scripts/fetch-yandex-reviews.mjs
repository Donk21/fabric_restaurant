#!/usr/bin/env node
// Fetches real guest reviews from the organization's Yandex Maps reviews page
// (the JSON state embedded in the page) and saves a few of them for the site.
//
// Picks the newest 5-star reviews whose text fits a card nicely.
//
// Usage:
//   node scripts/fetch-yandex-reviews.mjs                          → public/reviews.json (before build)
//   node scripts/fetch-yandex-reviews.mjs --out dist/reviews.json  → update an already deployed site
//
// If Yandex doesn't respond, serves a captcha or changes its markup, the old file
// is left untouched and the script exits with code 0 so the build never breaks.

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { CONFIG } from "../src/config.js";

const outArg = process.argv.indexOf("--out");
const OUT = resolve(outArg > -1 ? process.argv[outArg + 1] : "public/reviews.json");
const URL_ = `https://yandex.ru/maps/org/${CONFIG.yandexOrgId}/reviews/`;
const TIMEOUT = 15000;
const COUNT = 5;
const MIN_LEN = 120;
const MAX_LEN = 450;

const log = (msg) => console.log(`[reviews] ${msg}`);

function findReviews(state) {
  const found = new Map();
  (function walk(v) {
    if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") {
      if (typeof v.reviewId === "string" && typeof v.text === "string") {
        found.set(v.reviewId, v);
        return;
      }
      Object.values(v).forEach(walk);
    }
  })(state);
  return [...found.values()];
}

const clean = (text) =>
  text
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

function parse(html) {
  const m = html.match(/<script type="application\/json" class="state-view">([\s\S]*?)<\/script>/);
  if (!m) throw new Error("page state not found (captcha or markup changed)");
  const all = findReviews(JSON.parse(m[1]));
  if (!all.length) throw new Error("no reviews found in the page state");

  const reviews = all
    .map((r) => ({ id: r.reviewId, author: r.author?.name?.trim(), rating: r.rating, date: r.updatedTime, text: clean(r.text) }))
    .filter((r) => r.rating === 5 && r.author && r.date && r.text.length >= MIN_LEN && r.text.length <= MAX_LEN)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, COUNT);
  if (!reviews.length) throw new Error(`none of ${all.length} reviews matched the filter`);

  return { url: URL_, updatedAt: new Date().toISOString(), reviews };
}

async function main() {
  let html;
  try {
    const res = await fetch(URL_, {
      signal: AbortSignal.timeout(TIMEOUT),
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36",
        "Accept-Language": "ru-RU,ru;q=0.9",
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    html = await res.text();
  } catch (e) {
    log(`failed to load the page: ${e.message}. Keeping previous data.`);
    return;
  }

  let data;
  try {
    data = parse(html);
  } catch (e) {
    log(`${e.message}. Keeping previous data.`);
    return;
  }

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(data, null, 2) + "\n");
  log(`${data.reviews.length} reviews (${data.reviews.map((r) => r.author).join(", ")}) → ${OUT}`);
}

main().catch((e) => log(`error: ${e.message}`));
