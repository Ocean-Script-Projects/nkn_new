import { NextRequest, NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { adminGuard } from '@/lib/admin-guard';
import {
  isSpacesStorageEnabled,
  publicMediathekUrl,
  requireMediathekBaseForPublicUrls,
  spacesPutObject,
  UPLOADS_PIECES_PREFIX,
} from '@/lib/spaces-storage';

export const dynamic = 'force-static';

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

function extFromMime(mime: string): string {
  const m: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
  };
  return m[mime] ?? 'bin';
}

function safeFileBase(name: string): string {
  const base = name
    .replace(/^.*[/\\]/, '')
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .slice(0, 48);
  return base || 'image';
}

export async function POST(request: NextRequest) {
  const denied = adminGuard(request);
  if (denied) return denied;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const file = form.get('file');
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'Expected file field' }, { status: 400 });
  }

  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { error: 'Allowed: JPEG, PNG, WebP, GIF' },
      { status: 400 }
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Max 8 MB' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = extFromMime(file.type);
  const filename = `${Date.now()}-${safeFileBase(file.name)}.${ext}`;

  if (isSpacesStorageEnabled()) {
    try {
      requireMediathekBaseForPublicUrls();
    } catch (e) {
      return NextResponse.json(
        { error: e instanceof Error ? e.message : 'Missing public URL config' },
        { status: 400 }
      );
    }
    const key = `${UPLOADS_PIECES_PREFIX}/${filename}`;
    try {
      await spacesPutObject(key, buffer, file.type, {
        cacheControl: 'public, max-age=31536000, immutable',
      });
    } catch (e) {
      console.error('[admin/upload] Spaces put failed:', e);
      return NextResponse.json(
        { error: e instanceof Error ? e.message : 'Upload to Spaces failed' },
        { status: 500 }
      );
    }
    const url = publicMediathekUrl(key);
    return NextResponse.json({ url });
  }

  const dir = path.join(process.cwd(), 'public', 'uploads', 'pieces');
  await mkdir(dir, { recursive: true });
  const filePath = path.join(dir, filename);
  await writeFile(filePath, buffer);

  /** Site-relative path; client components add `basePath` where needed (see ImageWithFallback). */
  const url = `/uploads/pieces/${filename}`;

  return NextResponse.json({ url });
}
