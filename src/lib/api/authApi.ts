import { apiFetch } from "./client";
import { getDeviceFingerprint } from "@/lib/utils/fingerprint";
import type { AuthResponse, User } from "@/types/auth";

export async function register(email: string, password: string) {
  const device_fingerprint = await getDeviceFingerprint();
  return apiFetch<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: { email, password, device_fingerprint },
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

export function updatePhoneNumber(phone_number: string) {
  return apiFetch<{ message: string }>("/api/auth/update-phone", {
    method: "POST",
    body: { phone_number },
  });
}

export function sendOTP(type: "email" | "phone") {
  return apiFetch<{ message: string }>("/api/auth/send-otp", {
    method: "POST",
    body: { type },
  });
}

export function verifyOTP(type: "email" | "phone", code: string) {
  return apiFetch<{ message: string }>("/api/auth/verify-otp", {
    method: "POST",
    body: { type, code },
  });
}

export function updateAcademicProfile(data: { institution_name: string; level: string; medium: string }) {
  return apiFetch<{ message: string }>("/api/auth/profile", {
    method: "PUT",
    body: data,
  });
}
