"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/lib/auth/useAuth";
import { updateAcademicProfile } from "@/lib/api/authApi";
import { ApiError } from "@/lib/api/client";
import { LEVEL_OPTIONS, MEDIUM_OPTIONS } from "@/lib/constants/academic";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import type { User } from "@/types/auth";

function detailsComplete(user: User | null): boolean {
  return Boolean(user?.full_name && user?.institution_name && user?.level && user?.medium);
}

function OnboardingContent() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState(user?.full_name ?? "");
  const [institutionName, setInstitutionName] = useState(user?.institution_name ?? "");
  const [level, setLevel] = useState(user?.level ?? "");
  const [medium, setMedium] = useState(user?.medium ?? "");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Nothing left to collect - the user landed here via a stale redirect.
  const alreadyDone = detailsComplete(user);

  useEffect(() => {
    if (alreadyDone) {
      router.replace("/dashboard");
    }
  }, [alreadyDone, router]);

  async function handleSubmit(e: FormEvent) {
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
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save your details");
    } finally {
      setSubmitting(false);
    }
  }

  if (alreadyDone) return null;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-black/5 bg-white p-8 shadow-[0_20px_60px_rgb(0,0,0,0.08)]">
          <p className="text-xs font-medium uppercase tracking-wide text-olympiad-500">Your details</p>
          <h1 className="mt-1 text-xl font-bold text-olympiad-900">Tell us about yourself</h1>
          <p className="mt-1 text-sm text-olympiad-800/70">
            We&apos;ll use this to set up your olympiad profile.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
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
                <option key={option.value} value={option.value}>
                  {option.label}
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
