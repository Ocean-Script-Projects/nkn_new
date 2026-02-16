'use client';

import { useEffect } from 'react';
import { defaultLocale } from '@/lib/i18n-config';

export default function RootPage() {
  useEffect(() => {
    // Используем относительный путь, который будет работать с любым basePath
    window.location.href = `/${defaultLocale}/`;
  }, []);

  return null;
}
