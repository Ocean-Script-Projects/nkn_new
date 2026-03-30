import { NextRequest, NextResponse } from 'next/server';
import type { RequestModalContext } from '@/lib/request-types';

export const dynamic = 'force-static';

export interface RequestPayload {
  name: string;
  contact: string;
  projectType?: string;
  message: string;
  context?: RequestModalContext;
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestPayload = await request.json();

    const { name, contact, projectType, message, context } = body;

    if (!name || !contact || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: name, contact, message' },
        { status: 400 }
      );
    }

    // TODO: Send to Telegram bot
    // Example: await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     chat_id: CHAT_ID,
    //     text: formatTelegramMessage({ name, contact, projectType, message, context }),
    //     parse_mode: 'HTML',
    //   }),
    // });

    const telegramMessage = [
      '📩 <b>Новая заявка NKN Atelier</b>',
      '',
      `<b>Имя:</b> ${name}`,
      `<b>Контакты:</b> ${contact}`,
      projectType ? `<b>Тип проекта:</b> ${projectType}` : null,
      context?.source === 'piece' && context?.pieceName
        ? `<b>По поводу изделия:</b> ${context.pieceName}${context.pieceType ? ` (${context.pieceType})` : ''}`
        : null,
      context?.source === 'event' && context?.eventTitle
        ? `<b>По поводу события:</b> ${context.eventTitle}`
        : null,
      '',
      '<b>Сообщение:</b>',
      message,
    ]
      .filter(Boolean)
      .join('\n');

    console.log('[Request API] New request:', {
      name,
      contact,
      projectType,
      message: message.substring(0, 50) + '...',
      context,
      telegramMessage,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Request API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
