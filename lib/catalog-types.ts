import type { Locale } from './i18n-config';

export type PieceType = 'atelier made' | 'one-of-one' | 'limited';

/** Optional per-locale copy stored in catalog JSON (overrides `descriptionKey` / i18n when set). */
export type PieceDescriptions = Partial<Record<Locale, string>>;

/** Per-locale product title; falls back to `name` when empty for a locale. */
export type PieceNames = Partial<Record<Locale, string>>;

export interface CatalogPiece {
  id: string;
  /** Legacy / default title; auto-filled from `names` in admin when saving. */
  name: string;
  names?: PieceNames;
  category: string;
  type: PieceType;
  /** Cover / first image (same as `images[0]` when `images` is set). */
  image: string;
  /** Extra gallery URLs after the first; omit when only one photo. */
  images?: string[];
  descriptionKey: string;
  descriptions?: PieceDescriptions;
  /** Whole euros; omit or `null` to hide price on the site. */
  priceEUR?: number | null;
  /** If true, block on the home page «featured» section (order = order in catalog). */
  featuredOnHome?: boolean;
}

export interface CatalogCategory {
  id: string;
  labels: Record<Locale, string>;
}

export function labelForLocale(
  category: CatalogCategory,
  locale: Locale
): string {
  return category.labels[locale] ?? category.labels.en ?? category.id;
}
