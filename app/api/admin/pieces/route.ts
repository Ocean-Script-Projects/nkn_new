import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { adminGuard } from '@/lib/admin-guard';
import { parsePiecesArray } from '@/lib/admin-catalog-piece-parse';

/** Required to coexist with `output: 'export'` (handlers are not shipped to static hosts). */
export const dynamic = 'force-static';

const filePath = path.join(process.cwd(), 'data', 'pieces.json');

export async function GET(request: NextRequest) {
  const denied = adminGuard(request);
  if (denied) return denied;
  try {
    const raw = await readFile(filePath, 'utf8');
    const data = JSON.parse(raw) as unknown;
    const parsed = parsePiecesArray(data);
    if (!parsed) {
      return NextResponse.json({ error: 'Invalid stored shape' }, { status: 500 });
    }
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: 'Failed to read pieces' }, { status: 500 });
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
  const parsed = parsePiecesArray(body);
  if (!parsed) {
    return NextResponse.json({ error: 'Invalid pieces payload' }, { status: 400 });
  }
  try {
    await writeFile(filePath, `${JSON.stringify(parsed, null, 2)}\n`, 'utf8');
    return NextResponse.json({ ok: true, count: parsed.length });
  } catch {
    return NextResponse.json({ error: 'Failed to write pieces' }, { status: 500 });
  }
}
