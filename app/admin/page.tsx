'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  Package,
  Pencil,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { ImageWithFallback } from '@/components/image-with-fallback';
import { withBasePath, uploadCatalogImage } from '@/lib/admin-api';
import type { CatalogCategory, CatalogPiece, PieceType } from '@/lib/catalog-types';
import type { Locale } from '@/lib/i18n-config';
import {
  emptyDescriptions,
  emptyNames,
  deriveLegacyPieceName,
  formatPriceEUR,
  pieceImageUrls,
} from '@/lib/piece-display';
import PieceImagesEditor from '@/components/admin/PieceImagesEditor';

const DESCRIPTION_LOCALES: Locale[] = ['ru', 'en', 'de'];
const NAME_LOCALES: Locale[] = ['ru', 'en', 'de'];

const SECRET_STORAGE = 'nkn-admin-secret';

const PIECE_TYPES: PieceType[] = ['atelier made', 'one-of-one', 'limited'];

type AdminStatus = {
  ok: boolean;
  secretRequired: boolean;
  message: string;
  catalogStorage?: 'spaces' | 'filesystem';
  mediathekConfigured?: boolean;
};

function catalogStorageLabels(storage: AdminStatus['catalogStorage']) {
  if (storage === 'spaces') {
    return {
      pieces: 'catalog/pieces.json (Spaces)',
      categories: 'catalog/categories.json (Spaces)',
      uploads: 'uploads/pieces/… (Spaces)',
    };
  }
  return {
    pieces: 'data/pieces.json',
    categories: 'data/categories.json',
    uploads: 'public/uploads/pieces/',
  };
}

const fieldClass =
  'w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-black/90 focus:border-brand-sage/45 focus:outline-none focus:ring-2 focus:ring-brand-sage/20 transition-shadow';

const labelClass =
  'text-[10px] font-semibold uppercase tracking-wider text-[#8B8B8B] block mb-1.5';

const cardClass =
  'rounded-2xl border border-black/[0.06] bg-white p-5 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.06)]';

async function apiGet(path: string, secret: string): Promise<Response> {
  const headers: HeadersInit = {};
  if (secret) headers['x-admin-secret'] = secret;
  return fetch(withBasePath(path), { headers });
}

function newCatalogId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `p-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

async function apiPut(path: string, secret: string, body: unknown): Promise<Response> {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (secret) headers['x-admin-secret'] = secret;
  return fetch(withBasePath(path), {
    method: 'PUT',
    headers,
    body: JSON.stringify(body),
  });
}

/** Latin slug for category id; fallback to timestamp if no Latin letters. */
function slugifyCategoryKeyPart(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function uniqueCategoryId(
  labels: { ru: string; en: string; de: string },
  existingIds: Set<string>
): string {
  const fromEn = slugifyCategoryKeyPart(labels.en);
  const fromDe = slugifyCategoryKeyPart(labels.de);
  let base = fromEn || fromDe || `cat-${Date.now()}`;
  if (base.length < 1) base = `cat-${Date.now()}`;
  let id = base;
  let n = 1;
  while (existingIds.has(id)) {
    id = `${base}-${n++}`;
  }
  return id;
}

export default function AdminPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [status, setStatus] = useState<AdminStatus | null>(null);
  const [secret, setSecret] = useState('');
  const [tab, setTab] = useState<'pieces' | 'categories'>('pieces');
  const [pieces, setPieces] = useState<CatalogPiece[]>([]);
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [persistingPieceId, setPersistingPieceId] = useState<string | null>(null);
  const [persistingCategories, setPersistingCategories] = useState(false);
  const [uploadingPieceId, setUploadingPieceId] = useState<string | null>(null);
  const [savingOrder, setSavingOrder] = useState(false);
  const [savingCategoryOrder, setSavingCategoryOrder] = useState(false);
  const [editingPieceId, setEditingPieceId] = useState<string | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryDraft, setCategoryDraft] = useState<{
    ru: string;
    en: string;
    de: string;
  } | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem(SECRET_STORAGE);
    if (!saved) {
      router.replace('/admin/login');
      return;
    }
    setSecret(saved);
    setAuthChecked(true);
  }, [router]);

  useEffect(() => {
    if (!authChecked) return;
    void (async () => {
      const isNextDev =
        typeof process !== 'undefined' && process.env.NODE_ENV === 'development';
      try {
        const r = await fetch(withBasePath('/api/admin/status'));
        if (!r.ok) {
          setStatus({
            ok: isNextDev,
            secretRequired: false,
            message:
              `Ответ ${r.status}: маршрута /api/admin/status нет (типично для статики: только папка out). ` +
              'Редактируйте каталог локально: npm run dev.',
          });
          return;
        }
        const j = (await r.json()) as AdminStatus;
        setStatus({
          ...j,
          ok: j.ok || isNextDev,
        });
      } catch {
        setStatus({
          ok: isNextDev,
          secretRequired: false,
          message:
            'Нет связи с /api/admin (на статическом хостинге серверных API нет). ' +
            'Откройте админку через npm run dev на своём компьютере.',
        });
      }
    })();
  }, [authChecked]);

  const redirectToLogin = useCallback(() => {
    sessionStorage.removeItem(SECRET_STORAGE);
    router.replace('/admin/login');
  }, [router]);

  const loadData = useCallback(async () => {
    setLoadError(null);
    const hdrSecret = sessionStorage.getItem(SECRET_STORAGE) ?? secret;
    try {
      const [pr, cr] = await Promise.all([
        apiGet('/api/admin/pieces', hdrSecret),
        apiGet('/api/admin/categories', hdrSecret),
      ]);
      if (pr.status === 401 || cr.status === 401) {
        redirectToLogin();
        return;
      }
      if (!pr.ok) {
        const t = await pr.text();
        throw new Error(`Pieces: ${pr.status} ${t}`);
      }
      if (!cr.ok) {
        const t = await cr.text();
        throw new Error(`Categories: ${cr.status} ${t}`);
      }
      setPieces((await pr.json()) as CatalogPiece[]);
      setCategories((await cr.json()) as CatalogCategory[]);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : 'Load failed');
    }
  }, [secret, redirectToLogin]);

  useEffect(() => {
    if (status === null) return;
    if (!sessionStorage.getItem(SECRET_STORAGE)) {
      redirectToLogin();
      return;
    }
    if (status.ok) void loadData();
  }, [status, loadData, redirectToLogin]);

  useEffect(() => {
    if (editingPieceId && !pieces.some((p) => p.id === editingPieceId)) {
      setEditingPieceId(null);
    }
  }, [pieces, editingPieceId]);

  useEffect(() => {
    if (editingCategoryId && !categories.some((c) => c.id === editingCategoryId)) {
      setEditingCategoryId(null);
    }
  }, [categories, editingCategoryId]);

  const hdr = () => sessionStorage.getItem(SECRET_STORAGE) ?? secret;

  const assignableCategoryIds = categories.filter((c) => c.id !== 'all').map((c) => c.id);

  const saveOnePiece = async (p: CatalogPiece) => {
    setPersistingPieceId(p.id);
    setSaveMessage(null);
    try {
      const path = '/api/admin/pieces/single';
      const r = await apiPut(path, hdr(), p);
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error((j as { error?: string }).error ?? r.statusText);
      const label = deriveLegacyPieceName(p.names, p.name);
      const lab = catalogStorageLabels(status?.catalogStorage);
      const warn = (j as { warning?: string }).warning;
      const base =
        (j as { created?: boolean }).created
          ? `Добавлено в ${lab.pieces}: ${label || 'без названия'}`
          : `Сохранено: ${label || 'без названия'}`;
      setSaveMessage(warn ? `${base}. ${warn}` : base);
      await loadData();
      setEditingPieceId(null);
    } catch (e) {
      setSaveMessage(e instanceof Error ? e.message : 'Ошибка сохранения');
    } finally {
      setPersistingPieceId(null);
    }
  };

  const movePiece = async (index: number, delta: -1 | 1) => {
    const target = index + delta;
    if (target < 0 || target >= pieces.length) return;
    setSavingOrder(true);
    setSaveMessage(null);
    const next = [...pieces];
    [next[index], next[target]] = [next[target], next[index]];
    setPieces(next);
    try {
      const r = await apiPut('/api/admin/pieces', hdr(), next);
      const body = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error((body as { error?: string }).error ?? r.statusText);
      const w = (body as { warning?: string }).warning;
      setSaveMessage(
        w ? `Порядок в каталоге обновлён. ${w}` : 'Порядок в каталоге обновлён'
      );
      await loadData();
    } catch (e) {
      setSaveMessage(e instanceof Error ? e.message : 'Не удалось сохранить порядок');
      await loadData();
    } finally {
      setSavingOrder(false);
    }
  };

  const moveCategory = async (index: number, delta: -1 | 1) => {
    const target = index + delta;
    if (target < 0 || target >= categories.length) return;
    if (index === 0 || target === 0) return;
    setSavingCategoryOrder(true);
    setSaveMessage(null);
    const next = [...categories];
    [next[index], next[target]] = [next[target], next[index]];
    setCategories(next);
    try {
      const r = await apiPut('/api/admin/categories', hdr(), next);
      const body = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error((body as { error?: string }).error ?? r.statusText);
      const w = (body as { warning?: string }).warning;
      setSaveMessage(
        w ? `Порядок категорий обновлён. ${w}` : 'Порядок категорий обновлён'
      );
      await loadData();
    } catch (e) {
      setSaveMessage(e instanceof Error ? e.message : 'Не удалось сохранить порядок');
      await loadData();
    } finally {
      setSavingCategoryOrder(false);
    }
  };

  const saveCategoriesToFile = async () => {
    setPersistingCategories(true);
    setSaveMessage(null);
    try {
      const r = await apiPut('/api/admin/categories', hdr(), categories);
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error((j as { error?: string }).error ?? r.statusText);
      const w = (j as { warning?: string }).warning;
      const msg = `Категории записаны в ${catalogStorageLabels(status?.catalogStorage).categories}`;
      setSaveMessage(w ? `${msg}. ${w}` : msg);
      await loadData();
    } catch (e) {
      setSaveMessage(e instanceof Error ? e.message : 'Ошибка сохранения');
    } finally {
      setPersistingCategories(false);
    }
  };

  const addPiece = () => {
    const id = newCatalogId();
    setPieces((prev) => [
      ...prev,
      {
        id,
        name: 'New piece',
        category: assignableCategoryIds[0] ?? 'dresses',
        type: 'limited',
        image: '',
        descriptionKey: `pieces.item-${id.replace(/-/g, '').slice(0, 12)}`,
        names: emptyNames(),
        descriptions: emptyDescriptions(),
        priceEUR: null,
        featuredOnHome: false,
      },
    ]);
    setEditingPieceId(id);
  };

  const removePiece = async (id: string) => {
    if (!window.confirm('Удалить этот товар? Это действие нельзя отменить.')) return;
    const next = pieces.filter((p) => p.id !== id);
    setPieces(next);
    if (editingPieceId === id) setEditingPieceId(null);
    try {
      const r = await apiPut('/api/admin/pieces', hdr(), next);
      if (!r.ok) {
        const body = await r.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? r.statusText);
      }
    } catch (e) {
      setSaveMessage(`Ошибка удаления: ${e instanceof Error ? e.message : String(e)}`);
      await loadData();
    }
  };

  const updatePiece = (id: string, patch: Partial<CatalogPiece>) => {
    setPieces((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...patch } : p))
    );
  };

  const setPieceImages = (id: string, urls: string[]) => {
    setPieces((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const clean = urls.map((u) => u.trim()).filter(Boolean);
        const uniq = [...new Set(clean)];
        const next: CatalogPiece = { ...p, image: uniq[0] ?? '' };
        if (uniq.length > 1) next.images = uniq;
        else delete next.images;
        return next;
      })
    );
  };

  const handleImageUpload = async (pieceId: string, file: File) => {
    setUploadingPieceId(pieceId);
    setSaveMessage(null);
    try {
      const url = await uploadCatalogImage(file, hdr());
      setPieces((prev) =>
        prev.map((p) => {
          if (p.id !== pieceId) return p;
          const cur = pieceImageUrls(p);
          const uniq = [...new Set([...cur, url])];
          const next: CatalogPiece = { ...p, image: uniq[0] ?? '' };
          if (uniq.length > 1) next.images = uniq;
          else delete next.images;
          return next;
        })
      );
      setSaveMessage(
        status?.catalogStorage === 'spaces'
          ? 'Файл загружен в Spaces — нажмите «Сохранить в каталог» на этой карточке.'
          : 'Файл в public/uploads — нажмите «Сохранить в каталог» на этой карточке.'
      );
    } catch (e) {
      setSaveMessage(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploadingPieceId(null);
    }
  };

  const commitNewCategory = () => {
    if (!categoryDraft) return;
    const ru = categoryDraft.ru.trim();
    const en = categoryDraft.en.trim();
    const de = categoryDraft.de.trim();
    if (!ru && !en && !de) {
      setSaveMessage('Введите название минимум на одном языке');
      return;
    }
    const first = ru || en || de;
    const labels = { ru: ru || first, en: en || first, de: de || first };
    const existingIds = new Set(categories.map((c) => c.id));
    const id = uniqueCategoryId({ ru, en, de }, existingIds);
    setCategories((prev) => [...prev, { id, labels }]);
    setCategoryDraft(null);
    setEditingCategoryId(id);
    setSaveMessage('Категория добавлена в список — нажмите «Сохранить категории» на карточке.');
  };

  const updateCategory = (
    id: string,
    patch: Partial<CatalogCategory> | { labels: CatalogCategory['labels'] }
  ) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } as CatalogCategory : c))
    );
  };

  const removeCategory = async (id: string) => {
    if (id === 'all') return;
    if (savingCategoryOrder || persistingCategories) return;

    const next = categories.filter((c) => c.id !== id);
    setSavingCategoryOrder(true);
    setSaveMessage(null);
    setCategories(next);
    if (editingCategoryId === id) setEditingCategoryId(null);

    // Persist right away — mirrors moveCategory. Without this the row only
    // disappears from local state and reappears on reload.
    try {
      const r = await apiPut('/api/admin/categories', hdr(), next);
      const body = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error((body as { error?: string }).error ?? r.statusText);
      const w = (body as { warning?: string }).warning;
      setSaveMessage(w ? `Категория удалена. ${w}` : 'Категория удалена');
      await loadData();
    } catch (e) {
      setSaveMessage(e instanceof Error ? e.message : 'Не удалось удалить категорию');
      await loadData();
    } finally {
      setSavingCategoryOrder(false);
    }
  };

  const storageLab = catalogStorageLabels(status?.catalogStorage);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-black/20 border-t-black/70 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-brand-sage/[0.07] via-transparent to-transparent"
        aria-hidden
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <header className="mb-10 sm:mb-12">
          <div className="flex items-center gap-2 text-brand-sage mb-3">
            <Sparkles className="w-4 h-4 opacity-90" aria-hidden />
            <span className="text-[11px] sm:text-xs tracking-[0.28em] uppercase font-medium">
              Atelier
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] font-serif tracking-tight text-black/90 leading-tight">
            Catalog admin
          </h1>
          <p className="mt-4 text-sm sm:text-base text-[#8B8B8B] leading-relaxed max-w-2xl">
            Редактирование{' '}
            <code className="text-xs bg-black/[0.04] px-2 py-0.5 rounded-md text-black/70">
              {storageLab.pieces}
            </code>{' '}
            и{' '}
            <code className="text-xs bg-black/[0.04] px-2 py-0.5 rounded-md text-black/70">
              {storageLab.categories}
            </code>
            . Загрузка фото — в{' '}
            <code className="text-xs bg-black/[0.04] px-2 py-0.5 rounded-md text-black/70">
              {storageLab.uploads}
            </code>
            {status?.catalogStorage === 'spaces' ? (
              <>
                . Публичные URL задаются через{' '}
                <code className="text-xs">NEXT_PUBLIC_MEDIATHEK_BASE_URL</code>
                {status.mediathekConfigured ? '' : ' (не задан — загрузка изображений в Spaces не сработает)'}
                .
              </>
            ) : (
              <>
                {' '}
                (только <code className="text-xs">npm run dev</code>). Если заданы переменные Spaces
                — каталог и фото пишутся в бакет.
              </>
            )}
          </p>
        </header>

        {status && !status.ok ? (
          <div
            role="alert"
            className="mb-8 rounded-2xl border border-amber-200/80 bg-amber-50/90 px-5 py-4 text-amber-950 text-sm leading-relaxed shadow-sm"
          >
            {status.message}
          </div>
        ) : null}


        {loadError ? (
          <div
            role="alert"
            className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {loadError}
          </div>
        ) : null}

        {status?.ok ? (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div className="inline-flex p-1 rounded-full bg-white/90 shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-black/[0.06] backdrop-blur-sm">
                <button
                  type="button"
                  onClick={() => {
                    setTab('pieces');
                    setEditingCategoryId(null);
                    setCategoryDraft(null);
                  }}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                    tab === 'pieces'
                      ? 'bg-black text-white shadow-md'
                      : 'text-[#8B8B8B] hover:text-black'
                  }`}
                >
                  <Package className="w-4 h-4 opacity-90" aria-hidden />
                  Изделия
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTab('categories');
                    setEditingPieceId(null);
                    setCategoryDraft(null);
                  }}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                    tab === 'categories'
                      ? 'bg-black text-white shadow-md'
                      : 'text-[#8B8B8B] hover:text-black'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4 opacity-90" aria-hidden />
                  Категории
                </button>
              </div>
              {saveMessage ? (
                <p className="text-sm text-[#666] sm:text-right sm:max-w-md leading-relaxed">
                  {saveMessage}
                </p>
              ) : null}
            </div>

            {tab === 'pieces' ? (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={addPiece}
                    className="rounded-full border border-black/12 bg-white px-5 py-2.5 text-sm font-medium text-black/85 shadow-sm hover:border-brand-sage/35 hover:bg-brand-sage/[0.06] transition-colors"
                  >
                    + Добавить изделие
                  </button>
                  <span className="text-xs text-[#8B8B8B] hidden sm:inline">
                    {pieces.length} {pieces.length === 1 ? 'позиция' : 'позиций'} — порядок в списке = на
                    сайте (стрелки вверх/вниз); карточка — «Сохранить в каталог»
                  </span>
                </div>

                {!editingPieceId ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {pieces.map((p, index) => {
                      const label = deriveLegacyPieceName(p.names, p.name);
                      const priceStr = formatPriceEUR(p.priceEUR, 'ru');
                      const thumb = pieceImageUrls(p)[0];
                      return (
                        <div
                          key={p.id}
                          className="flex gap-2 sm:gap-3 rounded-2xl border border-black/[0.06] bg-white p-3 sm:p-4 shadow-sm hover:border-black/10 transition-colors"
                        >
                          <div className="flex flex-col gap-0.5 shrink-0 justify-center">
                            <button
                              type="button"
                              title="Выше в списке"
                              disabled={
                                index === 0 ||
                                savingOrder ||
                                savingCategoryOrder ||
                                persistingPieceId !== null
                              }
                              onClick={() => void movePiece(index, -1)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-white text-black/70 hover:bg-black/[0.04] disabled:opacity-30 disabled:pointer-events-none"
                            >
                              <ChevronUp className="h-4 w-4" aria-hidden />
                            </button>
                            <button
                              type="button"
                              title="Ниже в списке"
                              disabled={
                                index >= pieces.length - 1 ||
                                savingOrder ||
                                savingCategoryOrder ||
                                persistingPieceId !== null
                              }
                              onClick={() => void movePiece(index, 1)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-white text-black/70 hover:bg-black/[0.04] disabled:opacity-30 disabled:pointer-events-none"
                            >
                              <ChevronDown className="h-4 w-4" aria-hidden />
                            </button>
                          </div>
                          <div className="relative w-16 h-20 sm:w-[4.5rem] sm:h-[5.5rem] shrink-0 rounded-xl overflow-hidden bg-black/[0.04] ring-1 ring-black/[0.05]">
                            {thumb ? (
                              <ImageWithFallback
                                src={thumb}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-[#f0efea]" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col">
                            <p className="font-serif text-sm sm:text-base text-black/90 leading-snug line-clamp-2">
                              {label || 'Без названия'}
                            </p>
                            <p className="text-[11px] text-[#8B8B8B] mt-1 truncate">
                              {p.category} · {p.type}
                            </p>
                            {priceStr ? (
                              <p className="text-xs font-medium text-black/75 mt-auto pt-2">
                                {priceStr}
                              </p>
                            ) : (
                              <span className="text-[10px] text-[#8B8B8B] mt-auto pt-2">
                                Цена не указана
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col gap-1.5 shrink-0 justify-center">
                            <button
                              type="button"
                              onClick={() => setEditingPieceId(p.id)}
                              className="inline-flex items-center justify-center gap-1 rounded-xl border border-black/12 bg-white px-2.5 py-2 text-xs font-medium text-black/85 hover:bg-black/[0.03]"
                            >
                              <Pencil className="w-3.5 h-3.5" aria-hidden />
                              Изм.
                            </button>
                            <button
                              type="button"
                              onClick={() => removePiece(p.id)}
                              className="inline-flex items-center justify-center rounded-xl border border-red-200/80 bg-red-50/60 px-2.5 py-2 text-xs font-medium text-red-700 hover:bg-red-100/70"
                              title="Удалить"
                            >
                              <Trash2 className="w-3.5 h-3.5" aria-hidden />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  (() => {
                    const p = pieces.find((x) => x.id === editingPieceId);
                    if (!p) return null;
                    return (
                      <div className="space-y-4">
                        <button
                          type="button"
                          onClick={() => setEditingPieceId(null)}
                          className="inline-flex items-center gap-2 text-sm font-medium text-[#8B8B8B] hover:text-black transition-colors"
                        >
                          <ArrowLeft className="w-4 h-4" aria-hidden />
                          Назад к списку
                        </button>
                        <article className={cardClass}>
                          <div className="flex items-start justify-between gap-3 mb-5 pb-4 border-b border-black/[0.06]">
                            <div className="flex-1 min-w-0 space-y-3">
                              <p className={labelClass}>Названия</p>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {NAME_LOCALES.map((loc) => (
                                  <div key={loc}>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-mustard/90">
                                      {loc}
                                    </span>
                                    <input
                                      value={p.names?.[loc] ?? ''}
                                      onChange={(e) => {
                                        const names = {
                                          ...p.names,
                                          [loc]: e.target.value,
                                        };
                                        updatePiece(p.id, {
                                          names,
                                          name: deriveLegacyPieceName(names, p.name),
                                        });
                                      }}
                                      className={`${fieldClass} mt-1 text-base font-serif tracking-tight`}
                                      placeholder={
                                        loc === 'ru'
                                          ? 'Название'
                                          : loc === 'en'
                                            ? 'Title'
                                            : 'Titel'
                                      }
                                    />
                                  </div>
                                ))}
                              </div>
                              <p className="text-[11px] text-[#8B8B8B] leading-relaxed">
                                ID в каталоге назначается автоматически и в интерфейсе не показывается.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removePiece(p.id)}
                              className="shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-red-200/80 bg-red-50/80 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-100/80 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" aria-hidden />
                              Удалить
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className={labelClass}>Цена (€)</label>
                              <input
                                type="number"
                                min={0}
                                step={1}
                                inputMode="numeric"
                                value={
                                  p.priceEUR === null || p.priceEUR === undefined
                                    ? ''
                                    : p.priceEUR
                                }
                                onChange={(e) => {
                                  const v = e.target.value;
                                  if (v === '') {
                                    updatePiece(p.id, { priceEUR: null });
                                    return;
                                  }
                                  const n = Number(v);
                                  if (Number.isFinite(n) && n >= 0) {
                                    updatePiece(p.id, { priceEUR: n });
                                  }
                                }}
                                className={`${fieldClass} tabular-nums`}
                                placeholder="Не показывать"
                              />
                            </div>
                            <div>
                              <label className={labelClass}>Категория</label>
                              <select
                                value={p.category}
                                onChange={(e) =>
                                  updatePiece(p.id, { category: e.target.value })
                                }
                                className={fieldClass}
                              >
                                {assignableCategoryIds.map((cid) => (
                                  <option key={cid} value={cid}>
                                    {cid}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="sm:col-span-2">
                              <label className={labelClass}>Тип</label>
                              <select
                                value={p.type}
                                onChange={(e) =>
                                  updatePiece(p.id, {
                                    type: e.target.value as PieceType,
                                  })
                                }
                                className={fieldClass}
                              >
                                {PIECE_TYPES.map((t) => (
                                  <option key={t} value={t}>
                                    {t}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="mb-4 flex items-start gap-3 rounded-xl border border-black/[0.06] bg-black/[0.02] px-4 py-3">
                            <input
                              type="checkbox"
                              id={`featured-home-${p.id}`}
                              checked={p.featuredOnHome === true}
                              onChange={(e) =>
                                updatePiece(p.id, {
                                  featuredOnHome: e.target.checked,
                                })
                              }
                              className="mt-1 h-4 w-4 shrink-0 rounded border-black/20 accent-black"
                            />
                            <label
                              htmlFor={`featured-home-${p.id}`}
                              className="min-w-0 cursor-pointer text-sm leading-snug text-black/85"
                            >
                              <span className="font-medium">
                                Показывать на главной
                              </span>
                              <span className="mt-1 block text-[11px] text-[#8B8B8B]">
                                Блок «изделия» на главной: если отмечено хотя бы
                                одно изделие — в блоке только они (порядок как в
                                каталоге). Иначе — первые 6 изделий по умолчанию.
                              </span>
                            </label>
                          </div>

                          <div className="mb-5">
                            <label className={labelClass}>Фото</label>
                            <PieceImagesEditor
                              key={p.id}
                              pieceId={p.id}
                              urls={pieceImageUrls(p)}
                              uploading={uploadingPieceId === p.id}
                              onUrlsChange={(urls) => setPieceImages(p.id, urls)}
                              onFileSelected={(file) =>
                                void handleImageUpload(p.id, file)
                              }
                            />
                          </div>

                          <div className="mb-5">
                            <label className={labelClass}>Ключ i18n (fallback)</label>
                            <input
                              value={p.descriptionKey}
                              onChange={(e) =>
                                updatePiece(p.id, {
                                  descriptionKey: e.target.value,
                                })
                              }
                              className={`${fieldClass} font-mono text-xs`}
                            />
                            <p className="mt-2 text-[11px] text-[#8B8B8B] leading-relaxed">
                              Если описания ниже пустые — подставится текст из{' '}
                              <code className="text-[10px] bg-black/[0.04] px-1 rounded">messages</code>
                              по этому ключу.
                            </p>
                          </div>

                          <div>
                            <label className={`${labelClass} mb-3`}>
                              Описания на сайте
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {DESCRIPTION_LOCALES.map((loc) => (
                                <div key={loc}>
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-sage/90">
                                    {loc}
                                  </span>
                                  <textarea
                                    value={p.descriptions?.[loc] ?? ''}
                                    rows={4}
                                    onChange={(e) =>
                                      updatePiece(p.id, {
                                        descriptions: {
                                          ...p.descriptions,
                                          [loc]: e.target.value,
                                        },
                                      })
                                    }
                                    className={`${fieldClass} mt-1 text-xs min-h-[5.5rem] resize-y leading-relaxed`}
                                    placeholder="Текст…"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 pt-6 mt-6 border-t border-black/[0.06]">
                            <button
                              type="button"
                              onClick={() => void saveOnePiece(p)}
                              disabled={
                                persistingPieceId !== null ||
                                savingOrder ||
                                savingCategoryOrder
                              }
                              className="rounded-full bg-brand-mustard text-brand-mustard-foreground px-6 py-2.5 text-sm font-semibold shadow-md hover:opacity-95 disabled:opacity-45 transition-opacity"
                            >
                              {persistingPieceId === p.id
                                ? 'Сохранение…'
                                : 'Сохранить в каталог'}
                            </button>
                            <p className="text-[11px] text-[#8B8B8B] max-w-md leading-relaxed">
                              Пишет только эту позицию в{' '}
                              <code className="text-[10px] bg-black/[0.04] px-1 rounded">{storageLab.pieces}</code>
                              .
                            </p>
                          </div>
                        </article>
                      </div>
                    );
                  })()
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  {!categoryDraft && !editingCategoryId ? (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCategoryId(null);
                        setCategoryDraft({ ru: '', en: '', de: '' });
                      }}
                      className="rounded-full border border-black/12 bg-white px-5 py-2.5 text-sm font-medium shadow-sm hover:border-brand-sage/35 hover:bg-brand-sage/[0.06] transition-colors"
                    >
                      + Категория
                    </button>
                  ) : null}
                  <span className="text-xs text-[#8B8B8B] hidden sm:inline">
                    {categories.length} категорий — порядок вкладок на сайте (стрелки); карточка — «Сохранить
                    категории»
                  </span>
                </div>

                {categoryDraft !== null ? (
                  <div className="space-y-4">
                    <button
                      type="button"
                      onClick={() => setCategoryDraft(null)}
                      className="inline-flex items-center gap-2 text-sm font-medium text-[#8B8B8B] hover:text-black transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" aria-hidden />
                      Назад к списку
                    </button>
                    <article className={cardClass}>
                      <h3 className="text-lg font-serif text-black/90 mb-1">Новая категория</h3>
                      <p className="text-[11px] text-[#8B8B8B] mb-5 leading-relaxed">
                        Названия на сайте. Внутренний ключ для фильтра подставится сам при создании.
                      </p>
                      <div className="space-y-3">
                        <div>
                          <label className={labelClass}>Русский</label>
                          <input
                            value={categoryDraft.ru}
                            onChange={(e) =>
                              setCategoryDraft((d) =>
                                d ? { ...d, ru: e.target.value } : d
                              )
                            }
                            className={fieldClass}
                            placeholder="Название"
                          />
                        </div>
                        <div>
                          <label className={labelClass}>English</label>
                          <input
                            value={categoryDraft.en}
                            onChange={(e) =>
                              setCategoryDraft((d) =>
                                d ? { ...d, en: e.target.value } : d
                              )
                            }
                            className={fieldClass}
                            placeholder="Title"
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Deutsch</label>
                          <input
                            value={categoryDraft.de}
                            onChange={(e) =>
                              setCategoryDraft((d) =>
                                d ? { ...d, de: e.target.value } : d
                              )
                            }
                            className={fieldClass}
                            placeholder="Titel"
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 pt-6 mt-6 border-t border-black/[0.06]">
                        <button
                          type="button"
                          onClick={() => setCategoryDraft(null)}
                          className="rounded-full border border-black/12 bg-white px-5 py-2.5 text-sm font-medium text-black/85 hover:bg-black/[0.03]"
                        >
                          Отмена
                        </button>
                        <button
                          type="button"
                          onClick={commitNewCategory}
                          className="rounded-full bg-brand-mustard text-brand-mustard-foreground px-6 py-2.5 text-sm font-semibold shadow-md hover:opacity-95"
                        >
                          Создать
                        </button>
                      </div>
                    </article>
                  </div>
                ) : !editingCategoryId ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {categories.map((c, index) => (
                      <div
                        key={c.id}
                        className="flex items-center gap-2 sm:gap-3 rounded-2xl border border-black/[0.06] bg-white px-3 py-3 sm:px-4 shadow-sm"
                      >
                        <div className="flex flex-col gap-0.5 shrink-0 justify-center">
                          <button
                            type="button"
                            title="Выше в списке"
                            disabled={
                              index <= 1 ||
                              savingCategoryOrder ||
                              persistingCategories ||
                              savingOrder
                            }
                            onClick={() => void moveCategory(index, -1)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-white text-black/70 hover:bg-black/[0.04] disabled:opacity-30 disabled:pointer-events-none"
                          >
                            <ChevronUp className="h-4 w-4" aria-hidden />
                          </button>
                          <button
                            type="button"
                            title="Ниже в списке"
                            disabled={
                              index === 0 ||
                              index >= categories.length - 1 ||
                              savingCategoryOrder ||
                              persistingCategories ||
                              savingOrder
                            }
                            onClick={() => void moveCategory(index, 1)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-white text-black/70 hover:bg-black/[0.04] disabled:opacity-30 disabled:pointer-events-none"
                          >
                            <ChevronDown className="h-4 w-4" aria-hidden />
                          </button>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-black/88 truncate">
                            {c.labels.ru}
                          </p>
                          {c.labels.en && c.labels.en !== c.labels.ru ? (
                            <p className="text-[11px] text-[#8B8B8B] truncate mt-0.5">
                              {c.labels.en}
                            </p>
                          ) : null}
                        </div>
                        <div className="flex flex-col gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setCategoryDraft(null);
                              setEditingCategoryId(c.id);
                            }}
                            className="inline-flex items-center justify-center gap-1 rounded-xl border border-black/12 bg-white px-2.5 py-2 text-xs font-medium"
                          >
                            <Pencil className="w-3.5 h-3.5" aria-hidden />
                            Изм.
                          </button>
                          {c.id !== 'all' ? (
                            <button
                              type="button"
                              onClick={() => void removeCategory(c.id)}
                              className="inline-flex items-center justify-center rounded-xl border border-red-200/80 bg-red-50/60 p-2 text-red-700"
                            >
                              <Trash2 className="w-3.5 h-3.5" aria-hidden />
                            </button>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  (() => {
                    const c = categories.find((x) => x.id === editingCategoryId);
                    if (!c) return null;
                    return (
                      <div className="space-y-4">
                        <button
                          type="button"
                          onClick={() => setEditingCategoryId(null)}
                          className="inline-flex items-center gap-2 text-sm font-medium text-[#8B8B8B] hover:text-black"
                        >
                          <ArrowLeft className="w-4 h-4" aria-hidden />
                          Назад к списку
                        </button>
                        <article className={cardClass}>
                          <div className="flex items-start justify-between gap-2 mb-5">
                            <div className="min-w-0 flex-1">
                              <h3 className="text-lg font-serif text-black/90">
                                {c.id === 'all' ? 'Все категории' : 'Редактирование'}
                              </h3>
                              {c.id === 'all' ? (
                                <p className="text-[11px] text-[#8B8B8B] mt-1 leading-relaxed">
                                  Системное значение фильтра «все товары» — не удаляется.
                                </p>
                              ) : (
                                <p className="text-[11px] text-[#8B8B8B] mt-1 leading-relaxed">
                                  Сайт подставляет категорию по внутреннему ключу, его менять не нужно.
                                </p>
                              )}
                            </div>
                            {c.id !== 'all' ? (
                              <button
                                type="button"
                                onClick={() => void removeCategory(c.id)}
                                className="shrink-0 inline-flex items-center justify-center rounded-xl border border-red-200/80 bg-red-50/80 p-2 text-red-700"
                              >
                                <Trash2 className="w-4 h-4" aria-hidden />
                              </button>
                            ) : null}
                          </div>
                          <div className="space-y-3">
                            <div>
                              <label className={labelClass}>Русский</label>
                              <input
                                value={c.labels.ru}
                                onChange={(e) =>
                                  updateCategory(c.id, {
                                    labels: { ...c.labels, ru: e.target.value },
                                  })
                                }
                                className={fieldClass}
                              />
                            </div>
                            <div>
                              <label className={labelClass}>English</label>
                              <input
                                value={c.labels.en}
                                onChange={(e) =>
                                  updateCategory(c.id, {
                                    labels: { ...c.labels, en: e.target.value },
                                  })
                                }
                                className={fieldClass}
                              />
                            </div>
                            <div>
                              <label className={labelClass}>Deutsch</label>
                              <input
                                value={c.labels.de}
                                onChange={(e) =>
                                  updateCategory(c.id, {
                                    labels: { ...c.labels, de: e.target.value },
                                  })
                                }
                                className={fieldClass}
                              />
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 pt-6 mt-6 border-t border-black/[0.06]">
                            <button
                              type="button"
                              onClick={() => void saveCategoriesToFile()}
                              disabled={persistingCategories || savingCategoryOrder}
                              className="rounded-full bg-brand-mustard text-brand-mustard-foreground px-6 py-2.5 text-sm font-semibold shadow-md hover:opacity-95 disabled:opacity-45"
                            >
                              {persistingCategories ? 'Сохранение…' : 'Сохранить категории'}
                            </button>
                            <p className="text-[11px] text-[#8B8B8B] max-w-md leading-relaxed">
                              Записывает весь список в{' '}
                              <code className="text-[10px] bg-black/[0.04] px-1 rounded">{storageLab.categories}</code>{' '}
                              (изменения из этой и других карточек в памяти).
                            </p>
                          </div>
                        </article>
                      </div>
                    );
                  })()
                )}
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
