/**
 * Exam-registration payment types, mirroring the Go backend's
 * `dto.CreateRegistrationRequest` / `dto.RegistrationResponse`.
 *
 * Flow: the student sends the event's `registration_fee` to its
 * bKash/Nagad number, then submits the wallet transaction id here. An
 * admin checks it against their payment statement and approves or rejects.
 */

export type PaymentMethod = "bkash" | "nagad";

export type RegistrationStatus = "pending" | "approved" | "rejected";

/** Body of `POST /api/user/registrations`. */
export interface CreateRegistrationRequest {
  event_id: string;
  payment_method: PaymentMethod;
  sender_number: string;
  transaction_id: string;
}

/** One row of `GET /api/user/registrations`, and the body returned by a
 * successful submission. */
export interface Registration {
  id: string;
  event_id: string;
  event_title?: string;
  payment_method: PaymentMethod;
  sender_number: string;
  transaction_id: string;
  status: RegistrationStatus;
  created_at: string;
  reviewed_at?: string | null;
  /** URL of the issued admit card (PDF). Present once an admin has issued
   * it for an approved registration; `null`/absent until then. */
  admit_card_url?: string | null;
}

/** The active event plus its per-event payment details, from
 * `GET /api/client/events`. */
export interface RegistrationEvent {
  id: string;
  title: string;
  event_date: string;
  bkash_number: string;
  nagad_number: string;
  /** Whole Bangladeshi Taka; 0 means the fee is not set yet. */
  registration_fee: number;
}
