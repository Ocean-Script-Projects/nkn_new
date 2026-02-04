'use client';

import { useEffect } from 'react';
import { defaultLocale } from '@/lib/i18n-config';

export default function RootPage() {
  useEffect(() => {
    window.location.href = `/${defaultLocale}`;
  }, []);

  return null;
}
