/** Public origin only, no path (e.g. https://www.nknbrand.com). */
export function getPublicOrigin(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.nknbrand.com').replace(
    /\/$/,
    '',
  );
}

/** Next base path without trailing slash, e.g. /nkn_new — mirrors next.config / NEXT_PUBLIC_BASE_PATH. */
export function getBasePathSegment(): string {
  return (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/$/, '');
}

/** Site root for absolute links: origin + optional basePath (GitHub Pages, etc.). */
export function getPublicSiteRoot(): string {
  const origin = getPublicOrigin();
  const bp = getBasePathSegment();
  return bp ? `${origin}${bp}` : origin;
}

/** Absolute URL for a path starting with / (respects trailingSlash routes). */
export function absolutePublicUrl(path: string): string {
  const root = getPublicSiteRoot();
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${root}${p}`;
}
