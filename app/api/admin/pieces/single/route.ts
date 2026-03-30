import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { adminGuard } from '@/lib/admin-guard';
import { parsePieceObject, parsePiecesArray } from '@/lib/admin-catalog-piece-parse';

export const dynamic = 'force-static';

const filePath = path.join(process.cwd(), 'data', 'pieces.json');

/** PUT one piece by body.id (static path for output: export). */
export async function PUT(request: NextRequest) {
  const denied = adminGuard(request);
  if (denied) return denied;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const piece = parsePieceObject(body);
  if (!piece) {
    return NextResponse.json({ error: 'Invalid piece' }, { status: 400 });
  }

  const targetId = piece.id;

  try {
    const raw = await readFile(filePath, 'utf8');
    const list = parsePiecesArray(JSON.parse(raw) as unknown);
    if (!list) {
      return NextResponse.json({ error: 'Corrupt pieces.json' }, { status: 500 });
    }

    const idx = list.findIndex((p) => p.id === targetId);
    const next = idx === -1 ? [...list, piece] : list.map((p, i) => (i === idx ? piece : p));

    await writeFile(filePath, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
    return NextResponse.json({ ok: true, created: idx === -1 });
  } catch {
    return NextResponse.json({ error: 'Failed to save piece' }, { status: 500 });
  }
}
