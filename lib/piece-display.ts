import type { Locale } from './i18n-config';
import type { CatalogPiece, PieceDescriptions, PieceNames } from './catalog-types';

type TranslatePieces = (key: string) => string | string[];

/** Localized title: `names` for locale, then fallback locales, then legacy `name`. */
export function resolvePieceName(
  piece: Pick<CatalogPiece, 'name' | 'names'>,
  locale: Locale
): string {
  const order: Locale[] = [locale, 'en', 'ru', 'de'];
  const seen = new Set<Locale>();
  for (const loc of order) {
    if (seen.has(loc)) continue;
    seen.add(loc);
    const text = piece.names?.[loc]?.trim();
    if (text) return text;
  }
  return piece.name?.trim() || '';
}

/** Inline locale text wins; then other locales; then i18n via `descriptionKey`. */
export function resolvePieceDescriptionText(
  piece: Pick<CatalogPiece, 'descriptionKey' | 'descriptions'>,
  locale: Locale,
  tPieces: TranslatePieces
): string {
  const order: Locale[] = [locale, 'en', 'ru', 'de'];
  const seen = new Set<Locale>();
  for (const loc of order) {
    if (seen.has(loc)) continue;
    seen.add(loc);
    const text = piece.descriptions?.[loc]?.trim();
    if (text) return text;
  }

  const descKey = piece.descriptionKey?.replace(/^pieces\./, '').trim() || '';
  if (!descKey) return '';
  const fromI18n = tPieces(`pieces.${descKey}`);
  return typeof fromI18n === 'string' ? fromI18n : '';
}

export function formatPriceEUR(
  priceEUR: number | null | undefined,
  locale: Locale
): string | null {
  if (priceEUR == null || !Number.isFinite(priceEUR)) return null;
  const locTag = locale === 'ru' ? 'ru-RU' : locale === 'de' ? 'de-DE' : 'en-GB';
  return new Intl.NumberFormat(locTag, {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(priceEUR);
}

export function emptyDescriptions(): PieceDescriptions {
  return { ru: '', en: '', de: '' };
}

export function emptyNames(): PieceNames {
  return { ru: '', en: '', de: '' };
}

/** All image URLs for a piece (deduped). `images` or a single `image`. */
export function pieceImageUrls(
  piece: Pick<CatalogPiece, 'image' | 'images'>
): string[] {
  const extra = piece.images?.map((u) => u.trim()).filter(Boolean) ?? [];
  const uniq = [...new Set(extra)];
  if (uniq.length) return uniq;
  const one = piece.image?.trim();
  return one ? [one] : [];
}

/** Prefer ru → en → de → previous legacy `name` for JSON `name` field. */
export function deriveLegacyPieceName(
  names: PieceNames | undefined,
  previousName: string
): string {
  const n =
    names?.ru?.trim() ||
    names?.en?.trim() ||
    names?.de?.trim() ||
    previousName.trim();
  return n || 'Untitled';
}
