import { apiFetch } from "./client";

/**
 * Exam-alert delivery settings.
 *
 * Flow for switching to SMS:
 *   1. `startNotificationPhoneSetup(phone)` — records the pending number and
 *      makes the backend text a 6-digit OTP (202). This single call IS the
 *      "send OTP" action; it does NOT make SMS active yet.
 *   2. `resendNotificationPhoneOtp()` — re-sends the code to that pending
 *      number (the backend already knows it; no body).
 *   3. `verifyNotificationPhoneOtp(otp)` — confirms the code. Only on success
 *      does the backend flip the user to phone / verified.
 *
 * Switching back to email is a single `setNotificationPreferenceEmail()`.
 *
 * NOTE: the backend's SMS provider credentials are not configured in this
 * environment, so the OTP send/verify path cannot be exercised end to end
 * here. The calls below follow the documented contract; only live SMS
 * delivery is blocked.
 */

/** `PUT /api/user/notification-preference` with `{ method: "email" }` —
 * switch exam alerts back to email. No phone needed. */
export function setNotificationPreferenceEmail() {
  return apiFetch<{ message: string }>("/api/user/notification-preference", {
    method: "PUT",
    body: { method: "email" },
  });
}

/** `PUT /api/user/notification-preference` with `{ method: "phone", phone }` —
 * register the pending number and trigger the OTP send (202). The channel is
 * not switched to SMS until `verifyNotificationPhoneOtp` succeeds. */
export function startNotificationPhoneSetup(phone: string) {
  return apiFetch<{ message: string }>("/api/user/notification-preference", {
    method: "PUT",
    body: { method: "phone", phone },
  });
}

/** `POST /api/user/notification-phone/resend-otp` — re-send the 6-digit code
 * to the pending number the backend recorded from `startNotificationPhoneSetup`.
 * Empty body: the number is tied to the authenticated session. */
export function resendNotificationPhoneOtp() {
  return apiFetch<{ message: string }>("/api/user/notification-phone/resend-otp", {
    method: "POST",
  });
}

/** `POST /api/user/notification-phone/verify-otp` — confirm the code for the
 * pending number. Body is just `{ otp }`. Throws `ApiError` with the backend
 * message for a wrong or expired code. */
export function verifyNotificationPhoneOtp(otp: string) {
  return apiFetch<{ message: string }>("/api/user/notification-phone/verify-otp", {
    method: "POST",
    body: { otp },
  });
}
