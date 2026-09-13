/**
 * Mirrors the Go backend's `dto.PrizeResponse` — one row of
 * `GET /api/client/events/{eventId}/prizes`. `rank_from`/`rank_to` form an
 * inclusive placement range (e.g. 1-1 for "1st place", 2-3 for "2nd-3rd
 * place"). `prize_description` is optional — the backend sends it with
 * `omitempty`, so the key is absent (not `null`) when unset.
 */
export interface PrizeResponse {
  id: string;
  event_id: string;
  rank_from: number;
  rank_to: number;
  prize_name: string;
  prize_description?: string;
  created_at: string;
  updated_at: string;
}

/** `{ prizes, count }` envelope returned by
 * `GET /api/client/events/{eventId}/prizes`. */
export interface PrizeListResponse {
  prizes: PrizeResponse[];
  count: number;
}
