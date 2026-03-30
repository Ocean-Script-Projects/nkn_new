'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Locale } from './i18n-config';
import type { CatalogCategory } from './catalog-types';
import { labelForLocale } from './catalog-types';
import staticCategories from '@/data/categories.json';

const remoteUrl =
  typeof process.env.NEXT_PUBLIC_CATEGORIES_URL === 'string'
    ? process.env.NEXT_PUBLIC_CATEGORIES_URL.trim()
    : '';

function normalizeCategories(raw: unknown): CatalogCategory[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((c) => {
    const o = c as Record<string, unknown>;
    const labels = (o.labels ?? {}) as Record<string, string>;
    return {
      id: String(o.id ?? ''),
      labels: {
        ru: String(labels.ru ?? labels.en ?? o.id ?? ''),
        en: String(labels.en ?? labels.ru ?? o.id ?? ''),
        de: String(labels.de ?? labels.en ?? o.id ?? ''),
      },
    };
  });
}

export function useCatalogCategories() {
  const [categories, setCategories] = useState<CatalogCategory[]>(() =>
    remoteUrl ? [] : normalizeCategories(staticCategories)
  );
  const [loading, setLoading] = useState(!!remoteUrl);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!remoteUrl) {
      setCategories(normalizeCategories(staticCategories));
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(remoteUrl, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: unknown = await res.json();
      setCategories(normalizeCategories(data));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { categories, loading, error, reload };
}

export function filterTabsForLocale(
  categories: CatalogCategory[],
  locale: Locale
): { id: string; label: string }[] {
  return categories.map((c) => ({
    id: c.id,
    label: labelForLocale(c, locale),
  }));
}
