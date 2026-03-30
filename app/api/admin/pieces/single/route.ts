import { NextRequest, NextResponse } from 'next/server';
import { adminGuard } from '@/lib/admin-guard';
import { parsePieceObject, parsePiecesArray } from '@/lib/admin-catalog-piece-parse';
import { readPiecesJsonRaw, writePiecesJsonRaw } from '@/lib/catalog-persistence';

export const dynamic = 'force-static';

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
    const raw = await readPiecesJsonRaw();
    const list = parsePiecesArray(JSON.parse(raw) as unknown);
    if (!list) {
      return NextResponse.json({ error: 'Corrupt pieces.json' }, { status: 500 });
    }

    const idx = list.findIndex((p) => p.id === targetId);
    const next = idx === -1 ? [...list, piece] : list.map((p, i) => (i === idx ? piece : p));

    const writeResult = await writePiecesJsonRaw(
      `${JSON.stringify(next, null, 2)}\n`
    );
    return NextResponse.json({
      ok: true,
      created: idx === -1,
      destination: writeResult.destination,
      ...(writeResult.warning ? { warning: writeResult.warning } : {}),
    });
  } catch (e) {
    console.error('[admin/pieces/single]', e);
    return NextResponse.json(
      {
        error:
          e instanceof Error ? e.message : 'Failed to save piece',
      },
      { status: 500 }
    );
  }
}
