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
  /** Event id — used client-side to match the signed-in student's
   * registrations (this response is public/cached and carries no per-user
   * state of its own). May be absent on older backends. */
  id: string;
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
      id: event.id ?? "",
      title: event.title,
      description: event.description ?? "",
      image_url: event.image_url ?? "",
      event_date: event.event_date,
    };
  } catch {
    return null;
  }
}

/** One row of `GET /api/client/events/all`. `is_active` is the only
 * per-event status this listing has to work with; `is_registered` is
 * deliberately omitted here — the backend always reports it `false` on
 * this route (it's unauthenticated, unlike the single-event routes), so
 * it would be misleading to surface it. */
export interface EventListItem extends ActiveEvent {
  is_active: boolean;
}

/** A relative backend path (e.g. "/uploads/xyz.jpg") resolved against the
 * API origin so it can be requested directly from the browser; an
 * already-absolute URL is returned unchanged. */
function resolveImageURL(path: string): string {
  if (!path || path.startsWith("http")) return path;
  return `${API_BASE_URL}${path}`;
}

/**
 * Fetches every event (active or not) for a listing page, or `[]` when the
 * request fails for any reason or nothing exists yet. Never throws.
 */
export async function getAllEvents(): Promise<EventListItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/client/events/all`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];

    const body = (await res.json()) as { events?: Array<Partial<EventListItem>> } | null;
    const events = body?.events ?? [];

    return events
      .filter((e): e is Partial<EventListItem> & Pick<EventListItem, "id" | "title" | "event_date"> =>
        Boolean(e.id && e.title && e.event_date),
      )
      .map((e) => ({
        id: e.id,
        title: e.title,
        description: e.description ?? "",
        image_url: resolveImageURL(e.image_url ?? ""),
        event_date: e.event_date,
        is_active: e.is_active ?? false,
      }));
  } catch {
    return [];
  }
}
