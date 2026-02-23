/**
 * Deterministic date formatter - same output on server and client.
 * Avoids hydration mismatch from toLocaleDateString differences.
 */

type Locale = 'en' | 'de' | 'ru';

const MONTHS: Record<Locale, string[]> = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  de: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
  ru: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
};

export function formatDate(dateStr: string, locale: Locale): string {
  const date = new Date(dateStr + 'T12:00:00');
  const day = date.getDate();
  const month = MONTHS[locale][date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

export function formatDateRange(dateStr: string, dateEndStr: string, locale: Locale): string {
  const start = formatDate(dateStr, locale);
  const end = formatDate(dateEndStr, locale);
  return `${start} — ${end}`;
}
