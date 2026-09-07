import { apiFetch, ApiError } from "./client";
import type {
  CreateRegistrationRequest,
  Registration,
  RegistrationEvent,
} from "@/types/registration";

/**
 * The currently active event, including its per-event bKash/Nagad numbers
 * and registration fee. `GET /api/client/events` is public, so this runs
 * with `skipAuth`; it returns `null` when nothing is published (backend
 * replies 404).
 *
 * This is the client-side (in-browser) counterpart to `eventsApi`'s
 * server-rendered `getActiveEvent` — the payment page needs the live
 * numbers and the event id at request time, not from a 60s ISR cache.
 */
export async function getRegistrationEvent(): Promise<RegistrationEvent | null> {
  try {
    const e = await apiFetch<RegistrationEvent>("/api/client/events", { skipAuth: true });
    return e && e.id ? e : null;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

/**
 * Submits a bKash/Nagad payment for exam registration. On success the
 * registration is created in `pending` state — there is no instant
 * confirmation, an admin reviews it.
 *
 * Throws `ApiError` with a specific status the caller must handle:
 * - 409 "already registered for this event"
 * - 409 "transaction id has already been submitted"
 * - 409 event not open for registration
 * - 404 event not found
 * - 400 malformed method / number / transaction id
 */
export function submitRegistration(payload: CreateRegistrationRequest) {
  return apiFetch<Registration>("/api/user/registrations", {
    method: "POST",
    body: payload,
  });
}

/** The caller's own exam registrations, newest first. */
export async function getMyRegistrations(): Promise<Registration[]> {
  const res = await apiFetch<
    Registration[] | { registrations?: Registration[]; data?: Registration[] } | null
  >("/api/user/registrations");

  if (Array.isArray(res)) return res;
  return res?.registrations ?? res?.data ?? [];
}
