import { NextRequest, NextResponse } from 'next/server';
import type { RequestPayload, RequestSource } from '@/lib/request-payload';
import { formatRequestTelegramHtml, sendTelegramHtml } from '@/lib/telegram-notify';

export type { RequestPayload } from '@/lib/request-payload';

const REQUEST_SOURCES: RequestSource[] = ['modal', 'contact', 'about', 'services', 'upcycling'];

function parseSource(v: unknown): RequestSource | undefined {
  if (typeof v !== 'string') return undefined;
  return REQUEST_SOURCES.includes(v as RequestSource) ? (v as RequestSource) : undefined;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function asString(v: unknown): string | undefined {
  if (typeof v === 'string') return v;
  return undefined;
}

function asStringArray(v: unknown): string[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const out = v.filter((x): x is string => typeof x === 'string');
  return out.length ? out : undefined;
}

export async function POST(request: NextRequest) {
  try {
    const raw: unknown = await request.json();
    if (!isRecord(raw)) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const name = asString(raw.name)?.trim() ?? '';
    const contact = asString(raw.contact)?.trim() ?? '';
    const message = asString(raw.message)?.trim() ?? '';

    if (!name || !contact || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: name, contact, message' },
        { status: 400 }
      );
    }

    if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
      console.error('[Request API] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set');
      return NextResponse.json(
        { error: 'Server is not configured for notifications' },
        { status: 503 }
      );
    }

    const payload: RequestPayload = {
      name,
      contact,
      message,
      projectType: asString(raw.projectType)?.trim() || undefined,
      contactMethod: asString(raw.contactMethod)?.trim() || undefined,
      locale: asString(raw.locale)?.trim() || undefined,
      source: parseSource(raw.source),
      context: isRecord(raw.context) ? (raw.context as RequestPayload['context']) : undefined,
      selectedServices: asStringArray(raw.selectedServices),
      email: asString(raw.email)?.trim() || undefined,
      phone: asString(raw.phone)?.trim() || undefined,
      service: asString(raw.service)?.trim() || undefined,
      garment: asString(raw.garment)?.trim() || undefined,
    };

    const html = formatRequestTelegramHtml(payload);
    const sent = await sendTelegramHtml(html);

    if (!sent.ok) {
      console.error('[Request API] Telegram send failed:', sent.error);
      return NextResponse.json(
        { error: sent.error ?? 'Failed to send notification' },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Request API] Error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
