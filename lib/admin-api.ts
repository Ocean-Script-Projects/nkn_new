/** Prefix for fetch paths when `basePath` is set in production. */
export function withBasePath(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  if (!base) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}`;
}

/** `multipart/form-data` upload (development + admin guard). Returns site-relative image URL. */
export async function uploadCatalogImage(
  file: File,
  secret: string
): Promise<string> {
  const fd = new FormData();
  fd.append('file', file);
  const headers: HeadersInit = {};
  if (secret) headers['x-admin-secret'] = secret;
  const r = await fetch(withBasePath('/api/admin/upload'), {
    method: 'POST',
    headers,
    body: fd,
  });
  const j = (await r.json().catch(() => ({}))) as { url?: string; error?: string };
  if (!r.ok) throw new Error(j.error ?? `Upload failed (${r.status})`);
  if (!j.url) throw new Error('No URL in response');
  return j.url;
}
