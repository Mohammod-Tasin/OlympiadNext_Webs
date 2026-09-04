/**
 * Account verification state:
 * - `unverified` — onboarding not submitted yet (forced to /onboarding)
 * - `pending`    — onboarding submitted, awaiting admin review (full browsing,
 *                  exam entry still gated)
 * - `verified`   — approved
 */
export type UserStatus = "unverified" | "pending" | "verified";

export interface User {
  user_id: string;
  email: string;
  full_name?: string;
  is_email_verified: boolean;
  status?: UserStatus;
  institution_name?: string;
  level?: string;
  medium?: string;
  /** URL of the uploaded student-status proof, set during onboarding. */
  verification_doc?: string;
  /** URL of the uploaded profile picture, optional. */
  profile_picture?: string;
}

export interface AuthResponse {
  access_token: string;
  access_token_expires_at: string;
}

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";
