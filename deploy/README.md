# Deployment and daily rating refresh

## 1. Build and upload the site

```
npm run build
```

A fresh rating is fetched automatically before the build (`npm run rating`).
Upload the contents of `dist/` to the site's web root on the hosting (usually `public_html`).

## 2. Rating refresh script

Upload `deploy/update-rating.php` to the hosting **outside the web root**, e.g. into your home directory:

```
~/update-rating.php          ← script
~/fabrika.ru/public_html/    ← site (rating.json lives here)
```

Test it manually over SSH (or with "Run now" in the scheduler):

```
php ~/update-rating.php ~/fabrika.ru/public_html/rating.json
```

Expected output:

```
[2026-11-13 05:17:02] [rating] 5 ★, 160 ratings, 126 reviews (was 5, 160 ratings) → /home/.../rating.json
```

## 3. Cron job (once a day)

Schedule: `17 5 * * *` — every day at 05:17. An odd minute avoids colliding with the bulk of jobs that run at 00:00.

**Beget:** Control panel → "CRON" → "Add task":

```
/usr/local/bin/php ~/update-rating.php ~/fabrika.ru/public_html/rating.json
```

**Timeweb:** Control panel → "Cron scheduler" → "Add task". The PHP path depends on the selected version
(the panel shows it, e.g. `/opt/php83/bin/php`):

```
/opt/php83/bin/php ~/update-rating.php ~/fabrika.ru/public_html/rating.json
```

Replace `fabrika.ru/public_html` with the actual path to your site.

## Troubleshooting

- `aggregateRating block not found` or `HTTP 403` — Yandex served a captcha or changed the page markup.
  The site keeps showing the last known numbers. If it repeats for several days, the parser in the script needs updating.
- `failed to write` — the cron user has no write permission on the site directory.
- Don't run the script more than a couple of times a day, or Yandex may start answering with a captcha.
