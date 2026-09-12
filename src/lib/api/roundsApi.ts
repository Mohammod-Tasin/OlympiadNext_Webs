import { apiFetch, ApiError } from "./client";
import type { EventRoundsResponse } from "@/types/event";

export interface EventSummary {
  id: string;
  title: string;
  description?: string;
}

/** A single event by id, or `null` if it doesn't exist (404). */
export async function getEventById(eventId: string): Promise<EventSummary | null> {
  try {
    return await apiFetch<EventSummary>(`/api/client/events/${eventId}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

/**
 * An event's rounds in `round_order` sequence, with the caller's own
 * `your_status` per round. Authenticated — the page that uses this is
 * already login-gated, and `your_status` has no meaning without a caller.
 */
export async function getEventRounds(eventId: string): Promise<EventRoundsResponse> {
  return apiFetch<EventRoundsResponse>(`/api/client/events/${eventId}/rounds`);
}

/**
 * Attempts to enter a round's exam session. Resolves `{ allowed: true }` on
 * success. On a 403 the thrown `ApiError.message` carries the backend's
 * `reason` string (one of: "round is not ongoing", "no active registration
 * for this event", "not qualified from the previous round") — callers map
 * it to friendlier copy rather than showing it raw.
 */
export function enterRound(roundId: string): Promise<{ allowed: true }> {
  return apiFetch<{ allowed: true }>(`/api/client/rounds/${roundId}/enter`, { method: "POST" });
}
