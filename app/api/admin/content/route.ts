import { NextRequest, NextResponse } from 'next/server';

import { adminGuard } from '@/lib/admin-guard';
import { locales, type Locale } from '@/lib/i18n-config';
import {
  getBaseMessages,
  getSiteMessages,
  readOverridesRaw,
  writeOverridesRaw,
} from '@/lib/messages-store';

function isLocale(value: string | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/** Overrides must be a nested object whose leaves are strings or string arrays. */
function isValidOverrideShape(value: unknown): boolean {
  if (typeof value === 'string') return true;
  if (Array.isArray(value)) return value.every((item) => typeof item === 'string');
  if (value && typeof value === 'object') {
    return Object.values(value).every(isValidOverrideShape);
  }
  return false;
}

export async function GET(request: NextRequest) {
  const denied = adminGuard(request);
  if (denied) return denied;

  const locale = request.nextUrl.searchParams.get('locale');
  if (!isLocale(locale)) {
    return NextResponse.json({ error: 'Unknown locale' }, { status: 400 });
  }

  let overrides: unknown = {};
  try {
    overrides = JSON.parse(await readOverridesRaw(locale));
  } catch {
    overrides = {};
  }

  return NextResponse.json({
    locale,
    base: getBaseMessages(locale),
    overrides,
    merged: await getSiteMessages(locale),
  });
}

export async function PUT(request: NextRequest) {
  const denied = adminGuard(request);
  if (denied) return denied;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { locale, overrides } = (body ?? {}) as {
    locale?: string;
    overrides?: unknown;
  };

  if (!isLocale(locale ?? null)) {
    return NextResponse.json({ error: 'Unknown locale' }, { status: 400 });
  }
  if (
    !overrides ||
    typeof overrides !== 'object' ||
    Array.isArray(overrides) ||
    !isValidOverrideShape(overrides)
  ) {
    return NextResponse.json(
      { error: 'overrides must be a nested object of strings / string arrays' },
      { status: 400 },
    );
  }

  try {
    // writeOverridesRaw busts the in-process message cache on success.
    const destination = await writeOverridesRaw(
      locale as Locale,
      `${JSON.stringify(overrides, null, 2)}\n`,
    );
    return NextResponse.json({ ok: true, destination });
  } catch (e) {
    console.error('[admin/content PUT]', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to save' },
      { status: 500 },
    );
  }
}
