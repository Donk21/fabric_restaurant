// ===== Settings =====
export const CONFIG = {
  open: 12 * 60,          // 12:00
  close: 24 * 60,         // 00:00
  lastBooking: 23 * 60,   // last bookable slot
  slotStep: 30,           // slot step, minutes
  leadTime: 30,           // earliest booking is N minutes from now
  bookingDaysAhead: 60,   // how many days ahead booking is allowed
  minGuests: 1,
  maxGuests: 12,
  phone: "79885402999",
  phoneDisplay: "+7 (988) 540-29-99",
  // Organization ID on Yandex Maps (from the link yandex.ru/maps/org/fabrika/<ID>/)
  yandexOrgId: "178860656686",
  // Rating shown if rating.json fails to load
  ratingFallback: { ratingValue: 5.0, ratingCount: 160, reviewCount: 126 },
  // URL of your booking handler (CRM, Telegram bot, form service, etc.).
  // Empty — the booking is handled locally and sent to the manager via WhatsApp.
  endpoint: "",
};

export const PHONE_HREF = `tel:+${CONFIG.phone}`;
