'use client';

import { useEffect } from 'react';
import { defaultLocale } from '@/lib/i18n-config';

export default function RootPage() {
  useEffect(() => {
    const basePath = '/nkn_new';
    window.location.href = `${basePath}/${defaultLocale}/`;
  }, []);

  return null;
}
