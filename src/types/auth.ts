/**
 * KYC / account verification state:
 * - `unverified` — onboarding not submitted yet (forced to /onboarding)
 * - `pending`    — onboarding submitted, awaiting admin review (full browsing,
 *                  exam entry still gated)
 * - `verified`   — approved
 */
export type VerificationStatus = "unverified" | "pending" | "verified";

export interface User {
  user_id: string;
  email: string;
  full_name?: string;
  is_email_verified: boolean;
  verification_status?: VerificationStatus;
  institution_name?: string;
  level?: string;
  medium?: string;
  /** URL of the uploaded student-status proof, set during onboarding. */
  verification_doc?: string;
  /** URL of the uploaded profile picture, optional. */
  profile_picture?: string;

  /** Channel for exam alerts (payment confirmed, admit card ready, …).
   * Defaults to `"email"`; only settable to `"phone"` once
   * `is_notification_phone_verified` is true. */
  notification_preference?: NotificationChannel;
  /** Mobile number registered for SMS alerts — may still be awaiting OTP
   * verification (see `is_notification_phone_verified`). */
  notification_phone?: string;
  is_notification_phone_verified?: boolean;
}

/** Matches the backend's `method` field on
 * `PUT /api/user/notification-preference`. The value is `"phone"` (not
 * `"sms"`); the UI still labels it "Phone (SMS)". */
export type NotificationChannel = "email" | "phone";

export interface AuthResponse {
  access_token: string;
  access_token_expires_at: string;
}

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";
