import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';

import {
  isSpacesStorageEnabled,
  spacesGetObjectText,
  spacesPutObject,
} from '@/lib/spaces-storage';
import { defaultLocale, locales, type Locale } from '@/lib/i18n-config';

import ruMessages from '@/messages/ru.json';
import enMessages from '@/messages/en.json';
import deMessages from '@/messages/de.json';

/**
 * Runtime message store.
 *
 * The bundled `messages/{locale}.json` files are the base — they ship with the
 * build and are the fallback if nothing else is available. On top of that we
 * merge a sparse "overrides" object edited from the admin panel and stored in
 * Spaces at `content/{locale}.json`. Only changed leaves live in the override
 * file, so a later code edit to an untouched key still wins.
 *
 * The localized pages are already dynamic (the root layout reads `headers()`),
 * so there is no full-route cache to bust. We only need to avoid re-reading the
 * tiny override file from Spaces on every request: a short in-process TTL cache
 * does that, and `bustMessagesCache()` (called by the admin PUT) drops it at
 * once on the instance that handled the write.
 */

const CACHE_TTL_MS = 15_000;

export type MessageTree = Record<string, unknown>;

const BASE: Record<Locale, MessageTree> = {
  ru: ruMessages as unknown as MessageTree,
  en: enMessages as unknown as MessageTree,
  de: deMessages as unknown as MessageTree,
};

function normalizeLocale(locale: string): Locale {
  return (locales.includes(locale as Locale) ? locale : defaultLocale) as Locale;
}

function overridesObjectKey(locale: Locale): string {
  return `content/${locale}.json`;
}

function overridesLocalPath(locale: Locale): string {
  return path.join(process.cwd(), 'data', 'content', `${locale}.json`);
}

/**
 * Deep-merge overrides onto base. Plain objects recurse; every other value
 * (strings and arrays included) replaces wholesale — an edited list is stored
 * and restored as a whole, never merged element by element.
 */
function deepMerge(base: MessageTree, over: MessageTree): MessageTree {
  const out: MessageTree = { ...base };
  for (const [key, value] of Object.entries(over)) {
    const current = out[key];
    const bothPlainObjects =
      value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      current !== null &&
      typeof current === 'object' &&
      !Array.isArray(current);
    out[key] = bothPlainObjects
      ? deepMerge(current as MessageTree, value as MessageTree)
      : value;
  }
  return out;
}

function parseOverrides(raw: string): MessageTree {
  try {
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as MessageTree)
      : {};
  } catch {
    return {};
  }
}

/** Raw override file for a locale (`'{}\n'` when none exists). Server/admin use only. */
export async function readOverridesRaw(locale: string): Promise<string> {
  const l = normalizeLocale(locale);
  if (isSpacesStorageEnabled()) {
    try {
      const fromSpaces = await spacesGetObjectText(overridesObjectKey(l));
      if (fromSpaces !== null) return fromSpaces;
    } catch (e) {
      console.warn(
        `[content] Spaces read ${overridesObjectKey(l)} failed — falling back to local/base.`,
        e,
      );
    }
  }
  try {
    return await readFile(overridesLocalPath(l), 'utf8');
  } catch {
    return '{}\n';
  }
}

export async function writeOverridesRaw(
  locale: string,
  raw: string,
): Promise<'spaces' | 'local'> {
  const l = normalizeLocale(locale);
  let destination: 'spaces' | 'local' = 'local';
  if (isSpacesStorageEnabled()) {
    try {
      await spacesPutObject(
        overridesObjectKey(l),
        Buffer.from(raw, 'utf8'),
        'application/json; charset=utf-8',
      );
      destination = 'spaces';
    } catch (e) {
      console.warn(
        `[content] Spaces write ${overridesObjectKey(l)} failed — saving locally.`,
        e,
      );
    }
  }
  if (destination === 'local') {
    await mkdir(path.dirname(overridesLocalPath(l)), { recursive: true });
    await writeFile(overridesLocalPath(l), raw, 'utf8');
  }
  bustMessagesCache();
  return destination;
}

async function loadMerged(locale: Locale): Promise<MessageTree> {
  const base = BASE[locale];
  const overrides = parseOverrides(await readOverridesRaw(locale));
  return Object.keys(overrides).length ? deepMerge(base, overrides) : base;
}

type CacheEntry = { value: MessageTree; at: number };
const cache = new Map<Locale, CacheEntry>();
let bustedAt = 0;

/** Drop the in-process cache so the next read reloads from Spaces immediately. */
export function bustMessagesCache(): void {
  bustedAt = Date.now();
  cache.clear();
}

/** Merged messages (base + admin overrides) for SSR and metadata. */
export async function getSiteMessages(locale: string): Promise<MessageTree> {
  const l = normalizeLocale(locale);
  // In dev, always reload so edits show on the next request.
  if (process.env.NODE_ENV === 'development') return loadMerged(l);

  const hit = cache.get(l);
  if (hit && hit.at > bustedAt && Date.now() - hit.at < CACHE_TTL_MS) {
    return hit.value;
  }
  const value = await loadMerged(l);
  cache.set(l, { value, at: Date.now() });
  return value;
}

/** Untouched bundled messages for a locale — the "reset to code default" reference. */
export function getBaseMessages(locale: string): MessageTree {
  return BASE[normalizeLocale(locale)];
}
