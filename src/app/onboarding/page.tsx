"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { OtpInput } from "@/components/auth/OtpInput";
import { useAuth } from "@/lib/auth/useAuth";
import { sendOTP, updateAcademicProfile, updatePhoneNumber, verifyOTP } from "@/lib/api/authApi";
import { ApiError } from "@/lib/api/client";
import { LEVEL_OPTIONS, MEDIUM_OPTIONS } from "@/lib/constants/academic";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import type { User } from "@/types/auth";

type Phase = "details" | "phone-number" | "phone-otp" | "email-otp";

const GROUP_OF: Record<Phase, number> = {
  details: 0,
  "phone-number": 1,
  "phone-otp": 1,
  "email-otp": 2,
};
const GROUP_LABEL = ["Your details", "Verify phone", "Verify email"];

function buildPhases(user: User | null): Phase[] {
  const phases: Phase[] = [];
  if (!user?.full_name || !user?.institution_name || !user?.level || !user?.medium) {
    phases.push("details");
  }
  if (!user?.is_phone_verified) {
    phases.push("phone-number", "phone-otp");
  }
  if (!user?.is_email_verified) {
    phases.push("email-otp");
  }
  return phases;
}

function OnboardingContent() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();

  const [phases] = useState(() => buildPhases(user));
  const [phaseIndex, setPhaseIndex] = useState(0);
  const currentPhase = phases[phaseIndex];

  const [fullName, setFullName] = useState(user?.full_name ?? "");
  const [institutionName, setInstitutionName] = useState(user?.institution_name ?? "");
  const [level, setLevel] = useState(user?.level ?? "");
  const [medium, setMedium] = useState(user?.medium ?? "");
  const [phone, setPhone] = useState(user?.phone_number ?? "");
  const [code, setCode] = useState("");
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const done = phaseIndex >= phases.length;

  useEffect(() => {
    if (done) {
      router.replace("/dashboard");
    }
  }, [done, router]);

  const groups = useMemo(() => Array.from(new Set(phases.map((p) => GROUP_OF[p]))), [phases]);
  const currentGroup = currentPhase ? GROUP_OF[currentPhase] : -1;

  function advance() {
    setPhaseIndex((i) => i + 1);
  }

  async function handleDetailsSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await updateAcademicProfile({
        full_name: fullName.trim(),
        institution_name: institutionName.trim(),
        level,
        medium,
      });
      await refreshUser();
      advance();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save your details");
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePhoneNumberSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await updatePhoneNumber(phone.trim());
      await sendOTP("phone");
      await refreshUser();
      setCode("");
      advance();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not send a code to that number");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResendPhoneCode() {
    setError(null);
    setSubmitting(true);
    try {
      await sendOTP("phone");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not resend code");
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePhoneOtpSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await verifyOTP("phone", code);
      await refreshUser();
      setCode("");
      advance();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Invalid or expired code");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSendEmailCode() {
    setError(null);
    setSubmitting(true);
    try {
      await sendOTP("email");
      setEmailCodeSent(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not send code");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEmailOtpSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await verifyOTP("email", code);
      await refreshUser();
      setCode("");
      advance();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Invalid or expired code");
    } finally {
      setSubmitting(false);
    }
  }

  if (done || !currentPhase) return null;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-2">
          {groups.map((g) => (
            <span
              key={g}
              className={`h-1.5 rounded-full transition-all ${
                g === currentGroup ? "w-8 bg-olympiad-500" : g < currentGroup ? "w-4 bg-olympiad-500/40" : "w-4 bg-gray-200"
              }`}
            />
          ))}
        </div>

        <div className="rounded-2xl border border-black/5 bg-white p-8 shadow-[0_20px_60px_rgb(0,0,0,0.08)]">
          <p className="text-xs font-medium uppercase tracking-wide text-olympiad-500">
            {GROUP_LABEL[currentGroup]}
          </p>

          {currentPhase === "details" && (
            <>
              <h1 className="mt-1 text-xl font-bold text-olympiad-900">Tell us about yourself</h1>
              <p className="mt-1 text-sm text-olympiad-800/70">
                We&apos;ll use this to set up your olympiad profile.
              </p>
              <form onSubmit={handleDetailsSubmit} className="mt-6 flex flex-col gap-4">
                <Input
                  id="full-name"
                  label="Full name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                <Input
                  id="institution"
                  label="Institution name"
                  type="text"
                  required
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                />
                <Select id="level" label="Level" required value={level} onChange={(e) => setLevel(e.target.value)}>
                  <option value="" disabled>
                    Select your level
                  </option>
                  {LEVEL_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
                <Select id="medium" label="Medium" required value={medium} onChange={(e) => setMedium(e.target.value)}>
                  <option value="" disabled>
                    Select your medium
                  </option>
                  {MEDIUM_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button type="submit" loading={submitting} className="mt-2 w-full">
                  Continue
                </Button>
              </form>
            </>
          )}

          {currentPhase === "phone-number" && (
            <>
              <h1 className="mt-1 text-xl font-bold text-olympiad-900">Add your phone number</h1>
              <p className="mt-1 text-sm text-olympiad-800/70">We&apos;ll text you a 6-digit code to verify it.</p>
              <form onSubmit={handlePhoneNumberSubmit} className="mt-6 flex flex-col gap-4">
                <Input
                  id="phone"
                  label="Phone number"
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button type="submit" loading={submitting} className="mt-2 w-full">
                  Send code
                </Button>
              </form>
            </>
          )}

          {currentPhase === "phone-otp" && (
            <>
              <h1 className="mt-1 text-xl font-bold text-olympiad-900">Verify your phone</h1>
              <p className="mt-1 text-sm text-olympiad-800/70">Enter the 6-digit code sent to your phone.</p>
              <form onSubmit={handlePhoneOtpSubmit} className="mt-6 flex flex-col items-center gap-5">
                <OtpInput value={code} onChange={setCode} disabled={submitting} />
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button type="submit" loading={submitting} disabled={code.length < 6} className="w-full">
                  Verify
                </Button>
                <button
                  type="button"
                  onClick={handleResendPhoneCode}
                  disabled={submitting}
                  className="text-sm font-medium text-olympiad-500 hover:text-olympiad-800 disabled:opacity-60"
                >
                  Resend code
                </button>
              </form>
            </>
          )}

          {currentPhase === "email-otp" && (
            <>
              <h1 className="mt-1 text-xl font-bold text-olympiad-900">Verify your email</h1>
              <p className="mt-1 text-sm text-olympiad-800/70">
                {emailCodeSent
                  ? `Enter the 6-digit code sent to ${user?.email}.`
                  : `We'll send a 6-digit code to ${user?.email}.`}
              </p>
              {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
              {emailCodeSent ? (
                <form onSubmit={handleEmailOtpSubmit} className="mt-6 flex flex-col items-center gap-5">
                  <OtpInput value={code} onChange={setCode} disabled={submitting} />
                  <Button type="submit" loading={submitting} disabled={code.length < 6} className="w-full">
                    Verify
                  </Button>
                  <button
                    type="button"
                    onClick={handleSendEmailCode}
                    disabled={submitting}
                    className="text-sm font-medium text-olympiad-500 hover:text-olympiad-800 disabled:opacity-60"
                  >
                    Resend code
                  </button>
                </form>
              ) : (
                <Button
                  type="button"
                  loading={submitting}
                  onClick={handleSendEmailCode}
                  className="mt-6 w-full"
                >
                  Send code
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <ProtectedRoute>
      <OnboardingContent />
    </ProtectedRoute>
  );
}
