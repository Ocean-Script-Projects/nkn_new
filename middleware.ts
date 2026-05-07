import { NextResponse, type NextRequest } from 'next/server';

import { locales, defaultLocale } from '@/lib/i18n-config';

const LOCALE_HEADER = 'x-locale';

function detectLocaleFromPath(pathname: string): string {
  const seg = pathname.split('/')[1] ?? '';
  return locales.includes(seg as (typeof locales)[number]) ? seg : defaultLocale;
}

export function middleware(request: NextRequest) {
  const locale = detectLocaleFromPath(request.nextUrl.pathname);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_HEADER, locale);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|map)$).*)',
  ],
};

