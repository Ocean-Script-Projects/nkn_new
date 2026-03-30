import { NextRequest, NextResponse } from 'next/server';

function adminApiAllowed(): boolean {
  if (process.env.NODE_ENV === 'development') return true;
  return (
    process.env.ENABLE_ADMIN_API === 'true' &&
    Boolean(process.env.ADMIN_SECRET?.length)
  );
}

/**
 * Защита admin API. Dev: опционально без секрета. Production: только при
 * ENABLE_ADMIN_API=true + ADMIN_SECRET и заголовке x-admin-secret.
 */
export function adminGuard(request: NextRequest): NextResponse | null {
  if (!adminApiAllowed()) {
    return NextResponse.json(
      {
        error:
          'Admin API недоступна. В production задайте ENABLE_ADMIN_API=true и ADMIN_SECRET на сервере.',
      },
      { status: 403 }
    );
  }

  const secret = process.env.ADMIN_SECRET;
  if (secret && request.headers.get('x-admin-secret') !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return null;
}
