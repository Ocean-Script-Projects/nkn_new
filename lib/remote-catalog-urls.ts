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
