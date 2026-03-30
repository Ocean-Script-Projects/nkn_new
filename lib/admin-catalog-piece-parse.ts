import type { CatalogPiece, PieceDescriptions } from '@/lib/catalog-types';
import type { Locale } from '@/lib/i18n-config';

function isPieceType(v: string): v is CatalogPiece['type'] {
  return v === 'atelier made' || v === 'one-of-one' || v === 'limited';
}

const locales: Locale[] = ['ru', 'en', 'de'];

function parseLocaleStrings(raw: unknown): PieceDescriptions | undefined {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return undefined;
  const dr = raw as Record<string, unknown>;
  const out: PieceDescriptions = {};
  for (const loc of locales) {
    const v = dr[loc];
    if (v === undefined || v === null) continue;
    const s = String(v).trim();
    if (s) out[loc] = s;
  }
  return Object.keys(out).length ? out : undefined;
}

function parseImagesArray(raw: unknown): string[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const urls = raw
    .map((x) => (typeof x === 'string' ? x.trim() : String(x ?? '').trim()))
    .filter(Boolean);
  const dedup = [...new Set(urls)];
  return dedup.length ? dedup : undefined;
}

function parsePriceEUR(o: Record<string, unknown>): number | null | undefined {
  if (!('priceEUR' in o)) return undefined;
  const raw = o.priceEUR;
  if (raw === null) return null;
  if (typeof raw === 'number') {
    if (!Number.isFinite(raw)) return null;
    return raw;
  }
  if (typeof raw === 'string') {
    const t = raw.trim();
    if (t === '') return null;
    const n = Number(t);
    if (!Number.isFinite(n)) return null;
    return n;
  }
  return null;
}

/** Validates and normalizes one catalog piece object (from JSON). */
export function parsePieceObject(raw: unknown): CatalogPiece | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const o = raw as Record<string, unknown>;
  const id = String(o.id ?? '').trim();
  const nameRaw = String(o.name ?? '').trim();
  const category = String(o.category ?? '').trim();
  const typeStr = String(o.type ?? '').trim();
  const imageRaw = String(o.image ?? '').trim();
  const imagesParsed = parseImagesArray(o.images);
  const descriptionKey = String(o.descriptionKey ?? '').trim();
  const names = parseLocaleStrings(o.names);
  const title =
    nameRaw ||
    names?.ru?.trim() ||
    names?.en?.trim() ||
    names?.de?.trim() ||
    '';
  if (!id || !title || !isPieceType(typeStr)) return null;
  const descriptions = parseLocaleStrings(o.descriptions);
  const priceEUR = parsePriceEUR(o);

  let image = imageRaw;
  if (imagesParsed && imagesParsed.length > 0) {
    image = imagesParsed[0];
  }

  const row: CatalogPiece = {
    id,
    name: nameRaw || title,
    category,
    type: typeStr,
    image,
    descriptionKey,
  };
  if (names && Object.keys(names).length > 0) row.names = names;
  if (descriptions) row.descriptions = descriptions;
  if (priceEUR !== undefined) row.priceEUR = priceEUR;
  if (imagesParsed && imagesParsed.length > 1) row.images = imagesParsed;
  if ('featuredOnHome' in o) {
    const v = o.featuredOnHome;
    if (typeof v === 'boolean') row.featuredOnHome = v;
    else if (v === 1 || v === '1' || v === 'true') row.featuredOnHome = true;
    else if (v === 0 || v === '0' || v === 'false') row.featuredOnHome = false;
  }
  return row;
}

export function parsePiecesArray(body: unknown): CatalogPiece[] | null {
  if (!Array.isArray(body)) return null;
  const out: CatalogPiece[] = [];
  for (const raw of body) {
    const row = parsePieceObject(raw);
    if (!row) return null;
    out.push(row);
  }
  return out;
}
