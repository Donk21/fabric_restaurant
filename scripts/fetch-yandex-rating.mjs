#!/usr/bin/env node
// Fetches the organization's rating and review count from its Yandex Maps page
// (schema.org AggregateRating markup) and saves them as JSON for the site.
//
// Usage:
//   node scripts/fetch-yandex-rating.mjs                         → public/rating.json (before build)
//   node scripts/fetch-yandex-rating.mjs --out dist/rating.json  → update an already deployed site (for cron)
//
// If Yandex doesn't respond, serves a captcha or changes its markup, the old file
// is left untouched and the script exits with code 0 so the build never breaks.

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { CONFIG } from "../src/config.js";

const outArg = process.argv.indexOf("--out");
const OUT = resolve(outArg > -1 ? process.argv[outArg + 1] : "public/rating.json");
const URL_ = `https://yandex.ru/maps/org/${CONFIG.yandexOrgId}/`;
const TIMEOUT = 15000;

const log = (msg) => console.log(`[rating] ${msg}`);

function parse(html) {
  const start = html.search(/itemprop="aggregateRating"/i);
  if (start === -1) throw new Error("aggregateRating block not found (captcha or markup changed)");
  const block = html.slice(start, start + 800);
  const meta = (name) => block.match(new RegExp(`itemprop="${name}"\\s+content="([^"]+)"`, "i"))?.[1];

  const ratingValue = parseFloat(meta("ratingValue"));
  const ratingCount = parseInt(meta("ratingCount"), 10);
  const reviewCount = parseInt(meta("reviewCount"), 10);
  const bestRating = parseFloat(meta("bestRating")) || 5;

  if (!(ratingValue >= 1 && ratingValue <= bestRating)) throw new Error(`unexpected rating: ${meta("ratingValue")}`);
  if (!(ratingCount > 0)) throw new Error(`unexpected rating count: ${meta("ratingCount")}`);

  return {
    ratingValue,
    ratingCount,
    reviewCount: reviewCount >= 0 ? reviewCount : null,
    bestRating,
    url: `https://yandex.ru/maps/org/${CONFIG.yandexOrgId}/reviews/`,
    updatedAt: new Date().toISOString(),
  };
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

  const prev = await readFile(OUT, "utf8").then(JSON.parse).catch(() => null);
  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(data, null, 2) + "\n");

  const was = prev ? ` (was ${prev.ratingValue}, ${prev.ratingCount} ratings)` : "";
  log(`${data.ratingValue} ★, ${data.ratingCount} ratings, ${data.reviewCount} reviews${was} → ${OUT}`);
}

main().catch((e) => log(`error: ${e.message}`));
