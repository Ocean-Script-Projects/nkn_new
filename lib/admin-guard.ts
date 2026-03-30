import { NextRequest, NextResponse } from 'next/server';

/** Admin mutations only run in development; optional `ADMIN_SECRET` header `x-admin-secret`. */
export function adminGuard(request: NextRequest): NextResponse | null {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Admin API is only available in development mode.' },
      { status: 403 }
    );
  }

  const secret = process.env.ADMIN_SECRET;
  if (secret && request.headers.get('x-admin-secret') !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return null;
}
