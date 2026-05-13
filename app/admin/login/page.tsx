'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Sparkles } from 'lucide-react';
import { withBasePath } from '@/lib/admin-api';

const SECRET_STORAGE = 'nkn-admin-secret';

export default function AdminLoginPage() {
  const router = useRouter();
  const [secret, setSecret] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [checking, setChecking] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem(SECRET_STORAGE);
    if (saved) {
      router.replace('/admin');
    } else {
      setChecking(false);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = secret.trim();
    if (!trimmed) return;

    setSubmitting(true);
    setError(null);

    try {
      const r = await fetch(withBasePath('/api/admin/pieces'), {
        headers: { 'x-admin-secret': trimmed },
      });

      if (r.status === 401) {
        setError('Неверный пароль');
        setSubmitting(false);
        return;
      }

      if (r.status === 403) {
        setError('Admin API отключена на сервере (проверьте ENABLE_ADMIN_API)');
        setSubmitting(false);
        return;
      }

      sessionStorage.setItem(SECRET_STORAGE, trimmed);
      router.replace('/admin');
    } catch {
      setError('Нет связи с сервером');
      setSubmitting(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-black/20 border-t-black/70 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#FAF9F6] overflow-hidden flex items-center justify-center px-4">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-brand-sage/[0.07] via-transparent to-transparent"
        aria-hidden
      />

      <div className="relative w-full max-w-sm">
        <div className="flex items-center gap-2 text-brand-sage mb-3">
          <Sparkles className="w-4 h-4 opacity-90" aria-hidden />
          <span className="text-[11px] tracking-[0.28em] uppercase font-medium">
            Atelier
          </span>
        </div>

        <h1 className="text-3xl font-serif tracking-tight text-black/90 mb-1">
          Catalog admin
        </h1>
        <p className="text-sm text-[#8B8B8B] mb-8">
          Введите пароль для доступа к панели управления
        </p>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-black/[0.07] bg-white p-6 shadow-[0_8px_32px_rgba(0,0,0,0.07)]"
        >
          <div className="mb-5">
            <label
              htmlFor="admin-secret"
              className="block text-[10px] font-semibold uppercase tracking-wider text-[#8B8B8B] mb-1.5"
            >
              Admin secret
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                <Lock className="w-4 h-4 text-black/30" aria-hidden />
              </div>
              <input
                id="admin-secret"
                type={showPassword ? 'text' : 'password'}
                value={secret}
                onChange={(e) => {
                  setSecret(e.target.value);
                  setError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') void handleSubmit(e as unknown as React.FormEvent);
                }}
                className="w-full rounded-xl border border-black/10 bg-white pl-9 pr-10 py-2.5 text-sm text-black/90 focus:border-brand-sage/45 focus:outline-none focus:ring-2 focus:ring-brand-sage/20 transition-shadow"
                autoComplete="current-password"
                placeholder="Введите пароль"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-3 flex items-center text-black/30 hover:text-black/60 transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" aria-hidden />
                ) : (
                  <Eye className="w-4 h-4" aria-hidden />
                )}
              </button>
            </div>

            {error ? (
              <p role="alert" className="mt-2 text-xs text-red-600">
                {error}
              </p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={submitting || !secret.trim()}
            className="w-full rounded-full bg-black text-white px-6 py-2.5 text-sm font-medium tracking-wide shadow-md hover:bg-black/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Проверяем…
              </>
            ) : (
              'Войти'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
