import { withBasePath } from '@/lib/admin-api';
import type { RequestPayload } from '@/lib/request-payload';

/** Клиентская отправка заявки на `POST /api/request` с учётом `NEXT_PUBLIC_BASE_PATH`. */
export async function submitSiteRequest(
  payload: RequestPayload
): Promise<{ ok: true } | { ok: false; error: string }> {
  const res = await fetch(withBasePath('/api/request'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) {
    const err =
      typeof data.error === 'string' ? data.error : `Ошибка ${res.status}`;
    return { ok: false, error: err };
  }
  return { ok: true };
}
