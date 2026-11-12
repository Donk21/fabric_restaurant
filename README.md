# Fabrika — restaurant & hookah bar landing page

Landing page for **Fabrika** («Фабрика»), an industrial-loft restaurant and hookah bar in Rostov-on-Don, Russia.
Built with React and Vite as a static site that can be hosted anywhere. The site content is in Russian.

## Features

- **Hero section** with an animated hookah-smoke background (SVG `feTurbulence` + `feDisplacementMap`), a flickering turquoise neon sign and a live open/closed status in Moscow time.
- **Menu page** (`menu.html`): dish cards with photo, name, portion and price, grouped by category, with a sticky category bar that follows scrolling and accent-insensitive search (`е`/`ё`). The landing shows a bestsellers preview that links to it.
- **Table booking form**:
  - time slots generated from opening hours, with lead time and the last bookable slot taken into account;
  - phone input mask `+7 (XXX) XXX-XX-XX`, inline validation and a guest stepper;
  - a confirmation modal that forwards the booking to the manager via WhatsApp;
  - an optional POST to your own endpoint (CRM, Telegram bot, etc.).
- **Opening hours** table that highlights the current day.
- **Yandex Maps rating**: the rating and review count are pulled from the organization's public Yandex Maps page, before every build and daily via cron on the hosting.
- **Contacts** with an embedded Yandex map.
- Responsive layout; animations are disabled for users with `prefers-reduced-motion`.

## Tech stack

- [React 19](https://react.dev/)
- [Vite 6](https://vite.dev/)
- Plain CSS (no framework), Google Fonts (Russo One, Manrope, Caveat)
- Node.js script + PHP script for the rating refresh

## Getting started

Requires Node.js 18+.

```bash
npm install
npm run dev
```

The dev server runs at http://localhost:5173. To open the site from a phone on the same network, run `npm run dev -- --host`.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Fetch the latest rating, then build the production site into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run rating` | Fetch the rating from Yandex Maps into `public/rating.json` |

## Project structure

```
index.html                 landing page shell: meta tags, fonts, #root
menu.html                  menu page shell
public/
  assets/                  photos and logo
  assets/dishes/           dish photos; placeholder.svg is shown until a dish has one
  rating.json              Yandex Maps rating (auto-generated)
src/
  main.jsx                 landing entry point
  menu.jsx                 menu page entry point
  api/menu.js              fetchMenu(): the single source of menu data (swap for a DB/API call later)
  App.jsx                  page layout
  config.js                opening hours, booking rules, phone, Yandex org ID, booking endpoint
  data/menu.js             menu items
  hooks/                   useNow (Moscow time ticker), useYandexRating, useMenu
  utils/                   time & booking slot helpers, phone mask
  styles/style.css         all styles
  components/              one component per file:
    Header, Hero, HeroSmoke, NeonSign, OpenStatus,
    About, Menu, MenuPage, CategoryNav, MenuSearch, DishCard,
    Hours, Schedule, Booking, BookingForm, FormField,
    GuestStepper, Checkbox, BookingModal,
    Contacts, Footer, Gear, GearSprite
scripts/
  fetch-yandex-rating.mjs  rating fetcher (runs before every build)
deploy/
  update-rating.php        rating fetcher for cron on shared hosting
  README.md                deployment guide
```

## Configuration

Most settings live in [`src/config.js`](src/config.js):

| Key | Purpose |
|---|---|
| `open`, `close` | Opening hours, in minutes from midnight |
| `lastBooking`, `slotStep`, `leadTime`, `bookingDaysAhead` | Booking slot rules |
| `minGuests`, `maxGuests` | Allowed party size |
| `phone`, `phoneDisplay` | Phone number for links/WhatsApp and its display format |
| `yandexOrgId` | Organization ID on Yandex Maps (also set as `ORG_ID` in `deploy/update-rating.php`) |
| `ratingFallback` | Rating shown if `rating.json` can't be loaded |
| `endpoint` | URL that receives bookings as JSON via POST. Leave empty to rely on WhatsApp only |

The menu is edited in [`src/data/menu.js`](src/data/menu.js); each dish is `{ id, name, weight, price, hit, image }`. Set `image` to a URL (for example `assets/dishes/ribs.jpg`) to show a photo; `null` shows the placeholder. Components read the menu only through `fetchMenu()` in [`src/api/menu.js`](src/api/menu.js), so moving the menu to a database means changing that one function.

## Yandex Maps rating

Browsers can't read Yandex Maps pages directly because of CORS, so the rating is fetched server-side and stored in `rating.json`, which the site loads at runtime:

1. `npm run build` runs `scripts/fetch-yandex-rating.mjs` first and writes `public/rating.json`.
2. On the hosting, `deploy/update-rating.php` refreshes `rating.json` once a day via cron, with no rebuild needed.

The scripts parse the public page's schema.org `AggregateRating` markup; this is not an official API. If the request fails (network error, captcha, markup change), the previous `rating.json` is kept and the build is not interrupted. If the file is missing, the site shows `ratingFallback` from the config.

## Deployment

1. `npm run build`
2. Upload the contents of `dist/` to the web root of your hosting.
3. Set up the daily rating refresh: see [`deploy/README.md`](deploy/README.md).

All asset paths are relative (`base: "./"`), so the site works both at a domain root and in a subdirectory.
