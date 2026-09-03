/**
 * Public, unauthenticated event feed for the marketing pages.
 *
 * Talks to the Go backend's `GET /api/client/events`, which returns the
 * single currently active event (or 404 when none is scheduled). This is a
 * plain server-side `fetch` — no `apiFetch`/token plumbing — so it can run
 * inside Server Components for SEO and be cached by Next.js.
 *
 * Responses are cached for 60s (ISR): the landing page renders instantly
 * from cache and picks up event changes within a minute.
 */

/** Base URL of the Go backend. */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

/** A single event as returned by `GET /api/client/events`. */
export interface ActiveEvent {
  title: string;
  description: string;
  image_url: string;
  /** ISO 8601 datetime, with an explicit offset. */
  event_date: string;
}

/**
 * Fetches the active event, or `null` when there is none (404) or the
 * request fails for any reason. Never throws — the homepage falls back to
 * static copy when this returns `null`.
 */
export async function getActiveEvent(): Promise<ActiveEvent | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/client/events`, {
      next: { revalidate: 60 },
    });

    // 404 = no active event; any other non-2xx = treat as "no data" rather
    // than break the page.
    if (!res.ok) return null;

    const event = (await res.json()) as Partial<ActiveEvent> | null;
    if (!event || !event.title || !event.event_date) return null;

    return {
      title: event.title,
      description: event.description ?? "",
      image_url: event.image_url ?? "",
      event_date: event.event_date,
    };
  } catch {
    return null;
  }
}
