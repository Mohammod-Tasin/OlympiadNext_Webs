/**
 * Public, unauthenticated "Important Dates" feed for the marketing pages.
 *
 * Talks to the Go backend's `GET /api/client/important-dates`, which returns
 * the active entries ordered chronologically (event date, then display
 * order). Plain server-side `fetch` — no `apiFetch`/token plumbing — so it
 * runs inside Server Components and is cached for 60s (ISR).
 */

/** Base URL of the Go backend. */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

/** A single timeline entry. `event_date` is a `YYYY-MM-DD` calendar date. */
export interface ImportantDate {
  id: string;
  event_date: string;
  title: string;
  details_en: string;
  details_bn: string;
}

/**
 * Fetches the active important dates, or `[]` when there are none, the
 * request 404s, or it fails for any reason. Never throws — the Timeline
 * shows an "announced soon" line when this returns `[]`.
 */
export async function getImportantDates(): Promise<ImportantDate[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/client/important-dates`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];

    const data = (await res.json()) as { important_dates?: Partial<ImportantDate>[] } | null;
    return (data?.important_dates ?? [])
      .filter((d): d is ImportantDate => !!d && !!d.event_date && !!d.title)
      .map((d) => ({
        id: d.id ?? "",
        event_date: d.event_date,
        title: d.title,
        details_en: d.details_en ?? "",
        details_bn: d.details_bn ?? "",
      }));
  } catch {
    return [];
  }
}
