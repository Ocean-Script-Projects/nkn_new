'use client';

import { useCallback, useEffect, useState } from 'react';
import type { CatalogPiece, PieceDescriptions } from './catalog-types';
import type { Locale } from './i18n-config';
import staticPieces from '@/data/pieces.json';
import { getRemotePiecesJsonUrl } from '@/lib/remote-catalog-urls';

const remoteUrl = getRemotePiecesJsonUrl();

const locales: Locale[] = ['ru', 'en', 'de'];

function parseLocaleMapLoose(raw: unknown): PieceDescriptions | undefined {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return undefined;
  const dr = raw as Record<string, unknown>;
  const out: PieceDescriptions = {};
  for (const loc of locales) {
    const v = dr[loc];
    if (v == null) continue;
    const s = String(v).trim();
    if (s) out[loc] = s;
  }
  return Object.keys(out).length ? out : undefined;
}

function parsePriceLoose(o: Record<string, unknown>): number | null | undefined {
  if (!('priceEUR' in o)) return undefined;
  const raw = o.priceEUR;
  if (raw === null) return null;
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw;
  if (typeof raw === 'string' && raw.trim() !== '') {
    const n = Number(raw);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

function parseImagesLoose(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return [
    ...new Set(
      raw
        .map((x) => (typeof x === 'string' ? x.trim() : String(x ?? '').trim()))
        .filter(Boolean)
    ),
  ];
}

function normalizePieces(raw: unknown): CatalogPiece[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((p) => {
    const o = p as Record<string, unknown>;
    const nameRaw = String(o.name ?? '');
    const names = parseLocaleMapLoose(o.names);
    const imagesParsed = parseImagesLoose(o.images);
    let image = String(o.image ?? '').trim();
    if (imagesParsed.length > 0) {
      image = imagesParsed[0];
    }
    const row: CatalogPiece = {
      id: String(o.id ?? ''),
      name:
        nameRaw.trim() ||
        names?.ru ||
        names?.en ||
        names?.de ||
        '',
      category: String(o.category ?? ''),
      type: o.type as CatalogPiece['type'],
      image,
      descriptionKey: String(o.descriptionKey ?? ''),
    };
    if (names) row.names = names;
    const descriptions = parseLocaleMapLoose(o.descriptions);
    if (descriptions) row.descriptions = descriptions;
    const priceEUR = parsePriceLoose(o);
    if (priceEUR !== undefined) row.priceEUR = priceEUR;
    if (imagesParsed.length > 1) row.images = imagesParsed;
    if (typeof o.featuredOnHome === 'boolean') row.featuredOnHome = o.featuredOnHome;
    return row;
  });
}

export function usePiecesList() {
  const [pieces, setPieces] = useState<CatalogPiece[]>(() =>
    remoteUrl ? [] : normalizePieces(staticPieces)
  );
  const [loading, setLoading] = useState(!!remoteUrl);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!remoteUrl) {
      setPieces(normalizePieces(staticPieces));
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(remoteUrl, { cache: 'no-store' });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data: unknown = await res.json();
      setPieces(normalizePieces(data));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load pieces');
      setPieces([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { pieces, loading, error, reload };
}
