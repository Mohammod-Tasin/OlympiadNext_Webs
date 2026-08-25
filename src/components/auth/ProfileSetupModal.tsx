"use client";

import { useEffect, useState, type FormEvent } from "react";
import { OtpInput } from "@/components/auth/OtpInput";
import { useAuth } from "@/lib/auth/useAuth";
import { sendOTP, updatePhoneNumber, verifyOTP } from "@/lib/api/authApi";
import { ApiError } from "@/lib/api/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type Step = "phone" | "choose" | "code";
type Target = "email" | "phone";

interface ProfileSetupModalProps {
  open: boolean;
  onClose: () => void;
}

function VerifyRow({
  label,
  detail,
  verified,
  onSend,
  disabled,
}: {
  label: string;
  detail?: string;
  verified: boolean;
  onSend: () => void;
  disabled: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
      <div>
        <p className="text-sm font-medium text-olympiad-900">{label}</p>
        {detail && <p className="text-xs text-olympiad-800/60">{detail}</p>}
      </div>
      {verified ? (
        <span className="text-xs font-medium text-emerald-600">Verified</span>
      ) : (
        <Button type="button" size="sm" variant="outline" onClick={onSend} disabled={disabled}>
          Send Code
        </Button>
      )}
    </div>
  );
}

export function ProfileSetupModal({ open, onClose }: ProfileSetupModalProps) {
  const { user, refreshUser } = useAuth();

  const [step, setStep] = useState<Step>(user?.phone_number ? "choose" : "phone");
  const [target, setTarget] = useState<Target | null>(null);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const bothVerified = !!user?.is_email_verified && !!user?.is_phone_verified;

  // Reset to a sensible starting step each time the modal is reopened.
  useEffect(() => {
    if (open) {
      setStep(user?.phone_number ? "choose" : "phone");
      setTarget(null);
      setCode("");
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Once both channels are verified, the modal has nothing left to do.
  useEffect(() => {
    if (open && bothVerified) {
      onClose();
    }
  }, [open, bothVerified, onClose]);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  async function handleSavePhone(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await updatePhoneNumber(phone.trim());
      await refreshUser();
      setStep("choose");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save phone number");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSendCode(type: Target) {
    setError(null);
    setSubmitting(true);
    try {
      await sendOTP(type);
      setTarget(type);
      setCode("");
      setStep("code");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not send code");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerifyCode(e: FormEvent) {
    e.preventDefault();
    if (!target) return;
    setError(null);
    setSubmitting(true);
    try {
      await verifyOTP(target, code);
      await refreshUser();
      setStep("choose");
      setTarget(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Invalid or expired code");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-olympiad-900/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Complete your profile setup"
        className="relative w-full max-w-md animate-[modalIn_0.25s_cubic-bezier(0.16,1,0.3,1)] rounded-2xl border border-black/5 bg-white shadow-[0_20px_60px_rgb(0,0,0,0.15)]"
      >
        <div className="flex items-start justify-between border-b border-black/5 px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-olympiad-900">Complete your profile</h1>
            <p className="mt-1 text-sm text-olympiad-800/70">
              {step === "phone" && "Add a phone number to continue."}
              {step === "choose" && "Confirm your email and phone to finish setting up your account."}
              {step === "code" && target && `Enter the 6-digit code sent to your ${target}.`}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-olympiad-800/50 transition-colors hover:bg-gray-100 hover:text-olympiad-900"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-5 px-6 py-4">
          {error && <p className="text-sm text-red-600">{error}</p>}

          {step === "phone" && (
            <form onSubmit={handleSavePhone} className="flex flex-col gap-4">
              <Input
                id="phone"
                label="Phone number"
                type="tel"
                placeholder="01XXXXXXXXX"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <Button type="submit" loading={submitting} className="w-full">
                Continue
              </Button>
            </form>
          )}

          {step === "choose" && (
            <div className="flex flex-col gap-3">
              <VerifyRow
                label="Email"
                detail={user?.email}
                verified={!!user?.is_email_verified}
                onSend={() => handleSendCode("email")}
                disabled={submitting}
              />
              <VerifyRow
                label="Phone"
                detail={user?.phone_number}
                verified={!!user?.is_phone_verified}
                onSend={() => handleSendCode("phone")}
                disabled={submitting}
              />
            </div>
          )}

          {step === "code" && target && (
            <form onSubmit={handleVerifyCode} className="flex flex-col items-center gap-5">
              <OtpInput value={code} onChange={setCode} disabled={submitting} />
              <Button type="submit" loading={submitting} disabled={code.length < 6} className="w-full">
                Verify
              </Button>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => handleSendCode(target)}
                  disabled={submitting}
                  className="text-sm font-medium text-olympiad-500 hover:text-olympiad-800 disabled:opacity-60"
                >
                  Resend code
                </button>
                <button
                  type="button"
                  onClick={() => setStep("choose")}
                  className="text-sm text-olympiad-800/60 hover:text-olympiad-800"
                >
                  Back
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
