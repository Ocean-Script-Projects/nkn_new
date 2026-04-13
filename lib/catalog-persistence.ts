import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import {
  CATALOG_CATEGORIES_KEY,
  CATALOG_PIECES_KEY,
  isSpacesStorageEnabled,
  spacesGetObjectText,
  spacesPutObject,
} from '@/lib/spaces-storage';

const PIECES_LOCAL = path.join(process.cwd(), 'data', 'pieces.json');
const CATEGORIES_LOCAL = path.join(process.cwd(), 'data', 'categories.json');

const DATA_DIR = path.join(process.cwd(), 'data');

export type CatalogWriteResult = {
  destination: 'spaces' | 'local';
  /** Present when Spaces is configured but write fell back to disk */
  warning?: string;
};

async function ensureDataDir(): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
}

async function readPiecesFromLocalOrEmpty(): Promise<string> {
  try {
    return await readFile(PIECES_LOCAL, 'utf8');
  } catch {
    return '[]\n';
  }
}

export async function readPiecesJsonRaw(): Promise<string> {
  if (isSpacesStorageEnabled()) {
    try {
      const s = await spacesGetObjectText(CATALOG_PIECES_KEY);
      if (s !== null) return s;
    } catch (e) {
      console.warn(
        '[catalog] Spaces read catalog/pieces.json failed — using local data/pieces.json if present.',
        e
      );
    }
    return readPiecesFromLocalOrEmpty();
  }
  try {
    return await readFile(PIECES_LOCAL, 'utf8');
  } catch {
    return '[]\n';
  }
}

export async function writePiecesJsonRaw(
  raw: string
): Promise<CatalogWriteResult> {
  if (isSpacesStorageEnabled()) {
    try {
      await spacesPutObject(
        CATALOG_PIECES_KEY,
        Buffer.from(raw, 'utf8'),
        'application/json; charset=utf-8'
      );
      return { destination: 'spaces' };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.warn(
        '[catalog] Spaces write catalog/pieces.json failed — saving to data/pieces.json:',
        e
      );
      await ensureDataDir();
      await writeFile(PIECES_LOCAL, raw, 'utf8');
      return {
        destination: 'local',
        warning: `Spaces недоступен, сохранено только локально: ${msg}`,
      };
    }
  }
  await ensureDataDir();
  await writeFile(PIECES_LOCAL, raw, 'utf8');
  return { destination: 'local' };
}

export async function readCategoriesJsonRaw(): Promise<string> {
  if (isSpacesStorageEnabled()) {
    try {
      const s = await spacesGetObjectText(CATALOG_CATEGORIES_KEY);
      if (s !== null) return s;
    } catch (e) {
      console.warn(
        '[catalog] Spaces read catalog/categories.json failed — using local data/categories.json if present.',
        e
      );
    }
    try {
      return await readFile(CATEGORIES_LOCAL, 'utf8');
    } catch {
      throw new Error(
        'Нет categories в Spaces и нет локального data/categories.json — положите файл локально или загрузите catalog/categories.json в бакет.'
      );
    }
  }
  return readFile(CATEGORIES_LOCAL, 'utf8');
}

export async function writeCategoriesJsonRaw(
  raw: string
): Promise<CatalogWriteResult> {
  if (isSpacesStorageEnabled()) {
    try {
      await spacesPutObject(
        CATALOG_CATEGORIES_KEY,
        Buffer.from(raw, 'utf8'),
        'application/json; charset=utf-8'
      );
      return { destination: 'spaces' };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.warn(
        '[catalog] Spaces write catalog/categories.json failed — saving to data/categories.json:',
        e
      );
      await ensureDataDir();
      await writeFile(CATEGORIES_LOCAL, raw, 'utf8');
      return {
        destination: 'local',
        warning: `Spaces недоступен, сохранено только локально: ${msg}`,
      };
    }
  }
  await ensureDataDir();
  await writeFile(CATEGORIES_LOCAL, raw, 'utf8');
  return { destination: 'local' };
}
