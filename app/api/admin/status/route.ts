import { NextResponse } from 'next/server';
import { isSpacesStorageEnabled } from '@/lib/spaces-storage';

export async function GET() {
  const dev = process.env.NODE_ENV === 'development';
  const hasSecret = Boolean(process.env.ADMIN_SECRET?.length);
  /** Явное включение админ-API в production (полный Next / Node, без output: export). */
  const adminEnabledInProd =
    process.env.ENABLE_ADMIN_API === 'true' && hasSecret;

  const ok = dev || adminEnabledInProd;
  const secretRequired = hasSecret;

  let message: string;
  if (ok) {
    message = dev
      ? secretRequired
        ? 'Укажите заголовок x-admin-secret, совпадающий с ADMIN_SECRET.'
        : 'Режим разработки: запись без секрета разрешена.'
      : 'Admin API включён (ENABLE_ADMIN_API=true + ADMIN_SECRET).';
  } else {
    message =
      'В production админ-API выключены, пока не заданы ENABLE_ADMIN_API=true и ADMIN_SECRET в переменных окружения сервера.';
  }

  return NextResponse.json({
    ok,
    secretRequired,
    message,
    catalogStorage: isSpacesStorageEnabled() ? 'spaces' : 'filesystem',
    mediathekConfigured: Boolean(
      process.env.NEXT_PUBLIC_MEDIATHEK_BASE_URL?.trim()
    ),
  });
}
