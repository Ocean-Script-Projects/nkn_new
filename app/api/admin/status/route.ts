import { NextResponse } from 'next/server';

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
  });
}
