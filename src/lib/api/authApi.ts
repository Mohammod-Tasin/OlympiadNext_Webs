import { apiFetch } from "./client";
import type { AuthResponse, User } from "@/types/auth";

export function register(email: string, password: string) {
  return apiFetch<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: { email, password },
    skipAuth: true,
  });
}

export function login(email: string, password: string) {
  return apiFetch<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: { email, password },
    skipAuth: true,
  });
}

export function loginWithGoogle(idToken: string) {
  return apiFetch<AuthResponse>("/api/auth/google", {
    method: "POST",
    body: { id_token: idToken },
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
