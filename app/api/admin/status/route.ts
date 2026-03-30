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
      'Серверная админка в production по умолчанию выключена. ' +
      'При статической сборке (output: export) на хостинге раздаётся только папка out — маршрутов /api нет, поэтому правки каталога делают локально: npm run dev. ' +
      'Либо поднимите отдельный Node-сервис без static export и задайте ENABLE_ADMIN_API=true и ADMIN_SECRET.';
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
