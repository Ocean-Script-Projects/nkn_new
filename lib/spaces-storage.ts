import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

/** Object keys in the bucket (no leading slash). */
export const CATALOG_PIECES_KEY = 'catalog/pieces.json';
export const CATALOG_CATEGORIES_KEY = 'catalog/categories.json';
export const UPLOADS_PIECES_PREFIX = 'uploads/pieces';

let client: S3Client | null = null;

/**
 * S3 API endpoint для DigitalOcean Spaces — только регион, без имени бакета:
 * `https://fra1.digitaloceanspaces.com`.
 *
 * Если в env указан публичный хост бакета `https://<bucket>.<region>.digitaloceanspaces.com`,
 * SDK при virtual-hosted-стиле собирает `bucket.bucket.region...` и TLS падает
 * (сертификат выдан на `*.fra1.digitaloceanspaces.com`).
 */
export function normalizeSpacesApiEndpoint(
  raw: string,
  bucketName: string
): string {
  const trimmed = raw.trim().replace(/\/+$/, '');
  try {
    const u = new URL(trimmed.includes('://') ? trimmed : `https://${trimmed}`);
    const host = u.hostname.toLowerCase();
    const parts = host.split('.');
    if (
      parts.length >= 4 &&
      parts[parts.length - 2] === 'digitaloceanspaces' &&
      parts[parts.length - 1] === 'com'
    ) {
      const bucketFromHost = parts[0];
      const region = parts[1];
      if (bucketFromHost === bucketName.trim().toLowerCase()) {
        return `https://${region}.digitaloceanspaces.com`;
      }
    }
  } catch {
    // keep raw
  }
  return trimmed;
}

export function isSpacesStorageEnabled(): boolean {
  return Boolean(
    process.env.SPACES_ENDPOINT?.trim() &&
      process.env.SPACES_BUCKET?.trim() &&
      process.env.SPACES_ACCESS_KEY?.trim() &&
      process.env.SPACES_SECRET_KEY?.trim()
  );
}

function getClient(): S3Client {
  if (!client) {
    const endpoint = normalizeSpacesApiEndpoint(
      process.env.SPACES_ENDPOINT!,
      process.env.SPACES_BUCKET!
    );
    if (endpoint !== process.env.SPACES_ENDPOINT!.trim()) {
      console.info(
        '[spaces] SPACES_ENDPOINT нормализован до API-URL региона (без имени бакета в хосте):',
        endpoint
      );
    }
    client = new S3Client({
      endpoint,
      region: process.env.SPACES_REGION?.trim() || 'us-east-1',
      credentials: {
        accessKeyId: process.env.SPACES_ACCESS_KEY!.trim(),
        secretAccessKey: process.env.SPACES_SECRET_KEY!.trim(),
      },
    });
  }
  return client;
}

function bucket(): string {
  return process.env.SPACES_BUCKET!.trim();
}

/** Read UTF-8 object; `null` if key does not exist. */
export async function spacesGetObjectText(key: string): Promise<string | null> {
  if (!isSpacesStorageEnabled()) return null;
  try {
    const out = await getClient().send(
      new GetObjectCommand({ Bucket: bucket(), Key: key })
    );
    if (!out.Body) return null;
    return await out.Body.transformToString();
  } catch (e: unknown) {
    const err = e as { name?: string; $metadata?: { httpStatusCode?: number } };
    if (err.name === 'NoSuchKey' || err.name === 'NotFound') return null;
    if (err.$metadata?.httpStatusCode === 404) return null;
    throw e;
  }
}

export async function spacesPutObject(
  key: string,
  body: Buffer,
  contentType: string,
  options?: { cacheControl?: string }
): Promise<void> {
  const cacheControl = options?.cacheControl ?? 'public, max-age=60';
  const base = {
    Bucket: bucket(),
    Key: key,
    Body: body,
    ContentType: contentType,
    CacheControl: cacheControl,
  };
  try {
    await getClient().send(new PutObjectCommand({ ...base, ACL: 'public-read' }));
  } catch (e: unknown) {
    const err = e as { name?: string; Code?: string; $metadata?: unknown };
    if (err.name === 'AccessDenied' || err.Code === 'AccessDenied') {
      await getClient().send(new PutObjectCommand(base));
      return;
    }
    throw e;
  }
}

/** Public URL for browser (CDN / Spaces public endpoint). Requires NEXT_PUBLIC_MEDIATHEK_BASE_URL. */
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

export function requireMediathekBaseForPublicUrls(): string {
  const base = (process.env.NEXT_PUBLIC_MEDIATHEK_BASE_URL ?? '').trim();
  if (!base) {
    throw new Error(
      'Set NEXT_PUBLIC_MEDIATHEK_BASE_URL to the public base URL of the bucket (same paths as object keys).'
    );
  }
  return base.replace(/\/+$/, '');
}
