"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth/useAuth";
import { ApiError } from "@/lib/api/client";
import {
  resendNotificationPhoneOtp,
  setNotificationPreferenceEmail,
  startNotificationPhoneSetup,
  verifyNotificationPhoneOtp,
} from "@/lib/api/notificationApi";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { OtpInput } from "@/components/auth/OtpInput";
import { cn } from "@/lib/utils/cn";
import type { NotificationChannel } from "@/types/auth";

const OTP_LENGTH = 6;

/** Bangladeshi mobile: `01`, an operator digit (3–9), then 8 digits.
 * Accepts a `+880` / `880` prefix and strips spaces/dashes. Mirrors the
 * check on the registration-payment page. */
function normalizeBdMobile(raw: string): string | null {
  const n = raw.replace(/[\s-]/g, "").replace(/^\+?880/, "0");
  return /^01[3-9]\d{8}$/.test(n) ? n : null;
}

type Flow = "idle" | "phone" | "otp";

export function NotificationPreferences() {
  const { user, refreshUser } = useAuth();

  // The backend's `/me` response may not echo the notification fields, so
  // once we mutate them we treat local state as the source of truth. SMS is
  // "active" only after a successful OTP verify (or a `/me` that already
  // reports both preference=sms and a verified phone).
  const [verifiedPhone, setVerifiedPhone] = useState(
    user?.is_notification_phone_verified ? user?.notification_phone ?? "" : "",
  );
  const [active, setActive] = useState<NotificationChannel>(
    user?.notification_preference === "phone" && user?.is_notification_phone_verified ? "phone" : "email",
  );

  const [flow, setFlow] = useState<Flow>("idle");
  const [phone, setPhone] = useState(user?.notification_phone ?? "");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  function reset(next: Flow) {
    setFlow(next);
    setError(null);
    setNotice(null);
    setOtp("");
  }

  async function pickEmail() {
    if (active === "email" || busy) return;
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await setNotificationPreferenceEmail();
      setActive("email");
      setFlow("idle");
      void refreshUser().catch(() => {});
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't update your preference. Try again.");
    } finally {
      setBusy(false);
    }
  }

  function pickSms() {
    if (busy || active === "phone") return;
    // The backend has no "switch to an already-verified phone" call — the
    // only way to select phone is PUT { method: "phone", phone }, which
    // (re)issues an OTP. So always run the verify flow, pre-filling any
    // number already on file.
    reset("phone");
  }

  async function handleSendOtp() {
    const normalized = normalizeBdMobile(phone);
    if (!normalized) {
      setError("Enter a valid Bangladeshi mobile number, e.g. 01712345678.");
      return;
    }
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await startNotificationPhoneSetup(normalized);
      setPhone(normalized);
      setOtp("");
      setFlow("otp");
      setNotice(`We sent a 6-digit code to ${normalized}.`);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Couldn't send the code. Check the number and try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleResend() {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await resendNotificationPhoneOtp();
      setNotice(`New code sent to ${phone}.`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't resend the code. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handleVerify() {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await verifyNotificationPhoneOtp(otp);
      // A successful verify is what flips the backend to phone / verified.
      setVerifiedPhone(phone);
      setActive("phone");
      setFlow("idle");
      setNotice("Phone verified — exam alerts will come by SMS.");
      void refreshUser().catch(() => {});
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "That code is invalid or has expired. Request a new one.",
      );
    } finally {
      setBusy(false);
    }
  }

  const options: Array<{ value: NotificationChannel; label: string }> = [
    { value: "email", label: "Email" },
    { value: "phone", label: "Phone (SMS)" },
  ];

  return (
    <Card>
      <CardHeader>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-olympiad-800">Notifications</h2>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm text-olympiad-800/70">
          Choose how we reach you about your registration — payment confirmation, admit-card
          availability, and exam-day reminders.
        </p>

        <div
          role="group"
          aria-label="Notification channel"
          className="grid grid-cols-2 gap-1 rounded-xl bg-gray-50 p-1"
        >
          {options.map((opt) => {
            const selected = active === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                aria-pressed={selected}
                disabled={busy}
                onClick={opt.value === "email" ? pickEmail : pickSms}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60",
                  selected
                    ? "bg-white text-olympiad-900 shadow-sm"
                    : "text-olympiad-800/60 hover:text-olympiad-800",
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {flow === "idle" && (
          <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm">
            {active === "email" ? (
              <p className="text-olympiad-800/80">
                Alerts go to <span className="font-medium text-olympiad-900">{user?.email}</span>.
              </p>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-olympiad-800/80">
                  Alerts go to{" "}
                  <span className="font-medium text-olympiad-900">{verifiedPhone}</span>.
                </p>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
                    Verified
                  </span>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => reset("phone")}
                    className="text-xs font-medium text-olympiad-500 hover:text-olympiad-800 disabled:opacity-60"
                  >
                    Change number
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {flow === "phone" && (
          <div className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <Input
              id="notification-phone"
              label="Mobile number"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="01712345678"
              value={phone}
              disabled={busy}
              onChange={(e) => setPhone(e.target.value)}
            />
            <p className="text-xs text-olympiad-800/60">
              We&apos;ll text a 6-digit code to confirm this number.
            </p>
            <div className="flex gap-2">
              <Button type="button" size="sm" loading={busy} onClick={handleSendOtp}>
                Send OTP
              </Button>
              <Button type="button" size="sm" variant="ghost" disabled={busy} onClick={() => reset("idle")}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {flow === "otp" && (
          <div className="flex flex-col items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-sm text-olympiad-800/70">
              Enter the 6-digit code sent to <span className="font-medium text-olympiad-900">{phone}</span>.
            </p>
            <OtpInput value={otp} onChange={setOtp} disabled={busy} />
            <div className="flex items-center gap-3">
              <Button
                type="button"
                size="sm"
                loading={busy}
                disabled={otp.length < OTP_LENGTH}
                onClick={handleVerify}
              >
                Verify
              </Button>
              <button
                type="button"
                disabled={busy}
                onClick={handleResend}
                className="text-sm font-medium text-olympiad-500 hover:text-olympiad-800 disabled:opacity-60"
              >
                Resend code
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => reset("idle")}
                className="text-sm font-medium text-olympiad-800/50 hover:text-olympiad-800 disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {notice && <p className="text-sm text-emerald-600">{notice}</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </CardContent>
    </Card>
  );
}
