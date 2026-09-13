import { apiFetch } from "./client";
import type { PrizeListResponse, PrizeResponse } from "@/types/prize";

/**
 * Fetches an event's prize tiers, or `[]` on any failure (non-2xx or
 * network error) — this is public informational content, so a failure
 * here should never break the page, mirroring `getEventById`'s /
 * `getActiveEvent`'s safe-fallback pattern. `skipAuth` since the route is
 * fully public and needs no per-caller enrichment (unlike `getEventRounds`,
 * there is no `your_status`-style field here to attach a token for).
 */
export async function getEventPrizes(eventId: string): Promise<PrizeResponse[]> {
  try {
    const res = await apiFetch<PrizeListResponse>(`/api/client/events/${eventId}/prizes`, {
      skipAuth: true,
    });
    return res.prizes ?? [];
  } catch {
    return [];
  }
}
