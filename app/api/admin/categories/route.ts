import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { adminGuard } from '@/lib/admin-guard';
import type { CatalogCategory } from '@/lib/catalog-types';
import type { Locale } from '@/lib/i18n-config';

export const dynamic = 'force-static';

const filePath = path.join(process.cwd(), 'data', 'categories.json');

const locales: Locale[] = ['ru', 'en', 'de'];

function parseCategories(body: unknown): CatalogCategory[] | null {
  if (!Array.isArray(body)) return null;
  const out: CatalogCategory[] = [];
  for (const raw of body) {
    if (!raw || typeof raw !== 'object') return null;
    const o = raw as Record<string, unknown>;
    const id = String(o.id ?? '').trim();
    const labelsRaw = o.labels;
    if (!id || !labelsRaw || typeof labelsRaw !== 'object') return null;
    const lr = labelsRaw as Record<string, unknown>;
    const labels: Record<Locale, string> = {
      ru: String(lr.ru ?? lr.en ?? id),
      en: String(lr.en ?? lr.ru ?? id),
      de: String(lr.de ?? lr.en ?? id),
    };
    for (const k of locales) {
      if (!labels[k].length) return null;
    }
    out.push({ id, labels });
  }
  if (!out.some((c) => c.id === 'all')) {
    return null;
  }
  return out;
}

export async function GET(request: NextRequest) {
  const denied = adminGuard(request);
  if (denied) return denied;
  try {
    const raw = await readFile(filePath, 'utf8');
    const data = JSON.parse(raw) as unknown;
    const parsed = parseCategories(data);
    if (!parsed) {
      return NextResponse.json({ error: 'Invalid stored shape' }, { status: 500 });
    }
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: 'Failed to read categories' }, { status: 500 });
  }
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
  const parsed = parseCategories(body);
  if (!parsed) {
    return NextResponse.json(
      { error: 'Invalid categories payload (need id + labels ru/en/de; must include "all")' },
      { status: 400 }
    );
  }
  try {
    await writeFile(filePath, `${JSON.stringify(parsed, null, 2)}\n`, 'utf8');
    return NextResponse.json({ ok: true, count: parsed.length });
  } catch {
    return NextResponse.json({ error: 'Failed to write categories' }, { status: 500 });
  }
}
