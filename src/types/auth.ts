export interface User {
  user_id: string;
  email: string;
  full_name?: string;
  phone_number?: string;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  institution_name?: string;
  level?: string;
  medium?: string;
}

export interface AuthResponse {
  access_token: string;
  access_token_expires_at: string;
}

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";
