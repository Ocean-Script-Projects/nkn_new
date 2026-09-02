export const locales = ['ru', 'en', 'de'] as const;
/** German is the primary market (Hamburg region), so `/` and hreflang x-default resolve here. */
export const defaultLocale = 'de';
export type Locale = 'ru' | 'en' | 'de';
