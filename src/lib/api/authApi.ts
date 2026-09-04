import { apiFetch } from "./client";
import { getDeviceFingerprint } from "@/lib/utils/fingerprint";
import type { AuthResponse, User } from "@/types/auth";

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
}

/**
 * Registration takes only email, password and name; academic details and
 * the verification document are collected later in onboarding. It does not
 * establish a session — the backend emails a 6-digit OTP that the user must
 * verify (see `verifyEmailOTP`) before `login` will issue tokens.
 */
export async function register(data: RegisterData) {
  const device_fingerprint = await getDeviceFingerprint();
  return apiFetch<{ message: string }>("/api/auth/register", {
    method: "POST",
    body: { ...data, device_fingerprint },
    skipAuth: true,
  });
}

export async function login(email: string, password: string) {
  const device_fingerprint = await getDeviceFingerprint();
  return apiFetch<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: { email, password, device_fingerprint },
    skipAuth: true,
  });
}

export async function loginWithGoogle(idToken: string) {
  const device_fingerprint = await getDeviceFingerprint();
  return apiFetch<AuthResponse>("/api/auth/google", {
    method: "POST",
    body: { id_token: idToken, device_fingerprint },
    skipAuth: true,
  });
}

/** Relies solely on the HttpOnly refresh cookie; no body or bearer token needed. */
export function refresh() {
  return apiFetch<AuthResponse>("/api/auth/refresh", { method: "POST", skipAuth: true });
}

export function logout() {
  return apiFetch<void>("/api/auth/logout", { method: "POST", skipAuth: true });
}

/** Access token is attached automatically by the API client. */
export function me() {
  return apiFetch<User>("/api/auth/me");
}

/** (Re)sends the email verification OTP. Runs before a session exists, so
 * the target email is passed explicitly rather than read from the token. */
export function sendEmailOTP(email: string) {
  return apiFetch<{ message: string }>("/api/auth/send-otp", {
    method: "POST",
    body: { email },
    skipAuth: true,
  });
}

/** Confirms the 6-digit code emailed during registration. On success the
 * account is marked verified and `login` will start issuing tokens. */
export function verifyEmailOTP(email: string, otp: string) {
  return apiFetch<{ message: string }>("/api/auth/verify-otp", {
    method: "POST",
    body: { email, otp },
    skipAuth: true,
  });
}

export function updateAcademicProfile(data: {
  full_name: string;
  institution_name: string;
  level: string;
  medium: string;
}) {
  return apiFetch<{ message: string }>("/api/auth/profile", {
    method: "PUT",
    body: data,
  });
}
