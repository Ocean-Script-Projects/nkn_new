/**
 * Public URL for CDN / Spaces (client-safe, no AWS SDK).
 * Object keys match bucket paths, e.g. `uploads/pieces/photo.png`.
 */
export function publicMediathekUrl(objectKey: string): string {
  const base = (process.env.NEXT_PUBLIC_MEDIATHEK_BASE_URL ?? '')
    .trim()
    .replace(/\/+$/, '');
  const k = objectKey.replace(/^\/+/, '');
  if (!base) {
    return `/${k}`;
  }
  return `${base}/${k}`;
}
