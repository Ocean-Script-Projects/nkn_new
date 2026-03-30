import { NextRequest, NextResponse } from 'next/server';
import { adminGuard } from '@/lib/admin-guard';
import { parsePiecesArray } from '@/lib/admin-catalog-piece-parse';
import { readPiecesJsonRaw, writePiecesJsonRaw } from '@/lib/catalog-persistence';

/** Required to coexist with `output: 'export'` (handlers are not shipped to static hosts). */
export const dynamic = 'force-static';

export async function GET(request: NextRequest) {
  const denied = adminGuard(request);
  if (denied) return denied;
  try {
    const raw = await readPiecesJsonRaw();
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
    const writeResult = await writePiecesJsonRaw(
      `${JSON.stringify(parsed, null, 2)}\n`
    );
    return NextResponse.json({
      ok: true,
      count: parsed.length,
      destination: writeResult.destination,
      ...(writeResult.warning ? { warning: writeResult.warning } : {}),
    });
  } catch (e) {
    console.error('[admin/pieces PUT]', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to write pieces' },
      { status: 500 }
    );
  }
}
