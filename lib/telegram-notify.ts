import type { RequestPayload } from '@/lib/request-payload';

const TELEGRAM_MAX_MESSAGE_LENGTH = 4096;

/** Экранирование для Telegram HTML parse_mode. */
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const SOURCE_LABELS: Record<NonNullable<RequestPayload['source']>, string> = {
  modal: 'Модальное окно',
  contact: 'Страница контактов',
  about: 'Страница «О себе»',
  services: 'Страница услуг',
  upcycling: 'Страница upcycling',
};

export function formatRequestTelegramHtml(payload: RequestPayload): string {
  const {
    name,
    contact,
    message,
    projectType,
    contactMethod,
    locale,
    source,
    context,
    selectedServices,
    email,
    phone,
    service,
    garment,
  } = payload;

  const lines: (string | null)[] = [
    '📩 <b>NKN Atelier — новая заявка</b>',
    '',
    source ? `<b>Источник:</b> ${escapeHtml(SOURCE_LABELS[source] ?? source)}` : null,
    locale ? `<b>Локаль:</b> ${escapeHtml(locale)}` : null,
    '',
    `<b>Имя:</b> ${escapeHtml(name)}`,
    contactMethod ? `<b>Способ связи:</b> ${escapeHtml(contactMethod)}` : null,
    `<b>Контакт:</b> ${escapeHtml(contact)}`,
    email ? `<b>Email:</b> ${escapeHtml(email)}` : null,
    phone ? `<b>Телефон:</b> ${escapeHtml(phone)}` : null,
    projectType ? `<b>Тип проекта:</b> ${escapeHtml(projectType)}` : null,
    service ? `<b>Услуга:</b> ${escapeHtml(service)}` : null,
    garment ? `<b>Изделие / запрос:</b> ${escapeHtml(garment)}` : null,
    selectedServices?.length
      ? `<b>Интересующие услуги:</b> ${escapeHtml(selectedServices.join(', '))}`
      : null,
    context?.source === 'piece' && context?.pieceName
      ? `<b>По поводу изделия:</b> ${escapeHtml(context.pieceName)}${context.pieceType ? ` (${escapeHtml(context.pieceType)})` : ''}`
      : null,
    context?.source === 'event' && context?.eventTitle
      ? `<b>По поводу события:</b> ${escapeHtml(context.eventTitle)}`
      : null,
    '',
    '<b>Сообщение:</b>',
    escapeHtml(message),
  ];

  let text = lines.filter(Boolean).join('\n');
  if (text.length > TELEGRAM_MAX_MESSAGE_LENGTH) {
    text = `${text.slice(0, TELEGRAM_MAX_MESSAGE_LENGTH - 20)}\n\n<i>…обрезано</i>`;
  }
  return text;
}

export interface SendTelegramResult {
  ok: boolean;
  error?: string;
}

export async function sendTelegramHtml(text: string): Promise<SendTelegramResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return { ok: false, error: 'Telegram is not configured' };
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  });

  const data = (await res.json().catch(() => ({}))) as {
    ok?: boolean;
    description?: string;
  };

  if (!res.ok || !data.ok) {
    return {
      ok: false,
      error: data.description ?? `HTTP ${res.status}`,
    };
  }
  return { ok: true };
}
