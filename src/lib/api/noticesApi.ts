/**
 * Public, unauthenticated notice feed for the marketing pages.
 *
 * Talks to the Go backend's `GET /api/client/notices`, which returns the
 * active notices ordered by display order. Plain server-side `fetch` — no
 * `apiFetch`/token plumbing — so it runs inside Server Components and is
 * cached for 60s (ISR).
 */

/** Base URL of the Go backend. */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

/** A single notice as rendered on the Notice Board. */
export interface Notice {
  id: string;
  text_en: string;
  text_bn: string;
}

/**
 * Fetches the active notices, or `[]` when there are none, the request 404s,
 * or it fails for any reason. Never throws — the Notice Board shows a
 * "nothing right now" line when this returns `[]`.
 */
export async function getNotices(): Promise<Notice[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/client/notices`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];

    const data = (await res.json()) as { notices?: Partial<Notice>[] } | null;
    return (data?.notices ?? [])
      .filter((n): n is Notice => !!n && !!n.text_en && !!n.text_bn)
      .map((n) => ({ id: n.id ?? "", text_en: n.text_en, text_bn: n.text_bn }));
  } catch {
    return [];
  }
}
