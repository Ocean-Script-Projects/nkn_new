import { NextResponse } from 'next/server';
import { isSpacesStorageEnabled } from '@/lib/spaces-storage';

export const dynamic = 'force-static';

export async function GET() {
  const dev = process.env.NODE_ENV === 'development';
  const secretRequired = Boolean(process.env.ADMIN_SECRET?.length);
  return NextResponse.json({
    ok: dev,
    secretRequired,
    message: dev
      ? secretRequired
        ? 'Set x-admin-secret header to match ADMIN_SECRET.'
        : 'Development mode: writes allowed without secret.'
      : 'Admin API disabled outside development.',
    catalogStorage: isSpacesStorageEnabled() ? 'spaces' : 'filesystem',
    mediathekConfigured: Boolean(
      process.env.NEXT_PUBLIC_MEDIATHEK_BASE_URL?.trim()
    ),
  });
}
