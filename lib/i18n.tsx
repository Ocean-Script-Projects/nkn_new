'use client';

import { createContext, useContext, ReactNode } from 'react';

import ruMessages from '@/messages/ru.json';
import enMessages from '@/messages/en.json';
import deMessages from '@/messages/de.json';
import type { Locale } from './i18n-config';

type Messages = typeof ruMessages;

const messagesMap: Record<Locale, Messages> = {
  ru: ruMessages,
  en: enMessages,
  de: deMessages,
};

interface I18nContextType {
  locale: Locale;
  messages: Messages;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({
  children,
  locale,
}: {
  children: ReactNode;
  locale: string;
}) {
  const validLocale = (locale in messagesMap ? locale : 'ru') as Locale;
  const messages = messagesMap[validLocale];

  return (
    <I18nContext.Provider value={{ locale: validLocale, messages }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useLocale(): Locale {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useLocale must be used within I18nProvider');
  }
  return context.locale;
}

export function useTranslations(namespace: keyof Messages) {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslations must be used within I18nProvider');
  }

  const section = context.messages[namespace] as Record<string, unknown>;

  return function t(key: string): string {
    const keys = key.split('.');
    let value: unknown = section;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key;
      }
    }

    return typeof value === 'string' ? value : key;
  };
}

export { locales, defaultLocale, type Locale } from './i18n-config';
