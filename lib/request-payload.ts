import type { RequestModalContext } from '@/lib/request-types';

/** Источник заявки (для текста в Telegram). */
export type RequestSource = 'modal' | 'contact' | 'about' | 'services' | 'upcycling';

/** Тело POST /api/request — единый контракт для модалки и страничных форм. */
export interface RequestPayload {
  name: string;
  contact: string;
  message: string;
  projectType?: string;
  contactMethod?: string;
  locale?: string;
  source?: RequestSource;
  context?: RequestModalContext;
  /** Страница контакта: выбранные услуги */
  selectedServices?: string[];
  email?: string;
  phone?: string;
  /** Страница услуг: выбранная услуга */
  service?: string;
  /** Страница upcycling: описание изделия */
  garment?: string;
}
