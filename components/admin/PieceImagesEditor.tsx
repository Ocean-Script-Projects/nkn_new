'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, ImageIcon, Plus, Trash2, Upload } from 'lucide-react';
import { ImageWithFallback } from '@/components/image-with-fallback';

const inputClass =
  'w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-black/90 placeholder:text-black/35 focus:border-brand-sage/45 focus:outline-none focus:ring-2 focus:ring-brand-sage/20 transition-shadow';

function normalizeLines(urls: string[]): string[] {
  if (urls.length === 0) return [''];
  return [...urls];
}

export default function PieceImagesEditor({
  pieceId,
  urls,
  uploading,
  onUrlsChange,
  onFileSelected,
}: {
  pieceId: string;
  urls: string[];
  uploading: boolean;
  onUrlsChange: (urls: string[]) => void;
  onFileSelected: (file: File) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [lines, setLines] = useState<string[]>(() => normalizeLines(urls));

  useEffect(() => {
    setLines(normalizeLines(urls));
  }, [pieceId, urls.join('\u0001')]);

  const commitAll = (next: string[]) => {
    setLines(next.length ? next : ['']);
    onUrlsChange(next.map((s) => s.trim()).filter(Boolean));
  };

  const moveLine = (index: number, delta: -1 | 1) => {
    const j = index + delta;
    if (j < 0 || j >= lines.length) return;
    const next = [...lines];
    [next[index], next[j]] = [next[j], next[index]];
    setLines(next);
    onUrlsChange(next.map((s) => s.trim()).filter(Boolean));
  };

  return (
    <div className="space-y-4">
      {lines.map((url, i) => (
        <div
          key={`${i}-${pieceId}`}
          className="flex flex-col gap-3 sm:flex-row sm:items-stretch"
        >
          <div className="flex shrink-0 gap-2 sm:flex-col sm:justify-center">
            <button
              type="button"
              title="Выше (раньше в галерее)"
              disabled={i === 0 || uploading || lines.length < 2}
              onClick={() => moveLine(i, -1)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-white text-black/70 hover:bg-black/[0.04] disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronUp className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              title="Ниже (позже в галерее)"
              disabled={i >= lines.length - 1 || uploading || lines.length < 2}
              onClick={() => moveLine(i, 1)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-white text-black/70 hover:bg-black/[0.04] disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronDown className="h-4 w-4" aria-hidden />
            </button>
          </div>
          <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-black/[0.03] to-black/[0.07] ring-1 ring-black/[0.06] sm:h-[7.5rem] sm:w-32 sm:max-w-[9rem]">
            {url.trim() ? (
              <ImageWithFallback
                src={url.trim()}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-black/18">
                <ImageIcon className="h-7 w-7 stroke-[1.25]" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <input
              type="text"
              value={url}
              onChange={(e) => {
                const v = e.target.value;
                setLines((prev) => {
                  const next = [...prev];
                  next[i] = v;
                  return next;
                });
              }}
              onBlur={() => {
                setLines((prev) => {
                  onUrlsChange(prev.map((s) => s.trim()).filter(Boolean));
                  return prev;
                });
              }}
              placeholder="/uploads/pieces/… or https://…"
              className={inputClass}
            />
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={lines.length <= 1}
                onClick={() => {
                  const next = lines.filter((_, j) => j !== i);
                  commitAll(next.length ? next : ['']);
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 py-1.5 text-[11px] font-medium text-black/70 hover:bg-red-50 hover:border-red-200 hover:text-red-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden />
                Убрать
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={ref}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFileSelected(f);
            e.target.value = '';
          }}
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => ref.current?.click()}
          className="inline-flex items-center gap-2 rounded-full border border-black/12 bg-white px-4 py-2 text-xs font-medium tracking-wide text-black/85 shadow-sm hover:border-brand-sage/35 hover:bg-brand-sage/[0.06] disabled:opacity-45 disabled:pointer-events-none transition-colors"
        >
          <Upload className="h-3.5 w-3.5 opacity-80" aria-hidden />
          {uploading ? 'Загрузка…' : 'Загрузить файл'}
        </button>
        <button
          type="button"
          onClick={() => setLines((prev) => [...prev, ''])}
          className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-black/15 bg-black/[0.02] px-4 py-2 text-xs font-medium text-black/70 hover:border-brand-sage/35 hover:bg-brand-sage/[0.06] transition-colors"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden />
          Ещё фото (URL)
        </button>
      </div>
      <p className="text-[11px] leading-relaxed text-[#8B8B8B]">
        Первое в списке — обложка в каталоге; порядок в галерее на сайте как здесь (стрелки вверх/вниз).
        Сохраните карточку изделия.
      </p>
    </div>
  );
}
