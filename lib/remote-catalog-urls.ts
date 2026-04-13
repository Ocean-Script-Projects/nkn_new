/**
 * Public URLs for catalog JSON when hosted on CDN / Spaces (client bundle).
 * Priority: explicit env → derived from NEXT_PUBLIC_MEDIATHEK_BASE_URL.
 */

export function getRemotePiecesJsonUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_PIECES_URL?.trim();
  if (explicit) return explicit;
  const base = process.env.NEXT_PUBLIC_MEDIATHEK_BASE_URL?.trim().replace(
    /\/+$/,
    ''
  );
  return base ? `${base}/catalog/pieces.json` : '';
}

export function getRemoteCategoriesJsonUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_CATEGORIES_URL?.trim();
  if (explicit) return explicit;
  const base = process.env.NEXT_PUBLIC_MEDIATHEK_BASE_URL?.trim().replace(
    /\/+$/,
    ''
  );
  return base ? `${base}/catalog/categories.json` : '';
}

/**
 * Catalog JSON often stores root-relative paths (`/uploads/...`). Resolve them against
 * `NEXT_PUBLIC_MEDIATHEK_BASE_URL` so images load from Spaces/CDN, not from the app origin
 * (which would break under `/[locale]/pieces` and without local `/public/uploads`).
 */
export function resolveCatalogAssetUrl(url: string): string {
  const u = url.trim();
  if (!u) return u;
  if (/^https?:\/\//i.test(u)) return u;
  const base = process.env.NEXT_PUBLIC_MEDIATHEK_BASE_URL?.trim().replace(
    /\/+$/,
    ''
  );
  if (base && u.startsWith('/')) {
    return `${base}${u}`;
  }
  return u;
}
