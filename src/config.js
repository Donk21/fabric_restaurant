// ===== Настройки =====
export const CONFIG = {
  open: 12 * 60,          // 12:00
  close: 24 * 60,         // 00:00
  lastBooking: 23 * 60,   // последняя бронь
  slotStep: 30,           // шаг слотов, мин
  leadTime: 30,           // бронь не раньше чем через N минут
  bookingDaysAhead: 60,   // на сколько дней вперёд можно бронировать
  minGuests: 1,
  maxGuests: 12,
  phone: "79885402999",
  phoneDisplay: "+7 (988) 540-29-99",
  // ID организации в Яндекс Картах (из ссылки yandex.ru/maps/org/fabrika/<ID>/)
  yandexOrgId: "178860656686",
  // Рейтинг на случай, если rating.json не загрузился
  ratingFallback: { ratingValue: 5.0, ratingCount: 160, reviewCount: 126 },
  // URL вашего обработчика заявок (CRM, Telegram-бот, форма и т.п.).
  // Пусто — заявка оформляется локально и отправляется администратору через WhatsApp.
  endpoint: "",
};

export const PHONE_HREF = `tel:+${CONFIG.phone}`;
