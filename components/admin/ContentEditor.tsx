'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  RotateCcw,
  Search,
  RefreshCw,
  MousePointerClick,
  Monitor,
  Smartphone,
  ListTree,
} from 'lucide-react';

import { withBasePath } from '@/lib/admin-api';
import { INLINE_EDIT_OVERLAY } from '@/lib/inline-edit-overlay';
import { locales, type Locale } from '@/lib/i18n-config';

type Tree = Record<string, unknown>;
type LeafValue = string | string[];

type Row = {
  /** path segments, e.g. ['homePage', 'seo', 'title'] */
  segments: string[];
  /** '.'-joined path for display and keying */
  key: string;
  /** current merged value (base + saved overrides) */
  value: LeafValue;
  /** untouched bundled value at the same path */
  base: LeafValue;
};

const LOCALE_LABEL: Record<Locale, string> = { ru: 'RU', en: 'EN', de: 'DE' };

/** Preview viewports. The iframe is laid out at these exact widths and scaled to fit. */
const DEVICES = {
  laptop: { label: 'Ноутбук', w: 1440, h: 900, icon: Monitor },
  mobile: { label: 'Мобильный', w: 390, h: 844, icon: Smartphone },
} as const;

type DeviceId = keyof typeof DEVICES;

const SOFT_LIMITS: Record<string, number> = {
  'seo.title': 60,
  'seo.description': 160,
};

function isLeaf(v: unknown): v is LeafValue {
  return typeof v === 'string' || (Array.isArray(v) && v.every((x) => typeof x === 'string'));
}

function flatten(tree: Tree, base: Tree): Row[] {
  const rows: Row[] = [];
  const walk = (node: unknown, baseNode: unknown, segments: string[]) => {
    if (isLeaf(node)) {
      rows.push({
        segments,
        key: segments.join('.'),
        value: node,
        base: isLeaf(baseNode) ? baseNode : node,
      });
      return;
    }
    if (node && typeof node === 'object' && !Array.isArray(node)) {
      for (const [k, v] of Object.entries(node)) {
        const b = baseNode && typeof baseNode === 'object' && !Array.isArray(baseNode)
          ? (baseNode as Tree)[k]
          : undefined;
        walk(v, b, [...segments, k]);
      }
    }
  };
  walk(tree, base, []);
  return rows;
}

/** Rebuild a sparse nested object from `path -> value` entries. */
function toSparse(entries: [string[], LeafValue][]): Tree {
  const root: Tree = {};
  for (const [segments, value] of entries) {
    let node = root;
    for (let i = 0; i < segments.length - 1; i += 1) {
      const seg = segments[i];
      if (typeof node[seg] !== 'object' || node[seg] === null || Array.isArray(node[seg])) {
        node[seg] = {};
      }
      node = node[seg] as Tree;
    }
    node[segments.at(-1) as string] = value;
  }
  return root;
}

/** Where an edited piece of rendered text belongs in the message tree. */
type Candidate = {
  key: string;
  /** element of a string[] value */
  index?: number;
  /** paragraph of a multi-paragraph string value */
  para?: number;
};

/** Same split SeoIntro uses to turn one long value into several <p> elements. */
function splitParagraphs(value: string): string[] {
  return value.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
}

const same = (a: LeafValue, b: LeafValue) => JSON.stringify(a) === JSON.stringify(b);

function placeholderTokens(s: string): string[] {
  return (s.match(/\{[^}]+\}/g) ?? []).map((t) => t.trim());
}

function textareaRows(value: string): number {
  const byLines = value.split('\n').length;
  const byLength = Math.ceil(value.length / 72);
  return Math.min(14, Math.max(2, Math.max(byLines, byLength)));
}

export default function ContentEditor({ secret }: { secret: string }) {
  const [locale, setLocale] = useState<Locale>('de');
  const [rows, setRows] = useState<Row[]>([]);
  const [savedOverrides, setSavedOverrides] = useState<Tree>({});
  const [draft, setDraft] = useState<Record<string, LeafValue>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [previewKey, setPreviewKey] = useState(0);
  const [inlineOn, setInlineOn] = useState(true);
  const [inlineCount, setInlineCount] = useState<number | null>(null);
  const [picker, setPicker] = useState<
    { candidates: Candidate[]; value: string } | null
  >(null);
  const [device, setDevice] = useState<DeviceId>('laptop');
  const [showList, setShowList] = useState(false);
  const [previewWidth, setPreviewWidth] = useState(0);
  const previewRef = useRef<HTMLIFrameElement>(null);
  const previewBoxRef = useRef<HTMLDivElement>(null);

  const headers = useMemo(() => {
    const h: Record<string, string> = { 'Content-Type': 'application/json' };
    if (secret) h['x-admin-secret'] = secret;
    return h;
  }, [secret]);

  const load = useCallback(
    async (l: Locale) => {
      setLoading(true);
      setError(null);
      setDraft({});
      try {
        const r = await fetch(withBasePath(`/api/admin/content?locale=${l}`), { headers });
        const j = await r.json();
        if (!r.ok) throw new Error(j.error ?? `HTTP ${r.status}`);
        setRows(flatten(j.merged as Tree, j.base as Tree));
        setSavedOverrides((j.overrides ?? {}) as Tree);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Не удалось загрузить тексты');
        setRows([]);
      } finally {
        setLoading(false);
      }
    },
    [headers],
  );

  useEffect(() => {
    void load(locale);
  }, [locale, load]);

  const current = useCallback(
    (row: Row): LeafValue => (row.key in draft ? draft[row.key] : row.value),
    [draft],
  );

  const dirtyKeys = useMemo(
    () => Object.keys(draft).filter((k) => {
      const row = rows.find((r) => r.key === k);
      return row ? !same(draft[k], row.value) : false;
    }),
    [draft, rows],
  );

  const overriddenCount = useMemo(
    () => rows.filter((r) => !same(current(r), r.base)).length,
    [rows, current],
  );

  const setValue = (row: Row, value: LeafValue) => {
    setDraft((d) => ({ ...d, [row.key]: value }));
  };

  const resetToBase = (row: Row) => {
    setDraft((d) => ({ ...d, [row.key]: row.base }));
  };

  // ── inline (click-on-preview) editing ──

  /** normalized rendered text -> the key(s) that produced it */
  const inlineIndex = useMemo(() => {
    const map: Record<string, Candidate[]> = {};
    const add = (text: string, entry: Candidate) => {
      const v = text.replace(/\s+/g, ' ').trim();
      if (v.length < 2 || (v.includes('{') && v.includes('}'))) return;
      (map[v] ??= []).push(entry);
    };
    for (const row of rows) {
      const v = current(row);
      if (Array.isArray(v)) {
        v.forEach((item, i) => add(item, { key: row.key, index: i }));
        continue;
      }
      add(v, { key: row.key });
      // Long-form values hold several paragraphs joined by blank lines and are
      // rendered as separate <p> elements, so index each paragraph on its own.
      const paras = splitParagraphs(v);
      if (paras.length > 1) paras.forEach((para, i) => add(para, { key: row.key, para: i }));
    }
    return map;
  }, [rows, current]);

  const injectOverlay = useCallback(() => {
    const iframe = previewRef.current;
    if (!iframe || !inlineOn) return;
    let doc: Document | null = null;
    try {
      doc = iframe.contentDocument;
    } catch {
      doc = null; // cross-origin — shouldn't happen, preview is same-origin
    }
    if (!doc?.body) return;
    (iframe.contentWindow as unknown as { __NKN_INLINE__?: unknown }).__NKN_INLINE__ = {
      index: inlineIndex,
      origin: window.location.origin,
    };
    const s = doc.createElement('script');
    s.textContent = INLINE_EDIT_OVERLAY;
    // <head> is outside React's tree — appending here can't disturb hydration.
    doc.head.appendChild(s);
  }, [inlineIndex, inlineOn]);

  const applyInline = useCallback(
    (target: Candidate, value: string) => {
      const { key, index, para } = target;
      setDraft((d) => {
        const row = rows.find((r) => r.key === key);
        if (!row) return d;
        const currentValue = key in d ? d[key] : row.value;

        if (typeof index === 'number' && Array.isArray(currentValue)) {
          const arr = [...currentValue];
          arr[index] = value;
          return { ...d, [key]: arr };
        }
        // Put the edited paragraph back into its multi-paragraph value.
        if (typeof para === 'number' && typeof currentValue === 'string') {
          const paras = splitParagraphs(currentValue);
          if (para < paras.length) {
            paras[para] = value.trim();
            return { ...d, [key]: paras.join('\n\n') };
          }
        }
        return { ...d, [key]: value };
      });
      setNote('Правка из превью применена — нажмите «Сохранить», чтобы опубликовать.');
    },
    [rows],
  );

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const d = e.data as
        | {
            source?: string;
            type?: string;
            target?: Candidate;
            value?: string;
            count?: number;
            candidates?: Candidate[];
          }
        | null;
      if (!d || d.source !== 'nkn-inline') return;
      if (d.type === 'ready') {
        setInlineCount(d.count ?? 0);
      } else if (d.type === 'edit') {
        if (d.candidates && d.candidates.length > 1) {
          setPicker({ candidates: d.candidates, value: d.value ?? '' });
        } else if (d.target) {
          applyInline(d.target, d.value ?? '');
        }
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [applyInline]);

  const save = async () => {
    setSaving(true);
    setError(null);
    setNote(null);
    // Sparse overrides = every leaf whose current value differs from the bundled base.
    const entries: [string[], LeafValue][] = rows
      .map((r) => [r.segments, current(r)] as [string[], LeafValue])
      .filter(([, v], i) => !same(v, rows[i].base));
    try {
      const r = await fetch(withBasePath('/api/admin/content'), {
        method: 'PUT',
        headers,
        body: JSON.stringify({ locale, overrides: toSparse(entries) }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error ?? `HTTP ${r.status}`);
      setNote(
        j.destination === 'spaces'
          ? `Сохранено в Spaces (content/${locale}.json). Публичная страница подхватит изменения за ~15 секунд.`
          : `Сохранено локально (data/content/${locale}.json).`,
      );
      await load(locale);
      setPreviewKey((k) => k + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось сохранить');
    } finally {
      setSaving(false);
    }
  };

  // The iframe keeps its real device width and is scaled to fit the column,
  // so the page inside lays out exactly as it would on that viewport.
  useEffect(() => {
    const box = previewBoxRef.current;
    if (!box) return;
    const measure = () => setPreviewWidth(box.clientWidth);
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(box);
    return () => ro.disconnect();
  }, [showList]);

  const q = search.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!q) return rows;
    return rows.filter((r) => {
      if (r.key.toLowerCase().includes(q)) return true;
      const v = current(r);
      const hay = Array.isArray(v) ? v.join(' ') : v;
      return hay.toLowerCase().includes(q);
    });
  }, [rows, q, current]);

  const groups = useMemo(() => {
    const m = new Map<string, Row[]>();
    for (const r of filtered) {
      const g = r.segments[0] ?? '(root)';
      (m.get(g) ?? m.set(g, []).get(g)!).push(r);
    }
    return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered]);

  const isOpen = (g: string) => (q ? true : open[g] ?? false);

  const dev = DEVICES[device];
  const STAGE_PADDING = 32; // p-4 on both sides of the stage
  const scale =
    previewWidth > 0 ? Math.min(1, (previewWidth - STAGE_PADDING) / dev.w) : 1;

  return (
    <div className="space-y-4">
      {/* ── toolbar ── */}
      <div className="sticky top-2 z-20 flex flex-wrap items-center gap-2 rounded-2xl border border-black/[0.06] bg-white/95 px-3 py-2.5 shadow-sm backdrop-blur">
        <div className="inline-flex rounded-full bg-black/[0.04] p-0.5">
          {locales.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLocale(l)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                locale === l ? 'bg-black text-white' : 'text-black/55 hover:text-black'
              }`}
            >
              {LOCALE_LABEL[l]}
            </button>
          ))}
        </div>

        <div className="inline-flex rounded-full bg-black/[0.04] p-0.5">
          {(Object.keys(DEVICES) as DeviceId[]).map((id) => {
            const Icon = DEVICES[id].icon;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setDevice(id)}
                title={`${DEVICES[id].label} · ${DEVICES[id].w}px`}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  device === id ? 'bg-black text-white' : 'text-black/55 hover:text-black'
                }`}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden />
                {DEVICES[id].label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => {
            setInlineOn((v) => !v);
            setInlineCount(null);
            setPreviewKey((k) => k + 1);
          }}
          title="Редактирование по клику прямо в превью"
          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
            inlineOn ? 'bg-blue-600/10 text-blue-700' : 'text-black/45 hover:bg-black/[0.05] hover:text-black'
          }`}
        >
          <MousePointerClick className="h-3.5 w-3.5" aria-hidden />
          инлайн{inlineOn && inlineCount != null ? ` · ${inlineCount}` : ''}
        </button>

        <button
          type="button"
          onClick={() => setPreviewKey((k) => k + 1)}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-black/50 hover:bg-black/[0.05] hover:text-black"
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden />
          обновить
        </button>

        <div className="flex-1" />

        <span className="text-[11px] text-black/45">
          {overriddenCount} изменено{dirtyKeys.length ? ` · ${dirtyKeys.length} несохранённых` : ''}
        </span>

        <button
          type="button"
          onClick={() => setShowList((v) => !v)}
          title="Полный список ключей — для текстов, которые не видны на странице (alt, SEO-заголовки)"
          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
            showList ? 'bg-black/[0.06] text-black' : 'text-black/45 hover:bg-black/[0.05] hover:text-black'
          }`}
        >
          <ListTree className="h-3.5 w-3.5" aria-hidden />
          список
        </button>

        <button
          type="button"
          onClick={() => void save()}
          disabled={saving || dirtyKeys.length === 0}
          className="rounded-lg bg-black px-3.5 py-1.5 text-xs font-semibold text-white disabled:opacity-30"
        >
          {saving ? 'Сохранение…' : 'Сохранить'}
        </button>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>
      ) : null}
      {note ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{note}</p>
      ) : null}

      <div className={showList ? 'grid gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]' : ''}>
        {/* ── key list (hidden by default) ── */}
        {showList ? (
          <div className="min-w-0">
            <label className="relative mb-3 block">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-black/35" aria-hidden />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск по ключу или тексту…"
                className="w-full rounded-lg border border-black/10 bg-white py-1.5 pl-8 pr-2 text-sm outline-none focus:border-brand-sage/45 focus:ring-2 focus:ring-brand-sage/20"
              />
            </label>

            {loading ? (
              <p className="py-10 text-center text-sm text-black/40">Загрузка…</p>
            ) : (
            <div className="space-y-2">
              {groups.map(([group, groupRows]) => {
                const changed = groupRows.filter((r) => !same(current(r), r.base)).length;
                return (
                  <section key={group} className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white">
                    <button
                      type="button"
                      onClick={() => setOpen((o) => ({ ...o, [group]: !isOpen(group) }))}
                      className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                    >
                      <span className="font-mono text-[13px] font-medium text-black/80">{group}</span>
                      <span className="flex items-center gap-2 text-[11px] text-black/40">
                        {changed ? <span className="text-brand-mustard">● {changed}</span> : null}
                        {groupRows.length}
                        <span className="text-black/30">{isOpen(group) ? '▾' : '▸'}</span>
                      </span>
                    </button>

                    {isOpen(group) ? (
                      <div className="divide-y divide-black/[0.05] border-t border-black/[0.05]">
                        {groupRows.map((row) => {
                          const value = current(row);
                          const changedRow = !same(value, row.base);
                          const rel = row.segments.slice(1).join('.');
                          const limit = SOFT_LIMITS[row.segments.slice(-2).join('.')];
                          const lostTokens =
                            typeof row.base === 'string' && typeof value === 'string'
                              ? placeholderTokens(row.base).filter((t) => !value.includes(t))
                              : [];
                          return (
                            <div key={row.key} className="px-4 py-3">
                              <div className="mb-1.5 flex items-center gap-2">
                                {changedRow ? (
                                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-mustard" aria-hidden />
                                ) : (
                                  <span className="h-1.5 w-1.5 shrink-0" aria-hidden />
                                )}
                                <code className="min-w-0 flex-1 truncate text-[11px] text-black/45">{rel}</code>
                                {limit ? (
                                  <span
                                    className={`text-[10px] tabular-nums ${
                                      typeof value === 'string' && value.length > limit
                                        ? 'text-red-600'
                                        : 'text-black/35'
                                    }`}
                                  >
                                    {typeof value === 'string' ? value.length : 0}/{limit}
                                  </span>
                                ) : null}
                                {changedRow ? (
                                  <button
                                    type="button"
                                    onClick={() => resetToBase(row)}
                                    title="Вернуть исходный текст"
                                    className="inline-flex h-6 w-6 items-center justify-center rounded-md text-black/40 hover:bg-black/[0.05] hover:text-black"
                                  >
                                    <RotateCcw className="h-3.5 w-3.5" aria-hidden />
                                  </button>
                                ) : null}
                              </div>

                              {Array.isArray(value) ? (
                                <div className="space-y-1.5">
                                  {value.map((item, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                      <span className="w-6 shrink-0 text-right text-[10px] text-black/30">{i}</span>
                                      <input
                                        value={item}
                                        onChange={(e) => {
                                          const next = [...value];
                                          next[i] = e.target.value;
                                          setValue(row, next);
                                        }}
                                        className="w-full rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-brand-sage/45 focus:ring-2 focus:ring-brand-sage/20"
                                      />
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <textarea
                                  value={value}
                                  rows={textareaRows(value)}
                                  onChange={(e) => setValue(row, e.target.value)}
                                  className="w-full resize-y rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-sm leading-relaxed outline-none focus:border-brand-sage/45 focus:ring-2 focus:ring-brand-sage/20"
                                />
                              )}

                              {lostTokens.length ? (
                                <p className="mt-1 text-[10px] text-red-600">
                                  потерян плейсхолдер: {lostTokens.join(', ')}
                                </p>
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    ) : null}
                  </section>
                );
              })}
              {groups.length === 0 ? (
                <p className="py-10 text-center text-sm text-black/40">Ничего не найдено</p>
              ) : null}
            </div>
            )}
          </div>
        ) : null}

        {/* ── preview + inline editing ── */}
        <div className="min-w-0">
          {/* Stage: the device keeps its real width and sits centred on a neutral
              backdrop, so a narrow viewport doesn't hug the left edge. */}
          <div
            ref={previewBoxRef}
            className="relative flex justify-center rounded-2xl border border-black/[0.08] bg-black/[0.035] p-4"
          >
            <div
              style={{ width: dev.w * scale, height: dev.h * scale }}
              className="relative overflow-hidden rounded-xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] ring-1 ring-black/[0.06]"
            >
              <iframe
                key={previewKey}
                ref={previewRef}
                src={withBasePath(`/${locale}/`)}
                title="Предпросмотр сайта"
                onLoad={injectOverlay}
                style={{
                  width: dev.w,
                  height: dev.h,
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left',
                }}
                className="block border-0"
              />
            </div>

            {picker ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 p-4">
                <div className="w-full max-w-sm rounded-xl border border-black/10 bg-white p-4 shadow-xl">
                  <p className="mb-1 text-sm font-medium text-black/85">
                    Этот текст встречается под несколькими ключами
                  </p>
                  <p className="mb-3 truncate text-[11px] text-black/45">«{picker.value}»</p>
                  <div className="space-y-1">
                    {picker.candidates.map((c) => (
                      <button
                        key={`${c.key}#${c.index ?? ''}#${c.para ?? ''}`}
                        type="button"
                        onClick={() => {
                          applyInline(c, picker.value);
                          setPicker(null);
                        }}
                        className="block w-full truncate rounded-lg border border-black/10 px-3 py-2 text-left font-mono text-[11px] text-black/70 hover:border-blue-500/50 hover:bg-blue-500/[0.06]"
                      >
                        {c.key}
                        {typeof c.index === 'number' ? ` [${c.index}]` : ''}
                        {typeof c.para === 'number' ? ` ¶${c.para + 1}` : ''}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setPicker(null)}
                    className="mt-3 text-[11px] text-black/45 hover:text-black"
                  >
                    отмена
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          <p className="mt-2 text-[11px] leading-relaxed text-black/40">
            {dev.label} · {dev.w}×{dev.h}
            {scale < 1 ? ` · масштаб ${Math.round(scale * 100)}%` : ''}
            {inlineOn
              ? ' — кликните текст в превью, чтобы поправить его на месте. У текста внутри ссылок наведите курсор и нажмите карандаш (обычный клик переходит по ссылке). Enter — применить, Esc — отменить.'
              : ' — инлайн-правки выключены.'}{' '}
            Правка попадёт в черновик, нажмите «Сохранить». На публичном сайте изменения появляются за ~15 секунд.
          </p>
        </div>
      </div>
    </div>
  );
}
