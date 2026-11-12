#!/usr/bin/env node
// Забирает рейтинг и количество отзывов организации со страницы Яндекс Карт
// (разметка schema.org AggregateRating) и сохраняет в JSON для сайта.
//
// Использование:
//   node scripts/fetch-yandex-rating.mjs                 → public/rating.json (перед сборкой)
//   node scripts/fetch-yandex-rating.mjs --out dist/rating.json   → обновить уже выложенный сайт (для cron)
//
// Если Яндекс не ответил, показал капчу или поменял разметку — старый файл
// остаётся как есть, скрипт завершается с кодом 0 и не ломает сборку.

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
  if (start === -1) throw new Error("блок aggregateRating не найден (капча или изменилась разметка)");
  const block = html.slice(start, start + 800);
  const meta = (name) => block.match(new RegExp(`itemprop="${name}"\\s+content="([^"]+)"`, "i"))?.[1];

  const ratingValue = parseFloat(meta("ratingValue"));
  const ratingCount = parseInt(meta("ratingCount"), 10);
  const reviewCount = parseInt(meta("reviewCount"), 10);
  const bestRating = parseFloat(meta("bestRating")) || 5;

  if (!(ratingValue >= 1 && ratingValue <= bestRating)) throw new Error(`странный рейтинг: ${meta("ratingValue")}`);
  if (!(ratingCount > 0)) throw new Error(`странное число оценок: ${meta("ratingCount")}`);

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
    log(`не удалось загрузить страницу: ${e.message}. Оставляю прежние данные.`);
    return;
  }

  let data;
  try {
    data = parse(html);
  } catch (e) {
    log(`${e.message}. Оставляю прежние данные.`);
    return;
  }

  const prev = await readFile(OUT, "utf8").then(JSON.parse).catch(() => null);
  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(data, null, 2) + "\n");

  const was = prev ? ` (было ${prev.ratingValue}, ${prev.ratingCount} оценок)` : "";
  log(`${data.ratingValue} ★, ${data.ratingCount} оценок, ${data.reviewCount} отзывов${was} → ${OUT}`);
}

main().catch((e) => log(`ошибка: ${e.message}`));
