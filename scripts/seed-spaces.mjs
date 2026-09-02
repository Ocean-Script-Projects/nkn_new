/**
 * Prepares a freshly created DigitalOcean Space for the site.
 *
 *   node scripts/seed-spaces.mjs          # create missing catalog files, then check access
 *   node scripts/seed-spaces.mjs --force  # overwrite them even if they already exist
 *
 * Reads credentials from .env. Creates the two objects the app expects
 * (see CATALOG_PIECES_KEY / CATALOG_CATEGORIES_KEY in lib/spaces-storage.ts),
 * then verifies they are publicly readable and that CORS allows the live site
 * to fetch them — the browser loads this JSON cross-origin, so a Space without
 * a CORS rule leaves the catalog empty even when the files are correct.
 */
import fs from 'node:fs';
import path from 'node:path';
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';

const FORCE = process.argv.includes('--force');
const ORIGINS = ['https://www.nknbrand.com', 'https://nknbrand.com'];

// Minimal .env reader — the script runs outside Next, which would otherwise load it.
for (const line of fs.readFileSync('.env', 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const required = ['SPACES_ENDPOINT', 'SPACES_BUCKET', 'SPACES_ACCESS_KEY', 'SPACES_SECRET_KEY'];
const missing = required.filter((k) => !process.env[k]?.trim());
if (missing.length) {
  console.error('В .env не хватает:', missing.join(', '));
  process.exit(1);
}

const bucket = process.env.SPACES_BUCKET.trim();
// The SDK needs the regional endpoint; a bucket host would be doubled up by
// virtual-host addressing and break TLS.
const rawEndpoint = process.env.SPACES_ENDPOINT.trim().replace(/\/+$/, '');
const host = new URL(rawEndpoint.includes('://') ? rawEndpoint : `https://${rawEndpoint}`).hostname;
const parts = host.split('.');
const region = parts.at(-3) === undefined ? parts[0] : (parts[0] === bucket ? parts[1] : parts[0]);
const endpoint = `https://${region}.digitaloceanspaces.com`;
const publicBase = (process.env.NEXT_PUBLIC_MEDIATHEK_BASE_URL || `https://${bucket}.${region}.digitaloceanspaces.com`)
  .trim().replace(/\/+$/, '');

console.log(`бакет:   ${bucket}`);
console.log(`API:     ${endpoint}`);
console.log(`публично: ${publicBase}\n`);

const s3 = new S3Client({
  region: 'us-east-1',
  endpoint,
  forcePathStyle: false,
  credentials: {
    accessKeyId: process.env.SPACES_ACCESS_KEY.trim(),
    secretAccessKey: process.env.SPACES_SECRET_KEY.trim(),
  },
});

// pieces starts empty: the local data/pieces.json is leftover test data whose
// images point at files that no longer exist in a recreated Space.
const objects = [
  { key: 'catalog/pieces.json', body: '[]\n' },
  { key: 'catalog/categories.json', body: fs.readFileSync(path.join('data', 'categories.json'), 'utf8') },
];

for (const { key, body } of objects) {
  let exists = false;
  try {
    await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    exists = true;
  } catch { /* missing — will be created */ }

  if (exists && !FORCE) {
    console.log(`= ${key} уже есть, пропускаю (--force чтобы перезаписать)`);
    continue;
  }
  await s3.send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: Buffer.from(body, 'utf8'),
    ContentType: 'application/json; charset=utf-8',
    CacheControl: 'public, max-age=60',
    ACL: 'public-read',
  }));
  console.log(`${exists ? '~ перезаписан' : '+ создан'} ${key}`);
}

console.log('\nПроверка доступа из браузера:');
let allOk = true;
for (const { key } of objects) {
  const url = `${publicBase}/${key}`;
  for (const origin of ORIGINS) {
    let line;
    try {
      const res = await fetch(url, { headers: { Origin: origin } });
      const acao = res.headers.get('access-control-allow-origin');
      const ok = res.ok && (acao === '*' || acao === origin);
      if (!ok) allOk = false;
      line = `${ok ? 'OK  ' : 'FAIL'} ${origin} → HTTP ${res.status}, ACAO: ${acao ?? '(нет заголовка)'}`;
    } catch (e) {
      allOk = false;
      line = `FAIL ${origin} → ${e.message}`;
    }
    console.log(`  ${key}  ${line}`);
  }
}

if (!allOk) {
  console.log(`
Что-то не прошло:
  HTTP 403        → в настройках Space включите File Listing / сделайте объекты публичными
  нет ACAO        → добавьте CORS-правило: Settings → CORS Configurations
                    Origin: ${ORIGINS.join(' и ')}
                    Allowed Method: GET, Access Control Max Age: 3600`);
  process.exit(1);
}
console.log('\nВсё в порядке — каталог доступен сайту.');
