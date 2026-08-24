"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { OtpInput } from "@/components/auth/OtpInput";
import { useAuth } from "@/lib/auth/useAuth";
import { sendOTP, updatePhoneNumber, verifyOTP } from "@/lib/api/authApi";
import { ApiError } from "@/lib/api/client";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type Step = "phone" | "choose" | "code";
type Target = "email" | "phone";

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

function VerifyContent() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<Step>(user?.phone_number ? "choose" : "phone");
  const [target, setTarget] = useState<Target | null>(null);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const bothVerified = !!user?.is_email_verified && !!user?.is_phone_verified;

  // A user who lands here already fully verified (e.g. a stale bookmark)
  // should just continue on, not sit on the verification screen.
  useEffect(() => {
    if (bothVerified) {
      router.replace("/dashboard");
    }
  }, [bothVerified, router]);

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
    <Card className="w-full max-w-md">
      <CardHeader>
        <h1 className="text-xl font-bold text-olympiad-900">Verify your account</h1>
        <p className="mt-1 text-sm text-olympiad-800/70">
          {step === "phone" && "Add a phone number to continue."}
          {step === "choose" && "Confirm your email and phone to finish setting up your account."}
          {step === "code" && target && `Enter the 6-digit code sent to your ${target}.`}
        </p>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
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
      </CardContent>
    </Card>
  );
}

export default function VerifyPage() {
  return (
    <ProtectedRoute>
      <div className="page-center">
        <VerifyContent />
      </div>
    </ProtectedRoute>
  );
}
