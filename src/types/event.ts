/**
 * Per-round progress types for `GET /api/client/events/{eventId}/rounds`.
 *
 * `your_status` is only meaningful for an authenticated request — it
 * reflects the caller's own eligibility/progress through the event's
 * rounds, evaluated by the backend (round order, registration approval,
 * previous-round results). It is `null` when the backend hasn't computed
 * one (e.g. no auth token attached).
 */

export type RoundStatus =
  | "not_eligible"
  | "waiting"
  | "locked"
  | "ready"
  | "eliminated"
  | "qualified"
  | "winner";

/** One row of `GET /api/client/events/{eventId}/rounds`, mirroring the
 * backend's `RoundResponse` exactly. */
export interface EventRound {
  id: string;
  event_id: string;
  round_order: number;
  round_name: string;
  /** ISO 8601 datetime, with an explicit offset. */
  start_at: string;
  duration_minutes: number;
  /** The round's own lifecycle status (distinct from the caller's
   * `your_status`) — not currently rendered by the rounds page. */
  status: string;
  your_status: RoundStatus | null;
  created_at: string;
  updated_at: string;
}

/** Flat response body — there is no nested `event` object; the backend has
 * no per-id event lookup (see `roundsApi.ts`'s `getEventRounds`). */
export interface EventRoundsResponse {
  rounds: EventRound[];
  count: number;
}
